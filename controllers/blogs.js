const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response, next) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
      .catch(error => next(error))
  })

blogsRouter.get('/:id', (request, response, next) => {
  console.log('finding id', request.params.id)
  Blog.findById(request.params.id)
  .then(blog => {
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

blogsRouter.get('/author/:author', (request, response, next) => {
  console.log('finding author', request.params.author)
  Blog.find({author: request.params.author})
  .then(blog => {
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

  
blogsRouter.post('/', (request, response, next) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes ? body.likes : 0
    })
  
    blog.save()
      .then(result => {
        response.status(201).json(result)
      })
      .catch(error => next(error))
  })

blogsRouter.delete('/:id', (request, response, next) => {
  console.log(request.params.id)
  Blog.findOneAndDelete({_id: request.params.id})
  .then(result => {
    response.status(204).json(result)
  })
  .catch(error => next(error))
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    llikes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog)

  response.status(200).json(updatedBlog)

})


module.exports = blogsRouter