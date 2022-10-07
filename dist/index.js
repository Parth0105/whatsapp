"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const app = (0, express_1.default)().use(body_parser_1.default.json());
process.env.access_token = 'EAASSYxSdSZCEBAPin7z9NdZAZAo1Bl1c1xwe8LW57UdT4cmcImY8g1EqEDbJZBRQaKmuywqk4FvPpi2chLJ8pVZAvZAccuPaeWX9ijng5qUOllW5YZCbsVVqG9j44jZA7VnZBIZCN3mh3fIGac5NppskVznWre7ZAAMc6wZBeg8RTOjxABmYnfotM5wQ0VU5RdzI7bousEthN309NQZDZD';
app.listen(process.env.PORT, async () => {
    console.log('Listening');
});
app.get('/webhooks', (req, res) => {
    const mode = req.query['hub.mode'];
    const challenge = req.query['hub.challenge'];
    const verify_token = req.query['hub.verify_token'];
    if (config_1.secret != verify_token || mode != 'subscribe') {
        res.status(403);
    }
    res.status(200).send(challenge);
});
app.post('/webhooks', async (req, res) => {
    const val = req.body;
    let imageId;
    if (val.entry[0].changes[0].value.messages[0].image) {
        imageId = val.entry[0].changes[0].value.messages[0].image.id;
    }
    else {
        imageId = val.entry[0].changes[0].value.messages[0].document.id;
    }
    const baseURL = `https://graph.facebook.com/v15.0/${imageId}`;
    const headers = {
        Authorization: `Bearer ${process.env.access_token}`,
    };
    let response;
    try {
        response = await axios_1.default.get(baseURL, { headers });
    }
    catch (error) {
        res.status(400).send(error);
    }
    console.log(JSON.stringify(response?.data));
    res.status(200).send(response?.data);
});
app.get('/', (req, res) => {
    res.status(200).send('Server running');
});
