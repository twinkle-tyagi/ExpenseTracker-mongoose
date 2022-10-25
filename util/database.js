const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_ADMIN_ID, process.env.DB_ADMIN_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST
})

module.exports = sequelize;