# COMPLETE SCROLL CHOREOGRAPHY PLAN

## Philosophy
Every single scroll tick is choreographed. Nothing disabled. Everything works together with intentional pacing and rhythm.

## SITE STRUCTURE & RHYTHM

### ACT 1: ARRIVAL (Hero)
**0-200vh**: Cinematic entrance
- 0-50vh: Title fades in with blur
- 50-100vh: Pin hero, character wave animation
- 100-150vh: Visualizer zooms in (density 40→20)
- 150-200vh: Unpin, transition to narrative

### ACT 2: THE STORY (Narrative)
**200-500vh**: Three narrative cards
- Each card: 100vh total
  - 0-20vh: Card enters, pins
  - 20-70vh: Pinned, text morphs, visualizer shifts color
  - 70-100vh: Unpins, transitions to next

### ACT 3: IMMERSIVE MOMENTS (Immersion Gallery)
**500-900vh**: Three immersion cards
- Each card: 133vh
  - Card enters from bottom
  - Pins at center (50vh duration)
  - Background image parallaxes
  - Visualizer becomes atmospheric
  - Unpins smoothly

### ACT 4: THE SYSTEM DEEP DIVE (Orchestra - 9 Cards)
**900-4500vh**: Nine system cards with morphing
- Each card: 400vh
  - 0-60vh: Circle entrance (zoomed in, slow)
  - 60-140vh: Expanding to full card
  - 140-280vh: Expanded (4 stage progressions)
    - Each stage: 35vh, visualizer params shift
  - 280-360vh: Dissolving to background
  - 360-400vh: Fade out

**Visualizer ties to system identity:**
- Card 0 (Temporal Kernel): Blue hue (0.55), structured (low chaos)
- Card 1 (Registry Lattice): Purple hue (0.65), geometric
- Card 2 (Intent Canvas): Orange hue (0.1), organic (high morph)
- Card 3 (Execution Mesh): Cyan hue (0.5), flowing
- Card 4 (Observability Array): Green hue (0.35), detailed
- Card 5 (Compliance Scaffold): Red hue (0.0), rigid
- Card 6 (Context Fabric): Yellow hue (0.15), warm
- Card 7 (Integration Nexus): Magenta hue (0.8), energetic
- Card 8 (Security Perimeter): Dark blue (0.6), protective

### ACT 5: THE PROMISE (Capstone)
**4500-4700vh**: Release candidate
- 4500-4600vh: Pin, fade in copy
- 4600-4650vh: Pinned, subtle pulse
- 4650-4700vh: Unpin

### ACT 6: CLOSURE (Footer)
**4700-4850vh**: Contact & credits
- 4700-4800vh: Pin footer, zoom visualizer way out (density 50)
- 4800-4850vh: Slow fade, contemplative ending

## TOTAL SITE HEIGHT: ~4850vh

## VISUALIZER CHOREOGRAPHY

### Card Focus Centering
When card enters center (progress 0.35-0.65):
- Visualizer: Subtle pan toward card center
- Use CSS transform on canvas: translateX/Y based on card position
- Smooth transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1)

When unfocused (progress <0.35 or >0.65):
- Visualizer: Return to center
- Smooth transition back

### Section-Based Parameter Shifts

**Hero → Narrative:**
- Hue: 0.55 → 0.60 (subtle warm shift)
- Density: 20 → 25 (zoom out slightly)
- Speed: 0.4 → 0.6

**Narrative → Immersion:**
- Hue: 0.60 → 0.45 (cooler, atmospheric)
- Density: 25 → 18 (zoom back in)
- Speed: 0.6 → 0.3 (slow down)
- Blur: Add 1px for depth

**Immersion → Orchestra:**
- Hue: Per-card identity (see above)
- Density: Dynamic per card morph phase
- Geometry: Switch per system (dots, grid, web, etc.)
- Speed: Choreographed to morph phase

**Orchestra → Capstone:**
- Hue: 0.7 (purple, climactic)
- Density: 22 (balanced)
- Speed: 0.5 (moderate)
- Intensity: 0.6 (bright)

**Capstone → Footer:**
- Hue: 0.55 (return to beginning)
- Density: 50 (zoom FAR out)
- Speed: 0.2 (very slow, contemplative)
- Intensity: 0.3 (dim, peaceful)

## PIN DURATIONS (Tuned for Rhythm)

- Hero: 100vh (was 150vh - too long)
- Narrative cards: 50vh each (was 100vh - too long)
- Immersion cards: 50vh each (was 150vh - too long)
- Orchestra: NO PINS (morphing handles rhythm)
- Capstone: 50vh (was 150vh - too long)
- Footer: 60vh (was 120vh - too long)

**Total pin space: 310vh** (was 1170vh - WAY better!)

## SCROLL TICK RHYTHM

Every 10vh of scroll has intention:

**Hero (0-200vh):**
- 0-10vh: Fade in
- 10-20vh: Blur clear
- 20-30vh: Title appear
- 30-40vh: Subtitle appear
- 40-50vh: Pin engage
- 50-100vh: Pinned - character wave, color shift
- 100-110vh: Pin disengage start
- 110-200vh: Smooth exit to next

**Narrative Cards (200-500vh):**
- Pattern repeats 3x
- Each transition: 20vh
- Each pin: 50vh
- Each exit: 30vh

**Orchestra Cards (900-4500vh):**
- Circle: 0-60vh (contemplative)
- Expanding: 60-140vh (reveal)
- Expanded: 140-280vh (explore - 4 stages × 35vh)
- Dissolving: 280-360vh (recede)
- Fade: 360-400vh (transition)

## IMPLEMENTATION STRATEGY

1. **Re-enable PinChoreography** with SHORT durations
2. **Re-enable MorphEngine** for text effects
3. **Add visualizer centering** on card focus
4. **Section identity system**: Each section has color/param signature
5. **Smooth transitions** between sections
6. **Geometry switching**: Per system (dots, grid, triangles, etc.)
7. **Every 10vh planned** with intentional pacing

## NEXT STEPS

1. Update PinChoreography durations (100vh max)
2. Add visualizer centering logic
3. Create section identity map
4. Add geometry switching
5. Tune every transition for perfect rhythm
