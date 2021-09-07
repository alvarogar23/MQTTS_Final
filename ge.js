var rsa = require('node-rsa');
var fs = require('fs');

function gen(){
    var key = new rsa().generateKeyPair();

    var publicKey = key.exportKey('public');

    var privateKey = key.exportKey('private');

    fs.openSync('./keys3/public.key', 'w');
    fs.writeFileSync('./keys3/public.key', publicKey, 'utf8');
    fs.openSync('./keys3/private.key', 'w');
    fs.writeFileSync('./keys3/private.key', privateKey, 'utf8');
}

gen();