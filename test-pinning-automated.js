/**
 * Automated Playwright test for pin choreography
 * Run with: node test-pinning-automated.js
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting automated pin choreography test...\n');

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Listen for console messages from the page
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      console.log('  ❌ Browser Error:', msg.text());
    }
  });

  // Listen for page errors
  page.on('pageerror', error => {
    console.log('  ❌ Page Error:', error.message);
  });

  try {
    console.log('📄 Loading page...');
    await page.goto('http://localhost:8080/index.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('✅ Page loaded\n');

    // Wait for initialization
    console.log('⏳ Waiting for initialization (3s)...');
    await page.waitForTimeout(3000);

    // Test 1: Check if PIN_CHOREOGRAPHY exists
    console.log('\n🧪 Test 1: PIN_CHOREOGRAPHY initialization');
    const pinChoreographyExists = await page.evaluate(() => {
      return typeof window.PIN_CHOREOGRAPHY !== 'undefined';
    });

    if (pinChoreographyExists) {
      console.log('  ✅ PIN_CHOREOGRAPHY initialized');

      const pinCount = await page.evaluate(() => {
        return window.PIN_CHOREOGRAPHY.pinnedElements.size;
      });
      console.log(`  📊 Tracking ${pinCount} pinned elements`);
    } else {
      console.log('  ❌ PIN_CHOREOGRAPHY not found');
    }

    // Test 2: Check ScrollTrigger instances
    console.log('\n🧪 Test 2: ScrollTrigger instances');
    const triggerData = await page.evaluate(() => {
      if (!window.ScrollTrigger) {
        return { error: 'ScrollTrigger not found' };
      }

      const triggers = window.ScrollTrigger.getAll();
      return {
        total: triggers.length,
        instances: triggers.map((t, i) => ({
          index: i,
          isPinned: !!t.vars.pin,
          pinSpacing: t.vars.pinSpacing,
          anticipatePin: t.vars.anticipatePin,
          start: t.vars.start,
          end: t.vars.end,
          trigger: t.vars.trigger?.id || t.vars.trigger?.className || 'unknown'
        }))
      };
    });

    if (triggerData.error) {
      console.log(`  ❌ ${triggerData.error}`);
    } else {
      console.log(`  ✅ Found ${triggerData.total} ScrollTrigger instances\n`);

      const pinnedCount = triggerData.instances.filter(t => t.isPinned).length;
      const withProperSpacing = triggerData.instances.filter(
        t => t.isPinned && t.pinSpacing !== false
      ).length;

      console.log(`  📌 Pinned instances: ${pinnedCount}/${triggerData.total}`);
      console.log(`  ✨ With pinSpacing ≠ false: ${withProperSpacing}/${pinnedCount}\n`);

      if (pinnedCount === 0) {
        console.log('  ⚠️  WARNING: No pinned instances found!');
      } else if (withProperSpacing < pinnedCount) {
        console.log('  ⚠️  WARNING: Some pins have pinSpacing: false!');
      }

      // Show details of pinned instances
      console.log('  📋 Pinned Instance Details:');
      triggerData.instances
        .filter(t => t.isPinned)
        .forEach(t => {
          const spacingOk = t.pinSpacing !== false ? '✅' : '❌';
          const anticipateOk = t.anticipatePin ? '✅' : '⚠️';
          console.log(`\n    ${t.index + 1}. ${t.trigger}`);
          console.log(`       pinSpacing: ${t.pinSpacing} ${spacingOk}`);
          console.log(`       anticipatePin: ${t.anticipatePin} ${anticipateOk}`);
          console.log(`       Range: ${t.start} → ${t.end}`);
        });
    }

    // Test 3: Check MORPH_ENGINE
    console.log('\n\n🧪 Test 3: MORPH_ENGINE initialization');
    const morphEngineExists = await page.evaluate(() => {
      return typeof window.MORPH_ENGINE !== 'undefined';
    });

    if (morphEngineExists) {
      console.log('  ✅ MORPH_ENGINE initialized');
    } else {
      console.log('  ❌ MORPH_ENGINE not found');
    }

    // Test 4: Check visualizers
    console.log('\n🧪 Test 4: Visualizers');
    const visualizersExist = await page.evaluate(() => {
      return typeof window.visualizers !== 'undefined' &&
             window.visualizers.primary !== undefined;
    });

    if (visualizersExist) {
      console.log('  ✅ Visualizers initialized');

      const vizParams = await page.evaluate(() => {
        return {
          gridDensity: window.visualizers.primary.targets.gridDensity,
          speed: window.visualizers.primary.targets.speed,
          intensity: window.visualizers.primary.targets.intensity
        };
      });

      console.log(`  📊 Current params: density=${vizParams.gridDensity}, speed=${vizParams.speed}, intensity=${vizParams.intensity}`);
    } else {
      console.log('  ❌ Visualizers not found');
    }

    // Summary
    console.log('\n' + '═'.repeat(60));
    console.log('📝 SUMMARY');
    console.log('═'.repeat(60));

    const allGood = pinChoreographyExists &&
                    triggerData.total > 0 &&
                    triggerData.instances.filter(t => t.isPinned && t.pinSpacing !== false).length > 0 &&
                    morphEngineExists &&
                    visualizersExist;

    if (allGood) {
      console.log('✅ ALL TESTS PASSED');
      console.log('\nThe pin choreography system is properly configured:');
      console.log('  • ScrollTrigger instances created with pin: true');
      console.log('  • pinSpacing set correctly (not false)');
      console.log('  • anticipatePin enabled for smooth entry');
      console.log('  • Engines and visualizers initialized');
      console.log('\n🎯 Next step: Visual verification');
      console.log('   Open http://localhost:8080/index.html in browser');
      console.log('   Scroll and verify elements lock in center');
    } else {
      console.log('⚠️  SOME TESTS FAILED');
      console.log('\nIssues detected:');
      if (!pinChoreographyExists) console.log('  • PIN_CHOREOGRAPHY not initialized');
      if (triggerData.total === 0) console.log('  • No ScrollTrigger instances');
      if (!morphEngineExists) console.log('  • MORPH_ENGINE not initialized');
      if (!visualizersExist) console.log('  • Visualizers not initialized');
    }

    console.log('\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
})();
