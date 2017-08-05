const userService = require('../services/users')

class UsersController {

  static async getAll() {
    return await userService.getAllUsers()
  }

  static async getOne(userId) {
    return await userService.getOneById(userId)
  }

  static async uploadAvatar(req, res) { }

  static async getAuthenticated(req, res) { } 
}

module.exports = UsersController