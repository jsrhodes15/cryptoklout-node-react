const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const debug = require('debug')('crypto:passport');
const User = require('../modules/user/user.model');
const config = require('../config');


// Create local strategy =====================================================


const localLogin = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      debug('%0 Error attempting to find password');
      return donne(err);
    }
    if (!user) { return done(null, false); }

    // compare passwords - is 'password' equal to user.password?
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if(!isMatch) {
        debug('%0', 'Provided password does not match');
        return done(null, false);
      }
      return done(null, user);
    });
  });
});


// Create jwt Strategy =======================================================
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.SECRET
};

const jwtLogin = new Strategy(jwtOptions, function(payload, done) {
  debug('@PAYLOAD:', payload)
  // See if the user ID in the payload exists in DB
  // If it does, call 'done' with that user
  // Otherwise, call done without a user object
  User.findById(payload.sub, (err, user) => {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Create strategy for verifying user roles
const adminLogin = new Strategy(jwtOptions, function(payload, done) {
  debug('@PAYLOAD', payload);
  // See if the user ID in the payload exists in DB
  // If it does, call 'done' with that user
  // Otherwise, call done without a user object
  User.findById(payload.sub, (err, user) => {
    if (err) { return done(err, false); }

    if (user && user.role === 'admin') {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
passport.use('admin', adminLogin);
