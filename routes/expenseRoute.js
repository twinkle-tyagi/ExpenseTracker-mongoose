const express = require('express');
const expenseRouter = require('../controller/expense');
const userAuth = require('../middleware/auth');
const verifySign = require('../middleware/verifySign');

const routers = express.Router();

routers.get('/expense/getExpenses', userAuth.authenticate, expenseRouter.getExpenses);

routers.post('/expense/addExpenses', userAuth.authenticate, expenseRouter.postExpenses);

routers.delete('/expense/deleteExpense/:id', userAuth.authenticate, expenseRouter.deleteExpense);

// routers.get('/expense/getLeaderBoard', expenseRouter.getLeaderBoard);

routers.post('/order/createOrder', userAuth.authenticate, expenseRouter.createNewOrder);

routers.post('/order/payment', userAuth.authenticate, expenseRouter.postOrder);

// routers.get('/user/download', userAuth.authenticate, expenseRouter.downloadExpense);

// routers.get('/expense/filesDownloaded', userAuth.authenticate, expenseRouter.getFiles);

routers.get('/', userAuth.authenticate, expenseRouter.getIndex);

module.exports = routers;