const path = require('path');
const fs = require('fs');
const https = require('https');

//const privateKey = fs.readFileSync('server.key');
//const certificate = fs.readFileSync('server.cert');

const accessLogStream = fs.createWriteStream('access.log', {flag: 'a'})

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const sequelize = require('./util/database');
const Expense = require('./model/expenseDB');
const User = require('./model/user');
const Order = require('./model/orderDB');
const resetRequest = require('./model/forgetPasswordRequest');
const filesUploaded = require('./model/filesurl');

const routes = require('./routes/routes');
const expenseRoutes = require('./routes/expenseRoute');
const passwordRoutes = require('./routes/forgetPassword');

const app = express();

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `view/${req.url}`));
})

app.use(morgan('combined', {stream: accessLogStream}));
app.use(cors());
app.use(bodyParser.json());
app.use(routes);
app.use(expenseRoutes);
app.use(passwordRoutes);
app.use(helmet());


//Expense.belongsTo(User);
User.hasOne(Expense);
User.hasMany(Expense);

Order.belongsTo(User);

User.hasMany(resetRequest);

User.hasMany(filesUploaded);


sequelize.sync()
.then(res => {
    app.listen(process.env.PORT_NUMBER || 3000);
    //https.createServer({key: privateKey, cert: certificate}, app)
    //.listen(process.env.PORT_NUMBER || 3000);
})
.catch(err => console.log(err));
