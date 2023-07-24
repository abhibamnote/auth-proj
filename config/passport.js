const User = require("../models/User");
const passport = require("passport");
require('dotenv').config();

const SECRET = process.env.JWT_SEC;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Strategy, ExtractJwt } = require("passport-jwt");
const crypto = require('crypto')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET
};

module.exports = passport => {
    passport.use('jwt',
        new Strategy(opts, async (payload, done) => {
        await User.findById(payload.user_id)
            .then(user => {
            if (user) {
                return done(null, user);
            }

            return done(null, false);
            })
            .catch(err => {
            return done(null, false);
            });
        })
    );
}


