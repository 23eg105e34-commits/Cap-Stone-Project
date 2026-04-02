import exp from 'express'
import { UserTypeModel } from '../models/UserModel.js'
import {verifyToken} from '../middlewares/verifyToken.js'
import {authenticate} from '../services/authService.js'
import {checkUser} from '../middlewares/checkUser.js'


export const adminRoute=exp.Router()


//block user
adminRoute.post("/block",async(req,res)=>{
    //get id
        const userId = req.body.id
        //check the user is present or not 
        let user = await UserTypeModel.findOne({userId})
        if (!user) {
            return res.status(404).json({ message: "User not found"});
        }
        //if the user found block the user 
        user.isActive = false
        await user.save()
        res.status(200).json({ message: "User blocked successfully", payload: user })
})


//unblock user
adminRoute.put("/unblock",async(req,res)=>{
    const userId =req.body.id
    // check whethere the the user is block or not 
    let user =await UserTypeModel.findOne({userId})
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    //if the user found blocked then unblock the the user 
    user.isActive = true
    await user.save()
    res.status(200).json({message:"user unblocked successfully",payload:user})
})