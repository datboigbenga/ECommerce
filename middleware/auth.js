require("dotenv")
// const User = require("../models/user");
// const jwt = require("jsonwebtoken");
const customApiError = require("../errors")
const {isTokenValid} = require("../utils")

const auth = async(req, res, next)=> {
    const token = req.signedCookies.token
    if(!token){
        throw new customApiError.unauthenticated("invalid authentication")
    }

    try {
        const{name, userId, role} = isTokenValid({token})
        req.user = {name, userId, role}
        next();
    } catch (error) {
        throw new customApiError.unauthenticated("invalid authentication")
    }

}

const authorizePermissions = (...roles)=>{
     return(req, res, next)=>{
        if(!roles.includes(req.user.role)){
            throw new customApiError.unaccessible("unable to access route")
        }
        next();
     }
}
module.exports  = {
    auth,
    authorizePermissions
}
