var _ = require('lodash');
var commonFunction = require('../helper/commonFunction');
var validator = require('validator');
var customerModel = require('./../models/customer');

var insertCustomer = (req, res) => {
    var customer = req.body;    
    if (!validator.isEmail(customer.Email)) {
        res.status(400).send("Invalid email address!");
        return;
    }    
    var cust = new customerModel.Customer({
        Email: customer.Email,
        Password: customer.Password
    });    

    customerModel.InsertCustomer(cust, function (data, err) {                
        if (!err) {
            res.header('x-auth', cust.Token).status(200).send(_.pick(cust, ["Email", "PublicKey"]));
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

//Used for login
//UpdateAuthTokenAndSave
var customerLogin = (req, res) => {
    var body = _.pick(req.body, ["Email", "Password"]);
    
    customerModel.GetCustomer(body.Email, function (data, err) {          
        if (!err) {                        
            commonFunction.VerifyPassword(body.Password, data[0].Password, function(isVerified, err) {                   
                if(!err){
                    if(isVerified === true){ 
                        customerModel.UpdateAuthTokenAndSave(body.Email, (tokenGenerated, err) => {
                            if(!err){
                                res.header('x-auth', tokenGenerated).status(200).send({
                                    "Email" : body.Email,
                                    "Token" : tokenGenerated
                                });
                            } else {
                                res.status(500).json(err.message);
                            }
                            
                        });                                                                  
                    } else {
                         res.status(401).json("Invalid credentials");
                    }
                }else{
                     res.status(500).json(err.message);
                }
            });            
        } else {
            res.status(401).json("Invalid credentials");
        }
    });
}   


module.exports = {
    insertCustomer,
    getCustomer,
    customerLogin
}
