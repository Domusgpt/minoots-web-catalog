/**
 * CONSOLE TEST SCRIPT
 *
 * Copy and paste this into browser DevTools console after page loads
 * to verify ScrollTrigger pinning is working correctly
 */

console.log('🧪 Testing Pin Choreography System\n');
console.log('═'.repeat(50));

// Wait for everything to initialize
setTimeout(() => {
  console.log('\n📊 SCROLLTRIGGER INSTANCES:');
  console.log('─'.repeat(50));

  const triggers = window.ScrollTrigger.getAll();
  console.log(`Total instances: ${triggers.length}\n`);

  if (triggers.length === 0) {
    console.error('❌ No ScrollTrigger instances found!');
    console.log('Check for JavaScript errors in console');
    return;
  }

  triggers.forEach((trigger, i) => {
    const isPinned = trigger.vars.pin;
    const triggerEl = trigger.vars.trigger;
    const pinEl = trigger.vars.pin;
    const spacing = trigger.vars.pinSpacing;
    const anticipate = trigger.vars.anticipatePin;

    console.log(`\n${i + 1}. ${isPinned ? '📌 PINNED' : '🔓 NOT PINNED'}`);
    console.log(`   Trigger: ${triggerEl?.id || triggerEl?.className || 'unknown'}`);

    if (isPinned) {
      console.log(`   Pin Element: ${pinEl?.className || 'unknown'}`);
      console.log(`   pinSpacing: ${spacing !== false ? '✅ true' : '❌ false'}`);
      console.log(`   anticipatePin: ${anticipate || 'not set'}`);
    }

    console.log(`   Start: ${trigger.vars.start}`);
    console.log(`   End: ${trigger.vars.end}`);
  });

  // Check PIN_CHOREOGRAPHY global
  console.log('\n\n🎭 PIN CHOREOGRAPHY ENGINE:');
  console.log('─'.repeat(50));

  if (window.PIN_CHOREOGRAPHY) {
    console.log('✅ PIN_CHOREOGRAPHY initialized');
    console.log(`   Pinned elements tracked: ${window.PIN_CHOREOGRAPHY.pinnedElements.size}`);
    console.log(`   Transform stages tracked: ${window.PIN_CHOREOGRAPHY.transformStages.size}`);
  } else {
    console.error('❌ PIN_CHOREOGRAPHY not found on window');
  }

  // Check MORPH_ENGINE global
  console.log('\n🌀 MORPH ENGINE:');
  console.log('─'.repeat(50));

  if (window.MORPH_ENGINE) {
    console.log('✅ MORPH_ENGINE initialized');
  } else {
    console.error('❌ MORPH_ENGINE not found on window');
  }

  // Visual test instructions
  console.log('\n\n🎯 VISUAL TESTS TO PERFORM:');
  console.log('─'.repeat(50));
  console.log('1. Scroll down slowly');
  console.log('2. Hero section should LOCK IN CENTER');
  console.log('3. Title should transform while pinned (not move away)');
  console.log('4. Visualizer should change (density, color, speed)');
  console.log('5. Each narrative card should pin for ~100vh');
  console.log('6. Orchestra cards should pin for LONG duration (~350vh each)');
  console.log('7. Elements should have "breathing room" - not flying by');
  console.log('\n💡 Expected Behavior:');
  console.log('   - Element enters viewport');
  console.log('   - Element LOCKS in center');
  console.log('   - Scroll drives INTERNAL transformations (4-7 stages)');
  console.log('   - Element exits after transformations complete');

  console.log('\n═'.repeat(50));

  // Additional debugging helpers
  window.debugPin = (index) => {
    const trigger = triggers[index];
    if (!trigger) {
      console.error(`No trigger at index ${index}`);
      return;
    }
    console.log('Trigger details:', trigger);
    console.log('Vars:', trigger.vars);
    console.log('Progress:', trigger.progress);
  };

  console.log('\n🛠️  Debugging Helper Added:');
  console.log('   Type: debugPin(0) to inspect first trigger');
  console.log('   Type: debugPin(1) for second, etc.');

}, 2000); // Wait 2 seconds for everything to initialize
