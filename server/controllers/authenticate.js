var {tokenpassword} = require('./../../settings');
var jwt = require('jsonwebtoken');

var generateAuthToken = (_email) => {
    var access = 'auth';
    var token = jwt.sign({email: _email, access}, tokenpassword, {
        //expiresIn: 4000 //4k seconds
    });
    return token;
}

module.exports = {
    generateAuthToken
}
