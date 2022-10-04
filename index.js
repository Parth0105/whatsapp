const express = require('express');
const bodyParsesr = require('body-parser');
const app = express().use(bodyParsesr.json());
const { secret } = require('./config');
app.listen(8000,()=>{
    console.log('Listening');
});
app.get('/webhooks',(req,res)=>{
    const mode = req.query[hub.mode];
    const challenge = req.query[hub.challenge];
    const verify_token = req.query[hub.verify_token];
    if(secret != verify_token ||  mode!= 'subscribe'){
        res.status(200).send(challenge);
    }
    res.status(403);
});
app.post('/webhooks', (req, res) => {
    const pno = req.body.entry[0].challenge[0].value.metadata.phone_number_id;
    const from = req.body.entry[0].challenge[0].value.messages[0].from;
    console.log('from:::::::::::::', from, '::::::::::from');
});
app.get('/', (req, res) => {
  res.status(200).send('Hello there');
});