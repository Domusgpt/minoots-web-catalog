# Advanced Morph Engine Documentation

## Overview

The Advanced Morph Engine creates a comprehensive, reactive animation system that transforms cards, text, and visualizers through scroll-driven choreography.

## Key Features

### 1. **Multi-Phase Card Morphing**

Cards transform through 7 distinct phases:

- **Dormant** (0-5%): Initial hidden state with 3D perspective
- **Circle** (5-12%): Formation from nothing into perfect circle (420px)
- **Expanding** (12-30%): Morphs from circle → rounded rectangle
- **Full** (30-55%): Fully expanded card with all content visible
- **Splitting** (55-70%): Card splits into pieces (8 different split modes)
- **Background** (70-85%): Card becomes full-screen background
- **Dissolved** (85-100%): Fades out with heavy blur

### 2. **Split Modes**

Each of the 9 system cards has a unique split behavior:

1. **Horizontal Split**: Top and bottom halves separate vertically
2. **Vertical Split**: Left and right halves separate horizontally
3. **Diagonal Split**: Splits along diagonal line
4. **Radial Split**: 8 segments explode from center
5. **Scatter Split**: 20 circular pieces scatter randomly
6. **Grid Split**: 4x4 grid of pieces
7. **Shatter Split**: 30 irregular shards with physics
8. **Shard Assembly**: Card assembles FROM shards (reverse)

### 3. **Layer Switching System**

Elements can dynamically switch roles:

- **Card** → **Background**: Card becomes fixed backdrop, visualizer comes forward
- **Card** → **Hybrid**: Visualizer shows through translucent card
- **Card** → **Visualizer Mask**: Card content masks the visualizer

### 4. **Visualizer Density Modulation**

**Understanding Density:**
- **Increase density** (28 → 52) = Grid ZOOMS OUT (recedes to background)
- **Decrease density** (28 → 18) = Grid ZOOMS IN (advances to foreground)

**Hover Behavior:**
- Card hover: Density +20 (visualizer recedes behind card)
- Card focus: Density +25-30 (visualizer zooms out, card comes forward)
- Footer: Density -10 (visualizer comes close, intimate feel)

### 5. **Speed Modulation**

Speed coordinates with focus states:

- **Normal**: 0.8 (default cruising speed)
- **Card Hover**: 0.24 (70% slowdown - slow motion effect)
- **Card Focus**: 0.15-0.2 (almost frozen)
- **Section Transition**: 1.2 (speeds up between sections)
- **Footer**: 0.25 (very slow, meditative)

### 6. **Text Morphing**

Text can:

- **Scatter & Reform**: Characters explode and reassemble
- **Wave Effect**: Rippling wave motion through characters
- **SplitType Integration**: Automatic word/char splitting for animations

### 7. **Hover-Focus Pipeline**

Every interactive element triggers visualizer responses:

**Card Hover:**
```javascript
gridDensity: +20 (zoom out)
speed: ×0.3 (slow down)
intensity: ×1.3 (brighten)
chaos: +0.08 (more movement)
```

**Button Hover:**
```javascript
intensity: +0.15
morph: +0.3
chaos: +0.05
```

**Text Hover:**
```javascript
rot4dXW: +0.2
rot4dYW: +0.15
(subtle 4D rotation)
```

**Badge Hover:**
```javascript
accentLift: +0.1 (accent visualizer)
gridDensity: +5
```

### 8. **Section Transitions**

Each major section has unique visualizer configuration:

**Hero:**
- Hue: 0.55 (cyan-blue)
- Density: 28 (neutral)
- Speed: 0.6 (calm)
- Chaos: 0.12 (minimal)

**Narrative:**
- Hue: 0.72 (purple)
- Density: 32
- Speed: 0.5 (mellow)
- Chaos: 0.15

**Immersion:**
- Hue: 0.62 (teal)
- Density: 38 (zoomed out)
- Speed: 0.8 (active)
- Chaos: 0.20

**Orchestra:**
- Hue: 0.18 (warm orange)
- Density: 42 (very zoomed out)
- Speed: 0.95 (fast)
- Chaos: 0.22 (energetic)

**Capstone:**
- Hue: 0.48 (green)
- Density: 30
- Speed: 0.7
- Chaos: 0.16

**Footer:**
- Density: 18 (most zoomed in)
- Speed: 0.25 (slowest)
- Intensity: 0.15 (dimmest)
- Saturation: 0.4 (most desaturated)

### 9. **Parallax with Visualizer**

Content parallax coordinates with visualizer parallax:

```javascript
layer[data-parallax="0.5"]: Moves at 50% scroll speed
visualizer.parallax: Updates to depth × progress × 2
```

### 10. **Unique Entry/Exit Animations**

**Hero Entry:**
- Title: Elastic scale + 3D rotation from bottom
- Subtitle: Fade up from below
- CTAs: Staggered pop-in with back easing

**Immersion Cards:**
- Spiral entry: Scale from 0.3 + 180° rotation

**Footer:**
- Gentle fade + float up over 2 seconds
- Visualizer transitions to most mellow state

## Visualizer Parameter Reference

| Parameter | Range | Default | Effect |
|-----------|-------|---------|--------|
| `gridDensity` | 12-85 | 28 | Grid zoom (↑=out, ↓=in) |
| `speed` | 0.05-2.5 | 0.8 | Animation speed |
| `intensity` | 0.1-1.2 | 0.35 | Brightness/visibility |
| `chaos` | 0.02-0.45 | 0.12 | Noise/distortion |
| `morph` | 0.3-2.5 | 1.05 | 4D morphing amplitude |
| `geometry` | 0.5-3.0 | 1.0 | UV scale factor |
| `hue` | 0-1 | 0.55 | Color (0=red, 0.33=green, 0.66=blue) |
| `saturation` | 0-1 | 0.75 | Color saturation |
| `parallax` | 0-2 | 0 | Mouse parallax strength |
| `rot4dXW` | any | 0 | 4D rotation X-W plane |
| `rot4dYW` | any | 0 | 4D rotation Y-W plane |
| `rot4dZW` | any | 0 | 4D rotation Z-W plane |

## Usage Examples

### Trigger Text Scatter

```javascript
const title = document.querySelector('.scroll-card__title');
window.MORPH_ENGINE.scatterText(title, () => {
  console.log('Text reformed!');
});
```

### Manual Layer Switch

```javascript
const card = document.querySelector('.scroll-card');
window.MORPH_ENGINE.triggerLayerSwitch(card, 'hybrid', 0);
```

### Trigger Wave Effect

```javascript
const heading = document.querySelector('h2');
window.MORPH_ENGINE.waveText(heading);
```

## Performance Considerations

- **Mobile**: Shard animations disabled, parallax simplified
- **Reduced Motion**: All complex animations disabled
- **will-change**: Applied to transforming elements
- **backface-visibility**: Hidden for better performance
- **Lerping**: Smooth transitions using requestAnimationFrame

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with WebGL)
- Mobile Safari: Optimized experience
- IE11: Not supported (WebGL 2 required)

## Debugging

Access the morph engine in console:

```javascript
// View morph states
window.MORPH_ENGINE.morphStates

// View layer stack
window.MORPH_ENGINE.layerStack

// View visualizer parameter ranges
window.MORPH_ENGINE.vizParams

// Manually update visualizer
window.MORPH_ENGINE.visualizers.updateForStage({
  gridDensity: 50,
  speed: 0.2,
  intensity: 0.6
})
```

## Architecture

```
MorphEngine
├── Card Morph System (7 phases × 9 cards)
│   ├── Unique morph patterns per card
│   ├── 8 different split modes
│   └── Scroll-driven progress tracking
│
├── Layer Switching (3 roles × dynamic composition)
│   ├── Card ↔ Background
│   ├── Card ↔ Hybrid
│   └── Card ↔ Visualizer Mask
│
├── Text Morphing (SplitType integration)
│   ├── Scatter & reform
│   ├── Wave effects
│   └── Character animations
│
├── Hover-Focus Pipeline (4 element types)
│   ├── Cards → Visualizer density +20
│   ├── Buttons → Visualizer intensity +0.15
│   ├── Text → 4D rotation offsets
│   └── Badges → Accent visualizer boost
│
├── Section Transitions (6 sections)
│   ├── Unique visualizer config per section
│   ├── Entry/exit effects
│   └── Smooth crossfades
│
├── Parallax Depth (coordinated with visualizer)
│   ├── Content layers at different speeds
│   └── Visualizer parallax sync
│
└── Unique Entry/Exits
    ├── Hero: Elastic + 3D rotation
    ├── Immersion: Spiral entry
    └── Footer: Float up + mellow state
```

## Future Enhancements

Potential additions:

1. **Audio Integration**: Sound effects for morphs
2. **Physics**: Real physics for shard animations
3. **WebGL Transitions**: Direct WebGL morph effects
4. **Touch Gestures**: Swipe-driven morphing
5. **Procedural Patterns**: Dynamic split pattern generation
6. **State Persistence**: Remember morph states across sessions
