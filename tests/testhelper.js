const Blog = require('../models/blog');
const bcrypt = require('bcrypt');

const initialBlogs = [
    {
        title: "blog 1",
        author: "new author",
        url: "https://www.hailee.com/",
        likes: 699
    },
    {
        title: "blog 2",
        author: "new author",
        url: "https://www.hayward.com/",
        likes: 42
    }
];

const newBlog = {
    title: "new blog",
    author: "new author",
    url: "https://www.newblog.com/",
    likes: 0
}

const newBlogwoLikes = {
    title: "new blog wo likes",
    author: "new author wo likes",
    url: "https://www.likelessblog.com/"
}

const brokenBlog = {
    author: "broken author",
}

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
}

const password = bcrypt.hashSync('new password', 10);

const initialUsers = [
    {
        "username": "new author",
        "name": "new author",
        "passwordHash": password
    }
]

module.exports = {
    initialBlogs,
    newBlog,
    newBlogwoLikes,
    brokenBlog,
    blogsInDb,
    initialUsers
};