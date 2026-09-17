const errorHandler = (error, req, res, next) => {
  console.error('Error name:', error.name)
  console.error('Error message:', error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  }

  return res.status(500).json({ error: 'Internal server error' })
}

module.exports = { errorHandler } 