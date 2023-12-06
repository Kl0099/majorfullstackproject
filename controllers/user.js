const User = require("../models/user")

module.exports.renderSignUp = (req, res) => {
  res.render("../views/users/signup.ejs")
}

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body
    const newUser = new User({ username, email })
    const saveduser = await User.register(newUser, password)
    req.login(saveduser, (err) => {
      if (err) {
        next(err)
      }
      req.flash("success", "signup successfully")
      res.redirect("/listings")
    })
  } catch (e) {
    req.flash("error", e.message)
    res.redirect("/signup")
  }
}

//login
module.exports.renderrLogIn = (req, res) => {
  res.render("../views/users/login.ejs")
}

module.exports.logIn = async (req, res) => {
  req.flash("success", `you are currently logged as ${req.user.username}`)
  let redirectUrl = res.locals.redirectUrl || "/listings"
  res.redirect(redirectUrl)
}

//logOut
module.exports.logOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err)
    }
    req.flash("success", "log out successfully")
    res.redirect("/listings")
  })
}
