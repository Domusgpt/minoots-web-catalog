/**
 * ADVANCED MORPHING ENGINE
 *
 * Handles:
 * - Layer morphing and role-switching (card ↔ background ↔ visualizer)
 * - Unique scroll-driven entry/exit animations
 * - Text splitting, shattering, and reformation
 * - Visualizer density modulation (zoom in/out coordination)
 * - Comprehensive hover-to-focus pipeline
 * - Total section transitions
 * - Parallax depth with visualizer integration
 */

export class MorphEngine {
  constructor(visualizers, gsap, ScrollTrigger, SplitType) {
    this.visualizers = visualizers;
    this.gsap = gsap;
    this.ScrollTrigger = ScrollTrigger;
    this.SplitType = SplitType;

    this.morphStates = new Map(); // Track morph state per element
    this.layerStack = []; // Dynamic layer composition
    this.activeTransitions = new Set();

    // Visualizer parameter memory
    this.vizParams = {
      gridDensity: { min: 12, max: 85, default: 28 },
      speed: { min: 0.05, max: 2.5, default: 0.8 },
      intensity: { min: 0.1, max: 1.2, default: 0.35 },
      chaos: { min: 0.02, max: 0.45, default: 0.12 },
      morph: { min: 0.3, max: 2.5, default: 1.05 },
      geometry: { min: 0.5, max: 3.0, default: 1.0 }
    };

    this.init();
  }

  init() {
    this.setupCardMorphSystem();
    this.setupLayerSwitching();
    this.setupTextMorphing();
    this.setupHoverFocusPipeline();
    this.setupSectionTransitions();
    this.setupParallaxDepth();
    this.setupUniqueEntryExits();

    console.log('🌀 Advanced Morph Engine initialized');
  }

  /**
   * CARD MORPHING SYSTEM
   * Cards expand, split, merge, and transform into backgrounds
   */
  setupCardMorphSystem() {
    const cards = document.querySelectorAll('.scroll-card');

    cards.forEach((card, index) => {
      const inner = card.querySelector('.scroll-card__inner');
      if (!inner) return;

      const stageCount = Number(card.dataset.stageCount) || 4;
      const systemIndex = Number(card.dataset.index);

      // Initialize morph state
      this.morphStates.set(card, {
        phase: 'dormant', // dormant → circle → expanding → full → splitting → background → dissolved
        layerRole: 'card', // card, background, visualizer-mask, hybrid
        visualizerMode: 'behind', // behind, within, overlay, merged
        textState: 'intact' // intact, splitting, scattered, reforming
      });

      // Create advanced morph timeline
      const tl = this.gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
          onUpdate: (self) => this.onCardMorphProgress(card, inner, self.progress, stageCount, systemIndex)
        }
      });

      this.buildMorphSequence(tl, card, inner, stageCount, systemIndex);
    });
  }

  /**
   * BUILD MORPH SEQUENCE
   * Unique morph patterns per card type
   */
  buildMorphSequence(tl, card, inner, stageCount, systemIndex) {
    const morphPattern = this.getMorphPattern(systemIndex);

    // PHASE 0: Dormant Entry (0-0.05)
    tl.fromTo(inner,
      { scale: 0.7, opacity: 0, rotationX: -45, z: -200 },
      {
        scale: 0.85,
        opacity: 0.3,
        rotationX: -15,
        z: -50,
        duration: 0.05,
        ease: 'power1.out',
        onStart: () => this.setMorphPhase(card, 'dormant')
      }
    );

    // PHASE 1: Circle Formation (0.05-0.12)
    if (morphPattern.startShape === 'circle') {
      tl.to(inner, {
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        scale: 1,
        opacity: 1,
        rotationX: 0,
        z: 0,
        duration: 0.07,
        ease: 'elastic.out(1, 0.6)',
        onStart: () => {
          this.setMorphPhase(card, 'circle');
          this.updateVisualizerForPhase(card, 'circle', systemIndex);
        }
      });
    } else if (morphPattern.startShape === 'shard') {
      // Alternative: Shard assembly
      this.createShardAssembly(tl, inner, card);
    }

    // PHASE 2: Expansion Morph (0.12-0.30)
    tl.to(inner, {
      width: 'min(1040px, 95vw)',
      height: 'auto',
      borderRadius: '40px',
      duration: 0.18,
      ease: 'power3.inOut',
      onStart: () => {
        this.setMorphPhase(card, 'expanding');
        this.updateVisualizerForPhase(card, 'expanding', systemIndex);
      },
      onComplete: () => this.setMorphPhase(card, 'full')
    });

    // PHASE 3: Content Reveal with Layer Switching (0.30-0.55)
    tl.add(() => {
      this.triggerLayerSwitch(card, 'hybrid', systemIndex);
    }, 0.30);

    // PHASE 4: Splitting Transformation (0.55-0.70)
    if (morphPattern.canSplit) {
      tl.add(() => {
        this.triggerCardSplit(card, inner, systemIndex);
      }, 0.55);
    }

    // PHASE 5: Background Takeover (0.70-0.85)
    tl.to(inner, {
      width: '100vw',
      height: '100vh',
      borderRadius: '0px',
      scale: 1.05,
      opacity: 0.85,
      duration: 0.15,
      ease: 'power4.inOut',
      onStart: () => {
        this.setMorphPhase(card, 'background');
        this.triggerLayerSwitch(card, 'background', systemIndex);
      }
    });

    // PHASE 6: Dissolve (0.85-1.0)
    tl.to(inner, {
      opacity: 0,
      scale: 1.1,
      filter: 'blur(20px)',
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => this.setMorphPhase(card, 'dissolved')
    });
  }

  /**
   * GET MORPH PATTERN
   * Each system card has unique morph behavior
   */
  getMorphPattern(systemIndex) {
    const patterns = [
      { startShape: 'circle', canSplit: true, splitMode: 'horizontal', visualizerRole: 'behind-then-within' },
      { startShape: 'circle', canSplit: true, splitMode: 'vertical', visualizerRole: 'mask' },
      { startShape: 'shard', canSplit: false, splitMode: null, visualizerRole: 'overlay' },
      { startShape: 'circle', canSplit: true, splitMode: 'diagonal', visualizerRole: 'merged' },
      { startShape: 'circle', canSplit: true, splitMode: 'radial', visualizerRole: 'behind-then-within' },
      { startShape: 'shard', canSplit: true, splitMode: 'scatter', visualizerRole: 'overlay' },
      { startShape: 'circle', canSplit: false, splitMode: null, visualizerRole: 'behind-then-within' },
      { startShape: 'circle', canSplit: true, splitMode: 'grid', visualizerRole: 'mask' },
      { startShape: 'shard', canSplit: true, splitMode: 'shatter', visualizerRole: 'merged' }
    ];

    return patterns[systemIndex % patterns.length];
  }

  /**
   * CREATE SHARD ASSEMBLY
   * Card assembles from scattered shards
   */
  createShardAssembly(tl, inner, card) {
    const shardCount = 12;
    const shards = [];

    // Create temporary shards
    for (let i = 0; i < shardCount; i++) {
      const shard = document.createElement('div');
      shard.className = 'morph-shard';
      shard.style.cssText = `
        position: absolute;
        width: ${100 / 3}%;
        height: ${100 / 4}%;
        left: ${(i % 3) * (100 / 3)}%;
        top: ${Math.floor(i / 3) * (100 / 4)}%;
        background: inherit;
        clip-path: polygon(
          ${Math.random() * 20}% ${Math.random() * 20}%,
          ${80 + Math.random() * 20}% ${Math.random() * 20}%,
          ${80 + Math.random() * 20}% ${80 + Math.random() * 20}%,
          ${Math.random() * 20}% ${80 + Math.random() * 20}%
        );
      `;
      inner.appendChild(shard);
      shards.push(shard);
    }

    // Animate shards assembling
    tl.fromTo(shards,
      {
        x: () => (Math.random() - 0.5) * 800,
        y: () => (Math.random() - 0.5) * 600,
        rotation: () => (Math.random() - 0.5) * 360,
        opacity: 0,
        scale: 0.3
      },
      {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        scale: 1,
        duration: 0.12,
        stagger: 0.01,
        ease: 'back.out(2)',
        onComplete: () => {
          shards.forEach(s => s.remove());
          this.setMorphPhase(card, 'full');
        }
      }
    );
  }

  /**
   * TRIGGER CARD SPLIT
   * Card splits into multiple pieces
   */
  triggerCardSplit(card, inner, systemIndex) {
    const state = this.morphStates.get(card);
    if (!state) return;

    const pattern = this.getMorphPattern(systemIndex);
    state.textState = 'splitting';

    switch (pattern.splitMode) {
      case 'horizontal':
        this.splitHorizontal(inner);
        break;
      case 'vertical':
        this.splitVertical(inner);
        break;
      case 'diagonal':
        this.splitDiagonal(inner);
        break;
      case 'radial':
        this.splitRadial(inner);
        break;
      case 'scatter':
        this.splitScatter(inner);
        break;
      case 'grid':
        this.splitGrid(inner);
        break;
      case 'shatter':
        this.splitShatter(inner);
        break;
    }

    this.setMorphPhase(card, 'splitting');
  }

  splitHorizontal(inner) {
    const top = inner.cloneNode(true);
    const bottom = inner.cloneNode(true);

    top.style.clipPath = 'inset(0 0 50% 0)';
    bottom.style.clipPath = 'inset(50% 0 0 0)';

    inner.parentNode.appendChild(top);
    inner.parentNode.appendChild(bottom);

    this.gsap.to(top, { y: -100, opacity: 0.6, duration: 0.8, ease: 'power2.out' });
    this.gsap.to(bottom, { y: 100, opacity: 0.6, duration: 0.8, ease: 'power2.out' });
    this.gsap.to(inner, { opacity: 0, duration: 0.4 });

    setTimeout(() => {
      top.remove();
      bottom.remove();
      inner.style.opacity = '';
    }, 1200);
  }

  splitVertical(inner) {
    const left = inner.cloneNode(true);
    const right = inner.cloneNode(true);

    left.style.clipPath = 'inset(0 50% 0 0)';
    right.style.clipPath = 'inset(0 0 0 50%)';

    inner.parentNode.appendChild(left);
    inner.parentNode.appendChild(right);

    this.gsap.to(left, { x: -120, rotation: -5, opacity: 0.6, duration: 0.8, ease: 'power2.out' });
    this.gsap.to(right, { x: 120, rotation: 5, opacity: 0.6, duration: 0.8, ease: 'power2.out' });
    this.gsap.to(inner, { opacity: 0, duration: 0.4 });

    setTimeout(() => { left.remove(); right.remove(); inner.style.opacity = ''; }, 1200);
  }

  splitDiagonal(inner) {
    const tl = inner.cloneNode(true);
    const br = inner.cloneNode(true);

    tl.style.clipPath = 'polygon(0 0, 100% 0, 0 100%)';
    br.style.clipPath = 'polygon(100% 0, 100% 100%, 0 100%)';

    inner.parentNode.appendChild(tl);
    inner.parentNode.appendChild(br);

    this.gsap.to(tl, { x: -80, y: -80, rotation: -8, opacity: 0.6, duration: 0.8 });
    this.gsap.to(br, { x: 80, y: 80, rotation: 8, opacity: 0.6, duration: 0.8 });
    this.gsap.to(inner, { opacity: 0, duration: 0.4 });

    setTimeout(() => { tl.remove(); br.remove(); inner.style.opacity = ''; }, 1200);
  }

  splitRadial(inner) {
    const segments = 8;
    const clones = [];

    for (let i = 0; i < segments; i++) {
      const segment = inner.cloneNode(true);
      const angle = (i / segments) * 360;
      const nextAngle = ((i + 1) / segments) * 360;

      segment.style.clipPath = `polygon(
        50% 50%,
        ${50 + 50 * Math.cos(angle * Math.PI / 180)}% ${50 + 50 * Math.sin(angle * Math.PI / 180)}%,
        ${50 + 50 * Math.cos(nextAngle * Math.PI / 180)}% ${50 + 50 * Math.sin(nextAngle * Math.PI / 180)}%
      )`;

      inner.parentNode.appendChild(segment);
      clones.push(segment);

      const distance = 200;
      const tx = Math.cos(angle * Math.PI / 180) * distance;
      const ty = Math.sin(angle * Math.PI / 180) * distance;

      this.gsap.to(segment, {
        x: tx,
        y: ty,
        rotation: angle + 45,
        opacity: 0.5,
        duration: 0.9,
        delay: i * 0.05,
        ease: 'power2.out'
      });
    }

    this.gsap.to(inner, { opacity: 0, duration: 0.4 });
    setTimeout(() => { clones.forEach(c => c.remove()); inner.style.opacity = ''; }, 1400);
  }

  splitScatter(inner) {
    const pieces = 20;
    const clones = [];

    for (let i = 0; i < pieces; i++) {
      const piece = inner.cloneNode(true);
      const size = 15 + Math.random() * 25;
      const x = Math.random() * 100;
      const y = Math.random() * 100;

      piece.style.clipPath = `circle(${size}% at ${x}% ${y}%)`;
      inner.parentNode.appendChild(piece);
      clones.push(piece);

      this.gsap.to(piece, {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        rotation: (Math.random() - 0.5) * 720,
        scale: 0.3 + Math.random() * 0.4,
        opacity: 0,
        duration: 1.2,
        delay: i * 0.02,
        ease: 'power2.out'
      });
    }

    this.gsap.to(inner, { opacity: 0, duration: 0.3 });
    setTimeout(() => { clones.forEach(c => c.remove()); inner.style.opacity = ''; }, 1600);
  }

  splitGrid(inner) {
    const rows = 4, cols = 4;
    const clones = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = inner.cloneNode(true);
        const x1 = (col / cols) * 100;
        const y1 = (row / rows) * 100;
        const x2 = ((col + 1) / cols) * 100;
        const y2 = ((row + 1) / rows) * 100;

        cell.style.clipPath = `inset(${y1}% ${100 - x2}% ${100 - y2}% ${x1}%)`;
        inner.parentNode.appendChild(cell);
        clones.push(cell);

        this.gsap.to(cell, {
          x: (col - cols / 2) * 60,
          y: (row - rows / 2) * 60,
          rotation: (Math.random() - 0.5) * 30,
          opacity: 0.4,
          duration: 0.8,
          delay: (row + col) * 0.03,
          ease: 'power2.out'
        });
      }
    }

    this.gsap.to(inner, { opacity: 0, duration: 0.4 });
    setTimeout(() => { clones.forEach(c => c.remove()); inner.style.opacity = ''; }, 1400);
  }

  splitShatter(inner) {
    const shards = 30;
    const clones = [];

    for (let i = 0; i < shards; i++) {
      const shard = inner.cloneNode(true);
      const points = Array.from({ length: 6 }, () =>
        `${Math.random() * 100}% ${Math.random() * 100}%`
      ).join(', ');

      shard.style.clipPath = `polygon(${points})`;
      inner.parentNode.appendChild(shard);
      clones.push(shard);

      this.gsap.to(shard, {
        x: (Math.random() - 0.5) * 600,
        y: Math.random() * 400 + 100,
        rotation: (Math.random() - 0.5) * 900,
        scale: 0.2 + Math.random() * 0.5,
        opacity: 0,
        duration: 1.5,
        delay: i * 0.01,
        ease: 'power3.in'
      });
    }

    this.gsap.to(inner, { opacity: 0, duration: 0.2 });
    setTimeout(() => { clones.forEach(c => c.remove()); inner.style.opacity = ''; }, 1800);
  }

  /**
   * LAYER SWITCHING SYSTEM
   * Elements can switch between card, background, and visualizer roles
   */
  setupLayerSwitching() {
    this.layerStack = [
      { role: 'background-gradient', element: document.body, zIndex: 0 },
      { role: 'visualizer-primary', element: document.getElementById('visualizer-primary'), zIndex: 1 },
      { role: 'content', element: document.querySelector('.site'), zIndex: 2 },
      { role: 'visualizer-accent', element: document.getElementById('visualizer-accent'), zIndex: 1 }
    ];
  }

  triggerLayerSwitch(card, newRole, systemIndex) {
    const state = this.morphStates.get(card);
    if (!state) return;

    const oldRole = state.layerRole;
    state.layerRole = newRole;

    console.log(`🔄 Layer switch: ${oldRole} → ${newRole} (system ${systemIndex})`);

    switch (newRole) {
      case 'background':
        this.cardBecomesBackground(card, systemIndex);
        break;
      case 'hybrid':
        this.cardBecomesHybrid(card, systemIndex);
        break;
      case 'visualizer-mask':
        this.cardBecomesVisualizerMask(card, systemIndex);
        break;
    }
  }

  cardBecomesBackground(card, systemIndex) {
    const inner = card.querySelector('.scroll-card__inner');
    if (!inner) return;

    // Card becomes the background, visualizer becomes foreground accent
    this.gsap.to(inner, {
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      opacity: 0.4,
      filter: 'blur(40px)',
      duration: 1.2,
      ease: 'power2.inOut'
    });

    // Bring visualizer forward
    if (this.visualizers) {
      this.visualizers.updateForStage({
        intensity: 0.65,
        gridDensity: 45, // ZOOM OUT - visualizer recedes, showing more grid
        chaos: 0.25,
        speed: 1.2,
        morph: 1.8
      });
    }
  }

  cardBecomesHybrid(card, systemIndex) {
    const inner = card.querySelector('.scroll-card__inner');
    if (!inner) return;

    // Visualizer shows THROUGH card via reduced opacity
    this.gsap.to(inner, {
      backdropFilter: 'blur(12px)',
      background: 'rgba(10, 15, 25, 0.65)',
      duration: 0.8,
      ease: 'power2.out'
    });

    // Visualizer increases density (zooms out) to appear behind card
    if (this.visualizers) {
      this.visualizers.updateForStage({
        gridDensity: 52, // ZOOM OUT - appears to recede behind card
        intensity: 0.55,
        speed: 0.7,
        parallax: 0.6
      });
    }
  }

  cardBecomesVisualizerMask(card, systemIndex) {
    // Card content becomes a mask for the visualizer
    // Text and UI elements show visualizer through them
    const inner = card.querySelector('.scroll-card__inner');
    if (!inner) return;

    this.gsap.to(inner, {
      mixBlendMode: 'screen',
      opacity: 0.9,
      duration: 1.0,
      ease: 'power2.inOut'
    });

    // Reduce visualizer density (zoom in) for foreground effect
    if (this.visualizers) {
      this.visualizers.updateForStage({
        gridDensity: 18, // ZOOM IN - visualizer comes forward
        intensity: 0.8,
        chaos: 0.18,
        morph: 2.2
      });
    }
  }

  /**
   * TEXT MORPHING
   * Text can split, shatter, scatter, and reform
   */
  setupTextMorphing() {
    if (!this.SplitType) return;

    // Setup text that can morph
    const morphableText = document.querySelectorAll('.scroll-card__title, .immersion-card__headline h3');

    morphableText.forEach((textEl) => {
      const split = new this.SplitType(textEl, { types: 'chars, words' });
      textEl._split = split;

      // Store for later morphing
      textEl.dataset.textMorphable = 'true';
    });
  }

  /**
   * TEXT SCATTER EFFECT
   * Characters scatter and reform
   */
  scatterText(element, callback) {
    if (!element._split) return;

    const chars = element._split.chars;

    // Scatter
    this.gsap.to(chars, {
      x: () => (Math.random() - 0.5) * 400,
      y: () => (Math.random() - 0.5) * 300,
      rotation: () => (Math.random() - 0.5) * 360,
      opacity: 0,
      scale: 0.3,
      duration: 0.8,
      stagger: 0.02,
      ease: 'power2.in',
      onComplete: () => {
        // Reform
        this.gsap.to(chars, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.03,
          ease: 'elastic.out(1, 0.5)',
          onComplete: callback
        });
      }
    });
  }

  /**
   * TEXT WAVE EFFECT
   * Characters ripple in waves
   */
  waveText(element) {
    if (!element._split) return;

    const chars = element._split.chars;

    this.gsap.to(chars, {
      y: -30,
      duration: 0.5,
      stagger: {
        each: 0.05,
        yoyo: true,
        repeat: 1
      },
      ease: 'sine.inOut'
    });
  }

  /**
   * HOVER-TO-FOCUS VISUALIZER PIPELINE
   * All hover events trigger coordinated visualizer responses
   */
  setupHoverFocusPipeline() {
    // Card hovers
    this.setupCardHoverPipeline();

    // Button hovers
    this.setupButtonHoverPipeline();

    // Text hovers
    this.setupTextHoverPipeline();

    // Badge hovers
    this.setupBadgeHoverPipeline();
  }

  setupCardHoverPipeline() {
    const cards = document.querySelectorAll('.scroll-card, .immersion-card, .narrative__item');

    cards.forEach((card) => {
      card.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'touch') return;

        // Card lifts forward - visualizer zooms out behind it
        if (this.visualizers) {
          this.visualizers.updateForStage({
            gridDensity: this.visualizers.primary.targets.gridDensity + 20, // ZOOM OUT
            speed: this.visualizers.primary.targets.speed * 0.3, // SLOWDOWN
            intensity: this.visualizers.primary.targets.intensity * 1.3,
            chaos: this.visualizers.primary.targets.chaos + 0.08
          });
        }

        // Trigger wave effect on text if available
        const title = card.querySelector('[data-text-morphable="true"]');
        if (title && Math.random() > 0.7) {
          this.waveText(title);
        }
      });

      card.addEventListener('pointerleave', () => {
        // Return to base state
        if (this.visualizers) {
          this.visualizers.updateForStage({
            gridDensity: this.visualizers.primary.targets.gridDensity,
            speed: this.visualizers.primary.targets.speed,
            intensity: this.visualizers.primary.targets.intensity,
            chaos: this.visualizers.primary.targets.chaos
          });
        }
      });
    });
  }

  setupButtonHoverPipeline() {
    const buttons = document.querySelectorAll('.button, .immersion-card__trigger');

    buttons.forEach((button) => {
      button.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'touch') return;

        // Subtle visualizer pulse
        if (this.visualizers) {
          this.visualizers.updateForStage({
            intensity: this.visualizers.primary.targets.intensity + 0.15,
            morph: this.visualizers.primary.targets.morph + 0.3,
            chaos: this.visualizers.primary.targets.chaos + 0.05
          });
        }
      });

      button.addEventListener('pointerleave', () => {
        if (this.visualizers) {
          this.visualizers.updateForStage({
            intensity: this.visualizers.primary.targets.intensity,
            morph: this.visualizers.primary.targets.morph,
            chaos: this.visualizers.primary.targets.chaos
          });
        }
      });
    });
  }

  setupTextHoverPipeline() {
    const headings = document.querySelectorAll('h1, h2, h3');

    headings.forEach((heading) => {
      heading.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'touch') return;

        // Visualizer shifts slightly
        if (this.visualizers) {
          this.visualizers.updateForStage({
            rot4dXW: this.visualizers.primary.targets.rot4dXW + 0.2,
            rot4dYW: this.visualizers.primary.targets.rot4dYW + 0.15
          });
        }
      });
    });
  }

  setupBadgeHoverPipeline() {
    const badges = document.querySelectorAll('.badge, .stage__chip');

    badges.forEach((badge) => {
      badge.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'touch') return;

        // Micro visualizer reaction
        if (this.visualizers && this.visualizers.accent) {
          this.visualizers.updateForStage({
            accentLift: (this.visualizers.accent.targets.intensity || 0.3) + 0.1,
            gridDensity: (this.visualizers.accent.targets.gridDensity || 24) + 5
          });
        }
      });
    });
  }

  /**
   * SECTION TRANSITIONS
   * Smooth transitions between major sections
   */
  setupSectionTransitions() {
    const sections = document.querySelectorAll('.section');

    sections.forEach((section, index) => {
      this.ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => this.onSectionEnter(section, index, 'forward'),
        onEnterBack: () => this.onSectionEnter(section, index, 'backward'),
        onLeave: () => this.onSectionLeave(section, index, 'forward'),
        onLeaveBack: () => this.onSectionLeave(section, index, 'backward')
      });
    });
  }

  onSectionEnter(section, index, direction) {
    const sectionId = section.id;
    console.log(`→ Entering section: ${sectionId} (${direction})`);

    // Get section-specific visualizer config
    const config = this.getSectionVisualizerConfig(sectionId, index);

    if (this.visualizers) {
      this.visualizers.updateForStage(config);
    }

    // Section-specific entry effects
    this.triggerSectionEntryEffect(section, index);
  }

  onSectionLeave(section, index, direction) {
    const sectionId = section.id;
    console.log(`← Leaving section: ${sectionId} (${direction})`);

    // Section-specific exit effects
    this.triggerSectionExitEffect(section, index, direction);
  }

  getSectionVisualizerConfig(sectionId, index) {
    const configs = {
      hero: {
        hue: 0.55,
        intensity: 0.25,
        gridDensity: 28,
        speed: 0.6,
        chaos: 0.12,
        morph: 1.0,
        parallax: 0.3
      },
      narrative: {
        hue: 0.72,
        intensity: 0.32,
        gridDensity: 32,
        speed: 0.5,
        chaos: 0.15,
        morph: 1.2,
        parallax: 0.5
      },
      immersion: {
        hue: 0.62,
        intensity: 0.45,
        gridDensity: 38,
        speed: 0.8,
        chaos: 0.20,
        morph: 1.5,
        parallax: 0.7
      },
      orchestra: {
        hue: 0.18,
        intensity: 0.50,
        gridDensity: 42,
        speed: 0.95,
        chaos: 0.22,
        morph: 1.8,
        parallax: 0.4
      },
      capstone: {
        hue: 0.48,
        intensity: 0.38,
        gridDensity: 30,
        speed: 0.7,
        chaos: 0.16,
        morph: 1.1,
        parallax: 0.6
      }
    };

    return configs[sectionId] || configs.hero;
  }

  triggerSectionEntryEffect(section, index) {
    // Unique entry per section
    const cards = section.querySelectorAll('.narrative__item, .metric-card, .badge');

    if (cards.length > 0) {
      this.gsap.from(cards, {
        scale: 0.9,
        opacity: 0,
        y: 60,
        stagger: 0.1,
        duration: 1.0,
        ease: 'power3.out'
      });
    }
  }

  triggerSectionExitEffect(section, index, direction) {
    const multiplier = direction === 'forward' ? 1 : -1;
    const cards = section.querySelectorAll('.narrative__item, .metric-card');

    if (cards.length > 0) {
      this.gsap.to(cards, {
        y: -30 * multiplier,
        opacity: 0.6,
        duration: 0.6,
        ease: 'power2.in'
      });
    }
  }

  /**
   * PARALLAX DEPTH WITH VISUALIZER
   * Coordinated parallax between content and visualizer
   */
  setupParallaxDepth() {
    const parallaxLayers = document.querySelectorAll('[data-parallax]');

    parallaxLayers.forEach((layer) => {
      const depth = parseFloat(layer.dataset.parallax) || 0.5;

      this.ScrollTrigger.create({
        trigger: layer,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
        onUpdate: (self) => {
          const progress = self.progress;
          const offset = (progress - 0.5) * depth * 100;

          this.gsap.to(layer, {
            y: offset,
            duration: 0.1,
            ease: 'none'
          });

          // Coordinate visualizer parallax
          if (this.visualizers) {
            this.visualizers.updateForStage({
              parallax: depth * progress * 2
            });
          }
        }
      });
    });
  }

  /**
   * UNIQUE ENTRY/EXIT ANIMATIONS
   * Each element type has distinctive entry/exit
   */
  setupUniqueEntryExits() {
    this.setupHeroEntry();
    this.setupImmersionEntry();
    this.setupFooterEntry();
  }

  setupHeroEntry() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const title = hero.querySelector('.hero__title');
    const subtitle = hero.querySelector('.hero__subtitle');
    const ctas = hero.querySelector('.hero__ctas');

    const tl = this.gsap.timeline({ delay: 0.3 });

    if (title) {
      tl.from(title, {
        scale: 0.8,
        opacity: 0,
        y: 100,
        rotationX: -45,
        duration: 1.2,
        ease: 'elastic.out(1, 0.7)'
      });
    }

    if (subtitle) {
      tl.from(subtitle, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6');
    }

    if (ctas) {
      tl.from(ctas.children, {
        scale: 0.5,
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(1.7)'
      }, '-=0.4');
    }
  }

  setupImmersionEntry() {
    const immersionCards = document.querySelectorAll('.immersion-card');

    immersionCards.forEach((card, index) => {
      this.ScrollTrigger.create({
        trigger: card,
        start: 'top 80%',
        onEnter: () => {
          const frame = card.querySelector('.immersion-card__frame');
          if (!frame) return;

          // Spiral entry
          this.gsap.from(frame, {
            scale: 0.3,
            rotation: -180,
            opacity: 0,
            y: 200,
            duration: 1.5,
            ease: 'power4.out'
          });
        }
      });
    });
  }

  setupFooterEntry() {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;

    this.ScrollTrigger.create({
      trigger: footer,
      start: 'top 85%',
      onEnter: () => {
        // Gentle fade and float up
        this.gsap.from(footer, {
          opacity: 0,
          y: 60,
          duration: 2.0,
          ease: 'power1.out'
        });

        // Footer visualizer state - most mellow
        if (this.visualizers) {
          this.visualizers.updateForStage({
            gridDensity: 18, // ZOOM IN - intimate, close
            speed: 0.25, // Very slow
            intensity: 0.15, // Very dim
            chaos: 0.08, // Minimal noise
            morph: 0.6, // Subtle morphing
            saturation: 0.4 // Desaturated
          });
        }
      }
    });
  }

  /**
   * CARD MORPH PROGRESS
   * Continuous updates during card scroll
   */
  onCardMorphProgress(card, inner, progress, stageCount, systemIndex) {
    const state = this.morphStates.get(card);
    if (!state) return;

    // Update visualizer based on card proximity to viewport center
    const rect = card.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const cardCenter = rect.top + rect.height / 2;
    const distanceFromCenter = Math.abs(viewportCenter - cardCenter);
    const maxDistance = window.innerHeight;
    const focusStrength = 1 - Math.min(distanceFromCenter / maxDistance, 1);

    if (this.visualizers && focusStrength > 0.3) {
      const baseSpeed = this.visualizers.primary.targets.speed || 0.8;
      const baseDensity = this.visualizers.primary.targets.gridDensity || 28;

      // When card is focused: slow down speed, increase density (zoom out)
      this.visualizers.updateForStage({
        speed: baseSpeed * (0.2 + (1 - focusStrength) * 0.8), // Slower when focused
        gridDensity: baseDensity + focusStrength * 25, // ZOOM OUT when focused
        intensity: (this.visualizers.primary.targets.intensity || 0.35) + focusStrength * 0.3,
        chaos: (this.visualizers.primary.targets.chaos || 0.12) + focusStrength * 0.12
      });
    }
  }

  /**
   * SET MORPH PHASE
   * Update phase tracking
   */
  setMorphPhase(card, phase) {
    const state = this.morphStates.get(card);
    if (state) {
      state.phase = phase;
      card.dataset.morphPhase = phase;
    }
  }

  /**
   * UPDATE VISUALIZER FOR PHASE
   * Each morph phase has distinct visualizer state
   */
  updateVisualizerForPhase(card, phase, systemIndex) {
    if (!this.visualizers) return;

    const phaseConfigs = {
      dormant: {
        gridDensity: 20, // ZOOMED IN
        intensity: 0.2,
        speed: 0.4,
        chaos: 0.08,
        morph: 0.8
      },
      circle: {
        gridDensity: 28, // NEUTRAL
        intensity: 0.35,
        speed: 0.7,
        chaos: 0.12,
        morph: 1.1
      },
      expanding: {
        gridDensity: 38, // ZOOMING OUT
        intensity: 0.45,
        speed: 0.85,
        chaos: 0.18,
        morph: 1.5
      },
      full: {
        gridDensity: 48, // ZOOMED OUT
        intensity: 0.55,
        speed: 0.95,
        chaos: 0.22,
        morph: 1.8
      },
      splitting: {
        gridDensity: 35, // ZOOMING BACK IN
        intensity: 0.65,
        speed: 1.2,
        chaos: 0.28,
        morph: 2.2
      },
      background: {
        gridDensity: 25, // VERY ZOOMED IN
        intensity: 0.75,
        speed: 0.5,
        chaos: 0.32,
        morph: 2.5
      },
      dissolved: {
        gridDensity: 18, // MOST ZOOMED IN
        intensity: 0.25,
        speed: 0.3,
        chaos: 0.15,
        morph: 1.0
      }
    };

    const config = phaseConfigs[phase];
    if (config) {
      this.visualizers.updateForStage(config);
    }
  }

  /**
   * UTILITY: Cleanup
   */
  destroy() {
    this.morphStates.clear();
    this.layerStack = [];
    this.activeTransitions.clear();
  }
}
