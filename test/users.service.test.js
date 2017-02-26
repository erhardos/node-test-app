const chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon')

const usersService = require('../services/users')

describe('users service tests', () => {

  describe('user create', () => {

    const userObj = {
      username: 'JohnDoe',
      email: 'johndoe@mail.com',
      password: 'dummy_password'
    }

    const forge = {save: sinon.stub().returns(Promise.resolve(userObj))}
    const userSpy = {
      _Users: {
        forge: sinon.stub().returns(forge)
      }
    }

    it('simple usage', () => {
      usersService.create.call(userSpy, userObj)
        .then(response => {
          expect(userSpy._Users.forge.calledOnce).to.be.true
          expect(userSpy._Users.forge.args[0][0]).to.be.equal(userObj)

          expect(userSpy._Users.forge().save.calledOnce).to.be.true
          expect(userSpy._Users.forge().save.calledAfter(userSpy._Users.forge))

          expect(response).to.be.equal(userObj)
        })
    })

    it('optional password confirmation positive', () => {
      usersService.create.call(userSpy, userObj, userObj.password)
        .then(response => {
          expect(response).to.be.equal(userObj)
        })
    })

    it('optional password confirmation negative', () => {
      const invalid_password = '1234'

      usersService.create.call(userSpy, userObj, invalid_password)
        .catch(err => {
          expect(err).to.be.instanceof(Error)
            .and.have.property('message', 'passwords doesn\'t match');
        })
    })
  })

  describe('getUserInfo', () => {
    it('return nested attributes object from user', () => {
      const user = {
        attributes: {
          id: 2,
          email: 'dummy@email.com',
          username: "john.doe"
        }
      }

      expect(usersService.getUserInfo(user)).to.deep.equal(user.attributes)
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

      expect(usersService.getUserInfo(user))
        .to.contain.all.keys(['id', 'email', 'username']);
      expect(usersService.getUserInfo(user))
        .to.not.contain.all.keys(['otherField', 'anotherOne']);
    })

    it('throw error when nothing passed', () => {
      expect(usersService.getUserInfo)
        .to.throw(TypeError, /Cannot read property \'attributes\' of undefined/);

    })

    it('throw error when does not contain attributes', () => {
      const user = {
        randomKey: {
          id: 2,
          email: 'dummy@email.com'
        }
      }

      expect(usersService.getUserInfo.bind(null, user))
        .to.throw(ReferenceError, /User does not contain attributes object/);
    })
  })
})
