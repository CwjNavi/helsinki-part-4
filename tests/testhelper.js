const Blog = require('../models/blog');

const initialBlogs = [
    {
        title: "hawk tuah",
        author: "Hailee",
        url: "https://www.hailee.com/",
        likes: 699
    },
    {
        title: "jean jacket",
        author: "hayward",
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

module.exports = {
    initialBlogs,
    newBlog,
    newBlogwoLikes,
    brokenBlog,
    blogsInDb
};