var express = require('express');
var bodyParser = require('body-parser');
var { querySelectCustomerByID } = require('./db/mssql');
var {insertCustomer, getCustomerByEmail} = require('./controllers/customer');

var app = express();
const port = process.env.PORT || 3000;

//Middleware to express, so json file is passed to this rest api
app.use(bodyParser.json());

//Post insert customer
app.post('/customer', (req, res) => {
    var customer = req.body;
    insertCustomer(customer, (data, err) => {
        if(!err){
            res.send(data);
        }else {
            res.status(400).send(err);
        }        
    });
    //res.send(customer);
});

//Get customer
app.get('/customer/:customerEmail', (req, res) => {
    var customerEmail = req.params.customerEmail;
    getCustomerByEmail(customerEmail, (data, err) => {
        if(!err){
            res.send(data);
        }else {
            res.status(400).send(err);
        }        
    });
});


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});


module.exports = {app};