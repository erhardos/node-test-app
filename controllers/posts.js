const postService     = require('../services/posts'),
      userService     = require('../services/users'),
      ResponseError   = require('../utils/ResponseError')

class PostsController {
  static async getAll() {
    return await postService.getAll()
  }

  static async getOne(postId) {
    const post = await postService.getOneById(postId)
    if (!post)
      throw new ResponseError('Post does not exists.', 404)
    return post
  }

  static async create(user, newPost) {
    const {id} = await userService.getUserInfo(user)
    const createdPost = await postService.create({
      user_id: id,
      title: newPost.title,
      content: newPost.content
    })
    return createdPost
  }

  static async update(reqUser, postId, newPostBody) {
    const user = await userService.getUserInfo(reqUser)
    const post = await postService.getOneById(postId)
    if (!post)
      throw new ResponseError ('Post does not exists.', 404)
    if (post.get('user_id') !== user.id)
      throw new ResponseError ('You don\'t have permission to do that.', 401)

    return await post.patch(newPostBody)
  }

}

module.exports = PostsController