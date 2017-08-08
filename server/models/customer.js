const SchemaObject = require('schema-object');
const _ = require('lodash');
const { TYPES } = require('tedious');
const setting = require('../../settings');
const msSqlConnecter = require("../helper/msSqlConnecter");
const jwt = require('jsonwebtoken');
const { hashText, generateCustomerKeys } = require('./../helper/ethereumHelper');
var { HashPassword } = require('../helper/commonFunction');

// Create User schema 
var Customer = new SchemaObject({
    email: { type: String, required: true },
    password: { type: String, required: true },
    publickey: String,
    privatekey: String,
    token: String
});

const con = new msSqlConnecter.msSqlConnecter(setting.dbconfig);
const custTableName = setting.customersqltable;

var generateAuthToken = (_email) => {
    var access = 'auth';
    var token = jwt.sign({ email: _email, access }, setting.tokenpassword, {
    });
    return token;
}

function InsertCustomer(customer, callback) {
    //Generate hash key
    var seedText = customer.email + customer.password;
    etherKeys = generateCustomerKeys(seedText);
    customer.token = generateAuthToken(customer.email);    
    HashPassword(customer.password, (data, err) => {        
        if(!err){
            customer.password = data;
        } else {
            callback(null, err);
        }
    });
    customer.publickey = etherKeys.publickey;
    customer.privatekey = etherKeys.privatekey;
    //when insert     
    con.connect().then(function () {
        new con.Request("insert into " + custTableName + " values(@email,@password,@publickey,@privatekey, @token)")
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

function FindByToken(customerToken, callback) {
    try {
        decoded = jwt.verify(customerToken, setting.tokenpassword);
        GetCustomerByToken(customerToken, (data, err) => {
        if(!err){
            callback(data);
        } else {
            callback(null, err);
        }
    });

    } catch (e) {
        callback(null, e);
    }
}

module.exports = {
    Customer,
    InsertCustomer,
    GetCustomer,
    FindByToken
}
