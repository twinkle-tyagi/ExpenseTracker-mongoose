const mongoose = require('mongoose');
const UU = require('uuid');

const Schema = mongoose.Schema;

require('mongoose-uuid4')(mongoose);
var UUID = mongoose.Types.UUID;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isPremium: {
        type: Boolean,
        required: true
    },
    
    forgetPassword: {
        _id: {
            type: UUID,
            default: UU,
        },
        isActive: {
            type: Boolean,
            required: true
        }
    },

    order: {
        paymentId: {type: String},
        orderId: {type: String},
        signature: {type: String},
        status: {type: String}
    }
});

userSchema.methods.createForgetpassword = function(obj) {
    //const id = UUID.v4()
    this.forgetPassword._id = obj.id;
    this.forgetPassword.isActive = obj.isActive;
    return this.save();
    //console.log(this);
}

userSchema.methods.updatepwd = function(obj) {
    console.log(obj);
    this.password = obj.password;
    this.forgetPassword._id = obj.id
    return this.save();
}

userSchema.methods.createOrder = function(obj) {
    this.forgetPassword._id = null
    this.order.paymentId = obj.paymentId
    this.order.orderId = obj.orderId
    this.order.signature = obj.signature
    this.order.status = obj.status
    this.isPremium = true

    return this.save();
}

module.exports = mongoose.model(process.env.DB_USER, userSchema);




/*
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

*/