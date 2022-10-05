"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParsesr = require("body-parser");
var app = express().use(bodyParsesr.json());
var config_1 = require("./config");
app.listen(process.env.PORT, function () {
    console.log('Listening');
});
app.get('/webhooks', function (req, res) {
    var mode = req.query['hub.mode'];
    var challenge = req.query['hub.challenge'];
    var verify_token = req.query['hub.verify_token'];
    if (config_1.secret != verify_token || mode != 'subscribe') {
        res.status(403);
    }
    res.status(200).send(challenge);
});
app.post('/webhooks', function (req, res) {
    var val = req.body;
    console.log("Id:::::::::::::::::::::::::::::", JSON.stringify(val), "::::::::::::::::::::::::::::::::::");
    res.status(200).send();
});
app.get('/', function (req, res) {
    res.status(200).send('Hello there');
});
