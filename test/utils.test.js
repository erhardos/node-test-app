const chai = require('chai'),
      expect = chai.expect,
      sinon = require('sinon')

const utils = require('./../services/utils')

describe('utils tests', () => {
  describe('setUserInfo basic tests', () => {
    it('return nested attributes object from user', () => {
      const user = {
        attributes: {
          id: 2,
          email: 'dummy@email.com',
          username: "john.doe"
        }
      }

      expect(utils.setUserInfo(user)).to.deep.equal(user.attributes)
    })

    it('omit not specified keys', () => {
      const user = {
        attributes: {
          id: 2,
          email: 'dummy@email.com',
          username: "john.doe",
          otherField: "some random val",
          anotherOne: "no idea what"
        }
      }

      expect(utils.setUserInfo(user)).to.contain.all.keys(['id', 'email', 'username']);
      expect(utils.setUserInfo(user)).to.not.contain.all.keys(['otherField', 'anotherOne']);
    })

    it('throw error when nothing passed', () => {
      expect(utils.setUserInfo).to.throw(TypeError, /Cannot read property \'attributes\' of undefined/);

    })

    it('throw error when does not contain attributes', () => {
      const user = {
        randomKey: {
          id: 2,
          email: 'dummy@email.com'
        }
      }

      expect(utils.setUserInfo.bind(null, user)).to.throw(ReferenceError, /User does not contain attributes object/);

    })
  })

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
      const validator = utils.validate(model)

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
})
