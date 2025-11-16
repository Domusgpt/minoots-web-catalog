# 🎨 Visualizer System Redesign Plan

## Current State Analysis

### Issues Identified

1. **Playwright Tests Fail**
   - CDN resources (GSAP, ScrollTrigger) blocked with 403 errors
   - Page crashes in headless Chrome
   - Need to download GSAP locally or fix CDN access

2. **Canvas Morphing Attempts Crashed Browser**
   - Tried to animate `position: fixed` → `position: absolute` with left/top
   - Conflicting CSS transforms
   - Too many simultaneous animations

3. **Cards Not Working Well**
   - Need to verify: hover states, click interactions, expand/collapse
   - Need smooth transitions
   - Need proper z-index management

## The Vision

Based on user feedback, the visualizer system needs to:

### 1. **Organic, Fluid Borders** (Not Square)
- Use **radial gradients** with opacity falloff instead of hard borders
- CSS `mask-image` with radial gradients
- Smooth, breathing edges that morph
- Example:
  ```css
  .quantum-canvas {
    mask-image: radial-gradient(
      ellipse 80% 70% at 50% 50%,
      black 0%,
      black 60%,
      transparent 100%
    );
    animation: organic-breathing 8s ease-in-out infinite;
  }

  @keyframes organic-breathing {
    0%, 100% {
      mask-image: radial-gradient(
        ellipse 80% 70% at 50% 50%,
        black 0%, black 60%, transparent 100%
      );
    }
    50% {
      mask-image: radial-gradient(
        ellipse 90% 85% at 45% 55%,
        black 0%, black 70%, transparent 100%
      );
    }
  }
  ```

### 2. **Negative Space Design System**
- Visualizers and cards **evolve together**
- Visualizer fills the "negative space" around cards
- When card grows → visualizer morphs to fill new negative space
- When card shrinks → visualizer expands back

Approach:
```css
/* Card takes space */
.morph-card {
  position: relative;
  clip-path: polygon(...); /* Custom shape */
}

/* Visualizer fills negative space */
.quantum-layers {
  /* Multiple radial masks to "cut out" card shapes */
  mask-image:
    radial-gradient(at card1-position, transparent 0%, transparent 40%, black 60%),
    radial-gradient(at card2-position, transparent 0%, transparent 40%, black 60%),
    linear-gradient(black, black);
  mask-composite: exclude;
}
```

### 3. **Emergent, Cohesive, Elegant**
- Cards and visualizers are **one system**, not separate layers
- Smooth, continuous morphing
- No jarring transitions
- Everything feels intentional and interconnected

---

## Implementation Plan

### Phase 1: Fix the Cards (PRIORITY)

Before touching visualizers, make cards work perfectly:

#### 1.1 Download GSAP Locally
```bash
# Download GSAP
curl -o gsap.min.js https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js
curl -o ScrollTrigger.min.js https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js

# Update index.html
<script src="./gsap.min.js"></script>
<script src="./ScrollTrigger.min.js"></script>
```

#### 1.2 Verify Card Behaviors
- **Hover**: 3D tilt, subtle glow
- **Click**: Expand to modal OR trigger action
- **Expand**: Smooth transition to full-screen
- **Collapse**: Return to original position
- **Scroll**: Reveal/hide based on viewport

#### 1.3 Fix Card Z-Index Stack
```
z-index: 0    - Visualizers (background)
z-index: 10   - Cards (content)
z-index: 999  - Overlay (when card expanded)
z-index: 1000 - Expanded card (modal)
```

#### 1.4 Playwright Tests for Cards
- All hover tests pass
- All click tests pass
- Expand/collapse works
- No crashes

---

### Phase 2: Organic Canvas Morphing

Once cards work, redesign visualizer canvas morphing:

#### 2.1 Radial Gradient Masks
```css
.quantum-layers {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.quantum-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  /* Organic mask with soft edges */
  mask-image: radial-gradient(
    ellipse 85% 80% at 50% 50%,
    black 0%,
    black 50%,
    rgba(0,0,0,0.7) 70%,
    transparent 100%
  );
  /* Animate mask for breathing effect */
  animation: organic-mask-morph 12s ease-in-out infinite;
}

@keyframes organic-mask-morph {
  0%, 100% {
    mask-image: radial-gradient(
      ellipse 85% 80% at 50% 50%,
      black 0%, black 50%, rgba(0,0,0,0.7) 70%, transparent 100%
    );
  }
  25% {
    mask-image: radial-gradient(
      ellipse 90% 75% at 48% 52%,
      black 0%, black 55%, rgba(0,0,0,0.6) 75%, transparent 100%
    );
  }
  50% {
    mask-image: radial-gradient(
      ellipse 80% 85% at 52% 48%,
      black 0%, black 52%, rgba(0,0,0,0.65) 72%, transparent 100%
    );
  }
  75% {
    mask-image: radial-gradient(
      ellipse 88% 78% at 50% 51%,
      black 0%, black 53%, rgba(0,0,0,0.68) 73%, transparent 100%
    );
  }
}
```

#### 2.2 Contract Into Card (Morphing Approach)
Instead of moving the canvas, morph the mask to match card shape:

```javascript
class OrganicCanvasMorpher {
  contractIntoCard(card, duration = 1.5) {
    const cardRect = card.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate percentage positions
    const centerX = ((cardRect.left + cardRect.width / 2) / viewportWidth) * 100;
    const centerY = ((cardRect.top + cardRect.height / 2) / viewportHeight) * 100;
    const radiusX = (cardRect.width / viewportWidth) * 50; // percentage
    const radiusY = (cardRect.height / viewportHeight) * 50;

    // Morph mask to card location
    gsap.to(this.canvases, {
      '--mask-center-x': `${centerX}%`,
      '--mask-center-y': `${centerY}%`,
      '--mask-radius-x': `${radiusX}%`,
      '--mask-radius-y': `${radiusY}%`,
      duration,
      ease: 'power3.inOut'
    });
  }
}
```

CSS with custom properties:
```css
.quantum-canvas {
  --mask-center-x: 50%;
  --mask-center-y: 50%;
  --mask-radius-x: 85%;
  --mask-radius-y: 80%;

  mask-image: radial-gradient(
    ellipse var(--mask-radius-x) var(--mask-radius-y) at var(--mask-center-x) var(--mask-center-y),
    black 0%,
    black 60%,
    transparent 100%
  );
}
```

#### 2.3 Negative Space Choreography
Track card positions and create "cutouts":

```javascript
class NegativeSpaceChoreographer {
  updateCardPositions() {
    const cards = document.querySelectorAll('.morph-card');
    const cutouts = [];

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const centerX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const centerY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      const radiusX = (rect.width / window.innerWidth) * 60;
      const radiusY = (rect.height / window.innerHeight) * 60;

      cutouts.push(`radial-gradient(ellipse ${radiusX}% ${radiusY}% at ${centerX}% ${centerY}%, transparent 0%, transparent 50%, black 70%)`);
    });

    // Combine all cutouts with main gradient
    const maskImages = [
      ...cutouts,
      'linear-gradient(black, black)' // Base layer
    ];

    document.querySelector('.quantum-layers').style.maskImage = maskImages.join(', ');
    document.querySelector('.quantum-layers').style.maskComposite = 'exclude';
  }
}
```

---

### Phase 3: Integrated System

#### 3.1 Card + Visualizer Evolution
When card state changes, visualizer responds:

```javascript
class IntegratedSystem {
  onCardHover(card) {
    // Card: Subtle grow + glow
    gsap.to(card, {
      scale: 1.02,
      filter: 'brightness(1.1)',
      duration: 0.4
    });

    // Visualizer: Contract mask to reveal card more
    const morpher = new OrganicCanvasMorpher();
    morpher.expandCutoutAroundCard(card, 0.4);

    // Parameters: Speed up
    window.quantumVisualizers?.forEach(viz => {
      gsap.to(viz.params, {
        speed: viz.params.speed * 1.5,
        intensity: viz.params.intensity * 1.2,
        duration: 0.4
      });
    });
  }

  onCardClick(card) {
    // Card: Begin expand
    gsap.to(card, {
      scale: 1.05,
      duration: 0.3
    });

    // Visualizer: Intense glow around card
    const morpher = new OrganicCanvasMorpher();
    morpher.glowAroundCard(card, 0.6);

    // Parameters: Burst effect
    window.quantumVisualizers?.forEach(viz => {
      gsap.to(viz.params, {
        rot4dXW: '+=2',
        rot4dYW: '+=1.5',
        rot4dZW: '+=1.8',
        intensity: 1.0,
        duration: 0.3,
        ease: 'back.out(2)'
      });
    });
  }

  onScrollTransition() {
    // Smooth mask morphing based on visible cards
    const visibleCards = this.getVisibleCards();
    this.updateNegativeSpace(visibleCards);
  }
}
```

#### 3.2 Scroll-Based Morphing
```javascript
ScrollTrigger.create({
  trigger: section,
  start: 'top 80%',
  end: 'bottom 20%',
  onUpdate: (self) => {
    const progress = self.progress;

    // Morph mask based on scroll position
    const maskMorph = {
      radiusX: 85 + progress * 10,
      radiusY: 80 + progress * 15,
      centerX: 50 - progress * 5,
      centerY: 50 + progress * 3
    };

    canvases.forEach(canvas => {
      canvas.style.setProperty('--mask-radius-x', `${maskMorph.radiusX}%`);
      canvas.style.setProperty('--mask-radius-y', `${maskMorph.radiusY}%`);
      canvas.style.setProperty('--mask-center-x', `${maskMorph.centerX}%`);
      canvas.style.setProperty('--mask-center-y', `${maskMorph.centerY}%`);
    });
  }
});
```

---

## Testing Strategy

### Manual Testing Checklist
- [ ] Cards hover smoothly
- [ ] Cards click and expand properly
- [ ] Visualizers have organic edges (no hard squares)
- [ ] Negative space updates as cards move
- [ ] Scroll feels smooth and intentional
- [ ] No jarring transitions
- [ ] System feels cohesive

### Automated Testing (Playwright)
1. Fix CDN issues (download GSAP locally)
2. Card behavior tests
3. Scroll choreography tests
4. Minute scroll increment tests
5. Visual regression tests (screenshots)

---

## Timeline

### Immediate (Now)
1. Download GSAP locally
2. Fix cards - make them work perfectly
3. Run Playwright tests to verify

### Next (After Cards Work)
1. Implement organic mask system
2. Add radial gradient breathing animations
3. Test edge softness

### Then (Integration)
1. Negative space choreography
2. Card + visualizer evolution together
3. Scroll-based morphing
4. Final Playwright verification

### Finally (Polish)
1. Minute adjustments to timing curves
2. Color synchronization refinements
3. Performance optimization
4. Documentation

---

## Key Principles

1. **Cards First** - Nothing else matters if cards don't work
2. **Organic, Not Geometric** - Radial gradients, soft edges, breathing
3. **Negative Space** - Visualizers fill what cards don't occupy
4. **Emergent** - System behaviors arise from simple rules
5. **Cohesive** - Everything feels like one organism
6. **Elegant** - Smooth, intentional, beautiful

---

## Notes

- Avoid `position: absolute` morphing (causes crashes)
- Use CSS custom properties for animatable values
- Morph masks, not canvas positions
- Test in real browser first, then Playwright
- Minute scroll increments must be smooth
- Every transition should feel purposeful

---

_This is a living document. Update as implementation progresses._
