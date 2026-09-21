const router = require('express').Router()
const { Op } = require('sequelize')
const { tokenExtractor } = require('../util/middleware')

const { Blog, User } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.get('/', async (req, res) => {  
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User
    },
    order: [
      ['likes', 'DESC']
    ],
    where: {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: req.query.search ? `%${req.query.search}%` : `%%`
          }
        },
        {
          author: {
            [Op.iLike]: req.query.search ? `%${req.query.search}%` : `%%`
          }
        }
      ]
    }
  })  
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id})
    return res.json(blog)
  } catch(error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if (req.blog.userId === user.id) {
      await req.blog.destroy();
      return res.status(204).end();
    } else {
      return res.status(403).end();
    }
  } catch(error) {
    next(error)
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)  
  } catch(error) {
    next(error)
  }
})

module.exports = router