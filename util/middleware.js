const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const errorHandler = (error, req, res, next) => {
  console.error(JSON.stringify(error))

  if (error.name === 'SequelizeValidationError') {
    const emailError = error.errors.find(err => err.validatorKey === 'isEmail')
    
    if (emailError) {
      return res.status(400).json({ error: "username must be a valid email address" })
    }
    
    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: error.errors[0].message })
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(404).json({ error: error.message })
  }

  return res.status(500).json({ error: error })
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { errorHandler, tokenExtractor } 