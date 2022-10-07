const express = require('express');
const bodyParsesr = require('body-parser');
const app = express().use(bodyParsesr.json());
import { secret } from './config';
let axios;

type mediaType = {
    "object": string,
        "entry": {
                "id": string,
                "changes":{
                        "value": {
                            "messaging_product": string,
                            "metadata": {
                                "display_phone_number": string,
                                "phone_number_id": string
                            },
                            "contacts":
                                {
                                    "profile": {
                                        "name": string
                                    },
                                    "wa_id": string
                                }[],
                            "messages":{
                                    "from": string,
                                    "id": string,
                                    "timestamp": string,
                                    "type": string,
                                    "image": {
                                        "mime_type": string,
                                        "sha256": string,
                                        "id": string
                                    }
                                }[]
                        },
                        "field": string
                    }[]
            }[]
}
type docType = {
    "entry":{
        "changes":{
            "field": string,
            "value": {
                "contacts":{
                        "profile": {
                            "name": string
                        },
                        "wa_id": string
                    }[],
                "messages":{
                        "document": {
                            "filename": string,
                            "id": string,
                            "mime_type": string,
                            "sha256": string
                        },
                        "from": string,
                        "id": string,
                        "timestamp": string,
                        "type": string
                    }[],
                "messaging_product": string,
                "metadata": {
                    "display_phone_number": string,
                    "phone_number_id": string
                }
            }
        }[],
            "id": string
        }[]
    "object": string
}

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
    console.log(JSON.stringify(val));
    let imageId: string;
    if (val.entry[0].changes[0].value.messages[0].image){
        imageId = val.entry[0].changes[0].value.messages[0].image.id;
    }else{
        imageId = val.entry[0].changes[0].value.messages[0].document.id;
    }
    const baseURL = `https://graph.facebook.com/v15.0/${imageId}`;
    const headers = {
      Authorization:`Bearer ${process.env.access_token}`,
    };
    let response;
    try {
        response = await axios.get(baseURL, { headers });
    } catch (error) {
        res.status(500).send(error);
    }
    res.status(200).send(response.data);
});
app.get('/', (req, res) => {
  res.status(200).send('Server running');
});
