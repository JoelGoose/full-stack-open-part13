const router = require('express').Router()
const { Op } = require('sequelize')

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  let search = [true, false]
  if (req.query.read) {
    search = [req.query.read]
  }
  const user = await User.findByPk(req.params.id, {
    include: {
      model: Blog,
      as: 'readings',
      attributes: {
        exclude: ['userId']
      },
      through: {
        as: 'reading_list',
        where: {
          read: {
            [Op.in]: search
          }
        }
      }
    }
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  if (user && req.body.name) {
    console.log(user)
    user.name = req.body.name
    user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
  
})

module.exports = router