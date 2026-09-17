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

  return res.status(500).json({ error: 'Internal server error' })
}

module.exports = { errorHandler } 