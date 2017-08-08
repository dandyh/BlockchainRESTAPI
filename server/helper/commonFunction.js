const bcrypt = require('bcryptjs')

function CleanJSONObject(JSONInput) {
    return JSON.parse(JSON.stringify(JSONInput).toLowerCase());
}

function HashPassword(password, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        console.log(salt);
        bcrypt.hash(password, salt, (err, hash) => {
            console.log(hash);
            if (!err) {
                callback(hash);
            } else {
                callback(null, err);
            }
        });
    });
}

function VerifyPassword(PlainPassword, HashedPassword, callback) {
    bcrypt.compare(PlainPassword, HashedPassword, function (err, res) {
        if (!err) {
            if (res === true) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(null, err);
        }
    });
}

module.exports = {
    CleanJSONObject,
    HashPassword,
    VerifyPassword
};

