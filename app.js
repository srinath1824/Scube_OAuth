const express = require("express");
const path = require("path");
const authRoutes = require("./routes/auth-routes");
const passportSetup = require("./configs/passport-setup");
const mongoose = require("mongoose");
const keys = require("./configs/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");

const app = express();

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Connect to mongodb
mongoose.connect(
  keys.mongodb.dbURI,
  () => {
    console.log("Connected to mongoDB");
  }
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "login.html"));
});

app.listen(3000, () => {
  console.log("App is listening to port 3000");
});
