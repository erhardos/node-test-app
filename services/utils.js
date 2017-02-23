const _ = require('lodash')

// Set user info from request
module.exports = {
  setUserInfo (user) {
    if (!user.attributes)
      throw new ReferenceError('User does not contain attributes object')
    return _.pick(user.attributes, ['id', 'username', 'email'])
  }
}



