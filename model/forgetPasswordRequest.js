const Sequelize = require('sequelize');
//const UUID = require('uuid');

const sequelize = require('../util/database');

const resetPwd = sequelize.define(process.env.DB_FORGOT ,{
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
    },
    isActive: Sequelize.BOOLEAN
});

module.exports = resetPwd; 