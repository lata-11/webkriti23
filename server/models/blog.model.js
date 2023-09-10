import mongoose  from "mongoose";
const blogModel = new mongoose.Schema({
    title: {
        type :String, 
        require: [true ,"Title is required "] , 
    } ,
    description :{
        type: String, 
        require :  [true , "Description is required"]
    },
    thumbnail : {
        public_id : {
            type:String,
        },
        secure_url: {
            type:String
        }
    },
    author : {
        type : String
    },
    category: {
        type : String, 
    },
    comments : [
        {
            comment : {
                type : String
            }, 
            userId :  {
                type : String 
            },
            time: { 
                type : Date 
            }
        }
    ], 
    category: {
        type : String , 
        trim : true 

    }
},{ 
    timestamps  : true 
})

export default mongoose.model("blogModel", blogModel )