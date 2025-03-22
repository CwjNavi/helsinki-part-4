const { test, after, beforeEach, describe, before } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./testhelper');
const User = require('../models/user');
const api = supertest(app);

describe('when there is initially some blogs saved', () => {
    let token;

    beforeEach(async () => {
        await User.deleteMany({});
        await User.insertMany(helper.initialUsers);
        
        // get the token from the login endpoint
        const payload = {
            "username": "new author",
            "password": "new password"
        }

        const response = await api.post('/api/login').send(payload);
        token = response.body.token;

        await Blog.deleteMany({});

        for (const blog of helper.initialBlogs) {
            console.log(blog)
            await api
            .post('/api/blogs')
            .send(blog)
            .set('Authorization', `Bearer ${token}`)
        }

    });

    test('correct number of blogs are returned', async () => {
        const response = await api.get('/api/blogs');
        // console.log(response.body);
        assert.equal(response.body.length, helper.initialBlogs.length);
    });

    test('unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs');
        const ids = response.body.map(blog => blog.id);
        console.log(ids);
        assert.ok(ids);
    });

    test('a valid blog can be added', async () => {
        const newBlog = helper.newBlog;
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const response = await api.get('/api/blogs');

        const titles = response.body.map(blog => blog.title);

        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
        assert(titles.includes(helper.newBlog.title));
    });

    test('adding a blog without authorization will fail', async () => {
        const newBlog = helper.newBlog
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        assert.strictEqual(response.body.error, 'Unauthorized')

    })

    // test('if likes property is missing, it will default to 0', async () => {
    //     const newBlogwoLikes = helper.newBlogwoLikes;
    //     await api
    //         .post('/api/blogs')
    //         .send(newBlogwoLikes)
    //         .expect(201)
    //         .expect('Content-Type', /application\/json/);

    //     const response = await api.get('/api/blogs');

    //     const returnedBlogwoLikes = response.body.find(blog => blog.title === helper.newBlogwoLikes.title);
    //     console.log(returnedBlogwoLikes);
    //     assert.strictEqual(returnedBlogwoLikes.likes, 0);
    //     assert.strictEqual(returnedBlogwoLikes.title, newBlogwoLikes.title);
    // });

    // test('if title or url is missing, return 400', async () => {
    //     const brokenBlog = helper.brokenBlog;
    //     await api
    //         .post('/api/blogs')
    //         .send(brokenBlog)
    //         .expect(400);
    // });

    // describe('deletion of a blog', () => {
    //     test('succeeds with status code 204 if id is valid', async () => {
    //         const blogsAtStart = await helper.blogsInDb();
    //         console.log(blogsAtStart);
    //         const blogToDelete = blogsAtStart[0];
    
    //         await api
    //             .delete(`/api/blogs/${blogToDelete.id}`)
    //             .expect(204);
    
    //         const blogsAtEnd = await helper.blogsInDb();
    
    //         assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    
    //         const titles = blogsAtEnd.map(r => r.title);
    
    //         assert.ok(!titles.includes(blogToDelete.title));
    //     });
    // })

    // describe('updating a blog', () => {
    //     test('succeeds with status code 200 if id is valid', async () => {
    //         const blogsAtStart = await helper.blogsInDb();
    //         const blogToUpdate = blogsAtStart[0];
    //         const updatedBlog = {
    //             title: "updated blog",
    //         }
    //         await api
    //             .put(`/api/blogs/${blogToUpdate.id}`)
    //             .send(updatedBlog)
    //             .expect(200);

    //         const blogsAtEnd = await helper.blogsInDb();
    //         const titles = blogsAtEnd.map(r => r.title);
    //         assert.ok(titles.includes(updatedBlog.title));
    //         });
    //     });

    after( async () => {
        await mongoose.connection.close();
    });
});
