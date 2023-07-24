const User = require("../models/User");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require('crypto')



// Google strategy
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.Google_client,
        clientSecret: process.env.Google_client_sec,
        callbackURL: `/auth/google/cb`,
      },
        async (accessToken, refreshToken, profile, done) => {
            try{
                const user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                      // If the user is already registered, authenticate the user
                      return done(null, user);
                    } else {
                      // If the user is not registered, create a new user account
                      const newUser = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        role: 'user',
                        password: null,
                        phone: null,
                        uuid : crypto.randomUUID()
                      }); 
            
                      await newUser.save();

                      return done(null, newUser);
                    }

            } catch(err){
                done("Main " + err)
            }
      } 
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id, done) => {
    User.findOne({ _id: id })
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
    // console.log(user);
  });