/* eslint-disable no-undef */
const supertest = require('supertest');
const { expect } = require('chai');
const { PrismaClient } = require('@prisma/client');
const { invalidUser, newUser, validUser } = require('./helper');

const prisma = new PrismaClient();
const request = supertest('http://localhost:3000');

describe('E2E User Endpoint', () => {
  describe('POST /users/register', () => {
    it('should registered new user', async () => {
      const response = await request.post('/users/register').send(newUser);

      expect(response.statusCode).to.be.equal(201);
      expect(response.body)
        .to.have.property('user')
        .to.have.property('username')
        .to.be.eq(newUser.username);
      expect(response.header).to.have.property('set-cookie');

      after(async () => {
        await prisma.user.deleteMany();
        await prisma.userSetting.deleteMany();
      });
    });

    it('should returned 400 error cause invalid request', async () => {
      const response = await request.post('/users/register').send({});

      expect(response.statusCode).to.be.eq(400);
      expect(response.body.errors[0])
        .to.have.property('message')
        .to.be.eq('Please enter valid email');
    });
  });

  describe('POST /users/login', () => {
    it('should login the user', async () => {
      const res = await request.post('/users/login').send(validUser);
      const userCookie = res.header['set-cookie'];

      expect(res.statusCode).to.be.eq(200);
      expect(res.body.user)
        .to.have.property('username')
        .to.be.eq(validUser.username);
      expect(res.header).to.have.property('set-cookie');

      after(async () => {
        await request.post('/users/logout').set('Cookie', userCookie);
      });
    });

    it('should not login the user cause invalid password', async () => {
      const res = await request.post('/users/login').send(invalidUser);

      expect(res.statusCode).to.be.equal(400);
      expect(res.body.message).to.be.eq('Wrong password');
    });
  });

  describe('POST /users/logout', () => {
    let userCookie;
    before(async () => {
      const res = await request.post('/users/login').send(validUser);
      userCookie = res.header['set-cookie'];
    });
    it('should logout the user', async () => {
      const res = await request.post('/users/logout').set('Cookie', userCookie);
      expect(res.statusCode).to.be.eq(200);
    });
  });
});
