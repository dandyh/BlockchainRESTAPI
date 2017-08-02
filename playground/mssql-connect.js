var { Connection } = require('tedious');
var { Request } = require('tedious');
var { Types } = require('tedious');
var async = require('async');

var config = {
    userName: 'dandy',
    password: 'C@rneLL88',
    server: 'smarterhomedb.database.windows.net',
    options: {
        database: 'SmarterHomeDB',
        encrypt: true
    }
}


var connection = new Connection(config);

connection.on('connect', function (err) {
    if (!err) {
        console.log("Successful!");
        executeStatement();
    } else {
        console.log("Error : " + err);
    }
}
);




function executeStatement() {
    //var query = "select ContractID from Contract";
    var query = "select username from \"User\"";
    request = new Request(query, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        //console.log(result);
      }
    });

    request.on('row', function(columns) {
      columns.forEach(function(column) {
        console.log(column.value);
      });
    });

    connection.execSql(request);
  }

  