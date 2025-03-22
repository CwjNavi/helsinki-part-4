const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10

  if (username.length < 3) {
    return response.end.status(400).send({error: 'username too short'})
  }

  if (password.length < 3) {
    return response.status(400).send({error: 'password too short'})
  }

  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
    .then(users => {
      response.json(users)
    })
    .catch(error => next(error))
})

module.exports = userRouter