/**
 * Playwright analyzer for pin choreography
 * Handles CDN timeouts gracefully
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Starting Playwright Analysis...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  // Collect all console messages
  const consoleLogs = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleLogs.push({ type, text });

    if (type === 'error') {
      console.log(`  ❌ Console Error: ${text}`);
    } else if (text.includes('📌') || text.includes('✨') || text.includes('🚀')) {
      console.log(`  ${text}`);
    }
  });

  // Track page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
    console.log(`  💥 Page Error: ${error.message}`);
  });

  try {
    console.log('📄 Loading page (with 60s timeout for CDNs)...');

    await page.goto('http://localhost:8080/index.html', {
      waitUntil: 'domcontentloaded',  // Don't wait for all resources
      timeout: 60000
    });

    console.log('✅ Page loaded (DOM ready)\n');

    // Wait for GSAP and ScrollTrigger to load
    console.log('⏳ Waiting for libraries to load...');
    await page.waitForFunction(() => {
      return window.gsap && window.ScrollTrigger;
    }, { timeout: 15000 }).catch(() => {
      console.log('  ⚠️  GSAP/ScrollTrigger timeout - may not have loaded');
    });

    // Wait for app initialization
    console.log('⏳ Waiting for app initialization (5s)...');
    await page.waitForTimeout(5000);

    console.log('\n' + '='.repeat(70));
    console.log('📊 ANALYSIS RESULTS');
    console.log('='.repeat(70));

    // Test 1: Check library loading
    const libCheck = await page.evaluate(() => {
      return {
        gsap: typeof window.gsap !== 'undefined',
        scrollTrigger: typeof window.ScrollTrigger !== 'undefined',
        lenis: typeof window.Lenis !== 'undefined',
        lenisInstance: typeof window.lenis !== 'undefined',
        splitType: typeof window.SplitType !== 'undefined'
      };
    });

    console.log('\n1️⃣  LIBRARY STATUS:');
    console.log(`  GSAP: ${libCheck.gsap ? '✅' : '❌'}`);
    console.log(`  ScrollTrigger: ${libCheck.scrollTrigger ? '✅' : '❌'}`);
    console.log(`  Lenis (constructor): ${libCheck.lenis ? '✅' : '❌'}`);
    console.log(`  Lenis (instance): ${libCheck.lenisInstance ? '✅ Initialized' : '❌ NOT INITIALIZED'}`);
    console.log(`  SplitType: ${libCheck.splitType ? '✅' : '❌'}`);

    if (!libCheck.lenisInstance) {
      console.log('\n  🚨 CRITICAL: Lenis not initialized! Smooth scrolling WILL NOT WORK!');
    }

    // Test 2: Check engine initialization
    const engineCheck = await page.evaluate(() => {
      return {
        pinChoreography: typeof window.PIN_CHOREOGRAPHY !== 'undefined',
        morphEngine: typeof window.MORPH_ENGINE !== 'undefined',
        visualizers: typeof window.visualizers !== 'undefined'
      };
    });

    console.log('\n2️⃣  ENGINE STATUS:');
    console.log(`  PIN_CHOREOGRAPHY: ${engineCheck.pinChoreography ? '✅' : '❌'}`);
    console.log(`  MORPH_ENGINE: ${engineCheck.morphEngine ? '✅' : '❌'}`);
    console.log(`  Visualizers: ${engineCheck.visualizers ? '✅' : '❌'}`);

    // Test 3: Check DOM elements
    const domCheck = await page.evaluate(() => {
      return {
        hero: !!document.querySelector('.hero'),
        heroTitle: !!document.querySelector('.hero__title'),
        heroSubtitle: !!document.querySelector('.hero__subtitle'),
        narrative: !!document.querySelector('.narrative'),
        narrativeItems: document.querySelectorAll('.narrative__item').length,
        immersion: !!document.querySelector('.immersion'),
        immersionCards: document.querySelectorAll('.immersion-card').length,
        orchestra: !!document.querySelector('.orchestra'),
        scrollCards: document.querySelectorAll('.scroll-card').length,
        capstone: !!document.querySelector('.capstone'),
        footer: !!document.querySelector('.site-footer')
      };
    });

    console.log('\n3️⃣  DOM ELEMENTS:');
    console.log(`  Hero section: ${domCheck.hero ? '✅' : '❌'}`);
    console.log(`    - Title: ${domCheck.heroTitle ? '✅' : '❌ MISSING'}`);
    console.log(`    - Subtitle: ${domCheck.heroSubtitle ? '✅' : '❌ MISSING'}`);
    console.log(`  Narrative: ${domCheck.narrative ? '✅' : '❌'} (${domCheck.narrativeItems} items)`);
    console.log(`  Immersion: ${domCheck.immersion ? '✅' : '❌'} (${domCheck.immersionCards} cards)`);
    console.log(`  Orchestra: ${domCheck.orchestra ? '✅' : '❌'} (${domCheck.scrollCards} scroll-cards)`);
    console.log(`  Capstone: ${domCheck.capstone ? '✅' : '❌'}`);
    console.log(`  Footer: ${domCheck.footer ? '✅' : '❌'}`);

    if (domCheck.scrollCards === 0) {
      console.log('\n  🚨 CRITICAL: No scroll-cards found! Orchestra pins WILL NOT WORK!');
    }

    // Test 4: ScrollTrigger instances
    const triggerData = await page.evaluate(() => {
      if (!window.ScrollTrigger) return null;

      const triggers = window.ScrollTrigger.getAll();
      return {
        total: triggers.length,
        instances: triggers.map((t) => ({
          isPinned: !!t.vars.pin,
          pinSpacing: t.vars.pinSpacing,
          anticipatePin: t.vars.anticipatePin,
          trigger: t.vars.trigger?.id || t.vars.trigger?.className || 'unknown'
        }))
      };
    });

    console.log('\n4️⃣  SCROLLTRIGGER INSTANCES:');
    if (triggerData) {
      console.log(`  Total: ${triggerData.total}`);

      const pinned = triggerData.instances.filter(t => t.isPinned);
      const withSpacing = pinned.filter(t => t.pinSpacing !== false);
      const withAnticipate = pinned.filter(t => t.anticipatePin);

      console.log(`  Pinned: ${pinned.length}/${triggerData.total}`);
      console.log(`  With pinSpacing ≠ false: ${withSpacing.length}/${pinned.length} ${withSpacing.length === pinned.length ? '✅' : '❌'}`);
      console.log(`  With anticipatePin: ${withAnticipate.length}/${pinned.length} ${withAnticipate.length === pinned.length ? '✅' : '⚠️'}`);

      if (pinned.length > 0) {
        console.log('\n  📋 Pinned Instances:');
        pinned.forEach((t, i) => {
          const spacingOk = t.pinSpacing !== false ? '✅' : '❌';
          console.log(`    ${i + 1}. ${t.trigger.substring(0, 40)}`);
          console.log(`       pinSpacing: ${t.pinSpacing} ${spacingOk}`);
        });
      }

      if (pinned.length === 0) {
        console.log('\n  🚨 CRITICAL: No pinned instances! Pins are NOT being created!');
      }
    } else {
      console.log('  ❌ ScrollTrigger not available');
    }

    // Test 5: SplitType text splitting
    const splitCheck = await page.evaluate(() => {
      const heroTitle = document.querySelector('.hero__title');
      return {
        heroTitleExists: !!heroTitle,
        hasChars: heroTitle ? heroTitle.querySelectorAll('.char').length > 0 : false,
        charCount: heroTitle ? heroTitle.querySelectorAll('.char').length : 0
      };
    });

    console.log('\n5️⃣  SPLITTYPE TEXT SPLITTING:');
    if (splitCheck.heroTitleExists) {
      if (splitCheck.hasChars) {
        console.log(`  ✅ Hero title split into ${splitCheck.charCount} chars`);
      } else {
        console.log(`  ❌ Hero title NOT split (character animations WILL NOT WORK)`);
        console.log(`     Expected: .char elements inside .hero__title`);
        console.log(`     Found: 0 .char elements`);
      }
    } else {
      console.log(`  ❌ Hero title element not found`);
    }

    // Test 6: Visualizer check
    const vizCheck = await page.evaluate(() => {
      if (!window.visualizers) return null;
      return {
        hasPrimary: !!window.visualizers.primary,
        hasUpdateForStage: typeof window.visualizers.updateForStage === 'function',
        primaryTargets: window.visualizers.primary ? {
          gridDensity: window.visualizers.primary.targets?.gridDensity,
          speed: window.visualizers.primary.targets?.speed,
          intensity: window.visualizers.primary.targets?.intensity
        } : null
      };
    });

    console.log('\n6️⃣  VISUALIZER:');
    if (vizCheck) {
      console.log(`  Primary: ${vizCheck.hasPrimary ? '✅' : '❌'}`);
      console.log(`  updateForStage(): ${vizCheck.hasUpdateForStage ? '✅' : '❌ METHOD MISSING'}`);
      if (vizCheck.primaryTargets) {
        console.log(`  Current params:`,vizCheck.primaryTargets);
      }
    } else {
      console.log(`  ❌ window.visualizers not found`);
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('🎯 CRITICAL ISSUES DETECTED:');
    console.log('='.repeat(70));

    const issues = [];
    if (!libCheck.lenisInstance) issues.push('❌ Lenis not initialized (no smooth scrolling)');
    if (domCheck.scrollCards === 0) issues.push('❌ No scroll-cards found (orchestra pins broken)');
    if (!splitCheck.hasChars) issues.push('❌ SplitType not applied (character animations broken)');
    if (triggerData && triggerData.instances.filter(t => t.isPinned).length === 0) {
      issues.push('❌ No ScrollTrigger pins created');
    }
    if (vizCheck && !vizCheck.hasUpdateForStage) {
      issues.push('❌ Visualizer missing updateForStage() method');
    }

    if (issues.length > 0) {
      issues.forEach(issue => console.log(`  ${issue}`));
    } else {
      console.log('  ✅ No critical issues detected!');
    }

    // Console log summary
    console.log('\n📝 Console Log Summary:');
    console.log(`  Total logs: ${consoleLogs.length}`);
    console.log(`  Errors: ${consoleLogs.filter(l => l.type === 'error').length}`);
    if (pageErrors.length > 0) {
      console.log(`  Page errors: ${pageErrors.length}`);
    }

  } catch (error) {
    console.error('\n❌ Analysis failed:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ Analysis complete\n');
  }
})();
