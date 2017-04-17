const chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon')

const modelValidator = require('../services/validator')

describe('validator tests', () => {

  describe('basic', () => {
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

    it('pass empty body', ()=> {
      const model = {
        name: {
          type: 'string',
        }
      }
      const validator = modelValidator(model)

      const body = {}
      return validator(body, true).then(data => {
        expect(data).to.be.equal(body)
      })
    })

    it('fail if attr is not in model', () => {
      const model = {
        name: {
          type: 'string',
          require: true
        }
      }
      const validator = modelValidator(model)

      const user = {
        name: 'John',
        telNumber: 12312312,
      }

      return validator(user, true).catch(err => {
        expect(err).to.be.instanceof(ReferenceError)
          .and.have.property('message', 'telNumber is not valid field.');
      })
    })

    it('throw error if filed is required, but it is not present in body', () => {
      const model = {
        name: {
          type: 'string',
        },
        telNumber: {
          type: 'number'
        },
        email: {
          type: 'email',
          require: true
        }
      }
      const validator = modelValidator(model)

      const user = {
        telNumber: 12312312,
      }

      return validator(user, true).catch(err => {
        expect(err).to.be.instanceof(Error)
          .and.have.property('message', 'email is required');
      })
    })
  })


  describe('validators', ()=>{
    it('throw error if type is incorrect', () => {
      const model = {
        name: {
          type: 'string',
        }
      }
      const validator = modelValidator(model)

      const user = {
        name: 1
      }

      return validator(user, true).catch(err => {
        expect(err).to.be.instanceof(Error)
          .and.have.property('message', "'name' Error: is not valid string");
      })
    })

    it('throw error if length is incorrect', () => {
      const model = {
        name: {
          type: 'string',
          length: ({min: 2})
        }
      }
      const validator = modelValidator(model)

      const user = {
        name: 'a'
      }

      return validator(user, true).catch(err => {
        expect(err).to.be.instanceof(Error)
          .and.have.property('message', "'name' Error: have wrong length, should be min: 2");
      })
    })
  })
})
