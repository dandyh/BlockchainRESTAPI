var _ = require('lodash');
var { queryInsertCustomer, querySelectCustomerByEmail, queryAll } = require('../db/mssql');
var {CleanJSONObject} = require('../helper/commonFunction');
var {hashText, generateCustomerKeys} = require('../helper/ethereumHelper');
var validator = require('validator');
var {generateAuthToken} = require('./authenticate');

var insertCustomer = (req, res) => {
    var customer = CleanJSONObject(req.body);

    if (!validator.isEmail(customer.email)) {
        console.log("fail");
        
        res.status(400).send("Invalid email address!");
        return;
    }

    //Generate hash key
    var seedText = customer.email + customer.password;
    var keys = generateCustomerKeys(seedText);
    var token = generateAuthToken(customer.email);

    customer.password = hashText(customer.password);
    customer.publickey = keys.publickey;
    customer.privatekey = keys.privatekey;
    customer.token = token;

    queryInsertCustomer(customer, function (data, err) {
        if (!err) {                        
            res.header('x-auth', customer.token).status(200).send(_.pick(customer, ["email", "publickey"]));
        } else {                        
            res.status(500).json(err.message);
        }
    });

}

var getCustomer = (req, res) => {
    var customerEmail = req.params.customerEmail;
    querySelectCustomerByEmail(customerEmail, (data, err) => {
        if (!err) {
             res.status(200).json(data);
        } else {
            res.status(500).json("Unable to get the data " + err);                        
        }
    });
}

function SelectCustomers() {
    const query = "select * from BCCustomer;"
    queryAll(query, (data, err) => {
        if (!err) {
            console.log(data);
        } else {
            console.log(err);
        }
    });
}

function RemoveCustomers() {
    const query = "DELETE from BCCustomer;"
    queryAll(query, (data, err) => {
        if (!err) {
            callback(null, "Success");
        } else {
            callback(err);
        }
    });
}

module.exports = {
    insertCustomer,
    getCustomer
}
