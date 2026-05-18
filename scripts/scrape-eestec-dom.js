const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  let fetchCounter = 0;
  
  page.on('response', async (response) => {
    const url = response.url();
    const type = response.request().resourceType();
    
    if (type === 'xhr' || type === 'fetch') {
      try {
        const text = await response.text();
        if (text.includes('Local Committee') || text.includes('Observer') || text.includes('LC ')) {
          fs.writeFileSync(`tmp-xhr-${fetchCounter}.json`, text);
          fs.writeFileSync(`tmp-xhr-${fetchCounter}-url.txt`, url);
          console.log(`Intercepted highly relevant XHR: ${url}`);
          fetchCounter++;
        }
      } catch (e) {}
    }
  });

  console.log('Navigating to https://eestec.net/cities...');
  await page.goto('https://eestec.net/cities', { waitUntil: 'networkidle0' });
  
  console.log('Waiting 5s...');
  await new Promise(r => setTimeout(r, 5000));
  
  // also dump all text from DOM that is short (likely names)
  const domText = await page.evaluate(() => {
    function getLeafNodes(node) {
      let result = [];
      if (!node.children || node.children.length === 0) {
        if (node.innerText && node.innerText.trim()) {
           result.push(node.innerText.trim());
        }
      } else {
        for (let i = 0; i < node.children.length; i++) {
          result = result.concat(getLeafNodes(node.children[i]));
        }
      }
      return result;
    }
    return getLeafNodes(document.body);
  });
  
  fs.writeFileSync('eestec-dom-text.json', JSON.stringify([...new Set(domText)], null, 2));
  console.log('Saved DOM text dump.');
  
  await browser.close();
})();
