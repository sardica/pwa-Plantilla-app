import express from 'express'
//import cors from 'cors'
import cookieParser from 'cookie-parser'
import cuadernosRoutes from './routes/cuadernos.js'

const app = express()

/*app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))*/
app.use(express.json())
app.use(cookieParser())

//app.use('/api/cuadernos', cuadernosRoutes)
app.use(cuadernosRoutes) 
export default app
