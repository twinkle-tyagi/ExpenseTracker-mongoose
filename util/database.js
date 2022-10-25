const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_ADMIN_ID, process.env.DB_ADMIN_PASSWORD, {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;