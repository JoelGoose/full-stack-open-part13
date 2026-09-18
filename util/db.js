const Sequelize = require('sequelize')
const { DATABASE_URL, TEST_DATABASE_URL, TESTING } = require('./config')

let database
if (TESTING) {
  database = TEST_DATABASE_URL
} else {
  database = DATABASE_URL
}

const sequelize = new Sequelize(database, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }