const SchemaObject = require('schema-object');
const _ = require('lodash');
const { TYPES } = require('tedious');
const setting = require('../../settings');
const msSqlConnecter = require("../helper/msSqlConnecter");
const jwt = require('jsonwebtoken');
const { hashText, generateCustomerKeys } = require('./../helper/ethereumHelper');
var commonFunction = require('../helper/commonFunction');

// Create User schema 
var Customer = new SchemaObject({
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    PublicKey: String,
    PrivateKey: String,
    Token: String
});

const con = new msSqlConnecter.msSqlConnecter(setting.dbconfig);
const custTableName = setting.customersqltable;

var generateAuthToken = (_email) => {
    var access = 'auth';
    var token = jwt.sign({ Email: _email, access }, setting.tokenpassword, {
        expiresIn: ((60*60) + 600)//1 hour 10 minutes
    });
    return token;
}

function InsertCustomer(customer, callback) {
    //Generate hash key
    var seedText = customer.Email + customer.Password;
    etherKeys = generateCustomerKeys(seedText);
    customer.Token = generateAuthToken(customer.Email);
    commonFunction.HashPassword(customer.Password, (data, err) => {
        if (!err) {
            customer.Password = data;
        } else {
            callback(null, err);
        }
    });
    customer.PublicKey = etherKeys.PublicKey;
    customer.PrivateKey = etherKeys.PrivateKey;
    //when insert     
    con.connect().then(function () {
        new con.Request("insert into " + custTableName + " values(@email,@password,@publickey,@privatekey, @token)")
            .addParam("email", TYPES.VarChar, customer.Email)
            .addParam("password", TYPES.VarChar, customer.Password)
            .addParam("publickey", TYPES.VarChar, customer.PublicKey)
            .addParam("privatekey", TYPES.VarChar, customer.PrivateKey)
            .addParam("token", TYPES.VarChar, customer.Token)
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


function GetCustomer(custEmail, callback) {
    const query = "select * from " + custTableName + " where Email = @Email";
    con.connect().then(function () {
        new con.Request(query)
            .addParam("Email", TYPES.VarChar, custEmail)
            .onComplate(function (count, datas) {
                if (callback)
                    callback(datas);
            })
            .onError(function (err) {
                callback(null, err);
            }).Run();
    }).catch(function (ex) {
        callback(null, ex);
    });
}

function GetAllCustomer(callback) {
    const query = "select * from " + custTableName + ";";
    con.connect().then(function () {
        new con.Request(query)
            .onComplate(function (count, datas) {
                if (callback)
                    callback(datas);
            })
            .onError(function (err) {
                callback(null, err);
            }).Run();
    }).catch(function (ex) {
        callback(null, err);
    });
}

function GetCustomerByToken(customerToken, callback) {
    const query = "select * from " + custTableName + " where Token = @Token";
    con.connect().then(function () {
        new con.Request(query)
            .addParam("Token", TYPES.VarChar, customerToken)
            .onComplate(function (count, datas) {
                if (callback)
                    callback(datas);
            })
            .onError(function (err) {
                callback(null, err);
            }).Run();
    }).catch(function (ex) {
        callback(null, ex);
    });
}

function GetCustomerByCredentials(customer, callback) {
    const query = "select * from " + custTableName + " where Email = @Email and Password = @Password";
    con.connect().then(function () {
        new con.Request(query)
            .addParam("Email", TYPES.VarChar, customer.email)
            .addParam("Password", TYPES.VarChar, customer.password)
            .onComplate(function (count, datas) {
                if (callback)
                    callback(datas);
            })
            .onError(function (err) {
                callback(null, err);
            }).Run();
    }).catch(function (ex) {
        callback(null, ex);
    });
}

function FindByToken(customerToken, callback) {
    try {        
        decoded = jwt.verify(customerToken, setting.tokenpassword);        
        GetCustomerByToken(customerToken, (data, err) => {
            if (!err) {
                callback(data);
            } else {
                callback(null, err);
            }
        });

    } catch (e) {
        if(e.message === "jwt expired"){
            callback(null, "Token is expired");
        } else if(e.message === "invalid signature"){
            callback(null, "Token is not valid");
        } else {
            callback(null, e);
        }
        
    }
}

function UpdateAuthTokenAndSave(_email, callback) {
    var token = generateAuthToken(_email);
    const query = "update " + custTableName + " set token = @token where email = @email";

    con.connect().then(function () {
        new con.Request(query)
            .addParam("token", TYPES.VarChar, token)
            .addParam("email", TYPES.VarChar, _email)
            .onComplate(function (count) {
                if (callback)
                    callback(token);
            })
            .onError(function (err) {
                callback(null, err);
            })
            .Run();
    }).catch(function (ex) {
        callback(null, err);
    });
}


module.exports = {
    Customer,
    InsertCustomer,
    GetCustomer,
    FindByToken,
    UpdateAuthTokenAndSave
}