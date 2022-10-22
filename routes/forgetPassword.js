const express = require('express');

const passwordRouter = require('../controller/forgetpassword');

const router = express.Router();

router.post('/called/password/forgotpassword', passwordRouter.forgetPassword);

router.get('/password/resetpassword/:id', passwordRouter.resetPassword);

router.get('/password/updatepassword/:id', passwordRouter.updatePassword);


module.exports = router;