var express = require('express');
var bodyParser = require('body-parser');
var { querySelectCustomerByID } = require('./db/mssql');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/customer/:customerId', (req, res) => {
    var customerId = req.params.customerId;
    querySelectCustomerByID(customerId, (data, err) => {
        if (!err) {
            res.send(data);
        } else {
            res.status(400).send(err);
        }
    });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
