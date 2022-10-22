const express = require('express');
const signupController = require('../controller/signup');

const router = express.Router();

router.get('/user/signup', signupController.getUsers);

router.post('/user/signup', signupController.postUser);

router.post('/user/authenticate', signupController.authenticateUser);

module.exports = router;