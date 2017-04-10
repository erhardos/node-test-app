
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({
          username: 'guy1',
          password: '$2a$05$2hFC7rZWhoqBBopGun0o1exGU6OZL3GHp7PsuS26mXlqdL2tpbCL.',
          email: 'gu1@mail.com'
        }),
        knex('users').insert({
          username: 'guy2',
          password: '$2a$05$2hFC7rZWhoqBBopGun0o1exGU6OZL3GHp7PsuS26mXlqdL2tpbCL.',
          email: 'gu2@mail.com'
        }),
        knex('users').insert({
          username: 'guy3',
          password: '$2a$05$2hFC7rZWhoqBBopGun0o1exGU6OZL3GHp7PsuS26mXlqdL2tpbCL.',
          email: 'gu3@mail.com'
        }),
        knex('users').insert({
          username: 'guy4',
          password: '$2a$05$2hFC7rZWhoqBBopGun0o1exGU6OZL3GHp7PsuS26mXlqdL2tpbCL.',
          email: 'gu4@mail.com'
        })
      ]).then(()=> {
        return knex('posts').del()
          .then(() => {
            return Promise.all([
              // Inserts seed entries
              knex('posts').insert({
                title: 'Fancy title',
                user_id: 1,
                content: 'blahblahblahblah'
              }),
              knex('posts').insert({
                title: 'Fancy title2',
                user_id: 1,
                content: 'no value'
              }),
              knex('posts').insert({
                title: 'long one',
                user_id: 2,
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?'
              }),
              knex('posts').insert({
                title: 'basically no content',
                user_id: 4,
                content: ''
              }),
            ])
          })
      })
    })
}
