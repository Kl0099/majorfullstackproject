const Listing = require("../models/listing")
const cloudinary = require("cloudinary")

module.exports.renderindex = async (req, res) => {
  try {
    const titleQuery = req.query.title || ""

    if (!titleQuery) {
      const allListings = await Listing.find({})
      return res.render("./listings/index.ejs", {
        allListings,
      })
    }

    // Use the regex in the query
    const regex = new RegExp(titleQuery, "i")
    const allListings = await Listing.find({
      $or: [
        { title: { $regex: regex } },
        { location: { $regex: regex } },
        { country: { $regex: regex } },
      ],
    }).exec()

    // Render the index page with the listings
    res.render("./listings/index.ejs", { allListings })
  } catch (error) {
    // Handle any potential errors, log them, or send an error response
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
}
module.exports.newListing = async (req, res) => {
  res.render("../views/listings/new.ejs")
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner")
  if (!listing) {
    req.flash("error", "listing not found")
    res.redirect("/listings")
  }
  //  console.log("Listing:" , listing);
  res.render("./listings/show.ejs", { listing })
}

module.exports.createListing = async (req, res) => {
  let url = req.file.path
  let filename = req.file.filename
  // console.log(url)
  // console.log(filename)
  const newListing = new Listing(req.body.listing)
  newListing.owner = req.user._id
  newListing.image = { url, filename }
  await newListing.save()
  req.flash("success", "new listing created")

  res.redirect("/listings")
}

module.exports.renderEditListing = async (req, res) => {
  let { id } = req.params
  const listing = await Listing.findById(id)
  let originalImageUrl = listing.image.url
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/h_300,w_250/e_blur:100"
  )
  // console.log(originalImageUrl)
  res.render("./listings/edit.ejs", { listing, originalImageUrl })
}
module.exports.updateListing = async (req, res) => {
  let { id } = req.params
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })

  if (typeof req.file !== "undefined") {
    let url = req.file.path
    let filename = req.file.filename
    listing.image = { url, filename }
    await listing.save()
  }
  res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params

  let deletedListing = await Listing.findByIdAndDelete(id)
  res.redirect("/listings")
}
