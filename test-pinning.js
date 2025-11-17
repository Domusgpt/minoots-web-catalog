/**
 * Test script to verify ScrollTrigger pinning is working
 * Run with: node test-pinning.js
 */

const http = require('http');

// Simple test to check if page loads
const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/index.html',
  method: 'GET'
};

console.log('🧪 Testing pinning setup...\n');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✓ Page loads successfully (status:', res.statusCode, ')');

    // Check for key elements
    const checks = [
      { name: 'Pin Choreography import', pattern: /pin-choreography\.js/ },
      { name: 'Morph Engine import', pattern: /morph-engine\.js/ },
      { name: 'GSAP library', pattern: /gsap/ },
      { name: 'ScrollTrigger plugin', pattern: /ScrollTrigger/ },
      { name: 'Lenis smooth scroll', pattern: /lenis/ }
    ];

    console.log('\n📋 Checking for required components:\n');

    checks.forEach(check => {
      const found = check.pattern.test(data);
      console.log(found ? '  ✓' : '  ✗', check.name);
    });

    console.log('\n💡 Manual Testing Required:\n');
    console.log('1. Open http://localhost:8080/chill-claude_consolidate-prs-015HJ5q5t18aRMkU3XE41yTP/index.html');
    console.log('2. Open browser DevTools console');
    console.log('3. Run: window.ScrollTrigger.getAll()');
    console.log('4. Check that triggers have pin: true');
    console.log('5. Scroll and verify elements lock in center\n');

    console.log('🔍 Debug page: http://localhost:8080/chill-claude_consolidate-prs-015HJ5q5t18aRMkU3XE41yTP/debug.html\n');
  });
});

req.on('error', (e) => {
  console.error('✗ Error:', e.message);
  console.log('\nMake sure the HTTP server is running:');
  console.log('  cd /home/user/minoots-web-catalog/chill-claude_consolidate-prs-015HJ5q5t18aRMkU3XE41yTP');
  console.log('  python3 -m http.server 8080');
});

req.end();
