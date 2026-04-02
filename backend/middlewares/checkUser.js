import { UserTypeModel } from "../models/UserModel.js";

export const checkUser=async (req,res,next)=>{
    //get author id 
    // let userdetails=req.body // post 
    // let userId=req.params.id //get 
    // verif userId
    let userId=req.body?.user||req.params?.id;
    // if(userdetails.userId) userIdId=userdetails.userId
    // else userIdId=userId
    
    const user=await UserTypeModel.findById(userId)
    if(!user)
        return res.status(401).json({ message:"User not found"})
    if(user.role!=='USER') 
        return res.status(403).json({message:'User is a userId'})
    if(!user.isActive)
        return res.status(403).json({message:'User account is not active'})
    next()
}
