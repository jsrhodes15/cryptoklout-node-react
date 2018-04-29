'use strict';

const jwt = require('jsonwebtoken');
const debug = require('debug')('crypto:auth');
const error = require('./error');
const config = require('../config');
const User = require('../modules/User/user.model');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.sign(user, config.SECRET);
}

function validate(email, password) {
  if (!email || !password) throw new Error('Email and Password are required');
}

function signin(req, res) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({token: tokenForUser(req.user), role: req.user.role, user_id: req.user._id});
}

async function signup(req, res, next) {
  const {email, password} = req.body;
  validate(email, password);

  if (!email || !password) {
    return res.status(422).send({error: 'You must provide email and password'});
  }
  try {
    // see if a user with a given email exists
    const existingUser = await User.findOne({email});

    // if a user with email exists, return an error
    if (existingUser) {
      return res.status(422).send({error: 'Email is already in use'});
    }

    // if a user with email does not exist, create and save user record
    const newUser = new User({
      email: email,
      password: password
    });

    const user = await newUser.save();
    // Respond to request indicating status
    res.json({token: tokenForUser(user), user_id: user._id});
  } catch (err) {
    debug('%0', err);
    res.status(400).json(error.friendlyMessage(err, 'Something went wrong'));

  }
}


function findUsers(req, res) {
  User.find(req.query, function (err, response) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(response);
  });
}

function findOneUser(req, res) {
  User.findById(req.params.id, (err, response) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.json(response)
  });
}

module.exports = {
  signin,
  signup,
  findUsers,
  findOneUser,
};
