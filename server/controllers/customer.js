var { queryInsertCustomer, querySelectCustomerByEmail, queryAll } = require('../db/mssql');
var {CleanJSONObject} = require('../helper/commonFunction');
var {hashText, generateCustomerKeys} = require('../helper/ethereumHelper');
var validator = require('validator');

var insertCustomer = (customerObject, callback) => {
    var obj = CleanJSONObject(customerObject);    

    //verify whether the email is valid
    if(!validator.isEmail(obj.email)){
        return callback("Invalid email format");
    }

    //Generate hash key
    var seedText = obj.email + obj.password;
    var keys = generateCustomerKeys(seedText);

    obj.password = hashText(obj.password);
    obj.publickey = keys.publickey;
    obj.privatekey = keys.privatekey;

    //Insert customer into DB
    queryInsertCustomer(obj, (data, err) => {
        if (!err) {
            return callback(null, "Success");
        } else {
            return callback(err);
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

var getCustomerByEmail = (custEmail, callback) => {
    querySelectCustomerByEmail(custEmail, (data, err) => {
        if (err) {
            callback("Unable to get the data " + err);
        } else {
            console.log('error');
            callback(null, data[0]);
        }
    });
}

// var getCustomerPromise = (custId) => {
//     return new Promise((resolve, reject) => {
//         querySelectCustomerByID(custID, (data, err) => {
//             resolve(data);
//             // if (err) {
//             //     reject("Unable to get the data " + err);
//             // } else {
//             //     console.log(data);
//             //     resolve(data);
//             // }
//         });
//     }
//     )
// };


module.exports = {
    insertCustomer,
    getCustomerByEmail
}
