const jwt = require('jsonwebtoken');

const User = require('../model/user');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        //console.log("token is", token);
        
        const user = jwt.verify(token, process.env.TOKEN_SECRET); // will return object containing parameter you passed (id, name, etc) and iat field
        //console.log("verify ",user);

        User.findById(user.id)  
        .then(user => {
            //console.log("this", user);
            req.user = user;
            next();
        })
        .catch(err => { throw new Error(err)});
    }
    catch(err) {
        return res.status(401).json({message: "not successful"});
    }
}

module.exports = {authenticate}