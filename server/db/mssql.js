var {Connection, TYPES} = require('tedious');
var {dbconfig} = require('../../settings');
var msSqlConnecter = require("../helper/msSqlConnecter"); 

var connection = new Connection(dbconfig);

function queryInsertCustomer(customer, callback) { 
    //when insert 
    var con = new msSqlConnecter.msSqlConnecter(dbconfig); 
    con.connect().then(function () { 
        new con.Request("insert into BCCustomer values(@email,@password,@publickey,@privatekey)")         
            .addParam("email", TYPES.VarChar, customer.email) 
            .addParam("password", TYPES.VarChar, customer.password) 
            .addParam("publickey", TYPES.VarChar, customer.publickey) 
            .addParam("privatekey", TYPES.VarChar, customer.privatekey) 
            .onComplate(function (count) { 
                if (callback) 
                    callback(count); 
            }) 
            .onError(function (err) { 
                console.log(err); 
            }) 
            .Run(); 
    }).catch(function (ex) { 
        console.log(ex); 
    }); 
} 

function querySelectCustomerByID(custId, callback) { 
    const query = "select * from BCCustomer where customerid = @customerid"
    var con = new msSqlConnecter.msSqlConnecter(dbconfig); 
    con.connect().then(function () { 
        new con.Request(query) 
            .addParam("CustomerID", TYPES.VarChar, custId)
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

function querySelectCustomerByEmail(custEmail, callback) { 
    const query = "select * from BCCustomer where Email = @Email"
    var con = new msSqlConnecter.msSqlConnecter(dbconfig); 
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

function queryInsert(query, callback) { 
    //when insert 
    var con = new msSqlConnecter.msSqlConnecter(dbconfig); 
    con.connect().then(function () { 
        //new con.Request("insert into student values(@name,@age)") 
        new con.Request(query) 
            //.addParam("name", TYPES.VarChar, "Eric") 
            //.addParam("age", TYPES.Int, 20) 
            .onComplate(function (count) { 
                if (callback) 
                    callback(count); 
            }) 
            .onError(function (err) { 
                console.log(err); 
            }) 
            .Run(); 
    }).catch(function (ex) { 
        console.log(ex); 
    }); 
} 

function queryAll(query, callback) { 
    var con = new msSqlConnecter.msSqlConnecter(dbconfig); 
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

function queryUpdate(query, callback) { 
    var con = new msSqlConnecter.msSqlConnecter(dbconfig); 
    con.connect().then(function () { 
        //new con.Request("update student set name = @name where id > @id") 
        new con.Request(query) 
            //.addParam("id", TYPES.Int, 3) 
            //.addParam("name", TYPES.VarChar, "frank") 
            .onComplate(function (count) { 
                if (callback) 
                    callback(count); 
            }) 
            .onError(function (err) { 
                console.log(err); 
            }) 
            .Run(); 
    }).catch(function (ex) { 
        console.log(ex); 
    }); 
} 
 
function queryDelete(query, callback) { 
    var con = new msSqlConnecter.msSqlConnecter(dbconfig); 
    con.connect().then(function () { 
        //new con.Request("delete from student where id > @id") 
        new con.Request(query) 
            //.addParam("id", TYPES.Int, 3) 
            .onComplate(function (count) { 
                if (callback) 
                    callback(count); 
            }) 
            .onError(function (err) { 
                console.log(err); 
            }) 
            .Run(); 
    }).catch(function (ex) { 
        console.log(ex); 
    }); 
} 

module.exports = {
    connection,
    queryInsertCustomer,
    querySelectCustomerByID,
    querySelectCustomerByEmail,
    queryInsert,
    queryUpdate,
    queryDelete,
    queryAll
}