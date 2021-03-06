require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const sequelize = require('../start/db');

beforeAll(async () => {
    await sequelize.sync();

    await request(app)
        .post('/api/auth/signup')
        .set('content-type', 'application/json')
        .send({ username: 'testing', password: 'testing' });
});

afterAll(async () => {
    await sequelize.close();
});

test('Should sign up', async () => {
    await request(app)
        .post('/api/auth/signup')
        .set('content-type', 'application/json')
        .send({ username: 'testing1', password: 'testing1' })
        .expect(201)
        .then();
});

test('Should sign in', async () => {
    await request(app)
        .post('/api/auth/signin')
        .set('content-type', 'application/json')
        .send({ username: 'testing', password: 'testing' })
        .expect(200);
});
