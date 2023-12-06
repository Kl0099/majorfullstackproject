const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "airhub",
    allowedFormates: ["png", "jpg", "jpeg"],
    public_id: (req, file) => {
      const uniqueFilename = `${Date.now()}-${file.originalname}`
      return `computed-filename-using-request/${uniqueFilename}`
    },
  },
})

module.exports = {
  cloudinary,
  storage,
}
