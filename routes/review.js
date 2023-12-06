const express = require("express");
const router = express.Router({ mergeParams: true});




const { isLogin, isReviewAuthor,validateListing ,validateReview,asyncWrap}= require("../middleWare.js");


//controllers
const reviewController = require("../controllers/review");



//reviwes
router.post("/",isLogin, validateReview, asyncWrap(reviewController.newReview));


//reviews delete route
router.delete("/:reviewId",isLogin,isReviewAuthor, asyncWrap(reviewController.deleteReview))

module.exports = router;