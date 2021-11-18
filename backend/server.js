import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import authRoutes from './routes/authRoutes.js'
import noteRoutes from './routes/noteRoutes.js'

dotenv.config()

connectDB()

const PORT = process.env.PORT || 5001

const NODE_ENV = process.env.NODE_ENV || 'Development'

const dirname = path.resolve()

const app = express()

app.use(express.json())

app.use(express.static(path.join(dirname,'/templates')))

app.use('/api/auth',authRoutes)

app.use('/api/note',noteRoutes)

if(NODE_ENV==='PRODUCTION'){
    app.get('/api/detail',(req,res) => res.sendFile(path.resolve(dirname, 'backend', 'templates', 'index.html')))
    app.use(express.static(path.join(dirname,'/client/build')))
    app.get('*',(req,res) => {
        res.sendFile(path.resolve(dirname, 'client', 'build', 'index.html'))
    })
}
else{
    app.get('/',(req,res) => res.sendFile(path.resolve(dirname, 'backend', 'templates', 'index.html')))
}

app.use(notFound)

app.use(errorHandler)

app.listen(PORT,console.log(`Server running on port - ${PORT} in ${NODE_ENV}`))