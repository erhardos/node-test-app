const userService = require('../services/users')

class UsersController {

  static async getAll(req, res) {
    res.json({data: await userService.getAllUsers()})
  }

  static async getOne(req, res) {
    res.json({data: await userService.getOneById(req.params.id)})
  }

  static async uploadAvatar(req, res) {
    res.json({msg: 'ok'})
  }

  static async getAuthenticated(req, res) {} 
}

module.exports = UsersController