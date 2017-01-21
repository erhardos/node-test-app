const _ = require('lodash')

// Set user info from request
module.exports = {
  setUserInfo (request) {
    return _.pick(request.attributes, ['id', 'username', 'email'])
  }
}



