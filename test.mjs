import puppeteer, { TimeoutError } from 'puppeteer';
import fs from 'fs'
import { TIMEOUT } from 'dns';

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({width: 1080, height: 1024});
    const cookiesString = await fs.promises.readFile('./cookies.json', 'utf8');
    const cookies = JSON.parse(cookiesString);
    console.log(cookies);
    await page.setCookie(...cookies);

    await page.goto("https://aternos.org/servers/");
    const on = await page.evaluate(() => {
        const elementoObservado = document.querySelector("#read-our-tos > main > section > div.page-content.page-server > div.server-status > div.status.loading.starting > div > span.statuslabel-label-container > span");
        const observer = new MutationObserver((mutationsList, observer) => {
            // Aquí puedes manejar los cambios observados en el contenido del elemento
            mutationsList.forEach(mutation => {
              if (mutation.type === 'childList' && elementoObservado.textContent === 'Nuevo contenido') {
                // Realiza acciones en función del contenido cambiado
                console.log('El contenido del elemento cambió a "Nuevo contenido".');
                // Realiza otras acciones aquí
              }
            });
          });
    });

    browser.close();
    await page.waitForSelector("#read-our-tos > main > section > div.page-content.page-server > div.server-status > div.status.online", TIMEOUT, "1_000");
})();