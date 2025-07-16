// backend-services/auth-service/src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/mysql/user.model.js';
import { RefreshTokenModel } from '../models/mysql/refresh-token.model.js';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, VerifyErrors, JwtPayload } from 'jsonwebtoken';
import logger from '../config/logger.js';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/mailer.js';
import { env } from '../config/env.js';

interface CustomJWTPayload extends JwtPayload {
  id: string;
}

function createAccessToken(payload: CustomJWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN } as SignOptions);
}

function createRefreshToken(payload: CustomJWTPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN } as SignOptions);
}

// ... (register y login se mantienen igual)
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, name } = req.body;

  try {
    const userFound = await UserModel.findByEmail({ email });
    if (userFound) {
      res.status(400).json(['The email is already in use']);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const email_verification_token = crypto.randomBytes(32).toString('hex');
    const email_verification_expires = Date.now() + 3600000; // 1 hora

    await UserModel.create({ name, email, password: passwordHash, email_verification_token, email_verification_expires });
    await sendVerificationEmail(email, email_verification_token);

    res.json({
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const userFound = await UserModel.findByEmail({ email });
    if (!userFound) {
      res.status(400).json(['Invalid credentials']);
      return;
    }

    if (!userFound.email_verified) {
      res.status(401).json(['Please verify your email before logging in.']);
      return;
    }
    
    const isMatch = await bcrypt.compare(password, userFound.password!);
    if (!isMatch) {
      res.status(400).json(['Invalid credentials']);
      return;
    }

    const accessToken = createAccessToken({ id: userFound.id } as CustomJWTPayload);
    const refreshToken = createRefreshToken({ id: userFound.id } as CustomJWTPayload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días
    await RefreshTokenModel.create({ userId: userFound.id, token: refreshToken, expiresAt });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
    });

    res.json({ accessToken });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        res.sendStatus(204);
        return;
    }
    try {
        await RefreshTokenModel.delete({ token: refreshToken });
        res.clearCookie('refreshToken');
        res.sendStatus(204);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

export const profile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
       res.status(400).json({ message: "User ID not found in token" });
       return;
    }
    const userFound = await UserModel.findById({ id: req.user.id });
    if (!userFound) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};


// CORRECCIÓN: La función verifyToken ahora usa el middleware authRequired
// para ser consistente con las otras rutas protegidas.
export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized: User ID missing from token payload." });
      return;
    }
    const userFound = await UserModel.findById({ id: req.user.id });
    if (!userFound) {
      res.status(401).json({ message: "Unauthorized: User not found." });
      return;
    }
    res.json({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// ... (verifyEmail y refreshToken se mantienen igual)
export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token } = req.query;

    if (typeof token !== 'string') {
        res.status(400).json({ message: 'Invalid token format' });
        return;
    }

    try {
        const user = await UserModel.findByVerificationToken({ token });
        if (!user) {
            res.status(400).json({ message: 'Invalid token' });
            return;
        }

        if (user.email_verification_expires! < Date.now()) {
            res.status(400).json({ message: 'Token expired' });
            return;
        }

        await UserModel.verifyEmail({ id: user.id });
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token not found' });
      return;
  }
  try {
    const refreshTokenDoc = await RefreshTokenModel.findByToken({ token: refreshToken });
    if (!refreshTokenDoc) {
      res.status(403).json({ message: 'Invalid refresh token' });
      return;
    }
    if (new Date(refreshTokenDoc.expires_at) < new Date()) {
      await RefreshTokenModel.delete({ token: refreshToken });
      res.status(403).json({ message: 'Refresh token expired' });
      return;
    }
    
    jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, (err: VerifyErrors | null, user: string | JwtPayload | undefined) => {
      if (err || typeof user !== 'object') {
        logger.error(err);
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
      const userPayload = user as CustomJWTPayload;
      const accessToken = createAccessToken({ id: userPayload.id } as CustomJWTPayload);
      res.json({ accessToken });
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
