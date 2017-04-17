process.env.NODE_ENV = 'test'

const chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    server = require('../app'),
    knex = require('../db/knex')

chai.use(chaiHttp)

describe('posts routes', () => {
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

    describe('not authenticated', () => {
        it('get all posts', done => {
            chai.request(server)
                .get('/posts')
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.data.length).to.be.equal(4)
                    done()
                })
        })

        it('get one', done => {
            chai.request(server)
                .get('/posts/1')
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.data).to.be.not.undefined
                    expect(res.body.data.id).to.be.equal(1)
                    expect(res.body.data.title).to.be.equal('Fancy title')
                    expect(res.body.data.content).to.be.equal('blahblahblahblah')
                    done()
                })
        })

        it('get one which does not exists', done => {
            chai.request(server)
                .get('/posts/5')
                .end((err, res) => {
                    expect(err).to.be.not.null
                    expect(res.statusCode).to.be.equal(404)
                    expect(res.body.data).to.be.undefined
                    const body = JSON.parse(err.response.text)
                    expect(body.msg).to.be.equal('Post does not exists.')

                    done()
                })
        })
    })

    describe('authenticated', () => {
        let token = null
        let user_id = null

        beforeEach(done => {
            chai.request(server)
                .post('/auth/login')
                .send({
                    username: 'guy3',
                    password: 'topsecret'
                })
                .end((err, res) => {
                    token = res.body.token
                    user_id = res.body.user.id
                    done()
                })
        })

        it('add post', done => {
            chai.request(server)
                .post('/posts')
                .set('Authorization', token)
                .send({
                    title: 'WAT is this',
                    content: 'long story short'
                })
                .end((err, res) => {
                  expect(err).to.be.null
                  expect(res.statusCode).to.be.equal(200)
                  expect(res.body.data.user_id).to.be.equal(user_id)
                  expect(res.body.data.title).to.be.equal('WAT is this')
                  expect(res.body.data.content).to.be.equal('long story short')
                  done()
                })
        })

        describe('post CRUD', () => {
          let post_id = null
          beforeEach(done => {
            chai.request(server)
            .post('/posts')
              .set('Authorization', token)
              .send({
                title: 'WAT is this',
                content: 'long story short'
              })
              .end((err, res) => {
                expect(err).to.be.null
                post_id = res.body.data.id
                done()
              })
          })

          it('update post', done => {
            chai.request(server)
              .put(`/posts/${post_id}`)
              .set('Authorization', token)
              .send({
                title: 'new title'
              })
              .end((err, res) => {
                expect(err).to.be.null
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.data.title).to.be.equal('new title')
                expect(res.body.data.content).to.be.equal('long story short')
                done()
              })
          })

          xit('delete post', done => {
            chai.request(server)
              .delete(`/posts/${post_id}`)
              .set('Authorization', token)
              .end((err, res) => {
                expect(err).to.be.null
                expect(res.statusCode).to.be.equal(204)
                knex.select('*')
                    .from('posts')
                    .where('id', post_id)
                    .then((data) => {
                      expect(data).to.be.null
                    })
                done()
              })
          })
        })
    })
})