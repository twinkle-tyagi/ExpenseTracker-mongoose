const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const orderDB = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    paymentId: Sequelize.STRING,
    orderId: Sequelize.STRING,
    signature: Sequelize.STRING,
    status: Sequelize.STRING
});

module.exports = orderDB;