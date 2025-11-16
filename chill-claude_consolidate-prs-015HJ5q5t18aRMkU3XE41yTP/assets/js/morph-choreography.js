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

    // Create timeline for this card
    const tl = this.gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
        // markers: true, // Uncomment for debugging
        onUpdate: (self) => {
          this.onCardScroll(card, inner, self.progress, stageCount, systemIndex);
        }
      }
    });

    // Phase 1: Circle Entry (0-0.15)
    tl.fromTo(inner,
      {
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        scale: 0.8,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.15,
        ease: 'power2.out'
      }
    );

    // Animate title in circle state
    if (title) {
      tl.from(title, {
        scale: 0.9,
        opacity: 0,
        duration: 0.1,
        ease: 'power2.out'
      }, '-=0.1');
    }

    // Phase 2: Circle → Expanded Rectangle (0.15-0.35)
    tl.to(inner, {
      width: 'min(1040px, 95vw)',
      height: 'auto',
      borderRadius: '40px',
      duration: 0.2,
      ease: 'power3.inOut',
      onStart: () => {
        inner.dataset.morph = 'expanding';
      },
      onComplete: () => {
        inner.dataset.morph = 'expanded';
      }
    });

    // Reveal stages content as card expands
    if (stages) {
      tl.from(stages, {
        opacity: 0,
        y: 30,
        duration: 0.15,
        ease: 'power2.out'
      }, '-=0.15');
    }

    // Reveal expansion panel
    if (expansion) {
      tl.from(expansion, {
        opacity: 0,
        y: 20,
        duration: 0.12,
        ease: 'power2.out'
      }, '-=0.1');
    }

    // Phase 3: Hold Expanded (0.35-0.65)
    tl.to(inner, {
      scale: 1.02,
      duration: 0.3,
      ease: 'none'
    });

    // Add subtle pulsing to title during expanded state
    if (title) {
      tl.to(title, {
        scale: 1.01,
        duration: 0.15,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1
      }, '-=0.3');
    }

    // Phase 4: Expanded → Background (0.65-0.85)
    tl.to(inner, {
      width: '100vw',
      height: '120vh',
      borderRadius: '0px',
      scale: 1,
      duration: 0.2,
      ease: 'power3.inOut',
      onStart: () => {
        inner.dataset.morph = 'dissolving';
      },
      onComplete: () => {
        inner.dataset.morph = 'background';
      }
    });

    // Fade content as it dissolves
    if (stages) {
      tl.to(stages, {
        opacity: 0.4,
        duration: 0.15,
        ease: 'power2.in'
      }, '-=0.15');
    }

    // Phase 5: Fade Out (0.85-1.0)
    tl.to(inner, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in'
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

    // Merge configurations
    const config = {
      ...baseConfig,
      ...stageConfig,
      // Enhance based on scroll progress
      intensity: (baseConfig.intensity || 0.4) + progress * 0.15,
      chaos: (baseConfig.chaos || 0.15) + stageFrac * 0.1,
      morphFactor: 1 + progress * 0.4,
      gridDensity: (baseConfig.gridDensity || 30) + stageFrac * 8
    };

    // Update visualizers
    if (this.visualizers.updateForStage) {
      this.visualizers.updateForStage(config);
    }

    // Update scroll progress
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
