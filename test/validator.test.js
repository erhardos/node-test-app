const chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon')

const modelValidator = require('../services/validator')

describe('validator tests', () => {

  it('valid model pass', () => {
    const model = {
      name: {
        type: 'string',
        require: true
      },
      email: {
        type: 'email'
      },
      telNumber: {
        type: 'number'
      }
    }
    const validator = modelValidator(model)

    const user = {
      name: 'John',
      telNumber: 12312312,
      email: 'john@mail.com'
    }

    return validator(user, true).then(data => {
      expect(data).to.be.equal(user)
    })

  })
})
