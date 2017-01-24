const _ = require('lodash')
const Promise   = require('bluebird')

// Set user info from request
module.exports = {
  setUserInfo (request) {
    return _.pick(request.attributes, ['id', 'username', 'email'])
  },

  validate: (fields, validationRules) => Promise.method(function (body) {
    _.forIn(body, (val, key) => {
      if (!_.includes(fields, key))
        throw new ReferenceError(`${key} Property does not exists.`)

      if(!(validationRules[key] && validationRules[key](val)))
        throw new Error(`${key} is not valid.`, key, val)
    })

    return body
  })
}



