import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

const register = asyncHandler(async(req,res)=>{
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    if(!userExists){
        const user = await User.create({ name, email, password, notes:[] })
        if(user){
            res.status(201).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                notes:user.notes,
                token: generateToken(user._id),
            })
        }
    }
    else{
        res.status(400).json({ message:"This email is already used!" })
    }
})

const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    const userExists = await User.findOne({ email })
    if(!userExists){
        res.status(404).json({ message:"User not found" })
    }
    else{
        if(userExists && (await userExists.matchPassword(password))){
            res.status(200).json({
                _id: userExists._id,
                name:userExists.name,
                email:userExists.email,
                notes:userExists.notes,
                token: generateToken(userExists._id),
            })           
        }
        else{
            res.status(401).json({ message:"Bad credentials" })
        }
    }
})

export { register, login }