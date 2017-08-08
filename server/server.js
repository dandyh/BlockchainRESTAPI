const express = require('express');
const bodyParser = require('body-parser');
const customerController = require('./controllers/customer');
const setting = require('./../settings');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {authenticate} = require('./controllers/authenticate');
const app = express();
const secureRoutes = express.Router();


const port = process.env.PORT || 3000;

//Middleware to express, so json file is passed to this rest api
app.use(bodyParser.json());
app.use('/secure-api', secureRoutes);
//Validation Middleware
secureRoutes.use(authenticate);

//Public 
app.post('/api/customer', customerController.insertCustomer);
app.post("/api/login", customerController.customerLogin);

//Private
secureRoutes.get('/customer/:customerEmail', customerController.getCustomer);
secureRoutes.delete('/logout', customerController.customerLogout);


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});


module.exports = {app};