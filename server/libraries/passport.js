const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../modules/User/user.model');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.SECRET );
}

function signin(req, res) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user), role: req.user.role, user_id: req.user._id });
};

function signup(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }
  // see if a user with a given email exists
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) { return next(err); }

    // if a user with email exists, return an error
    if (existingUser) {

      return res.status(422).send({ error: 'Email is already in use'});
    }

    // if a user with email does not exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save((err) => {
      if (err) { return next(err); }

      // Respond to request indicating status
      res.json( { token: tokenForUser(user), user_id: user._id });

    });
  });
};

function findUsers(req, res) {
  User.find(req.query, function(err, response){
    if (err) { return res.status(500).json(err); }
    return res.json(response);
  });
};

function findOneUser(req, res) {
  User.findById(req.params.id, (err, response) => {
    if (err) { return res.status(500).json(err); }

    return res.json(response)
  });
};

module.exports = {
  signin,
  signup,
  findUsers,
  findOneUser,
};
