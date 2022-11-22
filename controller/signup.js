const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

function generateAccessToken(id) {
    console.log("user id" + id)
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>",process.env.TOKEN_SECRET);
    return jwt.sign({id: id }, process.env.TOKEN_SECRET);
}

exports.getUsers = (req, res, next) => {
    User.find()
    .then(result => {
        res.json(result);
    })
    .catch(err => console.log(err));
}

exports.postUser = async (req, res, next) => {
    
    const email1 = req.body.email;

    try {

    let user = await User.find({email: email1})

        console.log(user[0]);

        if(user[0] && (user[0].email == req.body.email)) {
            return res.status(500).json({message: "User already exists"});
        }
        
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;

        console.log("name is "+name);

    if(name == undefined || name.length === 0 || email == null || email.length ===0 || password == null || password.length === 0) {
        return res.status(500).json({err: "bad request"});
    }

    // to secure our password we store it in form of hash,

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        //console.log(err);

        const user = new User({
            name: name,
            email: email, 
            password: hash,
            isPremium: false,
            forgetPassword: {
                _id: null,
                isActive: false
            },
            order: {
                paymentId: null,
                orderId: null,
                signature: null,
                status: null
            }
        });

        user.save();

        res.status(201).json({message: "User created successfully"});
    })
    }
    catch(err) {
        res.status(500).json(err);
    }
}


exports.authenticateUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if(email == null || email.length ===0 || password == null || password.length === 0) {
            return res.status(500).json({err: "bad request"});
        }

        const user = await User.find({email: email});

        if(user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
               
                if(err) {
                    //return res.status(500).json({message: "something went wrong"});
                    throw new Error('Something went wrong');
                }
                if(result === true) {
                    res.status(200).json({message: "Login successful", token: generateAccessToken(user[0]._id), isPremium: user[0].isPremium});
                }
                else {
                    return res.status(400).json({message: "password incorrect"});
                }
            });
        }
        else {
            return res.status(401).json({message: "email not found"});
        }
    }
    catch (err) {
        res.status(500).json({message: err, success: false});
    }
}