var Customer = require('./../models/customer');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    //If token is empty
    if (!token) {
        res.status(401).json("Token is empty");
        return;
    }
    Customer.FindByToken(token, (data, err) => {
        if (!err) {
            if(data.length === 0){
                res.status(401).json("User not found");
                return;
            }
            next();
        } else {
            res.status(401).json(err);
        }
    });
};

module.exports = { authenticate };
