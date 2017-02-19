const Posts = require('../models/posts')

class PostsService {
  constructor(){
  }

  getAll() {
    return Posts
      .fetchAll()
  }

  getOneById(id) {
    return Posts
      .forge({id})
      .fetch()
  }

  create(post) {
    return Posts
      .forge(post)
      .save()
  }

  patch(post) {
    return Posts
      .patch(post)
  }

  destroy(id) {
    return Posts
      .forge({id})
      .destroy()
  }
}

module.exports = new PostsService()
