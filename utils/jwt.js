const jwt = require("jsonwebtoken")
const createJWT = ({payload})=>{
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
      });
      return token;
}

const isTokenValid = ({token}) => {return jwt.verify(token, process.env.JWT_SECRET)}



const attachCookiesToresponse = ({res, user})=>{
  const token = createJWT({payload:user})

  const oneday = 1000* 60*60*24
  res.cookie("token", token, {
    httpOnly:true,
    expires: new Date(Date.now() + oneday),
    secure:process.env.NODE_ENV ==="production",
    signed: true
  })

}
module.exports ={
  createJWT,
  isTokenValid,
  attachCookiesToresponse
}