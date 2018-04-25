const mongoose = require('mongoose');
import bcrypt from 'bcrypt-nodejs';

const genders = ['MALE', 'FEMALE'];
const validEmailRegex = /^(([^<>()[]\.,;:s@"]+(.[^<>()[]\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

const user = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true, unique: true, match: validEmailRegex },
  password: { type: String, required: true },
  profile: {
    firstName: String,
    lastName: String,
    location: String,
    website: String,
    picture: String,
    gender: { type: String, enum: genders },
  }
}, { timestamps: true });

// On save Hook, encrypt password
user.pre('save', function(next) {
  // get access to the user model
  const user = this;
  if (user.__v >= 0) {
    next()
  }
  // generate a salt, then run callback
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }

    // hash our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }

      // overwrite our unencrypted password with encrypted password
      user.password = hash;
      next();
    });
  });
});

user.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', user);
