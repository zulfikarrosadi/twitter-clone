module.exports = {
  newUser: {
    email: `testemail${Math.floor(Math.random() * 1000)}@test.com`,
    password: 'password',
    username: `testusername${Math.floor(Math.random() * 1000)}`,
  },

  validUser: {
    email: 'test@email.com',
    username: 'testusername',
    password: 'testingemail',
  },

  invalidUser: {
    email: 'test@email.com',
    username: 'testusername',
    password: 'invalidUser',
  },
};
