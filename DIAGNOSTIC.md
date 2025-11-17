# DIAGNOSTIC: What's Actually Deployed vs What Should Be There

## Current Deployed Version
Branch: `claude/enhance-card-interactions-013e1jiMsh4VmyqVpZg3AKd1`
URL: https://domusgpt.github.io/minoots-web-catalog/chill-claude_consolidate-prs-015HJ5q5t18aRMkU3XE41yTP/index.html

## Systems Currently Loaded (Per WebFetch):
1. ✅ Lenis smooth scrolling
2. ✅ setupImmersionReactivity
3. ✅ setupScrollDirector
4. ✅ AnimationOrchestrator
5. ✅ MorphChoreography (circle → expanded → background for .scroll-card)
6. ✅ PinChoreography (hero, narrative, immersion, capstone, footer pins)
7. ✅ MorphEngine (text morphing, hover effects)
8. ✅ setupCardReactivity

## Main Branch Has (Per Git):
1. ❌ NO Lenis
2. ✅ setupImmersionReactivity
3. ❌ NO setupScrollDirector
4. ✅ AnimationOrchestrator
5. ✅ MorphChoreography
6. ❌ NO PinChoreography
7. ❌ NO MorphEngine
8. ✅ setupCardReactivity

## Potential Conflicts

### Issue 1: PinChoreography.refresh() After MorphChoreography
- MorphChoreography creates ScrollTriggers for .scroll-card morphing
- PinChoreography runs AFTER and calls `ScrollTrigger.refresh()`
- This refresh could invalidate MorphChoreography's triggers

### Issue 2: Massive pinSpacing Inflation
- Hero: +150vh spacing
- Narrative: +300vh spacing (3 cards × 100vh)
- Immersion: +450vh spacing (3 cards × 150vh)
- Capstone: +150vh spacing
- Footer: +120vh spacing
- **TOTAL: +1170vh of added space**

This could make orchestra cards (which need natural scroll) scroll way too fast or have broken calculations.

### Issue 3: setupScrollDirector Expectations
- setupScrollDirector calculates progress with `(center - rect.top) / rect.height`
- Expects cards to scroll through viewport naturally
- Massive pinSpacing before orchestra section could break rect calculations

### Issue 4: Multiple Systems Updating Visualizers
- setupScrollDirector updates visualizers per stage
- PinChoreography updates visualizers during pins
- MorphChoreography updates visualizers during morph
- MorphEngine updates visualizers on hover
- **Potential race condition - who wins?**

## Questions for User:

1. **What specifically is "boring"?**
   - Cards not morphing circle → expanded?
   - Visualizers not changing colors/density?
   - No hover effects?
   - Everything just scrolling linearly?

2. **What "effects and nuances" are missing?**
   - Specific visual transitions?
   - Timing/pacing issues?
   - Interactive elements not responding?

3. **Compare to which version?**
   - Main branch (has LESS features)?
   - A different branch/build from the catalog?
   - An earlier commit on this branch?

## Hypothesis:

The user likely wants me to compare to **86c5886** (the original catalog commit before I added anything) or another build in the catalog that has MORE visual polish than what I have now.

Let me check what 86c5886 had.
