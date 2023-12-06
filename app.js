if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require("express")
const mongoose = require("mongoose")
const app = express()
const Listing = require("./models/listing")
const Review = require("./models/review")
const path = require("path")
const ejs = require("ejs")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const { listingSchema, reviewSchema } = require("./schema.js")
const ExpressError = require("./ExpressError")
const flash = require("connect-flash")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")

//routers
const listingsRouter = require("./routes/listing")
const reviewsRouter = require("./routes/review")
const userRouter = require("./routes/user")
// const user = require("./routes/user");

app.set("views", path.join(__dirname, "views"))
app.set("views engine", "ejs")
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
const dburl = process.env.ATLAS_URL

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRETE_CODE,
  },
  touchAfter: 24 * 3600,
})

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err)
})

const sessionOptions = {
  store: store,
  secret: process.env.SECRETE_CODE,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // corrected key
    expires: Date.now() + 7 * 24 * 3600 * 1000,
    maxAge: 7 * 24 * 3600 * 1000,
    httpOnly: true,
  },
}

app.get("/", (req, res) => {
  res.send("working")
})

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.curruser = req.user
  next()
})

app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", userRouter)

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 30000, // 30 seconds timeout
  })

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.listen(8080, () => {
  console.log("server is running")
})
