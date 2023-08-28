const { Client, GatewayIntentBits, Partials, Collection, Message } = require('discord.js');
const puppeteer = require('puppeteer-extra')
const fs = require('fs').promises;
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// Importa el módulo 'dotenv' para cargar variables de un archivo .env (si es necesario)
require('dotenv').config();

// Accede a la variable de entorno 'API_KEY'
const KEY = process.env.KEY;
puppeteer.use(StealthPlugin())

const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

const client = new Client({
    intents:[Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)]
});

client.setMaxListeners(0);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (Message) => {
    if(Message.content === "!on"){
      Message.channel.send("Encendiendo el server");
      puppeteer.launch({ headless: true }).then(async browser => {
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
        await page.waitForSelector("#read-our-tos > main > section > div.page-content.page-server > div.server-status > div.status.online",{
          timeout: 170000
        });
        const IP = await page.evaluate(() => {
          return document.querySelector("#ip").innerText;
        });
        await page.waitForSelector("#read-our-tos > main > section > div.page-content.page-server > div.server-ip.mobile-full-width > div > a");
        await page.click("#read-our-tos > main > section > div.page-content.page-server > div.server-ip.mobile-full-width > div > a");
        const DynIP = await page.evaluate(() => {
          return document.querySelector("#theme-switch > dialog > main > div.alert-body > div.dynip").innerText;
        });
        // Encuentra la posición del primer carácter después de "Dyn IP : "
        const posicionInicio = DynIP.indexOf("Dyn IP : ") + "Dyn IP : ".length;

        // Utiliza el método substring() para obtener el texto después de "Dyn IP : "
        const textoResultado = DynIP.substring(posicionInicio);
        await browser.close();
        await Message.channel.send("El server esta encendido\n\nLa IP es: "+ IP +"\nLa IP Dinamica es: "+ textoResultado);
      })
    }

    if(Message.content === "!off"){
      Message.channel.send("Apagando el server");
      puppeteer.launch({ headless: true }).then(async browser => {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        const cookiesString = await fs.readFile('./cookies.json');
        const cookies = JSON.parse(cookiesString);
        //console.log(cookies);
        
        await page.setCookie(...cookies);
        await page.goto("https://aternos.org/servers/");
        await page.click("#theme-switch > div.body > main > div > div.main-content-wrapper > section > div.page-content.page-servers > div > div.list-action > div.servercardlist > div > div.server-body");
        await page.waitForTimeout(1000)
        await page.waitForSelector("#stop");
        await page.waitForTimeout(1000)
        await page.click("#stop");
        await page.waitForSelector("#read-our-tos > main > section > div.page-content.page-server > div.server-status > div.status.offline",{
          timeout: 170000
        });
        await browser.close();
        await Message.channel.send("El server esta apagado");
      })
    }
})


client.login(KEY);