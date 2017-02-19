const Users   = require('../models/user'),
      config  = require('../config/main'),
      jwt     = require('jsonwebtoken')

class UsersService {

  constructor(){
  }

  getAllUsers() {
    return Users.fetchAll()
  }

  getOneByUsername(username) {
    return Users
      .forge({username})
      .fetch()
  }

  getOneById(id) {
    return Users
      .forge({id})
      .fetch()
  }

  create(username, email, password, passwordConfirm) {
    if (typeof passwordConfirm !== 'undefined' && password !== passwordConfirm)
      return Promise.reject(new Error('passwords doesn\'t match'))

    return Users
      .forge({username, email, password})
      .save()
  }

  generateToken(user) {
    return jwt.sign(user, config.secret, {
      expiresIn: 10080 // in seconds
    })
  }

  destroy(id) {
    return Users
      .forge({id})
      .destroy()
  }

}

module.exports = new UsersService()