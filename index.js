const express = require('express');
const bodyParsesr = require('body-parser');
const app = express().use(bodyParsesr.json());
const { secret } = require('./config');
app.listen(8000,()=>{
    console.log('Listening');
});
app.get('/webhooks',(req,res)=>{
    const mode = req.query['hub.mode'];
    const challenge = req.query['hub.challenge'];
    const verify_token = req.query['hub.verify_token'];
    if(secret != verify_token ||  mode!= 'subscribe'){
        res.status(403);
    }
    res.status(200).send(challenge);
});
app.post('/webhooks', (req, res) => {
    const val = req.body.entry[0].changes[0].value.contacts[0]['wa_id'];
    console.log("Id:::::::::::::::::::::::::::::", val, "::::::::::::::::::::::::::::::::::");
    res.status(200).send();
});
app.get('/', (req, res) => {
  res.status(200).send('Hello there');
});