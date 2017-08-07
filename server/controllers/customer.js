var { queryInsertCustomer, querySelectCustomerByID, queryInsert, queryUpdate, queryDelete, queryAll } = require('../db/mssql');

function InsertCustomer(customer) {
    queryInsertCustomer(customer, (data, err) => {
        if (!err) {
            console.log(data);
        } else {
            console.log(err);
        }
    });
}

function SelectCustomers(){
    const query = "select * from BCCustomer;"
    queryAll(query, (data, err) => {
        if (!err) {
            console.log(data);
        } else {
            console.log(err);
        }
    });
}

function SelectCustomer(custID){
    querySelectCustomerByID(custID, (data, err) => {
        if (!err) {
            console.log(data);
            return data;
        } else {
            throw err;
        }
    });
}

console.log(SelectCustomer(7));
// const customer = {
//     email: "handoko@centrica.com",
//     password: "password",
//     publickey: "publickey", 
//     privatekey: "privatekey"
// }

// InsertCustomer(customer);

exports.module = {
    InsertCustomer,
    SelectCustomer
}