module.exports = {
  newUser: {
    email: 'testemail@test.com',
    password: 'password',
    username: 'testusername',
    dateOfBirth: new Date(),
    genderId: 1,
    name: 'test name',
  },

  validUser: {
    email: 'testemail@test.com',
    username: 'testusername',
    password: 'password',
  },

  invalidUser: {
    email: 'test@email.com',
    username: 'testusername',
    password: 'invalidUser',
  },

  newTweet: {
    tweets: ['tweet parent test', 'tweet child test'],
  },

  validUserProfile: ['zulfikar', 'bio testing', 'https://zulfikar.com'],
  validUpdatedUserProfile: ['rosadi', 'bio update', 'https://rosadi.com'],
};
