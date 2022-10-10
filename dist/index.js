"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const selenium_webdriver_1 = require("selenium-webdriver");
// import { ChromiumWebDriver } from 'selenium-webdriver';
require("chromedriver");
require("selenium-webdriver/firefox");
const firefox_1 = require("selenium-webdriver/firefox");
const app = (0, express_1.default)().use(body_parser_1.default.json());
app.listen(8000, async () => {
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
app.get('/search', async (req, res) => {
    // const ans = await axios.get("https://shopping.google.com/search?q=nike")
    const screen = {
        width: 1920,
        height: 1080
    };
    var option = new firefox_1.Options();
    option.setBinary("C:/Program Files/Mozilla Firefox/firefox.exe");
    //when deploying to heroku uncomment below code
    // option.addArguments("--headless");
    // option.addArguments("--disable-gpu");
    // option.addArguments("--no-sandbox");
    // option.windowSize(screen);
    var driver = new selenium_webdriver_1.Builder()
        .forBrowser('firefox').setFirefoxOptions(option)
        .build();
    await driver.get("https://shopping.google.com");
    const nike = await driver.findElement(selenium_webdriver_1.By.id("REsRA")).sendKeys("nike", selenium_webdriver_1.Key.RETURN);
    // const title = await nike.getTitle()
    // const body = await nike.getCurrentUrl()
    console.log("driver" + nike);
    // res.status(200).send(ans.data)
});
