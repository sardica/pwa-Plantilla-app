import { UserModel } from '../models/mysql/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

async function createAccessToken (payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: '1d'
        },
        (err, token) => {
          if (err) reject(err)
          resolve(token)
        }
      )
    })
  }

export const register = async (req, res) => {
  const { email, password, name } = req.body

  try {
    const userFound = await UserModel.findByEmail({ email })
    if (userFound) return res.status(400).json(['The email is already in use'])

    const passwordHash = await bcrypt.hash(password, 10)

    const userId = await UserModel.create({ name, email, password: passwordHash })

    const token = await createAccessToken({ id: userId })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    res.json({
      id: userId,
      name,
      email
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const userFound = await UserModel.findByEmail({ email })
    if (!userFound) return res.status(400).json(['Invalid credentials'])

    const isMatch = await bcrypt.compare(password, userFound.password)
    if (!isMatch) return res.status(400).json(['Invalid credentials'])

    const token = await createAccessToken({ id: userFound.id })

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })

    res.json({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const logout = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0)
    });
    return res.sendStatus(200);
}

export const profile = async (req, res) => {
  const userFound = await UserModel.findById({ id: req.user.id })

  if (!userFound) return res.status(400).json({ message: "User not found" })

  return res.json({
    id: userFound.id,
    name: userFound.name,
    email: userFound.email
  })
}

export const verifyToken = async (req, res) => {
    const { token } = req.cookies

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if(err) return res.status(401).json({ message: "Unauthorized" });

        const userFound = await UserModel.findById({id: user.id})
        if (!userFound) return res.status(401).json({ message: "Unauthorized" });

        return res.json({
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
        })
    })
}