const router = require('express').Router()

const { Blog, User, ReadingLists } = require('../models')

router.get('/', async (req, res) => {
  return res.status(200).end()
})

router.post('/api/reset', async (req, res, next) => {  
  try {
    await ReadingLists.destroy({ where: {} })
    await Blog.destroy({ where: {} })
    await User.destroy({ where: {} })
    
    return res.status(204).end()
  } catch(error) {
    next(error)
  }
})

module.exports = router