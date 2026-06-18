import  jwt from 'jsonwebtoken'
import  User from "../models/user.js"
import AppError from './appError.js'

const isUserAuthenticated = async(req, res ,next) =>{
    const {token} = req.cookies
    try {
        if(!token){
            return next(new AppError("Please login again", 401))
        }
        const decodedObj = await jwt.verify(token, `${process.env.JWT_SECRET}`)
        if(!decodedObj){
            return next(new AppError("Please login again", 401))
        }
        const {_id} = decodedObj
        if(!_id){
            return next(new AppError("Please login again", 401))
        }
        const user = await User.findById(_id)

        if(!user){
            return next(new AppError("User not found", 401))
        }
        req.user = user
        next()
    } catch (error) {
        return next(error)
    }
}

export default isUserAuthenticated