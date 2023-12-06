const express = require("express");
const router = express.Router();

const passport = require("passport");
const { saveRedirectUrl,asyncWrap } = require("../middleWare");



const userController = require("../controllers/user");


//signup 
router.route("/signup")
.get(userController.renderSignUp)
.post(asyncWrap(userController.signUp));


//login
router.route("/login")
.get( userController.renderrLogIn)
.post(saveRedirectUrl,passport.authenticate("local" , {failureRedirect: "/login" ,failureFlash : true}), userController.logIn);



router.get("/logout",userController.logOut);



module.exports = router;

