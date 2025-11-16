/**
 * PIN-AND-TRANSFORM CHOREOGRAPHY SYSTEM
 *
 * Philosophy:
 * - Elements STAY CENTERED while scroll drives internal transformations
 * - Scroll progress shown through visualizer, text, and style changes
 * - NOT through constant entering/exiting
 * - Dramatic height increases for breathing room
 * - Clear rhythm: enter → lock → transform (multiple stages) → exit
 */

export class PinChoreography {
  constructor(visualizers, gsap, ScrollTrigger, SplitType) {
    this.visualizers = visualizers;
    this.gsap = gsap;
    this.ScrollTrigger = ScrollTrigger;
    this.SplitType = SplitType;

    this.pinnedElements = new Map();
    this.transformStages = new Map();

    this.init();
  }

  init() {
    this.setupHeroPinning();
    this.setupNarrativePinning();
    this.setupImmersionPinning();
    this.setupOrchestraPinning();
    this.setupCapstonePinning();
    this.setupFooterPinning();

    console.log('📌 Pin Choreography System initialized');
  }

  /**
   * HERO SECTION
   * Height: 250vh (lots of breathing room)
   * Pin duration: 150vh (60% of section)
   */
  setupHeroPinning() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Stretch the section
    hero.style.minHeight = '250vh';

    const title = hero.querySelector('.hero__title');
    const subtitle = hero.querySelector('.hero__subtitle');
    const lead = hero.querySelector('.hero__lead');

    // Pin the hero content
    this.ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: '+=150vh',
      pin: lead,
      pinSpacing: false,
      onUpdate: (self) => this.onHeroProgress(self.progress, title, subtitle)
    });

    // Visualizer transformation during pin
    this.ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: '+=250vh',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;

        // Visualizer evolves through stages while hero is pinned
        if (this.visualizers) {
          this.visualizers.updateForStage({
            hue: 0.55 + p * 0.1, // Slowly shift hue
            intensity: 0.25 + p * 0.2, // Gradually brighten
            gridDensity: 28 - p * 10, // ZOOM IN as we progress
            speed: 0.6 + p * 0.3,
            chaos: 0.12 + p * 0.08,
            morph: 1.0 + p * 0.5,
            saturation: 0.75 + p * 0.15
          });
        }

        // Update progress indicator
        document.documentElement.style.setProperty('--hero-progress', p.toFixed(3));
      }
    });

    console.log('📌 Hero pinned for 150vh with 4-stage transformation');
  }

  /**
   * HERO PROGRESS HANDLER
   * Transform content while pinned
   */
  onHeroProgress(progress, title, subtitle) {
    // Stage 1 (0-0.25): Initial state
    if (progress < 0.25) {
      const stageProgress = progress / 0.25;
      if (title) {
        this.gsap.to(title, {
          scale: 1 + stageProgress * 0.05,
          opacity: 1,
          duration: 0.5
        });
      }
    }
    // Stage 2 (0.25-0.5): Text morphing hint
    else if (progress < 0.5) {
      const stageProgress = (progress - 0.25) / 0.25;
      if (title) {
        // Subtle character wave
        const chars = title.querySelectorAll('.char');
        if (chars.length > 0) {
          chars.forEach((char, i) => {
            this.gsap.to(char, {
              y: Math.sin(stageProgress * Math.PI + i * 0.3) * 8,
              duration: 0.3
            });
          });
        }
      }
    }
    // Stage 3 (0.5-0.75): Style evolution
    else if (progress < 0.75) {
      const stageProgress = (progress - 0.5) / 0.25;
      if (subtitle) {
        this.gsap.to(subtitle, {
          opacity: 1 - stageProgress * 0.3,
          filter: `blur(${stageProgress * 2}px)`,
          duration: 0.5
        });
      }
    }
    // Stage 4 (0.75-1.0): Prepare for exit
    else {
      const stageProgress = (progress - 0.75) / 0.25;
      if (title) {
        this.gsap.to(title, {
          scale: 1.05 - stageProgress * 0.1,
          opacity: 1 - stageProgress * 0.4,
          duration: 0.5
        });
      }
    }
  }

  /**
   * NARRATIVE SECTION
   * Height: 400vh (3 cards × ~133vh each)
   * Each card pinned for 100vh
   */
  setupNarrativePinning() {
    const narrative = document.querySelector('.narrative');
    if (!narrative) return;

    narrative.style.minHeight = '400vh';

    const cards = narrative.querySelectorAll('.narrative__item');

    cards.forEach((card, index) => {
      // Wrap each card in a container for pinning
      const container = document.createElement('div');
      container.className = 'narrative-pin-container';
      container.style.height = '133vh';
      card.parentNode.insertBefore(container, card);
      container.appendChild(card);

      // Pin each card
      this.ScrollTrigger.create({
        trigger: container,
        start: 'top 20%',
        end: '+=100vh',
        pin: card,
        pinSpacing: false,
        onUpdate: (self) => this.onNarrativeCardProgress(self.progress, card, index)
      });
    });

    console.log(`📌 ${cards.length} narrative cards pinned, each for 100vh`);
  }

  /**
   * NARRATIVE CARD PROGRESS
   */
  onNarrativeCardProgress(progress, card, index) {
    const hueBase = [0.72, 0.15, 0.45][index % 3];

    // Transform visualizer based on which card is focused
    if (progress > 0.2 && progress < 0.8 && this.visualizers) {
      this.visualizers.updateForStage({
        hue: hueBase + progress * 0.1,
        intensity: 0.32 + progress * 0.15,
        gridDensity: 32 + progress * 12, // Zoom out as card progresses
        speed: 0.5 + progress * 0.25,
        chaos: 0.15 + progress * 0.08
      });
    }

    // Card style evolution
    // Stage 1 (0-0.33): Lock and settle
    if (progress < 0.33) {
      this.gsap.to(card, {
        scale: 0.95 + progress * 0.05,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.6
      });
    }
    // Stage 2 (0.33-0.66): Transform
    else if (progress < 0.66) {
      const stage = (progress - 0.33) / 0.33;
      this.gsap.to(card, {
        borderRadius: `${18 + stage * 22}px`,
        backdropFilter: `blur(${22 + stage * 10}px)`,
        duration: 0.6
      });
    }
    // Stage 3 (0.66-1.0): Prepare exit
    else {
      const stage = (progress - 0.66) / 0.34;
      this.gsap.to(card, {
        scale: 1 - stage * 0.05,
        opacity: 1 - stage * 0.3,
        filter: `blur(${stage * 4}px)`,
        duration: 0.6
      });
    }
  }

  /**
   * IMMERSION SECTION
   * Height: 600vh (3 cards × 200vh each)
   * Each card pinned for 150vh - LOTS of time to experience
   */
  setupImmersionPinning() {
    const immersion = document.querySelector('.immersion');
    if (!immersion) return;

    immersion.style.minHeight = '600vh';

    const cards = immersion.querySelectorAll('.immersion-card');

    cards.forEach((card, index) => {
      // Each card gets 200vh of space
      card.style.minHeight = '200vh';

      const frame = card.querySelector('.immersion-card__frame');
      if (!frame) return;

      // Pin the card frame
      this.ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        end: '+=150vh',
        pin: frame,
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate: (self) => this.onImmersionProgress(self.progress, card, frame, index)
      });
    });

    console.log(`📌 ${cards.length} immersion cards pinned, each for 150vh`);
  }

  /**
   * IMMERSION CARD PROGRESS
   * 5 transformation stages while pinned
   */
  onImmersionProgress(progress, card, frame, index) {
    const configs = [
      { hue: 0.62, accentHue: 0.8, density: 34, speed: 0.86 },
      { hue: 0.08, accentHue: 0.02, density: 30, speed: 0.92 },
      { hue: 0.9, accentHue: 0.78, density: 38, speed: 0.74 }
    ];

    const config = configs[index % 3];

    // Stage 1 (0-0.2): Entry and lock
    if (progress < 0.2) {
      const stage = progress / 0.2;

      this.gsap.to(frame, {
        scale: 0.9 + stage * 0.1,
        opacity: stage,
        rotation: -180 + stage * 180,
        duration: 0.8,
        ease: 'power2.out'
      });

      if (this.visualizers) {
        this.visualizers.updateForStage({
          ...config,
          intensity: 0.45 + stage * 0.1
        });
      }
    }
    // Stage 2 (0.2-0.4): First transformation
    else if (progress < 0.4) {
      const stage = (progress - 0.2) / 0.2;

      // Morph card shape
      this.gsap.to(frame, {
        borderRadius: `${44 - stage * 10}px`,
        scale: 1 + stage * 0.03,
        duration: 0.8
      });

      // Visualizer slows down dramatically
      if (this.visualizers) {
        this.visualizers.updateForStage({
          ...config,
          speed: config.speed * (1 - stage * 0.85), // Down to 15% speed
          gridDensity: config.density + stage * 20, // Zoom out
          intensity: 0.55 + stage * 0.2
        });
      }

      // Text content could fade/morph here
      const headline = frame.querySelector('.immersion-card__headline h3');
      if (headline && headline._split) {
        const words = headline._split.words;
        this.gsap.to(words, {
          y: Math.sin(stage * Math.PI) * 10,
          stagger: 0.05,
          duration: 0.4
        });
      }
    }
    // Stage 3 (0.4-0.6): Peak experience
    else if (progress < 0.6) {
      const stage = (progress - 0.4) / 0.2;

      // Card becomes highly translucent
      this.gsap.to(frame, {
        opacity: 1 - stage * 0.25,
        backdropFilter: `blur(${12 + stage * 20}px)`,
        duration: 0.8
      });

      // Visualizer at almost frozen, maximum density
      if (this.visualizers) {
        this.visualizers.updateForStage({
          ...config,
          speed: config.speed * 0.12, // Nearly frozen
          gridDensity: config.density + 30 + stage * 15, // Maximum zoom out
          intensity: 0.75 + stage * 0.15,
          chaos: 0.2 + stage * 0.15,
          morph: 1.5 + stage * 0.8
        });
      }

      // Pulsing effect on card
      card.dataset.pulsing = 'true';
    }
    // Stage 4 (0.6-0.8): Transformation reversal
    else if (progress < 0.8) {
      const stage = (progress - 0.6) / 0.2;

      card.dataset.pulsing = 'false';

      // Return to more solid state
      this.gsap.to(frame, {
        opacity: 0.75 + stage * 0.2,
        backdropFilter: `blur(${32 - stage * 20}px)`,
        scale: 1.03 - stage * 0.08,
        duration: 0.8
      });

      // Visualizer speeds back up
      if (this.visualizers) {
        this.visualizers.updateForStage({
          ...config,
          speed: config.speed * (0.12 + stage * 0.68), // Speed up to 80%
          gridDensity: config.density + 45 - stage * 20, // Zoom back in
          intensity: 0.9 - stage * 0.25
        });
      }
    }
    // Stage 5 (0.8-1.0): Exit preparation
    else {
      const stage = (progress - 0.8) / 0.2;

      this.gsap.to(frame, {
        scale: 0.95 - stage * 0.15,
        opacity: 0.95 - stage * 0.6,
        filter: `blur(${stage * 12}px)`,
        y: -stage * 100,
        duration: 0.8
      });

      if (this.visualizers) {
        this.visualizers.updateForStage({
          ...config,
          intensity: 0.65 - stage * 0.3
        });
      }
    }
  }

  /**
   * ORCHESTRA SECTION (System Cards)
   * Height: 3600vh (9 cards × 400vh each) - MASSIVE for deep experience
   * Each card pinned for 350vh with 7-stage transformation
   */
  setupOrchestraPinning() {
    const orchestra = document.querySelector('.orchestra');
    if (!orchestra) return;

    orchestra.style.minHeight = '3600vh';

    const cards = orchestra.querySelectorAll('.scroll-card');

    cards.forEach((card, index) => {
      // Each card gets 400vh of space
      card.style.height = '400vh';

      const inner = card.querySelector('.scroll-card__inner');
      if (!inner) return;

      const stageCount = Number(card.dataset.stageCount) || 4;

      // Pin the card
      this.ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        end: '+=350vh',
        pin: inner,
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate: (self) => this.onOrchestraProgress(self.progress, card, inner, index, stageCount)
      });
    });

    console.log(`📌 ${cards.length} orchestra cards pinned, each for 350vh with deep transformations`);
  }

  /**
   * ORCHESTRA CARD PROGRESS
   * 7 transformation stages (matching morph phases but MUCH slower)
   */
  onOrchestraProgress(progress, card, inner, systemIndex, stageCount) {
    const systems = window.APP_DATA?.systems || [];
    const system = systems[systemIndex];
    if (!system) return;

    const baseConfig = system.visualizer || {};

    // Stage 0 (0-0.1): Dormant entry
    if (progress < 0.1) {
      const stage = progress / 0.1;

      this.gsap.to(inner, {
        scale: 0.7 + stage * 0.3,
        opacity: stage,
        rotationX: -45 + stage * 45,
        z: -200 + stage * 200,
        duration: 0.8
      });

      if (this.visualizers) {
        this.visualizers.updateForStage({
          ...baseConfig,
          gridDensity: 20 + stage * 8,
          intensity: 0.2 + stage * 0.15
        });
      }
    }
    // Stage 1 (0.1-0.2): Circle formation
    else if (progress < 0.2) {
      const stage = (progress - 0.1) / 0.1;

      this.gsap.to(inner, {
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'elastic.out(1, 0.6)'
      });

      inner.dataset.morph = 'circle';

      if (this.visualizers) {
        this.visualizers.updateForStage({
          ...baseConfig,
          gridDensity: 28 + stage * 4,
          intensity: 0.35 + stage * 0.05,
          speed: 0.7 + stage * 0.1
        });
      }
    }
    // Stage 2 (0.2-0.35): Expanding to rectangle
    else if (progress < 0.35) {
      const stage = (progress - 0.2) / 0.15;

      this.gsap.to(inner, {
        width: 'min(1040px, 95vw)',
        height: 'auto',
        borderRadius: '40px',
        duration: 1.5,
        ease: 'power3.inOut'
      });

      inner.dataset.morph = 'expanding';

      if (this.visualizers) {
        this.visualizers.updateForStage({
          ...baseConfig,
          gridDensity: 32 + stage * 10, // Zooming out
          intensity: 0.4 + stage * 0.1,
          speed: 0.8 + stage * 0.15,
          chaos: (baseConfig.chaos || 0.18) + stage * 0.05
        });
      }

      // Reveal content stages
      const stages = card.querySelectorAll('.stage');
      const currentStage = Math.floor(stage * stageCount);
      stages.forEach((s, i) => {
        s.dataset.active = i === currentStage ? 'true' : 'false';
      });
    }
    // Stage 3 (0.35-0.55): Full card with stage cycling
    else if (progress < 0.55) {
      const stage = (progress - 0.35) / 0.2;

      inner.dataset.morph = 'full';

      // Cycle through all 4 stages of content
      const stages = card.querySelectorAll('.stage');
      const currentStage = Math.floor(stage * stageCount);

      stages.forEach((s, i) => {
        const active = i === currentStage;
        s.dataset.active = active ? 'true' : 'false';

        if (active) {
          this.gsap.to(s, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out'
          });
        }
      });

      // Visualizer per-stage transformations
      const stageConfig = system.stages?.[currentStage]?.visualizer || {};
      if (this.visualizers) {
        this.visualizers.updateForStage({
          ...baseConfig,
          ...stageConfig,
          gridDensity: 42 + stage * 8, // Continuing to zoom out
          speed: 0.95 - stage * 0.8, // SLOWDOWN dramatically
          intensity: 0.5 + stage * 0.25,
          chaos: (baseConfig.chaos || 0.18) + stage * 0.12
        });
      }

      // Update expansion panel content
      const expansion = card.querySelector('.scroll-card__expansion');
      const stageData = system.stages?.[currentStage];
      if (expansion && stageData && stage - Math.floor(stage * stageCount) / stageCount < 0.1) {
        // Re-render expansion content for current stage
        this.updateExpansionContent(expansion, system, stageData, currentStage, stageCount);
      }
    }
    // Stage 4 (0.55-0.7): Peak transformation
    else if (progress < 0.7) {
      const stage = (progress - 0.55) / 0.15;

      // Card becomes highly translucent, almost merging with visualizer
      this.gsap.to(inner, {
        opacity: 1 - stage * 0.35,
        backdropFilter: `blur(${22 + stage * 30}px)`,
        scale: 1.02 + stage * 0.06,
        duration: 1.0
      });

      // Visualizer at slowest, maximum density
      if (this.visualizers) {
        this.visualizers.updateForStage({
          ...baseConfig,
          gridDensity: 50 + stage * 25, // Maximum zoom out
          speed: 0.15 - stage * 0.05, // Almost frozen (0.1)
          intensity: 0.75 + stage * 0.15,
          chaos: (baseConfig.chaos || 0.18) + 0.12 + stage * 0.15,
          morph: (baseConfig.morph || 1.05) + 0.8 + stage * 0.6
        });
      }

      inner.dataset.morph = 'peak';
    }
    // Stage 5 (0.7-0.85): Background takeover
    else if (progress < 0.85) {
      const stage = (progress - 0.7) / 0.15;

      this.gsap.to(inner, {
        width: '100vw',
        height: '100vh',
        borderRadius: '0px',
        opacity: 0.5 - stage * 0.3,
        filter: `blur(${stage * 25}px)`,
        duration: 1.2,
        ease: 'power2.inOut'
      });

      inner.dataset.morph = 'background';

      // Visualizer starts zooming back in
      if (this.visualizers) {
        this.visualizers.updateForStage({
          ...baseConfig,
          gridDensity: 75 - stage * 30, // Zoom back in
          speed: 0.1 + stage * 0.4, // Speed up
          intensity: 0.9 - stage * 0.4
        });
      }
    }
    // Stage 6 (0.85-1.0): Dissolve
    else {
      const stage = (progress - 0.85) / 0.15;

      this.gsap.to(inner, {
        opacity: 0.2 - stage * 0.2,
        scale: 1.15 + stage * 0.1,
        filter: `blur(${25 + stage * 20}px)`,
        duration: 1.0
      });

      inner.dataset.morph = 'dissolved';

      if (this.visualizers) {
        this.visualizers.updateForStage({
          ...baseConfig,
          gridDensity: 45 - stage * 15,
          intensity: 0.5 - stage * 0.3
        });
      }
    }

    // Update CSS variables for any remaining CSS-driven effects
    card.style.setProperty('--stage-progress', progress.toFixed(3));
    card.dataset.morphPhase = inner.dataset.morph || 'dormant';
  }

  /**
   * Update expansion content (helper)
   */
  updateExpansionContent(expansion, system, stage, stageIndex, stageCount) {
    const metrics = (stage.metrics || []).slice(0, 3);
    const bullets = (stage.bullets || []).slice(0, Math.max(0, 3 - metrics.length));
    const metaPieces = [
      ...metrics.map(({ value, label }) => `<span>${value}<em>${label}</em></span>`),
      ...bullets.map((bullet) => `<span>${bullet}</span>`),
    ];

    if (!metaPieces.length) {
      metaPieces.push(`<span>${system.tagline}</span>`);
    }

    const phaseLabel = stageCount > 1 ? `Phase ${stageIndex + 1} of ${stageCount}` : `Phase ${stageIndex + 1}`;
    const heading = `${system.index} • ${stage.chip || stage.title}`;

    expansion.innerHTML = `
      <div class="scroll-card__expansion-title">${heading}<span class="scroll-card__expansion-phase"> // ${phaseLabel}</span></div>
      <p class="scroll-card__expansion-lede">${stage.lede}</p>
      <p class="scroll-card__expansion-body">${stage.body}</p>
      <div class="scroll-card__expansion-meta">
        ${metaPieces.join("")}
      </div>
    `;
  }

  /**
   * CAPSTONE SECTION
   * Height: 200vh
   * Pin duration: 150vh
   */
  setupCapstonePinning() {
    const capstone = document.querySelector('.capstone');
    if (!capstone) return;

    capstone.style.minHeight = '200vh';

    const inner = capstone.querySelector('.capstone__inner');
    if (!inner) return;

    this.ScrollTrigger.create({
      trigger: capstone,
      start: 'top top',
      end: '+=150vh',
      pin: inner,
      pinSpacing: false,
      onUpdate: (self) => {
        const p = self.progress;

        // Visualizer returns to calm
        if (this.visualizers) {
          this.visualizers.updateForStage({
            hue: 0.48 + p * 0.15,
            intensity: 0.38 - p * 0.13,
            gridDensity: 30 - p * 8, // Zoom in
            speed: 0.7 - p * 0.3,
            chaos: 0.16 - p * 0.08,
            saturation: 0.75 - p * 0.25
          });
        }

        // Gentle fade transformations
        this.gsap.to(inner, {
          opacity: 1 - p * 0.15,
          scale: 1 + p * 0.05,
          duration: 0.8
        });
      }
    });

    console.log('📌 Capstone pinned for 150vh with gentle resolution');
  }

  /**
   * FOOTER SECTION
   * Height: 150vh (ultra mellow, lots of time)
   * Pin duration: 120vh
   */
  setupFooterPinning() {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;

    // Wrap footer in container for proper pinning
    const container = document.createElement('div');
    container.className = 'footer-pin-container';
    container.style.minHeight = '150vh';
    footer.parentNode.insertBefore(container, footer);
    container.appendChild(footer);

    this.ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: '+=120vh',
      pin: footer,
      pinSpacing: false,
      onUpdate: (self) => {
        const p = self.progress;

        // Most mellow visualizer state
        if (this.visualizers && p > 0.1) {
          this.visualizers.updateForStage({
            hue: 0.5 + p * 0.1,
            intensity: 0.15 - p * 0.05, // Fade to almost nothing
            gridDensity: 18 - p * 4, // Zoom in close
            speed: 0.25 - p * 0.15, // Nearly stopped
            chaos: 0.08 - p * 0.04,
            morph: 0.6 - p * 0.2,
            saturation: 0.4 - p * 0.2 // Very desaturated
          });
        }

        // Footer gentle breathing
        this.gsap.to(footer, {
          opacity: 0.6 + Math.sin(p * Math.PI * 4) * 0.2,
          y: -60 + p * 40,
          scale: 1 + Math.sin(p * Math.PI * 2) * 0.01,
          duration: 1.5
        });
      }
    });

    console.log('📌 Footer pinned for 120vh with ultra-mellow meditation');
  }

  /**
   * Destroy all pins
   */
  destroy() {
    this.ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.pin) {
        trigger.kill();
      }
    });
    this.pinnedElements.clear();
    this.transformStages.clear();
  }
}
