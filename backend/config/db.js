import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        })        
        console.log(`Mongo connected to - ${connection.connection.host}`)
    } catch (error) {
        console.log(`Error connecting mongo - ${error.message}`)
        process.exit(1)        
    }
}

export default connectDB