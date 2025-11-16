#!/bin/bash

echo "🔍 FINAL COMPREHENSIVE CHECK - PASS 2"
echo "======================================"
echo ""

# Check 1: Server running
echo "1️⃣  Checking web server..."
if lsof -ti:8000 > /dev/null; then
    echo "   ✅ Web server running on port 8000"
else
    echo "   ❌ Web server NOT running"
    exit 1
fi

# Check 2: Page loads
echo ""
echo "2️⃣  Checking page loads..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/index.html | grep -q "200"; then
    echo "   ✅ Page returns HTTP 200"
else
    echo "   ❌ Page failed to load"
    exit 1
fi

# Check 3: GSAP files accessible
echo ""
echo "3️⃣  Checking GSAP files..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/lib/gsap.min.js | grep -q "200"; then
    echo "   ✅ GSAP file accessible"
else
    echo "   ❌ GSAP file not found"
    exit 1
fi

if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/lib/ScrollTrigger.min.js | grep -q "200"; then
    echo "   ✅ ScrollTrigger file accessible"
else
    echo "   ❌ ScrollTrigger file not found"
    exit 1
fi

# Check 4: Key HTML elements present
echo ""
echo "4️⃣  Checking key HTML elements..."
PAGE_CONTENT=$(curl -s http://localhost:8000/index.html)

if echo "$PAGE_CONTENT" | grep -q "class TimelineChoreographer"; then
    echo "   ✅ TimelineChoreographer class present"
else
    echo "   ❌ TimelineChoreographer class missing"
    exit 1
fi

if echo "$PAGE_CONTENT" | grep -q "quantum-canvas"; then
    echo "   ✅ Quantum canvas elements present"
else
    echo "   ❌ Quantum canvas elements missing"
    exit 1
fi

if echo "$PAGE_CONTENT" | grep -q "morph-card"; then
    echo "   ✅ Morph card elements present"
else
    echo "   ❌ Morph card elements missing"
    exit 1
fi

# Check 5: No broken @keyframes
echo ""
echo "5️⃣  Checking for broken CSS animations..."
if echo "$PAGE_CONTENT" | grep -q "@keyframes organic-breathing"; then
    echo "   ⚠️  WARNING: Found @keyframes organic-breathing (should be removed)"
else
    echo "   ✅ No broken @keyframes found"
fi

# Check 6: GSAP breathing setup present
echo ""
echo "6️⃣  Checking GSAP breathing animation..."
if echo "$PAGE_CONTENT" | grep -q "setupMaskMorphing"; then
    echo "   ✅ setupMaskMorphing function present"
else
    echo "   ❌ setupMaskMorphing function missing"
    exit 1
fi

if echo "$PAGE_CONTENT" | grep -q "getComputedStyle.*--mask-radius"; then
    echo "   ✅ Uses getComputedStyle for CSS vars"
else
    echo "   ⚠️  WARNING: May not be reading CSS vars correctly"
fi

# Check 7: All sections present
echo ""
echo "7️⃣  Checking sections..."
SECTIONS=("hero" "overview" "stats" "architecture" "use-cases" "integrations" "cta")
for section in "${SECTIONS[@]}"; do
    if echo "$PAGE_CONTENT" | grep -q "id=\"$section\""; then
        echo "   ✅ Section: $section"
    else
        echo "   ❌ Missing section: $section"
        exit 1
    fi
done

echo ""
echo "======================================"
echo "✅ ALL CHECKS PASSED!"
echo "======================================"
echo ""
echo "You can test the page at:"
echo "  • Main: http://localhost:8000/index.html"
echo "  • Debug: http://localhost:8000/test-live-debug.html"
echo "  • Cards: http://localhost:8000/test-cards.html"
echo "  • Masks: http://localhost:8000/test-organic-masks.html"
echo ""
