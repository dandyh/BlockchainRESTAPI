var {connection} = require('./db/mssql');
var { Request } = require('tedious');

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


connection.on('connect', function (err) {
    if (!err) {
        console.log("Successful!");
        executeStatement();
    } else {
        console.log("Error : " + err);
    }
}
);