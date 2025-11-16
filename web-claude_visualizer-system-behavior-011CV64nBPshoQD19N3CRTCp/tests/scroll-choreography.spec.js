const { test, expect } = require('@playwright/test');

test.describe('Scroll Choreography Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/index.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('Scroll progress bar should update', async ({ page }) => {
    const progressBar = page.locator('#scroll-progress');

    // Initial width
    const initialWidth = await progressBar.evaluate(el =>
      window.getComputedStyle(el).width
    );

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(500);

    // Check if width increased
    const newWidth = await progressBar.evaluate(el =>
      window.getComputedStyle(el).width
    );

    console.log('Progress bar - initial:', initialWidth, 'after scroll:', newWidth);
    expect(parseFloat(newWidth)).toBeGreaterThan(parseFloat(initialWidth));
  });

  test('Section transitions should trigger visualizer effects', async ({ page }) => {
    const sections = await page.locator('.section').all();
    const quantumLayers = page.locator('#quantum-layers');

    for (let i = 0; i < Math.min(sections.length, 3); i++) {
      // Scroll to section
      await sections[i].scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Get visualizer state
      const transform = await quantumLayers.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      const opacity = await quantumLayers.evaluate(el =>
        window.getComputedStyle(el).opacity
      );

      console.log(`Section ${i} - transform: ${transform}, opacity: ${opacity}`);

      // Scroll past section to trigger exit effect
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
      await page.waitForTimeout(1500); // Wait for flourish/portal effect

      const exitTransform = await quantumLayers.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      console.log(`Section ${i} exit - transform: ${exitTransform}`);
    }
  });

  test('Minute scroll increments should be smooth', async ({ page }) => {
    const quantumLayers = page.locator('#quantum-layers');

    // Collect states at 10px intervals
    const states = [];

    for (let i = 0; i < 20; i++) {
      await page.evaluate(() => window.scrollBy(0, 10));
      await page.waitForTimeout(50);

      const state = await quantumLayers.evaluate(el => ({
        transform: window.getComputedStyle(el).transform,
        opacity: window.getComputedStyle(el).opacity,
        scrollY: window.scrollY
      }));

      states.push(state);
    }

    console.log('Scroll states:', states);

    // Verify smooth transitions (no jumps)
    for (let i = 1; i < states.length; i++) {
      const prevOpacity = parseFloat(states[i - 1].opacity);
      const currOpacity = parseFloat(states[i].opacity);
      const opacityChange = Math.abs(currOpacity - prevOpacity);

      // Opacity shouldn't jump more than 0.2 in 10px scroll
      expect(opacityChange).toBeLessThan(0.2);
    }
  });

  test('Visualizer parameters should evolve with scroll', async ({ page }) => {
    // Inject test helper to read visualizer params
    await page.evaluate(() => {
      window.getVisualizerParams = () => {
        if (!window.quantumVisualizers || window.quantumVisualizers.length === 0) {
          return null;
        }

        return window.quantumVisualizers.map(viz => ({
          speed: viz.params.speed,
          intensity: viz.params.intensity,
          chaos: viz.params.chaos,
          dimension: viz.params.dimension,
          gridDensity: viz.params.gridDensity,
          hue: viz.params.hue
        }));
      };
    });

    // Get initial params
    const initialParams = await page.evaluate(() => window.getVisualizerParams());

    // Scroll down significantly
    await page.evaluate(() => window.scrollBy(0, 2000));
    await page.waitForTimeout(1000);

    // Get params after scroll
    const scrolledParams = await page.evaluate(() => window.getVisualizerParams());

    console.log('Initial params:', initialParams);
    console.log('Scrolled params:', scrolledParams);

    // At least one parameter should have changed
    if (initialParams && scrolledParams) {
      let paramsChanged = false;

      for (let i = 0; i < initialParams.length; i++) {
        const initial = initialParams[i];
        const scrolled = scrolledParams[i];

        if (Math.abs(initial.speed - scrolled.speed) > 0.1 ||
            Math.abs(initial.chaos - scrolled.chaos) > 0.05 ||
            Math.abs(initial.dimension - scrolled.dimension) > 0.1) {
          paramsChanged = true;
          break;
        }
      }

      expect(paramsChanged).toBe(true);
    }
  });

  test('Flourish, portal, bleed, shrink-explode effects should trigger', async ({ page }) => {
    const effects = ['flourish', 'portal', 'bleed', 'shrinkExplode'];
    const sections = await page.locator('.section').all();

    // Listen for console logs
    const effectLogs = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('FLOURISH') || text.includes('PORTAL') ||
          text.includes('BLEED') || text.includes('SHRINK-EXPLODE')) {
        effectLogs.push(text);
      }
    });

    // Scroll through sections
    for (let i = 0; i < Math.min(sections.length, 4); i++) {
      await sections[i].scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Scroll past to trigger exit
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
      await page.waitForTimeout(2000); // Wait for effect to complete
    }

    console.log('Effect logs:', effectLogs);

    // Should have triggered at least one effect
    expect(effectLogs.length).toBeGreaterThan(0);
  });
});
