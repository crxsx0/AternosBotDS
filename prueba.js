const puppeteer = require('puppeteer-extra')
const fs = require('fs').promises;
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

puppeteer.launch({ headless: false }).then(async browser => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    const cookiesString = await fs.readFile('./cookies.json');
    const cookies = JSON.parse(cookiesString);
    //console.log(cookies);
    
    await page.setCookie(...cookies);
    await page.goto("https://aternos.org/servers/");
    await page.click("#theme-switch > div.body > main > div > div.main-content-wrapper > section > div.page-content.page-servers > div > div.list-action > div.servercardlist > div > div.server-body");
    await page.waitForTimeout(1000)
    await page.waitForSelector("#start");
    await page.waitForTimeout(1000)
    await page.click("#start");
    await page.waitForSelector("#theme-switch > dialog > main > div.alert-buttons.btn-group > button.btn.btn-danger", "hidden");
    await page.click("#theme-switch > dialog > main > div.alert-buttons.btn-group > button.btn.btn-danger");
    await page.waitForTimeout(7000)
    await page.waitForSelector("#read-our-tos > main > section > div.page-content.page-server > div.server-status > div.status.online");
    console.log('El server ya esta ONLINE');
    await browser.close();
})