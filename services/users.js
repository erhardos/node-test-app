const Users   = require('../models/user'),
      config  = require('../config/main'),
      jwt     = require('jsonwebtoken'),
      _       = require('lodash'),
      Promise = require('bluebird')

class UsersService {

  constructor(Users){
    this._Users = Users
  }

  getAllUsers() {
    return this._Users.query('where', 'active', '=', 'true').fetchAll()
  }

  getOneByUsername(username) {
    return this._Users
      .forge({username})
      .fetch()
  }

  getOneById(id) {
    return this._Users
      .forge({id})
      .fetch()
  }

  create(userObj, passwordConfirm) {
    if (typeof passwordConfirm !== 'undefined' && userObj.password !== passwordConfirm)
      return Promise.reject(new Error('passwords doesn\'t match'))

    return this._Users
      .forge(userObj)
      .save()
  }

  generateToken(user) {
    return jwt.sign(user, config.secret, {
      expiresIn: 10080 // in seconds
    })
  }

  destroy(id) {
    return this._Users
      .forge({id})
      .save({active: false}, {patch: true})
  }

  getUserInfo (user) {
    return Promise.method(function (user) {
      if (!user.attributes)
        throw new ReferenceError('User does not contain attributes object')
      return _.pick(user.attributes, ['id', 'username', 'email'])
    })(user)
  }

}

module.exports = new UsersService(Users)
