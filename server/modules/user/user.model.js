'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const debug = require('debug')('crypto:user_model');
const config = require('../../config');

const genders = ['MALE', 'FEMALE'];
const validEmailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const User = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true, unique: true, match: [validEmailRegex, 'Please use a valid email'] },
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
User.pre('save', async function(next) {
  // get access to the User model
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  try {
    const salts = await bcrypt.genSalt(config.SALT_ROUNDS);
    // set the user's password to the resulting hash
    user.password = await bcrypt.hash(user.password, salts);
    next();

  } catch (err) {
    debug('%0', 'Error attempting to hash password');
    next(err)
  };
});

User.methods.comparePassword = async function(candidatePassword, callback) {
  try {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
    // success, fire callback
    callback(null, isMatch);
  } catch (err) {
    debug('%0', err);
    return callback(err);

  }
};

module.exports = mongoose.model('User', User);
