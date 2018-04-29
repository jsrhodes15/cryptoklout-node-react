const debug = require('debug')('crypto:auth');
const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Authentication Middleware
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Next middleware to invoke
 * @return {function} - Next middleware
 */
function isAuthenticated(req, res, next) {
  // allow authorization header or token query string param
  if (!req.headers.authorization && !req.query.token) {
    debug(`Auth Error=No authorization header or query token, url=${req.url}`);
    return res.status(403).json({ error: 'You are not permitted to perform this action' });
  }

  // get token from header
  let token = null;
  if (req.headers.authorization) token = req.headers.authorization.replace('Bearer ', '');
  if (!token) token = req.query.token;

  // verify token
  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err) {
      debug(`Auth Error=Unable to verify jwt, url=${req.url}, token=${token}, err=${err}`);
      return res.status(403).json({ error: 'You are not permitted to perform this action' });
    }

    // account for mongo documents with _id
    if (!decoded.id && !decoded['_id']) {
      debug('Auth Error=We did not have a decoded JWT value to check against.');
      return res.status(403).json({ error: 'You are not permitted to perform this action' });
    }

    // add decoded payload from token to request
    req.currentUser = decoded;

    return next();
  });
}

module.exports.isAuthenticated = isAuthenticated;
