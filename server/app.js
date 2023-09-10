import express, {urlencoded} from 'express' 
import cors from "cors"
import cookieParser from 'cookie-parser'
import connectToDB from './config/db.js'
import dotenv from 'dotenv'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import errorMiddleware from './middlewares/error.middleware.js'
const app = express()
dotenv.config()
app.use(morgan('dev'))
app.use(express.json())
// The encoded url we get it helps us to get the Query params or to parse the encoded  url 
app.use(cookieParser())
connectToDB()



// To Parse form data we have to use this middleware 
// Otherwise the data we recieve is JSON Data 


app.use(bodyParser.urlencoded({
    extended:  false 
}))
app.use(cors())

app.use('/ping', (req, res) => {
    res.send('/pong')
}) 
import userRoutes from './routes/user.route.js'
app.use('/api/v1/user/', userRoutes);


import blogRoute from "./routes/blogs.routes.js"
app.use("/api/v1/blogs/", blogRoute)
// Making error middleware 
// We are making this Middleware if any error is there Erroe Middleware will capture this 
// This middleware is for All errors 
// If there is Some Problem in the userRoutes section  then we have come to this errorMiddleware 
app.use(errorMiddleware)
app.all('*' , (req,res) =>{
    res.status(404).send("OOPS !! 404 Page Not Found");
})
export default app
