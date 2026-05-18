const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  let counter = 0;
  
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('api.eestec.net')) {
      try {
        const text = await response.text();
        fs.writeFileSync(`tmp-eestec-api-${counter}.json`, text);
        fs.writeFileSync(`tmp-eestec-api-${counter}-url.txt`, url);
        console.log(`Intercepted: ${url}`);
        counter++;
      } catch (e) {}
    }
  });

  console.log('Navigating to https://eestec.net/cities...');
  await page.goto('https://eestec.net/cities', { waitUntil: 'networkidle2' });
  
  console.log('Waiting 5s for data visualization...');
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('Done.');
  await browser.close();
})();
