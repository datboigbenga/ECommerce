const User = require("../model/User")
const {StatusCodes}= require("http-status-codes")
const customApiError =  require("../errors")
const {attachCookiesToresponse, createTokenUser} = require("../utils")
const jwt = require("jsonwebtoken")
// const {createJWT} = require("../utils")


const regiter = async(req, res)=>{
    const {email, name, password }= req.body
    const emailAlreadyExists = await User.findOne({email})

    if(emailAlreadyExists){
        throw new customApiError.BadRequestError("Email already  exist")
    }
    const isFirstAccount = await User.countDocuments({})  === 0
    const role = isFirstAccount? "admin":"user";

    const user = await User.create({name, email, password ,role});
    const tokenUser = createTokenUser(user)
    attachCookiesToresponse({res,user:tokenUser})
    res.status(StatusCodes.CREATED).json({user: tokenUser})
}

const login = async(req, res)=>{
    const {email, password} = req.body

    if(!email || !password){
        throw new customApiError.BadRequestError("Please fill in the fields")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new customApiError.unauthenticated("User does not exist")
    }

    const isPasswordCorrect = await user.comparePass(password)

    if(!isPasswordCorrect){
        throw new customApiError.unauthenticated("invalid details")
    }
    const tokenUser = createTokenUser(user)
    attachCookiesToresponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}

const logout = async(req, res)=>{
    res.cookie("token", "token", {
        httpOnly:true,
        expires:new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
}

module.exports = {
    regiter,
    login,
    logout,
}