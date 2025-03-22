const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user')
const helper = require('./testhelper');
const api = supertest(app);

describe ('when there is initially some users saved', () => {
    
        beforeEach(async () => {
            await User.deleteMany({});
            await User.insertMany(helper.initialUsers);
        });

        test('logging in with the correct credentials returns a token', async () => {
            const payload = {
                "username": "cwjivan",
                "password": "chan"
            }

            const response = await api.post('/api/login').send(payload);

            assert.strictEqual(response.status, 200)
        })

        test('logging in with the incorrect credentials returns an error', async () => {
            const payload = {
                "username": "cwjivan",
                "password": "wrongpassword"
            }

            const response = await api.post('/api/login').send(payload);

            assert.strictEqual(response.status, 401)
        })

    
    
        after( async () => {
            await mongoose.connection.close();
        });
    });