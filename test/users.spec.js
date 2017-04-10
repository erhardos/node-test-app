process.env.NODE_ENV = 'test'

const chai = require('chai'),
    expect = chai.expect,
  chaiHttp = require('chai-http'),
    server = require('../app'),
      knex = require('../db/knex')

chai.use(chaiHttp)

describe('users routes', () => {

  beforeEach(done  => {
    knex.migrate.rollback().then(() => {
      knex.migrate.latest().then(() => knex.seed.run().then(() => {
        done()
      }))
    })
  })

  afterEach(done => {
    knex.migrate.rollback().then(() => {
      done()
    })
  })

  describe('not logged in user', () => {
    it('get all users', (done)=> {
      chai.request(server)
        .get('/users/all')
        .end((err, res) => {
          expect(err).to.be.not.null
          expect(res.statusCode).to.be.equal(401)
          done()
        })
    })

    it('register', done => {
      chai.request(server)
        .post('/auth/register')
        .send({
          username: 'john',
          email: 'john@mail.com',
          password: 'topsecret'
        })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res.statusCode).to.be.equal(201)
          expect(res.body).to.not.be.false
          expect(res.body.user).to.be.deep.equal({
            id: 5, // this can fail
            username: 'john',
            email: 'john@mail.com'
          })
          done()
        })
    })
  })

  describe('login', () => {
    it('login', done => {
      chai.request(server)
          .post('/auth/login')
          .send({
            username: 'guy1',
            password: 'topsecret'
          })
          .end((err, res) => {
            expect(err).to.be.null
            expect(res.statusCode).to.be.equal(200)
            expect(res.body).to.have.ownProperty('token')
            expect(res.body.user).to.be.deep.equal({
              id: 1,
              username: 'guy1',
              email: 'gu1@mail.com'
            })
            done()
          })
    })

  })

  describe('logged in user', () => {
    let token = null

    beforeEach(done => {
      chai.request(server)
          .post('/auth/login')
          .send({
            username: 'guy3',
            password: 'topsecret'
          })
          .end((err, res) => {
            token = res.body.token
            done()
          })
    })

    it('get all users', done => {
      chai.request(server)
          .get('/users/all')
          .set('Authorization', token)
          .end((err, res) => {
            expect(err).to.be.null
            expect(res.statusCode).to.be.equal(200)
            expect(res.body.data).to.have.length(4)
            done()
          })
    })

    // causing db to hang
    xit('delete account', done => {
      chai.request(server)
        .delete('/auth/delete')
        .set('Authorization', token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res.statusCode).to.be.equal(204)
          done()
        })
    })
  })

})