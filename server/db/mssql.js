var { Connection } = require('tedious');
var {dbconfig} = require('../../settings');

var connection = new Connection(dbconfig);
module.exports = {connection}
