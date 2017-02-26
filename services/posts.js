const Posts = require('../models/posts')

class PostsService {
  constructor(Posts){
    this._Posts = Posts
  }

  getAll() {
    return this._Posts
      .fetchAll()
  }

  getOneById(id) {
    return this._Posts
      .forge({id})
      .fetch()
  }

  create(post) {
    return this._Posts
      .forge(post)
      .save()
  }

  patch(post) {
    return this._Posts
      .patch(post)
  }

  destroy(id) {
    return this._Posts
      .forge({id})
      .destroy()
  }
}

module.exports = new PostsService(Posts)
