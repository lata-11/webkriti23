<<<<<<< HEAD
import Apperror from "../utility/error.util.js"
import JWT from "jsonwebtoken"
const isLoggedIn = async (req , res, next) => { 
    console.log(req.cookies);
    const {token }= req.cookies
    if(!token)  {  
        return res.status(400).json({
            success: false, 
            message : "You are not Logged In"
        })
    }   
    try { 
        const userDetails= await JWT.verify(token, process.env.JWT_SECRET) 
        req.user = userDetails
    }       
    catch(e) {
        return new Apperror(e.message ,400)
=======
    import Apperror from "../utility/error.util.js"
    import JWT from "jsonwebtoken"
    const isLoggedIn = async (req , res, next) => { 
        const {token }= req.cookies
        if(!token)  {  
            return res.status(400).json({
                success: false, 
                message : "You are not Logged In"
            })
        }   
        try { 
            const userDetails= await JWT.verify(token, process.env.JWT_SECRET) 
            req.user = userDetails
        }       
        catch(e) {
            return new Apperror(e.message ,400)
        }
        next()
>>>>>>> b1635986403ca93a8823da539d29ef4ef1bca8ec
    }
    export default isLoggedIn