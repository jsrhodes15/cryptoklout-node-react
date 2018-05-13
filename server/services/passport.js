const debug = require('debug')('crypto:passport');
const config = require('../config');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const User = require('../modules/user/user.model');


// Create local strategy ======================================================
const localLoginOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localLoginOptions, async (email, password, done) => {
  // verify this email and password, if correct, call done with the user, otherwise, call done with false
  let user;
  try {
    user = await  User.findOne({email: email});
    if (!user) return done(null, false);
  } catch (err) {
    debug('%0 Error attempting to find password');
    return done(err);
  }

  try {
    // compare passwords - is supplied 'password' equal to user.password?
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      debug('%0 Provided password does not match');
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});


// Create jwt Strategy ========================================================
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.SECRET
};

const jwtLogin = new Strategy(jwtOptions, async function (payload, done) {
  debug('@PAYLOAD:', payload);
  // see if the user ID in the payload exists in DB, if correct call 'done' with that user, otherwise, call done without a user object
  try {
    const user = await User.findById(payload.user_id);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});

// Tell passport to use these strategies
passport.use(jwtLogin);
passport.use(localLogin);
