const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const { ReadingLists } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const readinglist = await ReadingLists.create(req.body)
    return res.status(200).json({
      id: readinglist.id,
      blog_id: readinglist.blogId,
      user_id: readinglist.userId,
      read: readinglist.read
    })
  } catch(error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const reading = await ReadingLists.findByPk(req.params.id)
  
  if (!reading) {
  return res.status(404).end()
}
  
  if (reading.userId !== req.decodedToken.id) {
    return res.status(401).end()
  }
  if (reading && typeof req.body.read === 'boolean') {
    reading.read = req.body.read
    await reading.save()
    return res.status(200).json(reading)
  } else {
    return res.status(400).end()
  }
})

module.exports = router