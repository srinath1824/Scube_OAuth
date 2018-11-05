const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const keys = require("./keys");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      //options for the strategy
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      //passport callback function
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          //already have user
          done(null, currentUser);
        } else {
          new User({
            username: profile.displayName,
            googleId: profile.id
          })
            .save()
            .then(newUser => {
              console.log("new user was created" + newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(new FacebookStrategy({
  callbackURL: "/auth/facebook/redirect",
  clientID: keys.facebook.clientID,
  clientSecret: keys.facebook.clientSecret
},
(accessToken, refreshToken, profile, done) => {
  User.findOne({ 'facebook.id': profile.id }).then(currentUser => {
    if (currentUser) {
      //already have user
      done(null, currentUser);
    } else {
      let newUser = new User()
      newUser.facebook.name= profile.name.givenName + " " + profile.name.familyName;
      newUser.facebook.id = profile.id;
      newUser.facebook.token = accessToken;
      newUser.facebook.email = profile.emails[0].value;
      newUser.save()
        .then(newUser => {
          console.log("new user was created" + newUser);
          done(null, newUser);
        });
    }
  });
}
));
