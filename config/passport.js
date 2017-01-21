const passport = require('passport'),
  User = require('../models/user'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local'),
  config = require('./main')

const localLogin = new LocalStrategy({}, (username, password, done) => {
  User
    .forge({username})
    .fetch()
    .then(user => {
      if (!user)
        return done(null, false, {error: 'Your login details could not be verified. Please try again.'})

      User.comparePassword(username, password)
        .then(res => {
          if (res) {
            return done(null, user);
          } else {
            done(null, false, {error: "Your login details could not be verified. Please try again."})
          }
        })
        .catch(res => {
          console.error(res)
          done(null, false, {error: "Your login details could not be verified. Please try again."})
        })
    })
    .catch(console.log);
});

const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
  secretOrKey: config.secret
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User
    .forge({'id': payload.id})
    .fetch()
    .then(user => {
      if (user.attributes)
        done(null, user);
      else
        done(null, false);
    })
    .catch(console.log);
});

passport.use(jwtLogin);
passport.use(localLogin);
