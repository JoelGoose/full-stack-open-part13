const Blog = require('./blog')
const User = require('./user')
const ReadingLists = require('./readingLists')
const Sessions = require('./sessions')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingLists, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingLists, as: 'users_reading' })

User.hasMany(Sessions)
Sessions.belongsTo(User)

module.exports = {
  Blog, User, ReadingLists, Sessions
}