var express = require('express');
var bodyParser = require('body-parser');
var { querySelectCustomerByID } = require('./db/mssql');
var customerController = require('./controllers/customer');
var authenticateController = require('./controllers/authenticate');
var setting = require('./../settings');
//var {insertCustomer, getCustomerByEmail} = require('./controllers/customer');
var _ = require('lodash');
const jwt = require('jsonwebtoken');

var app = express();
var secureRoutes = express.Router();


const port = process.env.PORT || 3000;

//Middleware to express, so json file is passed to this rest api
app.use(bodyParser.json());
app.use('/secure-api', secureRoutes);

//Post insert customer
app.post('/api/customer', customerController.insertCustomer);

//app.get('/api/authenticate', authenticateController.authenticate);
app.get('/api/customer/:customerEmail', customerController.getCustomer);

//Validation Middleware
secureRoutes.use(function(req, res, next){
    var token = req.body.token || req.headers['token'];    
    if(token){
        jwt.verify(token, setting.tokenpassword, (err, decode) => {
            if(!err){
                console.log(token);
                next();
            } else {
                res.status(500).send(err);
            }
        })
    } else{
        res.send("No token found");
    }
})

secureRoutes.post('/customer', customerController.insertCustomer);

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});


module.exports = {app};