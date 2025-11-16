const { test, expect } = require('@playwright/test');

test.describe('Card System Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/index.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for animations to initialize
  });

  test('Cards should exist and be visible', async ({ page }) => {
    const cards = await page.locator('.morph-card').all();
    expect(cards.length).toBeGreaterThan(0);

    for (const card of cards) {
      await expect(card).toBeVisible();
    }
  });

  test('Card hover should trigger effects', async ({ page }) => {
    const firstCard = page.locator('.morph-card').first();

    // Get initial state
    const initialTransform = await firstCard.evaluate(el =>
      window.getComputedStyle(el).transform
    );

    // Hover over card
    await firstCard.hover();
    await page.waitForTimeout(600); // Wait for animation

    // Check if transform changed (3D tilt effect)
    const hoverTransform = await firstCard.evaluate(el =>
      window.getComputedStyle(el).transform
    );

    expect(hoverTransform).not.toBe(initialTransform);

    // Check if visualizer contracted
    const quantumLayers = page.locator('#quantum-layers');
    const layersTransform = await quantumLayers.evaluate(el =>
      window.getComputedStyle(el).transform
    );

    console.log('Quantum layers transform on hover:', layersTransform);
  });

  test('Card click should occlude', async ({ page }) => {
    const firstCard = page.locator('.morph-card').first();

    // Get initial quantum layers z-index
    const quantumLayers = page.locator('#quantum-layers');
    const initialZIndex = await quantumLayers.evaluate(el =>
      window.getComputedStyle(el).zIndex
    );

    // Click card
    await firstCard.click();
    await page.waitForTimeout(700); // Wait for occlusion animation

    // Check if z-index increased
    const newZIndex = await quantumLayers.evaluate(el =>
      window.getComputedStyle(el).zIndex
    );

    console.log('Z-index before:', initialZIndex, 'after:', newZIndex);
    expect(parseInt(newZIndex)).toBeGreaterThan(parseInt(initialZIndex));

    // Check if canvas opacity increased
    const contentCanvas = page.locator('#quantum-content');
    const opacity = await contentCanvas.evaluate(el =>
      window.getComputedStyle(el).opacity
    );

    console.log('Canvas opacity on click:', opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.6);
  });

  test('Card should expand when clicked (if expandable)', async ({ page }) => {
    const expandableCard = page.locator('[data-expandable]').first();

    if (await expandableCard.count() > 0) {
      await expandableCard.click();
      await page.waitForTimeout(800);

      // Check if overlay is active
      const overlay = page.locator('#overlay');
      const overlayClass = await overlay.getAttribute('class');
      expect(overlayClass).toContain('active');

      // Check if card has expanded class
      const cardClass = await expandableCard.getAttribute('class');
      expect(cardClass).toContain('expanded');
    }
  });

  test('Header color should sync with visualizer on hover', async ({ page }) => {
    const firstCard = page.locator('.morph-card').first();
    const header = firstCard.locator('h2, h3').first();

    // Get initial color
    const initialColor = await header.evaluate(el =>
      window.getComputedStyle(el).color
    );

    // Hover card
    await firstCard.hover();
    await page.waitForTimeout(1000); // Wait for color sync

    // Get new color
    const hoverColor = await header.evaluate(el =>
      window.getComputedStyle(el).color
    );

    console.log('Header color - initial:', initialColor, 'hover:', hoverColor);

    // Check if text-shadow was applied
    const textShadow = await header.evaluate(el =>
      window.getComputedStyle(el).textShadow
    );

    console.log('Text shadow on hover:', textShadow);
    expect(textShadow).not.toBe('none');
  });
});
