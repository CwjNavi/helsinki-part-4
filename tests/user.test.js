const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user')
const helper = require('./testhelper');
const api = supertest(app);

describe('when there is initially some users saved', () => {

    beforeEach(async () => {
        await User.deleteMany({});

        await User.insertMany(helper.initialUsers);
    });

    test('username less than length 3 is rejected', async () => {
        const payload = {
            "username": "jo",
            "name": "ivdfsdaf",
            "password": "chdsads"
        }
        const response = await api.post('/api/user').send(payload);
        console.log(response.body);
        assert.strictEqual(response.status, 404)
    });

    test('password less than length 3 is rejected', async () => {
        const payload = {
            "username": "jotaro",
            "name": "ivdfsdaf",
            "password": "wo"
        }
        const response = await api.post('/api/user').send(payload);
        console.log(response.body);
        assert.strictEqual(response.status, 404)
    });



    after( async () => {
        await mongoose.connection.close();
    });
});
