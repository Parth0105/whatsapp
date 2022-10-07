import express from 'express';
import bodyParsesr from 'body-parser';
import axios from 'axios';
import { secret } from './config';
const app = express().use(bodyParsesr.json());
process.env.access_token = 'EAASSYxSdSZCEBAPin7z9NdZAZAo1Bl1c1xwe8LW57UdT4cmcImY8g1EqEDbJZBRQaKmuywqk4FvPpi2chLJ8pVZAvZAccuPaeWX9ijng5qUOllW5YZCbsVVqG9j44jZA7VnZBIZCN3mh3fIGac5NppskVznWre7ZAAMc6wZBeg8RTOjxABmYnfotM5wQ0VU5RdzI7bousEthN309NQZDZD';

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
        res.status(400).send(error);
    }
    console.log(JSON.stringify(response?.data));
    res.status(200).send(response?.data);
});
app.get('/', (req, res) => {
  res.status(200).send('Server running');
});
