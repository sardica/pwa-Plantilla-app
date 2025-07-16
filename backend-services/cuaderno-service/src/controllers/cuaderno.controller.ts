// backend-services/cuaderno-service/src/controllers/cuaderno.controller.ts

import { Request, Response } from 'express';
import { CuadernoModel } from '../models/mysql/cuaderno.model.js';

export class CuadernoController {
  // CORRECCIÓN: Se añaden los tipos Request y Response de Express
  static async getAll(req: Request, res: Response) {
    // El middleware de autenticación ya ha añadido req.user,
    // usamos la aserción de no nulo (!) para indicarle a TypeScript que confiamos en que existe.
    const cuadernos = await CuadernoModel.getAll({ userId: req.user!.id });
    res.json(cuadernos);
  }

  // CORRECCIÓN: Se añaden los tipos Request y Response
  static async getById(req: Request, res: Response) {
    // req.params.id es un string, lo convertimos a número.
    const id = parseInt(req.params.id, 10);
    const cuaderno = await CuadernoModel.getById({ id, userId: req.user!.id });
    if (!cuaderno) {
      return res.status(404).json({ message: 'Cuaderno not found' });
    }
    res.json(cuaderno);
  }

  // CORRECCIÓN: Se añaden los tipos Request y Response
  static async create(req: Request, res: Response) {
    const { title, content } = req.body;
    const newCuaderno = await CuadernoModel.create({ userId: req.user!.id, title, content });
    res.status(201).json(newCuaderno);
  }

  // CORRECCIÓN: Se añaden los tipos Request y Response
  static async update(req: Request, res: Response) {
    const { title, content } = req.body;
    const id = parseInt(req.params.id, 10);
    const updated = await CuadernoModel.update({ id, userId: req.user!.id, title, content });
    if (!updated) {
      return res.status(404).json({ message: 'Cuaderno not found' });
    }
    const updatedCuaderno = await CuadernoModel.getById({ id, userId: req.user!.id });
    res.json(updatedCuaderno);
  }

  // CORRECCIÓN: Se añaden los tipos Request y Response
  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const deleted = await CuadernoModel.delete({ id, userId: req.user!.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Cuaderno not found' });
    }
    res.sendStatus(204);
  }
}
