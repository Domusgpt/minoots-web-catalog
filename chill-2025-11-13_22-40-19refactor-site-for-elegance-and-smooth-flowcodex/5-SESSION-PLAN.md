# MINOOTS Redesign: 5-Session Implementation Plan
## Based on VIB3+ System Research

---

## SESSION 1: Canvas Lifecycle + 4 Visualizer System Classes
**Duration:** 3-4 hours
**Goal:** Implement proper canvas management with 4 visualizer types

### 1.1 CanvasLifecycleManager
```javascript
class CanvasLifecycleManager {
    constructor() {
        this.maxActive = 2;  // Browser constraint
        this.activeVisualizers = new Map();
        this.canvasPool = {
            primary: 'viz-primary',
            secondary: 'viz-secondary'
        };
    }

    // Smart initialization: reuse if same type, destroy if different
    async initializeVisualizer(type, canvasId, params) {
        const existing = this.activeVisualizers.get(canvasId);

        if (existing && existing.type === type) {
            // Same type - just update parameters
            existing.updateParameters(params);
            return existing;
        }

        // Different type or new - destroy old
        if (existing) {
            await this.destroy(canvasId);
        }

        // Create new
        const VisualizerClass = this.getVisualizerClass(type);
        const viz = new VisualizerClass(canvasId);
        viz.type = type;

        await viz.init();
        viz.updateParameters(params);
        viz.start();

        this.activeVisualizers.set(canvasId, viz);
        return viz;
    }

    async destroy(canvasId) {
        const viz = this.activeVisualizers.get(canvasId);
        if (!viz) return;

        // Stop render loop
        viz.stop();

        // Lose WebGL context (critical for memory)
        const loseContext = viz.gl?.getExtension('WEBGL_lose_context');
        if (loseContext) {
            loseContext.loseContext();
        }

        // Clear canvas
        viz.canvas.width = 0;
        viz.canvas.height = 0;

        // Cleanup
        viz.destroy();
        this.activeVisualizers.delete(canvasId);

        // Small delay for GPU cleanup
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    async transitionTo(cardIndex, params) {
        // Determine which visualizer this card needs
        const { type, params: vizParams } = this.getCardConfig(cardIndex);

        // Update primary visualizer
        await this.initializeVisualizer(type, 'viz-primary', {
            ...vizParams,
            ...params
        });
    }
}
```

### 1.2 Base Visualizer Class
```javascript
class BaseVisualizer {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvas = null;
        this.gl = null;
        this.isActive = false;
        this.animationFrameId = null;
        this.startTime = Date.now();

        // Default parameters (11 core)
        this.params = {
            geometry: 0,
            rot4dXW: 0.0,
            rot4dYW: 0.0,
            rot4dZW: 0.0,
            gridDensity: 20,
            morphFactor: 1.0,
            chaos: 0.1,
            speed: 0.4,
            hue: 200,
            intensity: 0.5,
            saturation: 0.8
        };

        this.targetParams = { ...this.params };
    }

    async init() {
        this.canvas = document.getElementById(this.canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas ${this.canvasId} not found`);
        }

        // Try WebGL2 first, fallback to WebGL1
        this.gl = this.canvas.getContext('webgl2', {
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false
        });

        if (!this.gl) {
            this.gl = this.canvas.getContext('webgl', this.getContextOptions());
        }

        if (!this.gl) {
            throw new Error('WebGL not supported');
        }

        await this.initShaders();
        this.initBuffers();
        this.resize();

        window.addEventListener('resize', () => this.resize());
    }

    async initShaders() {
        // Override in subclass
        throw new Error('initShaders must be implemented');
    }

    initBuffers() {
        // Full-screen quad
        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    }

    resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = this.canvas.clientWidth * dpr;
        this.canvas.height = this.canvas.clientHeight * dpr;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    updateParameters(params) {
        Object.assign(this.targetParams, params);
    }

    lerpParams() {
        const factor = 0.05;  // Smooth interpolation
        for (let key in this.targetParams) {
            if (typeof this.params[key] === 'number') {
                this.params[key] += (this.targetParams[key] - this.params[key]) * factor;
            }
        }
    }

    start() {
        this.isActive = true;
        this.renderLoop();
    }

    stop() {
        this.isActive = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    renderLoop() {
        if (!this.isActive) return;

        this.lerpParams();
        this.render();

        this.animationFrameId = requestAnimationFrame(() => this.renderLoop());
    }

    render() {
        // Override in subclass
        throw new Error('render must be implemented');
    }

    destroy() {
        this.stop();
        // Subclass cleanup
    }
}
```

### 1.3 FacetedVisualizer (Simple 2D)
```javascript
class FacetedVisualizer extends BaseVisualizer {
    async initShaders() {
        const vertexShader = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const fragmentShader = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform float u_gridDensity;
            uniform float u_chaos;
            uniform float u_hue;
            uniform float u_intensity;
            uniform float u_saturation;

            // Simple 2D distance functions
            float circle(vec2 p, float r) {
                return length(p) - r;
            }

            float box(vec2 p, vec2 b) {
                vec2 d = abs(p) - b;
                return length(max(d, 0.0));
            }

            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
                vec2 p = uv * 2.0;

                // Repeating grid
                p = fract(p * u_gridDensity) - 0.5;

                // Distance field
                float d = circle(p, 0.2 + sin(u_time * 0.001) * 0.1 * u_chaos);

                // Color
                float brightness = smoothstep(0.0, 0.02, -d) * u_intensity;
                vec3 color = hsv2rgb(vec3(u_hue / 360.0, u_saturation, 1.0));

                gl_FragColor = vec4(color * brightness, brightness * 0.6);
            }
        `;

        this.program = this.createProgram(vertexShader, fragmentShader);
        this.setupUniforms();
    }

    // ... rest of implementation
}
```

### 1.4 QuantumVisualizer (3D Lattice)
```javascript
class QuantumVisualizer extends BaseVisualizer {
    async initShaders() {
        // 3D sphere lattice shader (from VIB3 research)
        // Complex implementation with 4D rotations
        // See VIB3-SYSTEM-RESEARCH.md for details
    }
}
```

### 1.5 HolographicVisualizer (Audio-Reactive)
```javascript
class HolographicVisualizer extends BaseVisualizer {
    constructor(canvasId) {
        super(canvasId);
        this.audioContext = null;
        this.analyser = null;
        this.audioData = new Uint8Array(256);
    }

    async initAudio() {
        // Optional: Initialize Web Audio API
        // For now, can be placeholder
    }

    async initShaders() {
        // Interference pattern shader
        // Multi-layer holographic effects
        // See VIB3-SYSTEM-RESEARCH.md for details
    }
}
```

### 1.6 PolychoraVisualizer (4D Polytopes)
```javascript
class PolychoraVisualizer extends BaseVisualizer {
    async initShaders() {
        // 4D polytope distance functions
        // 6-axis rotation matrices
        // Glassmorphic rendering
        // Most complex - see VIB3-SYSTEM-RESEARCH.md for full shader
    }
}
```

### 1.7 HTML Canvas Setup
```html
<!-- In parallax-bg div -->
<canvas id="viz-primary" class="visualizer-canvas"></canvas>
<canvas id="viz-secondary" class="visualizer-canvas"></canvas>

<style>
.visualizer-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: 0;
    transition: opacity 0.8s ease;
}

.visualizer-canvas.active {
    opacity: 1;
}
</style>
```

**Session 1 Deliverables:**
- ✅ CanvasLifecycleManager class
- ✅ BaseVisualizer class
- ✅ FacetedVisualizer (simple, working)
- ✅ Skeletons for Quantum, Holographic, Polychora
- ✅ Proper init/destroy/lifecycle
- ✅ Test canvas switching without leaks

---

## SESSION 2: Scroll Choreography + Card-Visualizer Integration
**Duration:** 3-4 hours
**Goal:** Wire up visualizers to scroll system with proper timing

### 2.1 Card-to-Visualizer Mapping
```javascript
const CARD_VISUALIZER_CONFIG = {
    0: { type: 'QUANTUM', hue: 210, intensity: 0.5, geometry: 0 },    // Precision
    1: { type: 'HOLOGRAPHIC', hue: 30, intensity: 0.6, geometry: 3 }, // Consensus
    2: { type: 'QUANTUM', hue: 130, intensity: 0.7, geometry: 2 },    // Execution
    3: { type: 'POLYCHORA', hue: 280, intensity: 0.5, geometry: 1 },  // Storage
    4: { type: 'HOLOGRAPHIC', hue: 190, intensity: 0.6, geometry: 4 },// Network
    5: { type: 'POLYCHORA', hue: 355, intensity: 0.7, geometry: 7 },  // Security
    6: { type: 'HOLOGRAPHIC', hue: 210, intensity: 0.6, geometry: 5 },// Monitoring
    7: { type: 'FACETED', hue: 90, intensity: 0.4, geometry: 6 },     // API
    8: { type: 'QUANTUM', hue: 310, intensity: 0.7, geometry: 2 }     // Performance
};
```

### 2.2 ScrollChoreographer Class
```javascript
class ScrollChoreographer {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.currentCard = -1;
        this.stages = document.querySelectorAll('.card-stage');
        this.transitionZones = []; // Calculate overlap regions

        this.init();
    }

    init() {
        // Setup IntersectionObserver for each card
        this.stages.forEach((stage, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    this.handleCardIntersection(index, entry);
                });
            }, {
                threshold: this.createThresholds(101), // 0.00 to 1.00
                rootMargin: '-10% 0px -10% 0px'
            });

            observer.observe(stage);
        });
    }

    createThresholds(steps) {
        return Array.from({length: steps}, (_, i) => i / (steps - 1));
    }

    handleCardIntersection(cardIndex, entry) {
        const ratio = entry.intersectionRatio;
        const bounds = entry.boundingClientRect;
        const viewportHeight = window.innerHeight;

        // Calculate precise progress (0-1) through this card
        const progress = Math.max(0, Math.min(1,
            (viewportHeight - bounds.top) / (viewportHeight + bounds.height)
        ));

        // Card is entering viewport (10%+ visible)
        if (ratio > 0.1) {
            this.onCardActive(cardIndex, progress, ratio);
        }

        // Card is leaving viewport (<5% visible)
        if (ratio < 0.05 && this.currentCard === cardIndex) {
            this.onCardExit(cardIndex);
        }
    }

    async onCardActive(cardIndex, progress, ratio) {
        // Switch visualizer if needed
        if (this.currentCard !== cardIndex) {
            this.currentCard = cardIndex;
            await this.switchToCard(cardIndex);
        }

        // Update visualizer parameters based on scroll progress
        this.updateVisualizerForProgress(cardIndex, progress);
    }

    async switchToCard(cardIndex) {
        const config = CARD_VISUALIZER_CONFIG[cardIndex];

        await this.canvasManager.transitionTo(cardIndex, {
            type: config.type,
            geometry: config.geometry,
            hue: config.hue,
            intensity: config.intensity,
            gridDensity: 20,
            morphFactor: 1.0,
            chaos: 0.1,
            speed: 0.4,
            saturation: 0.8
        });

        console.log(`Switched to card ${cardIndex} (${config.type})`);
    }

    updateVisualizerForProgress(cardIndex, progress) {
        const config = CARD_VISUALIZER_CONFIG[cardIndex];
        const viz = this.canvasManager.activeVisualizers.get('viz-primary');

        if (!viz) return;

        // Progressive parameter changes as user scrolls through card
        viz.updateParameters({
            // Increase grid density as we progress
            gridDensity: 20 + (progress * 40),  // 20 → 60

            // Increase intensity
            intensity: config.intensity + (progress * 0.3),

            // Slightly shift hue
            hue: config.hue + (progress * 20),

            // Increase morphing
            morphFactor: 1.0 + (progress * 1.0),  // 1.0 → 2.0

            // Slight chaos increase
            chaos: 0.1 + (progress * 0.2),

            // Rotation speeds
            rot4dXW: Math.sin(progress * Math.PI) * 0.3,
            rot4dYW: Math.cos(progress * Math.PI) * 0.3
        });
    }

    onCardExit(cardIndex) {
        // Card exiting - could fade out or prepare next
        console.log(`Card ${cardIndex} exiting`);
    }
}
```

### 2.3 Integration with Existing System
```javascript
// In initialization
const canvasManager = new CanvasLifecycleManager();
const scrollChoreographer = new ScrollChoreographer(canvasManager);

window.canvasManager = canvasManager;
window.scrollChoreographer = scrollChoreographer;
```

**Session 2 Deliverables:**
- ✅ Card-to-visualizer mapping config
- ✅ ScrollChoreographer class
- ✅ Intersection Observer setup
- ✅ Smooth visualizer switching
- ✅ Progressive parameter updates during scroll
- ✅ Test all 9 cards switch properly

---

## SESSION 3: Parameter Interpolation + Smooth Transitions
**Duration:** 2-3 hours
**Goal:** Polish transitions and add crossfades

### 3.1 Crossfade Between Visualizers
```javascript
async transitionTo(cardIndex, params) {
    const { type } = this.getCardConfig(cardIndex);
    const primary = this.activeVisualizers.get('viz-primary');

    // If switching types, use crossfade
    if (primary && primary.type !== type) {
        // Move primary to secondary
        const secondary = this.activeVisualizers.get('viz-secondary');
        if (secondary) {
            await this.destroy('viz-secondary');
        }

        // Start new visualizer at secondary
        await this.initializeVisualizer(type, 'viz-secondary', params);

        // Crossfade
        await this.crossfade('viz-primary', 'viz-secondary', 800);

        // Swap references
        this.activeVisualizers.set('viz-primary',
            this.activeVisualizers.get('viz-secondary'));
        await this.destroy('viz-secondary');
    } else {
        // Same type - just update parameters
        primary.updateParameters(params);
    }
}

async crossfade(fromId, toId, duration) {
    const fromCanvas = document.getElementById(fromId);
    const toCanvas = document.getElementById(toId);

    toCanvas.classList.add('active');
    fromCanvas.style.transition = `opacity ${duration}ms ease`;
    toCanvas.style.transition = `opacity ${duration}ms ease`;

    // Fade out old, fade in new
    requestAnimationFrame(() => {
        fromCanvas.style.opacity = '0';
        toCanvas.style.opacity = '1';
    });

    await new Promise(resolve => setTimeout(resolve, duration));
}
```

### 3.2 Easing Functions
```javascript
const Easing = {
    easeInOutCubic: (t) => t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2,

    easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),

    easeInOutQuart: (t) => t < 0.5
        ? 8 * t * t * t * t
        : 1 - Math.pow(-2 * t + 2, 4) / 2
};
```

### 3.3 Staggered Card Content Reveals
```javascript
// Update stage visibility with stagger
stages.forEach((stage, i) => {
    if (i === activeStage) {
        // Stagger children
        const children = stage.querySelectorAll('.feature-badge, .feature-item, .metric-card');
        children.forEach((child, j) => {
            setTimeout(() => {
                child.classList.add('reveal');
            }, j * 50); // 50ms stagger
        });

        stage.classList.add('active');
    } else {
        stage.classList.remove('active');
    }
});
```

**Session 3 Deliverables:**
- ✅ Smooth crossfade transitions
- ✅ Easing functions for parameter changes
- ✅ Staggered content reveals
- ✅ No visual popping or jarring switches
- ✅ Performance: 60fps maintained

---

## SESSION 4: Typography + Visual Polish
**Duration:** 3-4 hours
**Goal:** Improve text styling and card aesthetics

### 4.1 Typography Improvements
```css
/* Enhanced typography hierarchy */
.dynamic-title {
    font-size: clamp(3rem, 8vw, 8rem);
    font-weight: 300;
    letter-spacing: -0.02em;
    line-height: 1.1;
    background: linear-gradient(135deg, var(--primary), var(--highlight));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.dynamic-text {
    font-size: clamp(1rem, 2vw, 1.4rem);
    font-weight: 400;
    line-height: 1.7;
    color: var(--text);
    opacity: 0.9;
    transition: all 0.4s ease;
}

/* Text reveal animation */
@keyframes textReveal {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.reveal {
    animation: textReveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

### 4.2 Card Shape Refinements
```css
/* Better card shadows and borders */
.locked-card {
    backdrop-filter: blur(20px);
    background: rgba(13, 17, 23, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
        0 0 40px rgba(0, 0, 0, 0.3),
        inset 0 0 40px rgba(255, 255, 255, 0.02),
        0 0 80px var(--card-glow);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Card-specific glow colors */
.card-1 { --card-glow: rgba(88, 166, 184, 0.2); }
.card-2 { --card-glow: rgba(232, 149, 126, 0.2); }
/* ... etc for all 9 cards */
```

### 4.3 Badge and Feature Polish
```css
.feature-badge {
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 30px;
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.feature-badge:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: var(--primary);
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}
```

**Session 4 Deliverables:**
- ✅ Better typography hierarchy
- ✅ Text reveal animations
- ✅ Enhanced card shadows/borders
- ✅ Polished badges and features
- ✅ Improved color schemes per card

---

## SESSION 5: Performance Optimization + Mobile Responsive
**Duration:** 2-3 hours
**Goal:** Ensure 60fps on desktop, 30fps on mobile

### 5.1 Performance Monitor
```javascript
class PerformanceMonitor {
    constructor() {
        this.fps = 60;
        this.frameTime = 0;
        this.lastFrameTime = performance.now();
        this.frames = [];
    }

    update() {
        const now = performance.now();
        this.frameTime = now - this.lastFrameTime;
        this.lastFrameTime = now;

        this.frames.push(this.frameTime);
        if (this.frames.length > 60) {
            this.frames.shift();
        }

        const avgFrameTime = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
        this.fps = Math.round(1000 / avgFrameTime);
    }

    shouldReduceQuality() {
        return this.fps < 25;
    }

    shouldIncreaseQuality() {
        return this.fps > 55;
    }
}
```

### 5.2 Adaptive Quality
```javascript
class AdaptiveQualityManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.perfMonitor = new PerformanceMonitor();
        this.quality = 'high';  // high, medium, low
    }

    update() {
        this.perfMonitor.update();

        if (this.perfMonitor.shouldReduceQuality() && this.quality !== 'low') {
            this.reduceQuality();
        } else if (this.perfMonitor.shouldIncreaseQuality() && this.quality !== 'high') {
            this.increaseQuality();
        }
    }

    reduceQuality() {
        if (this.quality === 'high') {
            this.quality = 'medium';
            this.applyMediumQuality();
        } else if (this.quality === 'medium') {
            this.quality = 'low';
            this.applyLowQuality();
        }
    }

    applyMediumQuality() {
        // Reduce gridDensity by 30%
        const viz = this.canvasManager.activeVisualizers.get('viz-primary');
        if (viz) {
            viz.updateParameters({
                gridDensity: viz.params.gridDensity * 0.7
            });
        }
    }

    applyLowQuality() {
        // Further reduce quality
        const viz = this.canvasManager.activeVisualizers.get('viz-primary');
        if (viz) {
            viz.updateParameters({
                gridDensity: Math.max(5, viz.params.gridDensity * 0.5)
            });
        }
    }
}
```

### 5.3 Mobile Optimizations
```javascript
// Detect mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
    // Cap frame rate at 30fps
    const targetFrameTime = 1000 / 30;

    // Reduce canvas resolution
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // Disable expensive effects
    disableParallax();
    reduceVisualizerComplexity();
}
```

### 5.4 Mobile CSS
```css
@media (max-width: 768px) {
    /* Simplify for mobile */
    .visualizer-canvas {
        /* Lower resolution */
        image-rendering: -webkit-optimize-contrast;
    }

    /* Reduce animations */
    .locked-card {
        transition-duration: 0.3s;
    }

    /* Simpler typography */
    .dynamic-title {
        font-size: clamp(2.5rem, 10vw, 4rem);
    }

    /* Touch-friendly badges */
    .feature-badge {
        min-width: 44px;
        min-height: 44px;
        padding: 1rem 1.5rem;
    }
}
```

**Session 5 Deliverables:**
- ✅ Performance monitoring
- ✅ Adaptive quality system
- ✅ Mobile-specific optimizations
- ✅ Responsive CSS refinements
- ✅ 60fps desktop, 30fps mobile achieved

---

## SUCCESS CRITERIA

### Technical
- ✅ Max 2 active WebGL contexts at any time
- ✅ Proper canvas lifecycle (init → destroy)
- ✅ No memory leaks during scroll
- ✅ Smooth visualizer transitions (<800ms)
- ✅ 60fps on desktop (RTX 3060+)
- ✅ 30fps on mobile (iPhone 12+)

### Visual
- ✅ 4 distinct visualizer types working
- ✅ Each of 9 cards has appropriate visualizer
- ✅ Smooth parameter interpolation
- ✅ No visual popping or glitches
- ✅ Beautiful typography and card designs

### User Experience
- ✅ Scroll feels fluid and responsive
- ✅ Content reveals are well-timed
- ✅ Mobile experience is optimized
- ✅ No performance degradation over time

---

## RISK MITIGATION

### If Sessions Run Over Time
- **Priority 1:** Sessions 1-2 (core architecture)
- **Priority 2:** Session 3 (smooth transitions)
- **Priority 3:** Sessions 4-5 (polish and optimization)

### If Performance Issues
- Use simpler shaders (Faceted for all cards temporarily)
- Reduce canvas resolution
- Cap frame rate lower
- Disable secondary canvas

### If WebGL Compatibility Issues
- Fallback to CSS-based visualizations
- Use canvas 2D context instead of WebGL
- Detect and disable on unsupported devices

---

**Total Estimated Time:** 13-18 hours across 5 sessions
**Target Completion:** 5 focused work sessions
**Based On:** Complete VIB3+ system research (see VIB3-SYSTEM-RESEARCH.md)
