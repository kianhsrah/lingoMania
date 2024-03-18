const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // INPUT_REQUIRED {Google client ID}
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // INPUT_REQUIRED {Google client secret}
    callbackURL: "/auth/google/redirect"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists in our db
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        console.log(`User already exists in DB: ${existingUser.username}`);
        done(null, existingUser);
      } else {
        // If not, create a new user in our db
        const newUser = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          displayName: profile.displayName,
          email: profile.emails[0].value
        });
        console.log(`New user created: ${newUser.username}`);
        done(null, newUser);
      }
    } catch (error) {
      console.error(`Error in Google Strategy passport: ${error.message}`, error.stack);
      done(error, null);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error(`Error deserializing user: ${error.message}`, error.stack);
    done(error, null);
  }
});