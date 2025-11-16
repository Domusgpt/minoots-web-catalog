#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 COMPREHENSIVE VALIDATION TEST\n');

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');

let errors = [];
let warnings = [];

// Test 1: Check for required elements
console.log('1️⃣  Checking for required elements...');
const requiredElements = [
    'class TimelineChoreographer',
    'class QuantumVisualizer',
    'SECTION_VIZ_PRESETS',
    'window.timelineChoreographer',
    'quantum-background',
    'quantum-content',
    'morph-card'
];

requiredElements.forEach(elem => {
    if (!html.includes(elem)) {
        errors.push(`Missing required: ${elem}`);
    } else {
        console.log(`   ✓ Found: ${elem}`);
    }
});

// Test 2: Check for common syntax issues
console.log('\n2️⃣  Checking for syntax issues...');

// Check for unmatched braces in script tags
const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
if (scriptMatches) {
    scriptMatches.forEach((script, index) => {
        const openBraces = (script.match(/\{/g) || []).length;
        const closeBraces = (script.match(/\}/g) || []).length;

        if (openBraces !== closeBraces) {
            warnings.push(`Script block ${index + 1}: Unmatched braces (${openBraces} open, ${closeBraces} close)`);
        }
    });
}

// Test 3: Check for required GSAP files
console.log('\n3️⃣  Checking for GSAP files...');
const gsapPath = path.join(__dirname, 'lib/gsap.min.js');
const scrollTriggerPath = path.join(__dirname, 'lib/ScrollTrigger.min.js');

if (fs.existsSync(gsapPath)) {
    console.log('   ✓ GSAP file exists');
} else {
    errors.push('Missing lib/gsap.min.js');
}

if (fs.existsSync(scrollTriggerPath)) {
    console.log('   ✓ ScrollTrigger file exists');
} else {
    errors.push('Missing lib/ScrollTrigger.min.js');
}

// Test 4: Check sections
console.log('\n4️⃣  Checking sections...');
const sections = [
    'id="hero"',
    'id="overview"',
    'id="stats"',
    'id="architecture"',
    'id="use-cases"',
    'id="integrations"',
    'id="cta"'
];

sections.forEach(section => {
    if (html.includes(section)) {
        console.log(`   ✓ Found section: ${section}`);
    } else {
        warnings.push(`Missing section: ${section}`);
    }
});

// Test 5: Check for CSS custom properties
console.log('\n5️⃣  Checking CSS custom properties...');
const cssVars = [
    '--mask-center-x',
    '--mask-center-y',
    '--mask-radius-x',
    '--mask-radius-y',
    '--mask-feather-start'
];

cssVars.forEach(cssVar => {
    if (html.includes(cssVar)) {
        console.log(`   ✓ Found CSS var: ${cssVar}`);
    } else {
        warnings.push(`Missing CSS var: ${cssVar}`);
    }
});

// Test 6: Check for function definitions
console.log('\n6️⃣  Checking function definitions...');
const functions = [
    'initEpicIntro',
    'initCenterLockChoreography',
    'initScrollAnimations',
    'initExpandableCards',
    'initScrollProgress',
    'initInteractiveStates'
];

functions.forEach(func => {
    if (html.includes(`function ${func}`) || html.includes(`${func}()`)) {
        console.log(`   ✓ Found function: ${func}`);
    } else {
        errors.push(`Missing function: ${func}`);
    }
});

// Results
console.log('\n' + '='.repeat(50));
console.log('📊 VALIDATION RESULTS\n');

if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ ALL TESTS PASSED!');
} else {
    if (errors.length > 0) {
        console.log(`❌ ERRORS (${errors.length}):`);
        errors.forEach(err => console.log(`   • ${err}`));
    }

    if (warnings.length > 0) {
        console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
        warnings.forEach(warn => console.log(`   • ${warn}`));
    }
}

console.log('\n' + '='.repeat(50));

process.exit(errors.length > 0 ? 1 : 0);
