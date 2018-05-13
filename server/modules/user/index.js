const express = require('express');
const passport = require('passport');
const authentication = require('../../services/authentication');

const router = express.Router();

const requireAuth = passport.authenticate('jwt',{ session: false });

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time is: ', Date.now());
  next();
});

// fetch all users
router.get('/user', (req, res) => {
    res.send('Users home page')
  });

// create new user
router.post('/users/new', authentication.signup);

// fetch one user
router.get('/user/auth', requireAuth, (req, res) => {
    res.send('You are authorized');
  });

module.exports = router;
