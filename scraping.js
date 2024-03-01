const pup = require('puppeteer');

const url = "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm";

(async () => {
    // Launch the browser and open a new blank page
    const browser = await pup.launch({ headless: false });
    const page = await browser.newPage();
    console.log('Iniciei!');
    await page.goto(url);
    console.log('Fui para url!');

    const data = await page.evaluate(() => {
        let data = [];
        console.log(data)

        const dadosBody =  document.querySelector("body")
        console.log(dadosBody)
    })


    // await page.goto(url);
    // console.log('Fui para url!');


    //await page.waitForTimeout(3000);
    await browser.close();
})();