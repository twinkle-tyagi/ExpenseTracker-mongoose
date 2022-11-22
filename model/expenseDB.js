const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema =  new Schema({
    expense: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: process.env.DB_USER,
        required: true
    },
});

module.exports = mongoose.model(process.env.DB_EXPENSE, expenseSchema);





// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const expense = sequelize.define(process.env.DB_EXPENSE, {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false
//     },
//     expense: {
//         type: Sequelize.INTEGER,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     category: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

// module.exports = expense;