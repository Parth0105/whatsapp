import express from 'express';
import bodyParsesr from 'body-parser';
import axios from 'axios';
import { secret } from './config';
import {Builder , By, Key  } from "selenium-webdriver"    
// import { ChromiumWebDriver } from 'selenium-webdriver';
import "chromedriver"
import 'selenium-webdriver/firefox'
import { Options } from 'selenium-webdriver/firefox';



const app = express().use(bodyParsesr.json());

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

app.listen(8000,async ()=>{
    console.log('Listening');
});
app.get('/webhooks',(req: express.Request,res: express.Response)=>{
    const mode = req.query['hub.mode'];
    const challenge = req.query['hub.challenge'];
    const verify_token = req.query['hub.verify_token'];
    if(secret != verify_token ||  mode!= 'subscribe'){
        res.status(403);
    }
    res.status(200).send(challenge);
});
app.post('/webhooks', async (req: express.Request, res: express.Response) => {
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
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send('Server running');
});

app.get('/search' , async(req: express.Request, res: express.Response)=>{
  
    // const ans = await axios.get("https://shopping.google.com/search?q=nike")
    
    
    const screen = {
    width: 1920,
    height: 1080
        };
  
    var option =new Options()
    option.setBinary("C:/Program Files/Mozilla Firefox/firefox.exe")
    //when deploying to heroku uncomment below code
    // option.addArguments("--headless");
    // option.addArguments("--disable-gpu");
    // option.addArguments("--no-sandbox");
    // option.windowSize(screen);

    var driver = new Builder()
    .forBrowser('firefox').setFirefoxOptions(option)
    .build();

    await driver.get("https://shopping.google.com")
    await driver.findElement(By.id("REsRA")).sendKeys("nike",Key.RETURN)
    
    const title = await driver.getTitle()
    const body = await driver.getCurrentUrl()
    console.log("driver" +title)

    // res.status(200).send(ans.data)
})
