const rsa = require('node-rsa');
const fs = require('fs');
const controllerID = 5;
var publicKey = new rsa();
var public = fs.readFileSync('./keys3/public.key', 'utf-8');
publicKey.importKey(public);
var privateKey = new rsa();
var private = fs.readFileSync('./keys3/private.key', 'utf-8');
privateKey.importKey(private);


function pairing (encryptedID){
    //console.log(encryptedID+'');
    const decrypted = publicKey.decryptPublic(encryptedID, 'utf8');
    console.log(decrypted+'');
    if(controllerID == decrypted){
        return true;
    }else{
        return false;
    }
}

//pairing();

exports.pairing = pairing;