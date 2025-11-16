const { test, expect } = require('@playwright/test');

test('Debug page load', async ({ page }) => {
  // Listen for console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Listen for errors
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  // Listen for crash
  page.on('crash', () => console.log('PAGE CRASHED!'));

  try {
    console.log('Loading page...');
    await page.goto('http://localhost:8000/index.html', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    console.log('Page loaded, waiting...');
    await page.waitForTimeout(5000);

    // Take screenshot
    await page.screenshot({ path: 'page-loaded.png' });
    console.log('Screenshot saved');

  } catch (error) {
    console.log('Error:', error.message);
    await page.screenshot({ path: 'page-error.png' });
  }
});
