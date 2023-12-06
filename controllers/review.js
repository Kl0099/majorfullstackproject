const Review = require("../models/review");
const Listing = require("../models/listing");


module.exports.newReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    
    await listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    
    res.redirect(`/listings/${listing.id}`);
}

module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId} = req.params;
   await Listing.findByIdAndUpdate(id , {$pull : {reviews: reviewId}});
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);

}