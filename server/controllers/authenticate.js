var Customer = require('./../models/customer');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');
    
  Customer.FindByToken(token, (data,err) => {
      if (!err) {          
          next();   
    } else {        
        res.status(401).json("Unauthorised access");                    
    }    
  });
};

module.exports = {authenticate};
