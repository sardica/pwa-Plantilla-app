import { Router } from 'express'
import { CuadernoController } from '../controllers/cuaderno.controller.js'
import { authRequired } from '../middlewares/auth.middleware.js'
import { validateSchema } from '../middlewares/validator.middleware.js'
import { cuadernoSchema } from '../schemas/cuaderno.schema.js'

const router = Router()

router.get('/', authRequired, CuadernoController.getAll)
router.get('/:id', authRequired, CuadernoController.getById)
router.post('/', authRequired, validateSchema(cuadernoSchema), CuadernoController.create)
router.put('/:id', authRequired, validateSchema(cuadernoSchema), CuadernoController.update)
router.delete('/:id', authRequired, CuadernoController.delete)

export default router
