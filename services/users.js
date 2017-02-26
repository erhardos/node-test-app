const Users   = require('../models/user'),
      config  = require('../config/main'),
      jwt     = require('jsonwebtoken')

class UsersService {

  constructor(Users){
    this._Users = Users
  }

  getAllUsers() {
    return this._Users.fetchAll()
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
      .destroy()
  }

}

module.exports = new UsersService(Users)