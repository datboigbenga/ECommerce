require("dotenv").config();
require("express-async-errors");

const express = require("express")
const app = express()

const morgan = require("morgan")

const connectDB = require("./database/db")

const authRouter = require("./routes/authRoutes")
const userRouter = require("./routes/userRoutes")
const productRouter = require("./routes/productRoute")
const reviewRouter= require("./routes/reviewRoute")
const orderRouter= require("./routes/orderRoute")

const cookiePaser = require("cookie-parser")

const notFound = require("./middleware/not-found")
const errorHandler = require("./middleware/errorHandler")

const rateLimiter = require("express-rate-limit")
const cors = require("cors")
const helmet = require("helmet")
const xss = require("xss-clean")
const mongoSanitize = require("express-mongo-sanitize")

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookiePaser(process.env.JWT_SECRET))
app.get("/", (req,res)=>{
    // console.log(req.cookies)
    res.send("E-commerce-API")
})

app.get("/cook", (req,res)=>{
    console.log(req.signedCookies)
    res.send("E-commerce-API")
})

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/product", productRouter)
app.use("/api/v1/review", reviewRouter)
app.use("/api/v1/orders", orderRouter)

app.use(notFound);
app.use(errorHandler)

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

const port = process.env.PORT || 5000
const start = async()=>{
try {
    await connectDB(process.env.Mongo_URI)
    app.listen(port, console.log(`server is listening on port ${port}`))
} catch (error) {
    console.log(error)
}
}


start()