var Servient = require("@node-wot/core").Servient;
var MqttsClientFactory = require("@node-wot/binding-mqtt").MqttsClientFactory
var rsa = require('node-rsa');
var fs = require('fs');
const express = require('express');
const app = express();
var router = express.Router();
var emparejamiento = require('./emparejamiento.js');
var privateKey = new rsa();
var private = fs.readFileSync('./keys3/private.key', 'utf-8');
privateKey.importKey(private);
const controllerID = 5;



Helpers = require("@node-wot/core").Helpers;

//Creamos el Servient y el protocolo MQTT

let servient = new Servient();
servient.addClientFactory(new MqttsClientFactory({rejectUnauthorized: false}));

//Thing description

let td = `{
    "@context": "https://www.w3.org/2019/wot/td/v1",
    "title": "AireAcondicionado",
    "id": "urn:dev:wot:mqtt:AireAcondicionado",
    "properties": {
        "temperatura": {
            "type": "integer",
            "forms": [{
                "href": "mqtts://localhost:8443/AireAcondicionado/properties/temperatura"
            }]
        }
    },
    "actions" : {
        "OnOff": {
            "forms": [
                {"href": "mqtts://localhost:8443/AireAcondicionado/actions/OnOff"}
            ]
        },
        "incrementar": {
            "forms": [
                {"href": "mqtts://localhost:8443/AireAcondicionado/actions/incrementar"}
            ]
        },
        "decrementar": {
            "forms": [
                {"href": "mqtts://localhost:8443/AireAcondicionado/actions/decrementar"}
            ]
        },
        "leerTemperatura": {
            "forms": [
                {"href": "mqtts://localhost:8443/AireAcondicionado/actions/leerTemperatura"}
            ]
        }
    }, 
    "events": {
        "estadoTemperatura": {
            "type": "integer",
            "forms": [
                {"href": "mqtts://localhost:8443/AireAcondicionado/events/estadoTemperatura"}
            ]
        } 
    } 
}`;

try {
    //console.log(privateKey.encryptPrivate(controllerID, 'base64'));
    if(emparejamiento.pairing(privateKey.encryptPrivate(controllerID, 'base64')) == true){
    servient.start().then((WoT) => {
        WoT.consume(JSON.parse(td)).then((thing) => {
            console.info(td);

            

            thing.subscribeEvent(
                "estadoTemperatura",
                (temperatura) => console.info("value:", temperatura),
                (e) => console.error("Error: %s", e),
                () => console.info("Completado")
            );

            /*setInterval(() =>{
                thing.invokeAction('incrementar');
            }, 1000);*/

            console.info("Suscrito");

            app.set('view engine', 'jade');
            var temeperatura23 = 11;

            

            router.get("/subirTemperatura", function (req, res) {
                thing.invokeAction('incrementar');
                res.redirect('/mando');
            });

            router.get("/bajarTemperatura", function (req, res) {
                thing.invokeAction('decrementar');
                res.redirect('/mando');
            });

            

            //app.listen(4000);

            module.exports = router;
        });
    });
}else{
    console.log('EMPAREJAMIENTO FALLIDO');
}


} catch (err) {
    console.error("Error en el script: ", err);
}