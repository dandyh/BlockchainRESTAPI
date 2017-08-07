const SchemaObject = require('schema-object');
const _ = require('lodash');
const {TYPES} = require('tedious');
const {dbconfig, tokenpassword} = require('../../settings');
const msSqlConnecter = require("../helper/msSqlConnecter"); 
const jwt = require('jsonwebtoken');
var { hashText, generateCustomerKeys } = require('./../helper/ethereumHelper');

// Create User schema 
var Customer = new SchemaObject({
  email: {type: String, required: true},
  password: {type: String, required: true},
  publickey: String,
  privatekey: String,
  token: String
});


var generateAuthToken = (_email) => {
    var access = 'auth';
    var token = jwt.sign({email: _email, access}, tokenpassword, {        
    });
    return token;
}

function customerSave(customer, callback) { 
    //Generate hash key
    var seedText = customer.email + customer.password;
    etherKeys = generateCustomerKeys(seedText);
    customer.token = generateAuthToken(customer.email);
    customer.password = hashText(customer.password);
    customer.publickey = etherKeys.publickey;
    customer.privatekey = etherKeys.privatekey;
    //when insert 
    var con = new msSqlConnecter.msSqlConnecter(dbconfig); 
    con.connect().then(function () { 
        new con.Request("insert into BCCustomer values(@email,@password,@publickey,@privatekey, @token)")         
            .addParam("email", TYPES.VarChar, customer.email) 
            .addParam("password", TYPES.VarChar, customer.password) 
            .addParam("publickey", TYPES.VarChar, customer.publickey) 
            .addParam("privatekey", TYPES.VarChar, customer.privatekey)
            .addParam("token", TYPES.VarChar, customer.token) 
            .onComplate(function (count) { 
                if (callback) 
                    callback(count); 
            }) 
            .onError(function (err) {                 
                callback(null, err);
            }) 
            .Run(); 
    }).catch(function (ex) { 
        console.log(ex); 
    }); 
} 

module.exports = {
    Customer,
    customerSave    
}
