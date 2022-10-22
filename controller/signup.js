const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

function generateAccessToken(id) {
    console.log("user id" + id)
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>",process.env.TOKEN_SECRET);
    return jwt.sign({id: id }, process.env.TOKEN_SECRET);
}

exports.getUsers = (req, res, next) => {
    User.findAll()
    .then(result => {
        console.log("result of get user", result);
        res.json(result);
    })
    .catch(err => console.log(err));
}

exports.postUser = async (req, res, next) => {
    
    console.log("this is ============================="+req.body.email);
    const email1 = req.body.email;

    try {

    let user = await User.findAll({where: {email: email1}})
    console.log("+++++++++++++++++++++++++++");
    /*
    let users = JSON.parse(JSON.stringify(user[]));
        console.log(users);

        for(var i =0; i< users.length; i++) {
            if(users[i].email == req.body.email) {
                console.log("===============================")
                return res.status(500).json({message: "User already exists"});
            }
        }
    */

        //let users = JSON.parse(JSON.stringify(user[0]));

        //console.log(user[0].email);

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
        await User.create({
            name,
            email,
            password: hash
        })
        res.status(201).json({message: "User created successfully"});
    })
    /*
    const val = await User.create({
        name: name,
        email: email,
        password: password
    })
        return res.status(200).json({message: "successful"});
        */
    }
    catch(err) {
        res.status(500).json(err);
    }
}


/*
exports.authenticateUser = async (req, res, next) => {
    const users = await User.findAll();

    let flag = 0;
    const email = req.body.email;
    const password = req.body.password;
    //console.log(email);

    let usersJson = JSON.parse(JSON.stringify(users));
    //console.log(usersJson[1].email);

    for(var i=0; i< usersJson.length; i++) {
        if(usersJson[i].email != email) {
            flag = 1;
        }
        else if (usersJson[i].email == email && usersJson[i].password != password) {
                flag = 2;
                break;
            }
        else {
            flag = 0;
            break;
        }
    }

        if(flag == 1) {
            console.log("user")
            return res.status(404).json({message: "Email not found"});
        }
        else if( flag == 2) {
            console.log("password")
            return res.status(401).json({message: "Password not match"});
        }
        else {
            console.log("logged in");
            return res.status(200).json({message: "valid"});
        }
    
}
*/

exports.authenticateUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log("password in AuthUser",password);

        if(email == null || email.length ===0 || password == null || password.length === 0) {
            return res.status(500).json({err: "bad request"});
        }

        const user = await User.findAll({where: {email}});
/*
        if(user.length > 0) {
            if(user[0].password === password) {
                res.status(200).json({message: "Login successful"});
            }
            else {
                return res.status(400).json({message: "password incorrect"});
            }
        }
        else {
            return res.status(401).json({message: "email not found"});
        }
*/

        //console.log("ID is "+user[0].id);
        if(user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                //console.log(result);
                if(err) {
                    //return res.status(500).json({message: "something went wrong"});
                    throw new Error('Something went wrong');
                }
                if(result === true) {
                    res.status(200).json({message: "Login successful", token: generateAccessToken(user[0].id), isPremium: user[0].isPremium});
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