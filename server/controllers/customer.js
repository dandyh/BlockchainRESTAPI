var _ = require('lodash');
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

    customerModel.InsertCustomer(cust, function (data, err) {        
        if (!err) {
            res.header('x-auth', cust.token).status(200).send(_.pick(cust, ["email", "publickey"]));
        } else {
            res.status(500).json(err.message);
        }
    });

}

var getCustomer = (req, res) => {
    var customerEmail = req.params.customerEmail;
    customerModel.GetCustomer(customerEmail, function (data, err) {        
        if (!err) {            
            res.status(200).json(data);
        } else {
            res.status(500).json(err.message);
        }
    });

}



module.exports = {
    insertCustomer,
    getCustomer
}
