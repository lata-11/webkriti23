const errorMiddleware = (err,req,res,next) =>{

    err.status = err.status || 500

    console.log("Error middleware me hu ")
    console.log(err)
    err.message  = err.message || "Something went Wrong"
    res.status(err.status).json({
        status: err.status,
        success:false,
        message:err.message,
        stack:err.stack
        
    })
    
}

export default errorMiddleware