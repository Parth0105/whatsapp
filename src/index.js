const express = require('express');
const bodyParsesr = require('body-parser');
const app = express().use(bodyParsesr.json());
import { secret } from './config';
let axios;
// type mediaType = {
//     "object": string,
//         "entry": {
//                 "id": string,
//                 "changes":{
//                         "value": {
//                             "messaging_product": string,
//                             "metadata": {
//                                 "display_phone_number": string,
//                                 "phone_number_id": string
//                             },
//                             "contacts":
//                                 {
//                                     "profile": {
//                                         "name": string
//                                     },
//                                     "wa_id": string
//                                 }[],
//                             "messages":{
//                                     "from": string,
//                                     "id": string,
//                                     "timestamp": string,
//                                     "type": string,
//                                     "image": {
//                                         "mime_type": string,
//                                         "sha256": string,
//                                         "id": string
//                                     }
//                                 }[]
//                         },
//                         "field": string
//                     }[]
//             }[]
// }
app.listen(process.env.PORT,async ()=>{
    axios = await import('axios');
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
app.post('/webhooks', async (req, res) => {
    const val = req.body;
    const baseURL = `https://graph.facebook.com/v15.0/${val.entry[0].changes[0].value.messages[0].image.id}`;
    const headers = {
      Authorization:'Bearer EAASSYxSdSZCEBAKJydLVkf9KjeZAM6ylxbOg2NnhDkZCRkDc4i8G3Xx23Cw9goIPcxuFIE0UR99w7MoLayAhiOWsLD24H4KC4iduSK0M7bjVxecolFG7uxgzUB3fl3617Mqrz6uMdHwg9pXiZBZCpSQZAb0Js4I2MYiaqOnPLGHNwj6as8CzqEpeEnMvIWs8HUR6KvvZBNVwQZDZD',
    };
    let response;
    try {
        response = await axios.get(baseURL, { headers });
    } catch (error) {
        res.status(500).send(error);
    }
    console.log(response.data);
    res.status(200).send(response.data);
});
app.get('/', (req, res) => {
  res.status(200).send('Server running');
});
