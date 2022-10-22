const User =  require('../model/user');
const ExpenseDB = require('../model/expenseDB');
const Order = require('../model/orderDB');
const FilesUrl = require('../model/filesurl');
const UserServices = require('../services/userservices');
const S3Services = require('../services/S3services');

const AWS = require('aws-sdk');
const Razorpay = require('razorpay');

//const ITEMS_PER_PAGE = 2;


exports.getIndex = async (req, res) => {
    try {

        const ITEMS_PER_PAGE = +req.header('ITEMS_PER_PAGE');
        console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ", ITEMS_PER_PAGE);
        const page = +req.query.page || 1;

        const totalPage = await ExpenseDB.count();

        var expenses = await req.user.getExpenseTables({offset:(page-1)*ITEMS_PER_PAGE , limit: ITEMS_PER_PAGE});

        var obj = {
            expenses: expenses,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE*page < totalPage,
            hasPreviousPage: page>1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalPage/ITEMS_PER_PAGE)
        }

       res.status(200).json(obj);
        
    }
    catch(err) {
        console.log(err);
        return res.status(400).json({message: "No Expense"});
    }
}

exports.getExpenses = async (req, res, next) => {
   
    try{
        //console.log("++++++++++++++++++++++++++++++++")
        //console.log("userId is ",req.user.id);
        
        /*
        ExpenseDB.findAll({where: {userId: req.user.id}})
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => console.log(err));
        */


       req.user.getExpenseTables()
       .then(expenses => {
        //console.log("/////////////////////////////////////////////////////////////")
        res.status(200).json(expenses);
       })
       .catch(err => console.log(err));
       res.status(200).json(obj);
        
    }
    catch(err) {
        console.log(err);
        return res.status(400).json({message: "No Expense"});
    }
}

exports.postExpenses = async (req, res, next) => {
    
    try { 
        const expense = req.body.expense;
        const description = req.body.description;
        const category = req.body.category;

        //console.log("req user =======> ",req.user);

        //console.log(expense, category);

        await ExpenseDB.create( {
        //await req.user.createExpense({
            expense: expense,
            description: description,
            category: category,
            userId: req.user.id
        });
        res.status(200).json({message: "successful"});
    }
    catch (err) {
        return res.status(400).json({message: "Unsuccessful"});
    }
}

exports.deleteExpense = async (req, res, next) => {
    const id = req.params.id
    //console.log("delete expense ============", req.params.id);

    const expense = await ExpenseDB.findAll({where: {id: id}});

    expense[0].destroy();
}

exports.getLeaderBoard = async (req, res, next) => {
    var users = await User.findAll();
    var obj = [];
    //console.log(users);
    //const exp = await users[0].getExpenseTables();
    //console.log("????????????????", exp);
    
    for(var i=0; i<users.length; i++) {
        var exp = await users[i].getExpenseTables();
        //console.log(i,";;;;;;;;;;;;;;;;;;;;;",exp);
        //obj = obj + JSON.stringify(exp);
        //obj = Object.assign({}, exp);
        exp = JSON.parse(JSON.stringify(exp)).concat(JSON.parse(JSON.stringify(users[i].name)));
        obj.push(exp);
    }
    //console.log("==============================", JSON.parse(JSON.stringify(obj)));
    res.json(obj);
}


exports.createNewOrder = async (req, res, next) => {

    try {
    var instance = new Razorpay({key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET});
    var options = {
        amount: 1000,
        currency: "INR",
        receipt: 'xyz'
    };

    //console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", req.user);
    //console.log("/////////////////////////////////",process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);
    
    instance.orders.create(options, (err, order) => {
        //console.log("order is",order.id);
        //console.log("err is", err);

        res.json({order, key_id: instance.key_id});

        /*
        req.user.createOrder({orderId: orderid, status: 'pending'})
        .then(() => {
            return res.json({order, key_id: instance.key_id});
        })
        .catch(err => console.log(err));
        */
      
        })
    }
    catch(err) {
        console.log(err);
    }
}

exports.postOrder = async (req, res, next) => {

    //console.log("here in post", req);
    //console.log("user", req.user);
    try {
        await Order.create({
            paymentId: req.body.razorpay_payment_id,
            orderId: req.body.razorpay_order_id,
            signature: req.body.razorpay_signature,
            status: "successful",
            userId: req.user.id
        })

        Order.findAll({where: {orderId: req.body.razorpay_order_id}})
        .then((order) => {
            //console.log(order);
            if(order[0].status == "successful") {
                req.user.update({isPremium: true})
                res.status(200).json({message: "Successfully Saved"});
            }
        })
        .catch(err => console.log(err));
        
    
        //res.status(200).json({message: "Successfully Saved"});
    }
    catch(err) {
        console.log(err);
        res.status(400).json({message: "Not Successful"});
    }
}

exports.downloadExpense = async (req, res, next) => {

    try {
        //console.log("..........", req.user);
        const userId = req.user.id;

        const expenses = await req.user.getExpenseTables();
        //const expenses = await UserServices.getExpenses(req);
        //console.log(expenses);
        //expenses is an array we cannot write array to file, so we convert to string.
        const stringifyExpense = JSON.stringify(expenses);

        // this way new upload will always over-write old files.
        // so we make file name dynamic using userId
        //const fileName = 'Expense.txt';
        const fileName = `Expense${userId}/${new Date()}.txt`;

        //we make a function that will return file url on success upload of file
        //const fileURL = await uploadToS3(stringifyExpense, fileName);
        const fileURL = await S3Services.uploadToS3(stringifyExpense, fileName);
        FilesUrl.create({
            filesUrl: fileURL,
            userId: userId
        })
        //console.log("-------------------",fileURL)
        res.status(200).json({ fileURL, success: true });
    }
    catch(err) {
        res.status(500).json({fileURL: "", success: false, err: err});
    }
}

// putting in services folder to make code look clean.

/*
async function uploadToS3(data, filename) {
    const BUCKET_NAME = 'expensetrackerproject';
    const IAM_USER_KEY = process.env.AWS_IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.AWS_IAM_USER_SECRET;

    //console.log("hey there", IAM_USER_KEY, IAM_USER_SECRET)

    // make new instance with keys to access
    let s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })
//create bucket with parameter to upload
//our bucket is already created in S3, so no need to create again
/*
    s3Bucket.createBucket(() => {
        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data
        }
*/

/*
        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read' // to give public access to file
        }

        return new Promise((resolve, reject) => {
            s3Bucket.upload(params, (err, s3response) => {
                if(err) {
                    console.log('Something went wrong');
                    reject(err);
                }
                else {
                    console.log('success', s3response);
                    resolve(s3response.Location);
                }
            })
        });
}
*/

exports.getFiles = (req, res, next) => {

    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5")
    req.user.getFilesUrl()
    .then(url => console.log(")))))))))))))))))))))))))", url))
    .catch(err => console.log(err));
}
