//Load library
var Web3 = require('web3');
var EthUtil = require('ethereumjs-util');
var tx = require('ethereumjs-tx');

//Initilise Web3 object
var web3 = new Web3(
    new Web3.providers.HttpProvider('https://rinkeby.infura.io/')
    //new Web3.providers.HttpProvider('http://bcl2qzhcq.ukwest.cloudapp.azure.com:8545')
);

//function to generate public key
var hexToBytes = function (hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

function hashText(text){
    return web3.sha3(text);
}

function generateCustomerKeys(seedText) {
    var PrivateKey = hashText(seedText);
    var PublicKey = "0x" + `${EthUtil.privateToAddress(hexToBytes(PrivateKey.substr(2))).toString('hex')}`;
    return {
        "PublicKey" : PublicKey,
        "PrivateKey": PrivateKey
    }
}

module.exports = {
    hashText,
    generateCustomerKeys
}
