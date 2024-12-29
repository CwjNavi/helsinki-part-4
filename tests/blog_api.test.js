const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./testhelper')
const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});

    await Blog.insertMany(helper.initialBlogs);
})

test('correct number of blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    // console.log(response.body);
    assert.equal(response.body.length, helper.initialBlogs.length);
})

test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');
    const ids = response.body.map(blog => blog.id);
    console.log(ids);
    assert.ok(ids);
})

test('a valid blog can be added', async () => {
    const newBlog = helper.newBlog;
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const titles = response.body.map(blog => blog.title);
    
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
    assert(titles.includes(helper.newBlog.title));
})

test('if likes property is missing, it will default to 0', async () => {
    const newBlogwoLikes = helper.newBlogwoLikes;
    await api
    .post('/api/blogs')
    .send(newBlogwoLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    
    const returnedBlogwoLikes = response.body.find(blog => blog.title === helper.newBlogwoLikes.title);
    console.log(returnedBlogwoLikes);
    assert.strictEqual(returnedBlogwoLikes.likes, 0);
    assert.strictEqual(returnedBlogwoLikes.title, newBlogwoLikes.title);
})

test.only('if title or url is missing, return 400', async () => {
    const brokenBlog = helper.brokenBlog;
    await api
    .post('/api/blogs')
    .send(brokenBlog)
    .expect(400);
})