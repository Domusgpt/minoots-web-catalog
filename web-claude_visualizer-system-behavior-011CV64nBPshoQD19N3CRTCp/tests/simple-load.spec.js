const { test } = require('@playwright/test');

test('Simple page load test', async ({ page, context }) => {
  // Listen for all console messages and errors
  page.on('console', msg => {
    const type = msg.type();
    console.log(`CONSOLE [${type}]:`, msg.text());
  });

  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
    console.log('Stack:', error.stack);
  });

  page.on('crash', () => {
    console.log('PAGE CRASHED!');
  });

  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  try {
    console.log('Navigating to page...');
    await page.goto('http://localhost:8000/test-minimal.html', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });

    console.log('Page loaded!');

    // Try to get info immediately (no wait)
    try {
      const title = await page.title();
      console.log('Page title:', title);

      const cardCount = await page.locator('.morph-card').count();
      console.log('Card count:', cardCount);

      console.log('SUCCESS: Page is stable');
    } catch (e) {
      console.log('Failed to get info:', e.message);
    }

    // Now wait and see if it crashes
    console.log('Waiting to see if page crashes...');
    await page.waitForTimeout(3000);
    console.log('Still alive after 3 seconds!');

  } catch (error) {
    console.log('CAUGHT ERROR:', error.message);
  }
});
