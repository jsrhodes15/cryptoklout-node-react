'use strict';


/**
 * Returns an error object with a friendly message
 *
 * @param {object} err - Raised error object
 * @param {string} message - Friendly message to use
 * @param {bool} override - Always override with friendly message
 * @return {object} - returns the error object
 */
function friendlyMessage(err, message, override = true) {
  if (message && typeof message === 'string') {
    const errorMessage = override ? message : (err.message || message);

    return Object.assign({}, err, {
      message: errorMessage,
    });
  }

  return err;
}

module.exports.friendlyMessage = friendlyMessage;
