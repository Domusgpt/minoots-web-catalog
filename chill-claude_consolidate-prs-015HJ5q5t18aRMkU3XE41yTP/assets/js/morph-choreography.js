/**
 * GSAP-Based Morphing Card Choreography
 * Handles circle → expanded → background transitions with visualizer coordination
 */

export class MorphChoreography {
  constructor(visualizers) {
    this.visualizers = visualizers;
    this.cards = [];
    this.gsap = window.gsap;
    this.ScrollTrigger = window.ScrollTrigger;

    if (!this.gsap || !this.ScrollTrigger) {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }

    this.gsap.registerPlugin(this.ScrollTrigger);
    this.init();
  }

  init() {
    const cardElements = document.querySelectorAll('.scroll-card');

    cardElements.forEach((card, index) => {
      this.setupCardMorphing(card, index);
    });

    console.log(`🎬 Morphing choreography initialized for ${cardElements.length} cards`);
  }

  setupCardMorphing(card, index) {
    const inner = card.querySelector('.scroll-card__inner');
    if (!inner) return;

    const stageCount = Number(card.dataset.stageCount) || 4;
    const systemIndex = Number(card.dataset.index);

    // Get card content elements
    const header = card.querySelector('.scroll-card__header');
    const title = card.querySelector('.scroll-card__title');
    const tagline = card.querySelector('.scroll-card__tagline');
    const stages = card.querySelector('.scroll-card__stages');
    const expansion = card.querySelector('.scroll-card__expansion');

    // Set initial state
    inner.dataset.morph = 'circle';

    // Performance hint: will-change for GPU acceleration
    inner.style.willChange = 'transform, opacity, border-radius';

    // Award-winning technique: scrub with momentum (like Apple product pages)
    // Scrub: true = instant, number = lerp smoothing
    const tl = this.gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8, // Tuned for responsive pacing (was 1.8 - too sluggish)
        anticipatePin: 1, // Smoother entry
        // markers: true, // Uncomment for debugging
        onUpdate: (self) => {
          this.onCardScroll(card, inner, self.progress, stageCount, systemIndex);
        },
        onLeave: () => {
          // Clean up will-change after animation completes
          inner.style.willChange = 'auto';
        }
      }
    });

    // Phase 1: Circle Entry (0-0.15) - Award-winning ease curves
    tl.fromTo(inner,
      {
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        scale: 0.8,
        opacity: 0,
        filter: 'blur(20px)' // Apple-style blur entrance
      },
      {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.15,
        ease: 'expo.out' // Sophisticated expo curve (like Apple Watch)
      }
    );

    // Animate title in circle state - staggered for depth
    if (title) {
      tl.from(title, {
        scale: 0.9,
        opacity: 0,
        y: 10,
        duration: 0.1,
        ease: 'back.out(1.2)' // Slight overshoot for playfulness
      }, '-=0.1');
    }

    // Phase 2: Circle → Expanded Rectangle (0.15-0.35)
    // Custom bezier curve inspired by Material Design + Apple
    tl.to(inner, {
      width: 'min(1040px, 95vw)',
      height: 'auto',
      borderRadius: '40px',
      duration: 0.2,
      ease: 'circ.inOut', // Circular easing = smooth, organic feel
      onStart: () => {
        inner.dataset.morph = 'expanding';
      },
      onComplete: () => {
        inner.dataset.morph = 'expanded';
      }
    });

    // Reveal stages content as card expands - layered timing
    if (stages) {
      tl.from(stages, {
        opacity: 0,
        y: 30,
        scale: 0.96,
        duration: 0.15,
        ease: 'expo.out' // Match entrance curve
      }, '-=0.15');
    }

    // Reveal expansion panel - staggered for hierarchy
    if (expansion) {
      tl.from(expansion, {
        opacity: 0,
        y: 20,
        duration: 0.12,
        ease: 'power3.out' // Softer ease for secondary content
      }, '-=0.1');
    }

    // Phase 3: Hold Expanded (0.35-0.65) - Breathing effect
    tl.to(inner, {
      scale: 1.02,
      duration: 0.3,
      ease: 'sine.inOut' // Gentle breathing, not linear
    });

    // Add subtle pulsing to title during expanded state - award-winning micro-interaction
    if (title) {
      tl.to(title, {
        scale: 1.01,
        duration: 0.15,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1
      }, '-=0.3');
    }

    // Phase 4: Expanded → Background (0.65-0.85) - Dramatic expansion
    tl.to(inner, {
      width: '100vw',
      height: '120vh',
      borderRadius: '0px',
      scale: 1,
      filter: 'blur(2px)', // Slight depth-of-field blur as it recedes
      duration: 0.2,
      ease: 'expo.inOut', // Exponential ease = dramatic but smooth
      onStart: () => {
        inner.dataset.morph = 'dissolving';
      },
      onComplete: () => {
        inner.dataset.morph = 'background';
      }
    });

    // Fade content as it dissolves - layered opacity timing
    if (stages) {
      tl.to(stages, {
        opacity: 0.4,
        scale: 0.98, // Slight scale down as fading
        filter: 'blur(4px)', // More blur on content than container
        duration: 0.15,
        ease: 'power3.in' // Accelerate into fade
      }, '-=0.15');
    }

    // Phase 5: Fade Out (0.85-1.0) - Elegant exit
    tl.to(inner, {
      opacity: 0,
      filter: 'blur(8px)', // Blur out completely
      duration: 0.15,
      ease: 'expo.in' // Fast acceleration into fade (like Apple)
    });

    this.cards.push({
      element: card,
      inner,
      timeline: tl,
      index,
      systemIndex,
      stageCount
    });
  }

  onCardScroll(card, inner, progress, stageCount, systemIndex) {
    // Calculate which stage we're in based on scroll progress
    const stageProgress = progress * stageCount;
    const currentStage = Math.floor(stageProgress);
    const stageFrac = stageProgress - currentStage;

    // Update CSS variables for smooth transitions
    card.style.setProperty('--stage-progress', stageFrac.toFixed(3));
    card.style.setProperty('--stage-frac', stageFrac.toFixed(3));

    // Determine morph state based on progress
    let morphState = 'circle';
    if (progress > 0.35 && progress < 0.65) {
      morphState = 'expanded';
    } else if (progress >= 0.65) {
      morphState = 'background';
    } else if (progress > 0.15) {
      morphState = 'expanding';
    }

    // Update stages visibility
    const stages = card.querySelectorAll('.stage');
    const clampedStage = Math.min(currentStage, stageCount - 1);
    stages.forEach((stage, idx) => {
      stage.dataset.active = idx === clampedStage ? 'true' : 'false';
    });

    // Coordinate visualizers
    this.coordinateVisualizers(progress, systemIndex, currentStage, stageFrac);

    // Update card state
    card.dataset.active = progress > 0.2 && progress < 0.9 ? 'true' : 'false';
    card.dataset.immersed = progress > 0.6 ? 'true' : 'false';
  }

  coordinateVisualizers(progress, systemIndex, stage, stageFrac) {
    if (!this.visualizers) return;

    // Get system-specific visualizer configuration
    const systems = window.APP_DATA?.systems || [];
    const system = systems[systemIndex];
    if (!system) return;

    // Base configuration
    const baseConfig = system.visualizer || {};
    const stageConfig = system.stages?.[stage]?.visualizer || {};

    // Award-winning technique: Parallax-style depth through layered parameter changes
    // Each parameter moves at different "speed" creating visual depth

    // CIRCLE PHASE (0-0.15): Compressed, intimate, focused
    // EXPANDING (0.15-0.35): Opening up, revealing layers
    // EXPANDED (0.35-0.65): Full view, maximum detail
    // DISSOLVING (0.65-0.85): Receding into background, atmospheric
    // FADING (0.85-1.0): Dissolve away

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // Sophisticated parameter choreography (inspired by Apple Watch page)
    const config = {
      ...baseConfig,
      ...stageConfig,

      // gridDensity: Lower = zoom IN (foreground), Higher = zoom OUT (background)
      // Circle: zoomed in (low density 15-20) → Expanded: mid (25-30) → Dissolved: far (35-45)
      gridDensity: baseConfig.gridDensity || 28 +
        (progress < 0.35 ? -12 * easeOutCubic(progress / 0.35) : // Circle → Expanded: zoom in
         progress < 0.65 ? 0 : // Expanded: hold
         17 * easeInOutQuad((progress - 0.65) / 0.35)), // Dissolving: zoom out dramatically

      // speed: Slow during focus, faster when transitioning
      speed: (baseConfig.speed || 0.5) *
        (progress < 0.2 ? 0.4 : // Circle: very slow, contemplative
         progress < 0.35 ? 0.4 + 0.4 * (progress - 0.2) / 0.15 : // Expanding: speed up
         progress < 0.65 ? 0.8 : // Expanded: moderate speed
         0.8 + 0.6 * ((progress - 0.65) / 0.35)), // Dissolving: accelerate away

      // intensity: Brightness/energy - build then release
      intensity: (baseConfig.intensity || 0.4) +
        (progress < 0.5 ? progress * 0.3 : // Build intensity
         0.15 - (progress - 0.5) * 0.2), // Release intensity

      // chaos: Structure → Disorder as we zoom out
      chaos: (baseConfig.chaos || 0.15) + progress * 0.25,

      // morph: Shape distortion increases with progress
      morph: (baseConfig.morph || 1.0) + progress * 0.8,

      // hue: Subtle color shift through stages (like sunset)
      hue: (baseConfig.hue || 0.55) + stageFrac * 0.08,

      // saturation: Peak saturation at expanded state
      saturation: (baseConfig.saturation || 0.7) +
        (progress < 0.5 ? progress * 0.2 : // Build saturation
         0.1 - (progress - 0.5) * 0.15), // Desaturate as dissolving

      // parallax: Depth effect increases with zoom
      parallax: 0.1 + progress * 0.3,

      // 4D rotation: Subtle tumble effect
      rot4dXW: (baseConfig.rot4dXW || 0) + Math.sin(progress * Math.PI) * 0.15,
      rot4dYW: (baseConfig.rot4dYW || 0) + Math.cos(progress * Math.PI * 1.3) * 0.12,
      rot4dZW: (baseConfig.rot4dZW || 0) + Math.sin(progress * Math.PI * 0.7) * 0.08
    };

    // Update visualizers with choreographed parameters
    if (this.visualizers.updateForStage) {
      this.visualizers.updateForStage(config);
    }

    // Update scroll progress for additional effects
    if (this.visualizers.setScrollProgress) {
      this.visualizers.setScrollProgress(stageFrac);
    }
  }

  destroy() {
    this.cards.forEach(card => {
      if (card.timeline) {
        card.timeline.kill();
      }
    });
    this.cards = [];
  }
}
