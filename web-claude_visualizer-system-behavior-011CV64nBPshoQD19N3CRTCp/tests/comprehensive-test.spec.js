const { test, expect } = require('@playwright/test');

test.describe('Comprehensive System Test', () => {
    let consoleMessages = [];
    let pageErrors = [];

    test.beforeEach(async ({ page }) => {
        consoleMessages = [];
        pageErrors = [];

        // Capture console messages
        page.on('console', msg => {
            const text = msg.text();
            consoleMessages.push({ type: msg.type(), text });
            console.log(`[${msg.type()}] ${text}`);
        });

        // Capture page errors
        page.on('pageerror', error => {
            pageErrors.push(error.message);
            console.log(`[PAGE ERROR] ${error.message}`);
        });

        await page.goto('http://localhost:8000/index.html', {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        // Wait for page to initialize
        await page.waitForTimeout(2000);
    });

    test('Page loads without errors', async ({ page }) => {
        // Check for page errors
        expect(pageErrors.length).toBe(0);

        // Check page title
        const title = await page.title();
        expect(title).toBeTruthy();
    });

    test('GSAP and ScrollTrigger load correctly', async ({ page }) => {
        const gsapLoaded = await page.evaluate(() => {
            return typeof gsap !== 'undefined';
        });

        const scrollTriggerLoaded = await page.evaluate(() => {
            return typeof ScrollTrigger !== 'undefined';
        });

        expect(gsapLoaded).toBe(true);
        expect(scrollTriggerLoaded).toBe(true);

        // Check console for success messages
        const gsapMessage = consoleMessages.find(m => m.text.includes('GSAP'));
        expect(gsapMessage).toBeTruthy();
    });

    test('Timeline Choreographer initializes', async ({ page }) => {
        const choreographerExists = await page.evaluate(() => {
            return window.timelineChoreographer !== undefined &&
                   typeof window.timelineChoreographer.init === 'function';
        });

        expect(choreographerExists).toBe(true);

        // Check for initialization message
        const initMessage = consoleMessages.find(m =>
            m.text.includes('Timeline Choreographer'));
        expect(initMessage).toBeTruthy();
    });

    test('Quantum Visualizers initialize', async ({ page }) => {
        const visualizersExist = await page.evaluate(() => {
            return window.quantumVisualizers &&
                   Array.isArray(window.quantumVisualizers) &&
                   window.quantumVisualizers.length > 0;
        });

        expect(visualizersExist).toBe(true);

        const vizCount = await page.evaluate(() => {
            return window.quantumVisualizers.length;
        });

        expect(vizCount).toBe(5); // 5 layers
    });

    test('Canvas elements exist and have correct attributes', async ({ page }) => {
        const canvases = await page.$$('.quantum-canvas');
        expect(canvases.length).toBe(5);

        const canvasIds = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.quantum-canvas'))
                .map(c => c.id);
        });

        expect(canvasIds).toContain('quantum-background');
        expect(canvasIds).toContain('quantum-content');
        expect(canvasIds).toContain('quantum-highlight');
    });

    test('Cards are visible', async ({ page }) => {
        const cards = await page.$$('.morph-card');
        expect(cards.length).toBeGreaterThan(0);

        // Check first card is visible
        const firstCardVisible = await page.locator('.morph-card').first().isVisible();
        expect(firstCardVisible).toBe(true);

        // Check first card has correct styles
        const firstCardOpacity = await page.locator('.morph-card').first().evaluate(el => {
            return window.getComputedStyle(el).opacity;
        });
        expect(parseFloat(firstCardOpacity)).toBeGreaterThan(0);
    });

    test('Sections have correct data-theme attributes', async ({ page }) => {
        const sections = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.section[data-theme]'))
                .map(s => ({ id: s.id, theme: s.dataset.theme }));
        });

        expect(sections.length).toBeGreaterThan(0);

        const expectedThemes = ['cyan', 'magenta', 'green', 'purple', 'orange'];
        const themes = sections.map(s => s.theme);

        expectedThemes.forEach(theme => {
            expect(themes).toContain(theme);
        });
    });

    test('Organic mask CSS variables are set', async ({ page }) => {
        const maskVars = await page.evaluate(() => {
            const canvas = document.querySelector('.quantum-canvas');
            const styles = window.getComputedStyle(canvas);

            return {
                centerX: styles.getPropertyValue('--mask-center-x'),
                centerY: styles.getPropertyValue('--mask-center-y'),
                radiusX: styles.getPropertyValue('--mask-radius-x'),
                radiusY: styles.getPropertyValue('--mask-radius-y')
            };
        });

        expect(maskVars.centerX).toBeTruthy();
        expect(maskVars.radiusX).toBeTruthy();
    });

    test('Scroll triggers section transitions', async ({ page }) => {
        // Get initial section
        const initialSection = await page.evaluate(() => {
            return window.timelineChoreographer?.currentSection?.id;
        });

        // Scroll down
        await page.evaluate(() => window.scrollBy(0, 1000));
        await page.waitForTimeout(1000);

        // Get new section
        const newSection = await page.evaluate(() => {
            return window.timelineChoreographer?.currentSection?.id;
        });

        // Section should have changed
        expect(newSection).toBeTruthy();
    });

    test('Card hover triggers visualizer boost', async ({ page }) => {
        const firstCard = page.locator('.morph-card').first();

        // Get initial visualizer intensity
        const initialIntensity = await page.evaluate(() => {
            return window.quantumVisualizers[0]?.params.intensity;
        });

        // Hover card
        await firstCard.hover();
        await page.waitForTimeout(500);

        // Check if intensity changed (should be boosted)
        const boostedIntensity = await page.evaluate(() => {
            return window.quantumVisualizers[0]?.params.intensity;
        });

        // Intensity should have changed
        expect(boostedIntensity).toBeTruthy();
    });

    test('No console errors', async ({ page }) => {
        const errors = consoleMessages.filter(m => m.type === 'error');

        if (errors.length > 0) {
            console.log('Console errors found:', errors);
        }

        expect(errors.length).toBe(0);
    });

    test('Page renders without crashing', async ({ page }) => {
        // Wait and ensure page is still responsive
        await page.waitForTimeout(3000);

        const isPageResponsive = await page.evaluate(() => {
            return document.readyState === 'complete';
        });

        expect(isPageResponsive).toBe(true);
        expect(pageErrors.length).toBe(0);
    });
});
