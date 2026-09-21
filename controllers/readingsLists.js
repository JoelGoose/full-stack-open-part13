const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const { ReadingLists } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const readinglist = await ReadingLists.create(req.body)
    return res.status(200).json(readinglist)
  } catch(error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const reading = await ReadingLists.findByPk(req.params.id)
  if (reading.userId !== req.decodedToken.id) {
    return res.status(403).end()
  }
  if (reading && req.body.read) {
    reading.read = req.body.read
    reading.save()
    return res.status(200).json(reading)
  } else {
    return res.status(400).end()
  }
})

module.exports = router