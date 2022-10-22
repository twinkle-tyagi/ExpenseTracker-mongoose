const crypto = require('crypto');

const verify = (req, res, next) => {
    console.log("this is to verify", req.body);

    var signBody = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

    var generated_sign = crypto.createHmac('sha256', 'xdiDqYWLTjjhsf3I8Nb1o5HW')
                            .update(signBody.toString())
                            .digest('hex');


    //console.log(req.body.response.razorpay_order_id);
    //console.log(req.body.order_id);
    //console.log(req.body.response.razorpay_signature);
    //console.log(generated_sign);

    if(generated_sign == req.body.razorpay_signature) {
        console.log("payment is successful", req.body);
        req.body = req.body;
        next();
    }
    else {
        console.log("not success");
    }

}

module.exports = {verify};