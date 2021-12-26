const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.use("/scrape-data", (req, res, next) => {
    const {url} = req.body;
    //const url = "https://www.amazon.com/Redragon-Keyboard-Mechanical-Software-Supported/dp/B09BVCVTBC/ref=sr_1_9?crid=EV27YXVOV0J7&keywords=redragon&qid=1640561891&sprefix=redragon%2Caps%2C376&sr=8-9"
    const scrapeData = async (url) => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url)

        const [el] = await page.$x('//*[@id="landingImage"]')
        const src = await el.getProperty('src')
        const srcImage = await src.jsonValue()
        
        
        const [el2] = await page.$x('//*[@id="productTitle"]')
        const txt = await el2.getProperty('textContent')
        const title = await txt.jsonValue()
        
        
        const [el3] = await page.$x('//*[@id="exports_desktop_outOfStock_buybox_message_feature_div"]/div/span')
        const txt2 = await el3.getProperty('textContent')
        const price = await txt2.jsonValue()
        
        
        console.log({srcImage, title, price})
        browser.close();
        res.send({srcImage, title, price})
    }
    scrapeData(url)
})

app.use("*", (req, res, next) => {
    res.sendStatus(404)
})

app.listen(3030, () => {
    console.log("Server Running: 3030")
})