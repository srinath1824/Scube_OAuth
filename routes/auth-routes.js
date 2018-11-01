const router = require("express").Router();
const path = require("path");
const passport = require("passport");

//auth Login
router.get("/login", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public", "login.html"));
});

//auth Logout
router.get("/logout", (req, res) => {
  //handle with passport
  req.logout();
  res.sendFile(path.resolve(__dirname, "../public", "login.html"));
});

//auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

//callback route for google to redirect
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  //res.send(req.user);
  res.sendFile(path.resolve(__dirname, "../public", "home.html"));
});

module.exports = router;