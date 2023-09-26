const User = require("../model/User")
const customApiError = require("../errors")
const {StatusCodes} = require("http-status-codes")
const {createTokenUser, attachCookiesToresponse, checkPermission} = require("../utils")
const getAllUsers = async(req, res)=>{
    const user = await User.find({role:"user"}).select("-password")
    res.status(StatusCodes.OK).json({users:user})
}

const getSingleUser = async(req, res)=>{
    const{id:userId} = req.params
    const user = await User.findOne({_id:userId}).select("-password")
    if(!user){
        throw new customApiError.notFound("user does not exist")
    }
    // console.log(req.user)
    checkPermission(req.user, user._id)
    res.status(StatusCodes.OK).json({users:user})
}

const showCurrentUser = async(req, res)=>{
    const user = req.user
    res.status(StatusCodes.OK).json({user:user})
}

const updateUser = async(req, res)=>{
    const {name, email}  = req.body
    if(!name || !email){
        throw new customApiError.BadRequestError("Please provide field parameters")
    }
    const user = await User.findOne({_id:req.user.userId})
    user.name = name;
    user.email = email;
    await user.save()
    const tokenUser = createTokenUser(user)
    attachCookiesToresponse({res, user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
    
}

const updateUserPassword = async(req, res)=>{
    const{oldPass, newPass} = req.body
    if(!oldPass || !newPass){
        throw new customApiError.BadRequestError("Please provide both fields")
    }
    const user = await User.findOne({_id:req.user.userId})
    console.log(oldPass)
    
    const isPasswordCorrect = await user.comparePass(oldPass)

    if(!isPasswordCorrect){
        throw new customApiError.BadRequestError("wrong password")
    }

    user.password = newPass
    await user.save()
    res.status(StatusCodes.OK).json({msg: "password changed successfully"})
}

module.exports ={
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}