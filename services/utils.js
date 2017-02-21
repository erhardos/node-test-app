const _ = require('lodash')
const Promise   = require('bluebird')
const validator = require('validator')

const typeValidator = {
  "string": (val) => typeof val === 'string',
  "number": (val) => validator.isNumeric(val.toString()),
  "email": (val) => validator.isEmail(val.toString()),
  "boolean": (val) => validator.isBoolean(val.toString()),
  "date": (val) => validator.isDate(val.toString())
}

const validators = {
  "length": (val, options) => {
    if (!validator.isLength(val, options))
      throw new Error(`have wrong length, should be ${options.min? 'min: ' + options.min : '' + options.max? ' max: ' + options.max : '' }`)
  },
  "type": (val, type) => {
    if (!typeValidator[type](val))
      throw new Error(`is not valid ${type}`)
  },
  "require": (val, option) => option
}

// Set user info from request
module.exports = {
  setUserInfo (user) {
    if (!user.attributes)
      throw new ReferenceError('User does not contain attributes object')
    return _.pick(user.attributes, ['id', 'username', 'email'])
  },

  validate: (model) => Promise.method(function (body, isNew) {

    // Check if all keys exists in model
    _.forIn(body, (val, key) => {
      if (!_.includes(_.keys(model), key))
        throw new ReferenceError(`${key} is not valid field.`)
    })

    _.forIn(model, (rules, key) => {
      if (isNew && rules.require && typeof body[key] === 'undefined')
        throw new Error(`${key} is required`)

      if (body[key]) {
        _.forIn(rules, (options, rule) => {
          try {
            validators[rule](body[key], options)
          } catch(err) {
            throw new Error(`'${key}' error: ${err}`)
          }
        })

      }
    })

    return body
  })
}



