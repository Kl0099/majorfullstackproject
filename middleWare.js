const Review = require("./models/review");
const Listing = require("./models/listing");
const {listingSchema , reviewSchema} = require("./schema.js");

const ExpressError = require('./ExpressError');

module.exports.isLogin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged");
       return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = async (req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error", "you dont have permission to edit this listing");
       return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.isReviewAuthor = async (req,res,next)=>{
    let {reviewId,id}=req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error", "you  are not the author of this review");
       return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let erroemsg = error.details.map((el)=>{el.message}).join(", ");
        return next(new ExpressError(400,erroemsg));
    }else{
        next();
    }

}
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let erroemsg = error.details.map((el) => el.message).join(", "); // Corrected the parentheses
        throw new ExpressError(400, erroemsg);
    } else {
        next();
    }
}

module.exports.asyncWrap = (fn) => {
    return function(req,res,next){
        fn(req,res,next).catch((err) => next(err));
    }
}
