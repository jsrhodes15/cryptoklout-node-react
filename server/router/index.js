const express = require('express');
const debug = require('debug')('crypto:router');
const authentication = require('../modules/authentication/index');

const router = express.Router();


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.route('/')
  .get((req, res) => {
    res.send('Users home page')
  })
  .post((req, res) => {
    res.json(req.body)
});
// define the about route
router.route('/signup')
  .post(authentication.signup);


module.exports = router;
