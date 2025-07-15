import { CuadernoModel } from '../models/mysql/cuaderno.model.js'

export class CuadernoController {
  static async getAll (req, res) {
    const cuadernos = await CuadernoModel.getAll({ userId: req.user.id })
    res.json(cuadernos)
  }

  static async getById (req, res) {
    const cuaderno = await CuadernoModel.getById({ id: req.params.id, userId: req.user.id })
    if (!cuaderno) return res.status(404).json({ message: 'Cuaderno not found' })
    res.json(cuaderno)
  }

  static async create (req, res) {
    const { title, content } = req.body
    const newCuaderno = await CuadernoModel.create({ userId: req.user.id, title, content })
    res.status(201).json(newCuaderno)
  }

  static async update (req, res) {
    const { title, content } = req.body
    const updated = await CuadernoModel.update({ id: req.params.id, userId: req.user.id, title, content })
    if (!updated) return res.status(404).json({ message: 'Cuaderno not found' })
    const updatedCuaderno = await CuadernoModel.getById({ id: req.params.id, userId: req.user.id })
    res.json(updatedCuaderno)
  }

  static async delete (req, res) {
    const deleted = await CuadernoModel.delete({ id: req.params.id, userId: req.user.id })
    if (!deleted) return res.status(404).json({ message: 'Cuaderno not found' })
    res.sendStatus(204)
  }
}