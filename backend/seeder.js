import usersNote from './data/usersNote.js'
import User from './models/userModel.js'
import connectDB from './config/db.js'

connectDB()

const importData = async () => {
    try {
        await User.deleteMany()
        await User.insertMany(usersNote)
        console.log("Data Added!")
        process.exit(0)
    } catch (error) {
        console.log(`Error: ${error.message}`)        
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await User.deleteMany()
        console.log("Data Deleted!")
        process.exit(0)
    } catch (error) {
        console.log(`Error deleting data - ${error.message}`) 
        process.exit(1)
    }
}

if(process.argv[2]==='-d'){
    destroyData()
}
else{
    importData()
}
