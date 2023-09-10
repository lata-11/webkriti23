import blogModel from "../models/blog.model.js";
import userModel from "../models/user.model.js";
import Apperror from "../utility/error.util.js";
import cloudinary from 'cloudinary'
import fs from "fs/promises"
const getAllblogs =async (req, res ,next) => { 
    try {
        const blogs = await blogModel.find({}) 
        if(!blogs.length)  {
            return next(new Apperror ("There are no blogs Available " ,400 ))
        }
        return res.status(200).json({
            success :true, 
            blogs
        })
        

    } catch (e) {
        return next(new Apperror(e.message ,400))
    }
}

const createBlog =async (req, res ,next) => { 
    try {
       
        


        const {title ,description , category } = req.body 
        


        const authorId= req.user.id 
        const author= await userModel.findById(authorId) 
        if(!author)  {
            return next(new Apperror("User Does NotExists ", 400 ))
        }
        if(!title|| !description || !category   )  {
            return next(new Apperror("Please Write Title And Description "))
        }
        const blog = await blogModel.create({
            title, description, author : author.id , category 
        })
        await blog.save() 


        if(req.file)  {
            console.log(`uploads/${req.file.filename}`)
            try { 
                const result = await cloudinary.v2.uploader.upload(req.file.path,  { 
                    folder : "Blog-Thumbnail", 

                })
                if(result)  {
                    blog.thumbnail.public_id = result.public_id
                    blog.thumbnail.secure_url = result.secure_url

                }
                fs.rm(`uploads/${req.file.filename}`)
            }
            catch(e) { 
                return next(new Apperror (e.message, 400))
            }
        }
        await blog.save()
        return res.status(200).json( {
            success : true , 
            blog
        })
    } catch (e) {
        return next(new Apperror(e.message , 400 ))
        
    }
}

const getBlogById = async(req, res, next ) =>  {
    try {
        const id = req.params.id 
        
        const blog= await blogModel.findById(  {id }) 
        if(!blog)   {
            return new Apperror("No Blogs Exist With This Id " ,400 )  
            
        }
        console.log("fasdkjbfsdjkb")
        return res.status(200).json({
            success : true , 
            blog 

        })
    } catch (error) {
        return next(new Apperror(error.message ,400 ))
    }

}
const updateBlog =async (req, res ,next) => { 

    try {
        const {newTitle,  description ,category} = req.body 

        const blogId = req.params.id 
        const blog = await blogModel.findById(blogId)
        if(!blog) {  
            return next ( new Apperror ( "Incorrect Blog Id ", 400 ) )  
        }
        blog.title = newTitle 
        blog.description = description
        blog.category = category 
        await blog.save() 
        if(req.file) { 
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder:  "Blog-Thumbnail"
            })
            if(result)  { 
                blog.thumbnail.public_id = result.public_id
                blog.thumbnail.secure_url = result.secure_url

            }
            fs.rm(`uploads/${req.file.filename}`)

        }    
        await blog.save() 
        return res.status(200).json({
            success : true ,
            message : "Blog Updated Successfully",
            blog
        })
    } catch (error) {
        return next(new Apperror(error.message ,400 ) )  
    }
    

}
const getBlogByCategory = async (req, res, next) =>  {
     try {
        const category = req.params.category 
        const blogs = await blogModel.find({category}) 
        if(!blogs)  {
            return next(new Apperror("No Blogs in this category" ,400 ))
        }
        return res.status(200).json({
            succesS :true , 
            message : "Success in getting blogs By Category ", 
            blogs
        } )
     } catch (e) {
        return next(new Apperror(e.message, 400 ))
     }
}

const deleteBlog =async (req, res ,next) => { 
    const blogid = req.params.id 
    const blog = await blogModel.findByIdAndDelete  (blogid)  
    return res.status(200).json({ 
         success : true , 
         message :  "Blog is deleted" 

    })
}
const getAllCommentsOfABlog = async (req, res, next) => { 
    try {
        const blogId= req.params.id 
        const blog = await blogModel.findById(blogId) 
        if(!blog) {
            return next(new Apperror("Blog Does Not Exits " ,400 ))
        }

        return res.status(200).json({ 
            success :true, 
            comments : blog.comments
        })
    } catch ( e) {
        return next(new Apperror(e.message ,400 ))        
    }
}
const writeComments = async(req, res, next) => { 
    
    try {


        const blogId= req.params.id 
        const userId=  req.user.id 
        const blog = await blogModel.findById(blogId) 
        const  {comment}  =req.body 
        blog.comments.push({comment, userId, time:  new Date()})
        await blog.save()
        return res.status(200).json({
            success :true ,
            message:  "Comment added Successfully ",
            blog
        })
    } catch (e) {
        return next(new Apperror(e.message ,400 )   )
    }
    
}
const removeComments = async (req, res, next) =>  {
    try {
        const commentId = req.params.commentId
        const blogId = req.params.id 
        const blog= await blogModel.findById( blogId) 
        if(!blog) {
            return next(new Apperror ("Blog Does not Exists with this user id"))
        }
        for(let  i=0 ;i < blog.comments.length ; i++) {
            if(blog.comments[i].id  === commentId) {
                console.log(blog.comments[i])
                blog.comments.splice(i ,1) 
            }
        }
        await blog.save()
        return res.status(200).json({
            success: true, 
            message : "Comment deleted Successfully", 
            blog
        })
        
    } catch ( e) {
        return next( new Apperror (e.message , 400))
    }
}
const likeBlog =async(req , res, next) => { 
    try {
        const userId= req.user.id 
        const blogId= req.params.id 
        const user = await userModel.findById(userId) 
        user.likedBlogs.push({likedBlogId: blogId}) 
        await user.save( )
        return res.status(200).json({
            success :true, 
            user
        })

        
    } catch (e) {
        return next(new Apperror(e.message ,400))
    }
}
const unlikeBlog = async(req, res,next) => { 
    try {
        const userId= req.user.id 
        const blogId= req.params.id 
        const user = await userModel.findById(userId)
        console.log(user.likedBlogs) 

        for (let i=0 ;i < user.likedBlogs.length ; i++ ) {
            if(user.likedBlogs[i].likedBlogId === blogId ) {
                user.likedBlogs.splice(i,1) 
            }
        }

        return res.status(200).json({
            success : true ,
            message : "Blog Unliked Successfully ",


        })
    } catch (error) {
        return next(new Apperror(error.message , 400 )) 
    }
}
const getRecentBlog=async (req ,res, next ) => { 
    try {
        const blogs = await blogModel.find({}).sort({createdAt :-1 })
        return res.status(200).json({
            success : true , 
            blogs
        })
    } catch (e) {
        return next(new Apperror(e.message ,400 ))
    }
}
export default { 
    getAllblogs,
    createBlog, 
    getBlogById,
    updateBlog,
    deleteBlog,
    writeComments,
    likeBlog,
    unlikeBlog, 
    removeComments,
    getAllCommentsOfABlog,
    getBlogByCategory, 
    getRecentBlog


}