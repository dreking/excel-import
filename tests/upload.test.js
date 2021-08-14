require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const sequelize = require('../start/db');
// const fs = require('fs/promises');
// const multer = require('multer');
// const { storage, fileFilter } = require('../config/multer');

const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZm5hbWUiOiJsZWFuZHJlIiwiaWF0IjoxNjI4OTQ1NjA2fQ.Tl_n3NjA8DCITHGhrqL9f7BfXqgFjfUW3IxEJhscxqw';

const fileId = '1628977527949data.xlsx';

beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

test('Should upload excel', async () => {
    await request(app)
        .post('/api/uploads')
        .attach('document', 'data.xlsx')
        .set({ Authorization: token })
        .expect(200);
}, 300000);

test('Should get excel data with validations', async () => {
    return await request(app)
        .get(`/api/uploads/${fileId}`)
        .set('content-type', 'application/json')
        .set({ Authorization: token })
        .expect(200);
});

test('Should commit data', async () => {
    return await request(app)
        .post('/api/uploads/commit')
        .set('content-type', 'application/json')
        .set({ Authorization: token })
        .send({ action: 'yes', id: fileId })
        .expect(201);
}, 300000);
