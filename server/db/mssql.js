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
        callback(null, err);
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
    queryInsert,
    queryUpdate,
    queryDelete,
    queryAll
}


//Example
//var qr = "insert into BCCustomer values('dandy@centrica.com', 'dandy', 'public key 1', 'private key 1')";
//var qr = "delete from BCCustomer where CustomerID =4;"
// var qr = "update BCCustomer set email='dandy@britishgas.co.uk' where customerid = 5"
// queryUpdate(qr, (data, err)=>{
//     if(!err){
//         console.log(data);
//     } else {
//         console.log(err);
//     }
    
// })