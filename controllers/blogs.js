const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get('/', (request, response, next) => {
  Blog
    .find({})
    .populate('author', {username: 1, name: 1, id: 1})
    .then(blogs => {
      response.json(blogs);
    })
    .catch(error => next(error));
});

blogsRouter.get('/:id', (request, response, next) => {
  console.log('finding id', request.params.id);
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

blogsRouter.get('/author/:author', (request, response, next) => {
  console.log('finding author', request.params.author);
  Blog.find({ author: request.params.author })
    .then(blog => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});


blogsRouter.post('/', (request, response, next) => {
  const body = request.body;

  if (!request.token) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  User.findById(request.userId)
    .then(user => {
      if (!user) {
        return response.status(404).json({ error: 'user not found' });
      }

      const blog = new Blog({
        title: body.title,
        author: user.id,
        url: body.url,
        likes: body.likes ? body.likes : 0
      });

      blog.save()
        .then(result => {
          user.blogs = user.blogs.concat(blog._id);
          user.save()
            .then(() => {
              response.status(201).json(result);
            })
            .catch(error => next(error));


          response.status(201).json(result);
        })
        .catch(error => next(error));

    })
    .catch(error => next(error));



});

blogsRouter.delete('/:id', async (request, response, next) => {

  try {
    const body = request.body;
    if (!request.token) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' });
    }

    if (blog.author.toString() !== decodedToken.id.toString()) {
      return response.status(401).json({ error: 'unauthorized' });
    }

    const result = await Blog.findByIdAndDelete(request.params.id);
    response.status(204).json(result);

  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.username,
    url: body.url,
    llikes: body.likes
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog);

  response.status(200).json(updatedBlog);

});


module.exports = blogsRouter;