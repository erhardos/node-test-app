const multer = require('multer')

const dest = './media'

const avatar =  {
  dest: `${dest}/avatars/`,
  limits: {
    fieldNameSize: 100,
  }
}

module.exports = {
  avatar: multer(avatar)
}
