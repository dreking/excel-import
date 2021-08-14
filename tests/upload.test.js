require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const sequelize = require('../start/db');

let jwt = '';
let fileId = '';

beforeAll(async () => {
    await sequelize.sync();

    await request(app)
        .post('/api/auth/signup')
        .set('content-type', 'application/json')
        .send({ username: 'import', password: 'import' })
        .then((res) => {
            const { token, type } = res.body;
            jwt = `${type} ${token}`;
        });

    await request(app)
        .post('/api/uploads')
        .attach('document', 'data.xlsx')
        .set({ Authorization: jwt })
        .then((res) => {
            const { id } = res.body;
            fileId = id;
        });
});

afterAll(async () => {
    await sequelize.close();
});

test('Should upload excel', async () => {
    return await request(app)
        .post('/api/uploads')
        .attach('document', 'data.xlsx')
        .set({ Authorization: jwt })
        .expect(200);
});

test('Should get excel data with validations', async () => {
    return await request(app)
        .get(`/api/uploads/${fileId}`)
        .set('content-type', 'application/json')
        .set({ Authorization: jwt })
        .expect(200);
});

test('Should commit data', async () => {
    return await request(app)
        .post('/api/uploads/commit')
        .set('content-type', 'application/json')
        .set({ Authorization: jwt })
        .send({ action: 'yes', id: fileId })
        .expect(201);
}, 300000);
