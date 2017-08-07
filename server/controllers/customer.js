var _ = require('lodash');
var { queryInsertCustomer, querySelectCustomerByEmail, queryAll } = require('../db/mssql');
var { CleanJSONObject } = require('../helper/commonFunction');
var validator = require('validator');
var customerModel = require('./../models/customer');

var insertCustomer = (req, res) => {
    var customer = CleanJSONObject(req.body);
    if (!validator.isEmail(customer.email)) {
        res.status(400).send("Invalid email address!");
        return;
    }    
    var cust = new customerModel.Customer({
        email: customer.email,
        password: customer.password
    });    

    customerModel.customerSave(cust, function (data, err) {        
        if (!err) {
            res.header('x-auth', cust.token).status(200).send(_.pick(cust, ["email", "publickey"]));
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
