const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/sessions')
const { tokenExtractor } = require('../util/middleware')

router.post('/login', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)
  
  await Session.create({
    userId: user.id,
    token: token
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

router.delete('/logout', tokenExtractor, async (request, response) => {
  await Session.destroy({ where: { userId: request.decodedToken.id }})
  return response.status(204).end()
})

module.exports = router