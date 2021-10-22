import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

connectDB()

const PORT = process.env.PORT || 5001

const app = express()

app.use(express.json())

app.use('/api/auth',authRoutes)

app.get('/',(req,res) => res.send("Hello World!"))

app.use(notFound)

app.use(errorHandler)

app.listen(PORT,console.log(`Server running on port - ${PORT}`))