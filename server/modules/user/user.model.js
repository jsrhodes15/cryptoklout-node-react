const mongoose = require('mongoose');

const genders = ['MALE', 'FEMALE'];
const validEmailRegex = /^(([^<>()[]\.,;:s@"]+(.[^<>()[]\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

const user = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true, unique: true, match: validEmailRegex },
  password: { type: String, required: true },
  profile: {
    name: String,
    location: String,
    website: String,
    picture: String,
    gender: { type: String, enum: genders },
  }
}, { timestamps: true });

module.exports = mongoose.model('User', user);
