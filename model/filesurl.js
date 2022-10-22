const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const filesUploaded = sequelize.define('filesurl', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    filesUrl: {
        type: Sequelize.STRING
    }
});

module.exports = filesUploaded;