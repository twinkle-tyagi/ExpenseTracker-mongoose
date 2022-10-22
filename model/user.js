const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const userData = sequelize.define(process.env.DB_USER, {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isPremium: Sequelize.BOOLEAN
});

module.exports = userData;