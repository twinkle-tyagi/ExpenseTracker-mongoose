const sendgrid = require('@sendgrid/mail');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

//const ResetReq = require('../model/forgetPasswordRequest');
const User = require('../model/user');

exports.forgetPassword = (req, res, next) => {
    console.log(req.body.email);  
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

    const id = uuid.v4();

    User.find({email: req.body.email})
    .then(users => {
        const user = users[0];
        console.log("getting user id ", user._id);


        if(user) {
            user.createForgetpassword({id:id, isActive: true});
        }
    })
    .catch(err => console.log(err));
    
    const msg = {
        to: req.body.email,
        from: 'twinkletyagi.1@gmail.com',
        subject: "reset password link",
        text: "this is nice msgs",
        html: `<a href="http://localhost:3000/password/resetpassword/${id}"> Reset Password </a>`
    }

    sendgrid.send(msg)
    .then(response => {
        //console.log(response);
        console.log("+++++++++ mail sent");
        //ResetReq.create()
    })
    .catch(err => console.log(err));

}

exports.resetPassword = (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    User.find({"forgetPassword._id" : id})
    .then(users => {
        const user = users[0];
        console.log("'''''''''''''''''''''''''''''''''''''''", user);
        user.createForgetpassword({id: id, isActive: false});
        res.status(200).send(`
        <html>
        <form action="/password/updatepassword/${id}" method="GET">
        enter new password: <input type="password" name="password" required>
        <button > RESET </button>
        </form>
        </html>
        `);
    })
    .catch(err => console.log(err));
}

exports.updatePassword = (req, res, next) => {
    const id = req.params.id;

    const newPassword = req.query.password;

    console.log("values ==========================", id, newPassword);

    User.find({"forgetPassword._id": id})
    .then(users => {
        const user = users[0];
        console.log("this is", user);
        //return User.findOne({where: {id: users.userId}});

        const saltRounds = 10;

        //console.log("user is ", user)

        bcrypt.genSalt(saltRounds, async (err, salt) => {

            console.log("++++++++++", salt)

            if(err) {
                throw new Error(err);
            }

        bcrypt.hash(newPassword, salt, function (err, hash) {
            
            console.log(">>>>>>>>>>>>>>>>.", hash);

            if(err) {
                throw new Error(err);
            }
            console.log(',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,')
            
            user.updatepwd({id: id, password: hash})
            .then(() => {
                res.status(200).json({message: "successfully changed password"});
            })
            .catch(err => console.log(err));
        });
    });
    })
    .catch(err => console.log(err));
}