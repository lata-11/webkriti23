    import userModel from "../models/user.model.js"; 
import Apperror  from "../utility/error.util.js";
import emailValidator from "email-validator";
import bcrypt from "bcrypt"
import fs from "fs/promises"
import cloudinary from "cloudinary"
import sendEmail from "../utility/sendEmail.utility.js";
import crypto from "crypto"
const cookieOptions =  {
    maxAge:7*24*60*60*100,
    httpOnly:false,
    secure:true
}
const register = async (req, res, next) => { 
    try {
        console.log(req.body)
        
        const {name , email, password, username }  = req.body
        if(!name || !email || !password || !username ) {
            return next(new Apperror ("All fields are required", 400));
        }
            
        
        const validEmail = emailValidator.validate(email) 
        if(!validEmail) {
            return next(new Apperror("Please Enter a Valid Email" , 400))
        }
        const UserExists  = await userModel.find({email})
        if(UserExists.length!==0) {
            return next(new Apperror ("User Already Exists Please Change Email" ,400))
        }

        const user = await userModel.create({
            name,email,password,username,
            avatar : {
                public_id:email ,
                secure_url :'https://images.pexels.com/lib/avatars/grey.png?w=130&h=130&fit=crop&dpr=1'
            }
        })
        if(!user) {
            return next(new Apperror("User Registration failed Please try Again  " , 400) )
        }
<<<<<<< HEAD

=======
        console.log(req.file)
        
>>>>>>> b1635986403ca93a8823da539d29ef4ef1bca8ec
        if(req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path , {
                    folder:'blogweb',
                    width:'250',
                    height:'250',
                    gravity:'face' ,
                    crop:'fill'
                }) 
                console.log( "Result=> "  ,result)
                if(result) {
                    console.log(result.secure_url)
                    user.avatar.public_id = result.public_id
                    user.avatar.secure_url  = result.secure_url
                    // Also we should remove file from local System in the upload folder 
                    fs.rm(`uploads/${req.file.filename}`)
                }
            } catch (error) {
                console.log(error)
                return next(new Apperror(error || "File not uploaded Successfully") ,500)
            }
        }else {
            console.log("Photo does not uploaded ")
        }

        await user.save();
        user.password  = undefined;
        const token  = await user.generateJWTTokens()
        res.cookie = ('token' , token , cookieOptions)
        res.status(200).json({
            success: true,
            message:"User created Successfully",
            user       
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message:error.message       
        })
        
    }
}
const login = async (req, res, next) => { 
    try {
        const {email , password}  = req.body
        console.log(req.body);
        const user = await userModel.
            findOne({
                email:email
            })
            .select('+password')
  
        if(!user ||!(await bcrypt.compare(password ,user.password))) {
            return res.status(400).json({
                success:false,
                message:'Invalid Credentials'
            })
        }
        const token  = user.generateJWTTokens();
        
        user.password = undefined;
        user.confirmpassword  =undefined
        
        res.cookie("token" ,token , cookieOptions)
        
        res.status(200).json({
            success:true,
            user,token
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:error.message
        })   
    }

}
const logout= async (req, res , next) => { 
    try {

        res.cookie("token", null, {
            maxAge:0, 
            httpOnly : true ,
            secure: true
        })



        return res.status(200).json({
            success:true, 
            message : "User LoggedOut Successfully"

        })

    } catch (error) {
        return new Apperror(error.message, 400 )
    }
}
const me = async (req, res, next ) => {  
    try {
        const userId =req.user.id 
        try {
            const user  = await userModel.findById(userId)
            return res.status(200).json({
                success : true , 
                user 

            })  

        } catch (error) {
            return next(new Apperror(error.message ,400 ))
        }
        
    } catch (e) {
        return next(new Apperror(e.message , 400 ))
    }
}
const updateUser = async (req, res, next) => { 
    try {
        const {name, username , bio  } = req.body 
        const usernameExists  = await userModel.findOne({username})
        if(!usernameExists) {
            return next(new Apperror("Username Already Exists Try Something new", 400 ) )

        }
        const id = req.user.id 
        const user = await userModel.findById(id) 

        if(!user) {
            return next(new Apperror("user does not Exists", 400 ) )  
        }
        user.name  = name 
        user.username = username
        user.bio = bio  
        await user.save( )
        if(req.file) { 
            
            const result = await cloudinary.v2.uploader.upload(req.file.path , {
                folder:'lms',
                width:'250',
                height:'250',
                gravity:'face' ,
                crop:'fill',


            }) 
            if(result) {
                user.avatar.public_id = result.public_id
                user.avatar.secure_url  = result.secure_url
                // Also we should remove file from local System in the upload folder 
                fs.rm(`uploads/${req.file.filename}`)
            } 
        }
        await user.save()  
        return res.status(200).json( {  
            success : true , 
            message : "User Updated SuccessFully"  
        })

    } catch (e) {
        return next(new Apperror(e.message, 400 ))
    }



}
const forgetPassword =async (req ,res, next) => {
    try {
        const {email } = req.body 
        const user = await userModel.findOne({email}) 
        if(!user) {
            return next(new Apperror("User does not exists")) 
        }
        const resetToken = await user.generatePasswordResetToken() 
        await user.save() 
        const resetPasswordUrl = `${process.env.HOSTNAME}:${process.env.PORT}/api/v1/user/reset-password/${resetToken}`
        try {
            const subject= "Verification for password reset "
            const message =`Hello  <a>${resetPasswordUrl} </a>`
            await sendEmail(email, subject ,message) 
            return res.status(200).json({
                success : true , 
                message : `Reset Password token has been send to ${user.email} Successfully`
            })
        } catch (e) {
            return next(new Apperror ("email does not send ", 400))
        }
    } catch (e) {
        return next(new Apperror(e.message ,400 ))
        
    }
}
const resetPassword = async (req, res, next ) =>{ 
    try {
        const  {resetPasswordToken}= req.params 
        const {password} = req.body 
        // Now we will check if token generated by crypto function is same as the forget password token 
            const forgotpasswordtoken  = crypto
                                    .createHash('sha256')
                                    .update(resetPasswordToken)
                                    .digest('hex')
        console.log(forgotpasswordtoken)
        const user = await userModel.findOne({
            forgotpasswordtoken , forgotpasswordexpirydate:  {$gt  : Date.now()}
        })
        
        if(!user) {
            return next(new Apperror ( "Token is invalid or Expired Please try Again ")  ,400)
        }
        user.password = password;
        // Now token is used and it is of no use so we will Set it null 
        user.forgotpasswordtoken =  undefined
        user.forgotpasswordexpirydate= undefined
        user.save()
        res.status(200).json({
            success:true, 
            message:"Password Changed Successfully"
    
        })    
    } catch (e) {
        return next(new Apperror(e.message , 400))
    }
    
}
const getUserDetails = async (req, res, next) => { 
    try {
        const userId= req.params.id 
        const user = await userModel.findById(userId)  
        if(!user){
            return next(new Apperror("User Does Not exists" ,400)) 

        }
        return res.status(200).json({
            success :true , 
            user 
        })

    } catch (e) {
        return next(new Apperror(e.message, 400 ))
    }
}
const followUser = async (req ,res, next) =>{ 
   
    try {
        const userId = req.user.id 
        const userToFollowId= req.params.id 
        const user = await userModel.findById(userId) 
        if(!user ) {
            return next(new Apperror("User Does not Exists"))
        }      
        user.follows.push({userId : userToFollowId } ) 

        await user.save ( )
        return res.status(200).json({
            success :true , 
            user 
        })
    } catch (e) {
        return next(new Apperror(e.message ,400) )
    }
}
const unfollowUser = async (req ,res , next) => { 
    try {
        const userId = req.user.id 
        const userToUnFollowId = req.params.id 
        const user = await userModel.findById(userId) 
        if(!user) {
            return next(new Apperror("User Does Not Exists " ,400 ))
        }
        for(let i=0 ;i < user.follows.length ; i++ ) {
            if(user.follows[i].userId === userToUnFollowId) {  
                user.follows.splice(i ,1) 
            }
        }
        await user.save() 
        return res.status(200).json({
            success :true , 
            user
        })
    } catch (e) {
        return next(new Apperror(e.message ,400 ))
    }
}

export default{
    register,
    login,
    logout,
    me,
    updateUser,
    getUserDetails,
    followUser, 
    unfollowUser,
    forgetPassword,
    resetPassword
}