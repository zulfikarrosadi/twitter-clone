/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const supertest = require('supertest');
const { expect } = require('chai');
const { PrismaClient } = require('@prisma/client');
const { validUser, newTweet } = require('./helper');

const prisma = new PrismaClient();
const request = supertest('http://localhost:3000');

describe.skip('E2E Tweet Endpoint', () => {
  let userCookie;

  beforeEach(async () => {
    const user = await request.post('/users/login').send(validUser);
    userCookie = user.header['set-cookie'];
    await request.post('/tweets').send(newTweet).set('Cookie', userCookie);
  });
  afterEach(async () => {
    await prisma.tweet_child.deleteMany();
    await prisma.tweet_photos.deleteMany();
    await prisma.tweet_parent.deleteMany();
  });

  describe('GET /tweets', () => {
    it('should return all the tweet', async () => {
      const res = await request.get('/tweets');

      expect(res.statusCode).to.be.equal(200);
      expect(res.body.tweets).to.not.be.empty;

      res.body.tweets.forEach((data) => {
        expect(data).to.have.property('id');
        expect(data).to.have.property('tweet_child');
        expect(data).to.have.property('tweet_photos');
      });
    });
  });

  describe('POST /tweets', () => {
    it('should create new tweet', async () => {
      // const res = await
    });
  });
});
