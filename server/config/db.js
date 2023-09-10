import mongoose  from "mongoose";

const connectToDB = async ()=> {
    await mongoose.connect("mongodb+srv://divyaagrawal0747:di501vya@cluster0.dlrb4w0.mongodb.net/")
        .then((conn)=>{
            console.log(`Connected to Database ${conn.connection.host}`)
        })
        .catch((e)=>{ 
            console.log(e) 
            process.exit(1)
         })
} 
export default connectToDB    
