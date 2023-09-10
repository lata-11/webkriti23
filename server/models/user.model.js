import mongoose from "mongoose";
import JWT from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
const UserSchema = new mongoose.Schema({
    name:{
        type:String, 
        require:[true, "Name is Required"],
        trim:true,
        minLength:[5 , "Name must be greater than 5 characters"],
        lowercase:true
    },
    email:{
        type:String,
        require:[true,"Name is required for SignUp"],
        unique:[true, 'User already SignIn'], 
        lowercase:true,
        trim:true,
        match:[ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ,  "Please Enter a Valid Email "]         
    },
    password:{
        type:String,
        require:[true,"Password is required for further Process"],
        select:false,
        minLength:[8, "Password must be greater than 8 characters"]
        
    },
    avatar :{
        public_id: {
            type:String, 
        },
        secure_url: {
            type:String
        }
    },
    username :{
        type: String,
        require : [true, "User name is Required"],
        maxLength: [8,  "User name cannot be greater than 8 characters"],
        unique: true
    },
    bio : {
        type: String, 
        maxLength :[200, "Bio cannot be more than 100 characters"]
    }, 
    likedBlogs : [
        {
            likedBlogId : {
                type : String
            }
        }
    ],
    follows: [
        {
            userId : {
                type :String , 
                trim : true 
            }
        }
    ],
    forgotpasswordtoken : {
        type : String
    },
    forgotpasswordexpirydate : {
        type: Date
    }
},{
    timestamps:true
})
UserSchema.pre('save' , async function (next) {
    if(!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password , 10  )
    return next()
})
UserSchema.methods = {
    comparePassword(newPassword){
        newPassword = bcrypt.hash(newPassword ,10) 
        return this.password === newPassword     
    },
    generateJWTTokens(){
        // JWT contains of three parts 
        /**
         * Payload 
         * Super Secret 
         * options like expiry 
         * 
         */
         return JWT.sign(
            {id:this._id,email:this.email, username: this.username },
            process.env.JWT_SECRET,
            {
                expiresIn:'24h'
            }
        )
    },
    generatePasswordResetToken() {
        // We are actually generating a hash 20 characters using crypto 

        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // We should try to store it in hashed form 
        // then we are setting it into database 
        this.forgotpasswordtoken = crypto.createHash('sha256')
                                        .update(resetToken)
                                        .digest('hex')
        // Setted the password expiry 15 minutes 
        this.forgotpasswordexpirydate = Date.now()*1000*60*15  
        
        return resetToken
    }
}
export default mongoose.model("User" , UserSchema)
