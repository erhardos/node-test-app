const chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon')

const postsService = require('../services/posts')

describe('posts service tests', () => {
  const obj = {
    data: 'ok'
  }

  const postSpy = {
    _Posts: {
      fetchAll: sinon.stub().returns(Promise.resolve(obj)),
      patch: sinon.stub(),
      forge: sinon.stub().returns({
        fetch: sinon.stub().returns(Promise.resolve(obj)),
        save: sinon.spy(),
        destroy: sinon.spy()
      })
    }
  }

  it('getAll is called', () => {
    postsService
      .getAll
      .call(postSpy)
      .then(response => {
        expect(response).to.be.equal(obj)
        expect(postSpy._Posts.fetchAll.calledOnce).to.be.true
      })
  })

  it('getOneById is called with proper id', () => {
    const id = {id: 1}

    postsService
      .getOneById
      .apply(postSpy, [id])
      .then(response => {
        expect(postSpy._Posts.forge.args[0][0]['id']).to.be.equal(id)
        expect(postSpy._Posts.forge.calledOnce).to.be.true

        expect(postSpy._Posts.forge().fetch.calledAfter(postSpy._Posts.forge))
        expect(postSpy._Posts.forge().fetch.calledOnce).to.be.true

        expect(response).to.be.equal(obj)
      })


  })
})