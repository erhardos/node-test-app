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
      fetchAll: sinon.stub().returns(obj),
      patch: sinon.stub(),
      forge: sinon.stub().returns({
        fetch: sinon.stub().returns(obj),
        save: sinon.spy(),
        destroy: sinon.spy()
      })
    }
  }

  it('getAll is called', () => {
    const returnedVal = postsService.getAll.call(postSpy)

    expect(returnedVal).to.be.equal(obj)
    expect(postSpy._Posts.fetchAll.calledOnce).to.be.true
  })

  it('getOneById is called with proper id', () => {
    const id = {id: 1}

    const result = postsService.getOneById.apply(postSpy, [id])

    expect(postSpy._Posts.forge.args[0][0]['id']).to.be.equal(id)
    expect(postSpy._Posts.forge.calledOnce).to.be.true

    expect(postSpy._Posts.forge().fetch.calledAfter(postSpy._Posts.forge))
    expect(postSpy._Posts.forge().fetch.calledOnce).to.be.true

    expect(result).to.be.equal(obj)
  })
})