const express = require("express")
const router = express.Router()
const {
  isLogin,
  isOwner,
  validateListing,
  asyncWrap,
} = require("../middleWare.js")
const multer = require("multer")
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

//controllers

const listingController = require("../controllers/listing.js")

router
  .route("/")
  .get(asyncWrap(listingController.renderindex))
  .post(
    isLogin,
    upload.single("listing[image]"),
    validateListing,
    asyncWrap(listingController.createListing)
  )

//new route
router.get("/new", isLogin, asyncWrap(listingController.newListing))

router
  .route("/:id")
  //show route
  .get(asyncWrap(listingController.showListing))
  //update
  .put(
    isLogin,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    asyncWrap(listingController.updateListing)
  )
  //delete
  .delete(isLogin, asyncWrap(listingController.deleteListing))

//edit route render route
router.get("/:id/edit", isLogin, asyncWrap(listingController.renderEditListing))

module.exports = router
