const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000/calendario');
  
  // Wait for hitting the milestone
  await page.waitForSelector('.group.relative.overflow-hidden', { timeout: 5000 });
  
  console.log('Clicking the milestone...');
  await page.click('.group.relative.overflow-hidden');
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Check the DOM for the portal
  const portalExists = await page.evaluate(() => {
    const el = document.querySelector('.fixed.inset-0.bg-black');
    if (!el) return null;
    return {
      opacity: window.getComputedStyle(el).opacity,
      zIndex: window.getComputedStyle(el).zIndex,
      visibility: window.getComputedStyle(el).visibility,
      display: window.getComputedStyle(el).display,
    };
  });
  
  console.log('Portal state:', portalExists);
  
  await browser.close();
})();
