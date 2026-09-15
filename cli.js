require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

function print({ author, title, likes }) {
  console.log(`${author}: \'${title}\', ${likes} likes`)
}

const main = async () => {
  try {
    await sequelize.authenticate()
    const notes = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })    
    notes.forEach(note => {
      print(note)
    });    
    sequelize.close()  
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()