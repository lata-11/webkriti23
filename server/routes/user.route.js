import express from "express" 
const router = express.Router() 
import upload from "../middlewares/multer.middleware.js"
import user from "../controllers/user.controller.js"
import isLoggedIn from "../middlewares/authenticate.middleware.js"
router.route('/register')
        .post(upload.single("avatar"), user.register)
router.route("/login")
        .post(user.login)
router.route("/logout")
        .get(user.logout)
router.route("/me")
        .get(isLoggedIn,user.me) 
router.route("/updateUser" )
        .post( isLoggedIn,upload.single("avatar") , user.updateUser)
router.route("/forgot-password")
        .post(isLoggedIn , user.forgetPassword)
router.route("/reset-password/:resetPasswordToken")
        .post(isLoggedIn , user.resetPassword)
router.route("/userdetails/:id")
        .get(user.getUserDetails)
router.route("/followUser/:id")
        .post( isLoggedIn,  user.followUser)
router.route("/unfollowUser/:id")
        .delete( isLoggedIn, user.unfollowUser)

        
export default router 