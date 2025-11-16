/**
 * Comprehensive GSAP Animation Orchestrator
 * Inspired by Simone's scroll choreography + Wix Space transitions
 *
 * Features:
 * - Lenis smooth scrolling
 * - SplitType text animations (lines, words, chars)
 * - Section-based color mode switching
 * - Parallax layers
 * - Staggered reveals
 * - Visualizer coordination
 */

export class AnimationOrchestrator {
  constructor(visualizers) {
    this.visualizers = visualizers;
    this.gsap = window.gsap;
    this.ScrollTrigger = window.ScrollTrigger;
    this.SplitType = window.SplitType;
    this.lenis = null;

    if (!this.gsap || !this.ScrollTrigger) {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }

    this.gsap.registerPlugin(this.ScrollTrigger);
    this.init();
  }

  init() {
    this.setupLenisSmoothing();
    this.setupTextSplitAnimations();
    this.setupFadeUpAnimations();
    this.setupStaggerAnimations();
    this.setupSectionModeSwitch();
    this.setupParallaxLayers();
    this.setupMicroInteractions();

    console.log('🎭 Animation Orchestrator initialized');
  }

  /**
   * Setup Lenis smooth scrolling (like Simone)
   */
  setupLenisSmoothing() {
    if (!window.Lenis) {
      console.warn('Lenis not loaded');
      return;
    }

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    this.lenis.on('scroll', (e) => {
      this.ScrollTrigger.update();
    });

    this.gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    this.gsap.ticker.lagSmoothing(0);

    console.log('✨ Lenis smooth scrolling active');
  }

  /**
   * Setup SplitType text animations (lines, words, chars)
   * Inspired by Simone's text reveal pattern
   */
  setupTextSplitAnimations() {
    if (!this.SplitType) {
      console.warn('SplitType not loaded');
      return;
    }

    // Split text by lines
    const lineElements = document.querySelectorAll('[data-animate-text="lines"]');
    lineElements.forEach((element) => {
      const split = new this.SplitType(element, { types: 'lines' });

      // Wrap lines for animation
      split.lines.forEach(line => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });

      this.gsap.from(split.lines, {
        y: '120%',
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Split text by words
    const wordElements = document.querySelectorAll('[data-animate-text="words"]');
    wordElements.forEach((element) => {
      const split = new this.SplitType(element, { types: 'words' });

      this.gsap.from(split.words, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.03,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Split text by characters
    const charElements = document.querySelectorAll('[data-animate-text="chars"]');
    charElements.forEach((element) => {
      const split = new this.SplitType(element, { types: 'chars' });

      this.gsap.from(split.chars, {
        opacity: 0,
        scale: 0.8,
        y: 20,
        duration: 0.4,
        ease: 'back.out(1.7)',
        stagger: 0.02,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    console.log(`📝 Text split animations: ${lineElements.length} lines, ${wordElements.length} words, ${charElements.length} chars`);
  }

  /**
   * Setup fade-up animations for content blocks
   */
  setupFadeUpAnimations() {
    const fadeElements = document.querySelectorAll('[data-animate="fade-up"]');

    fadeElements.forEach((element) => {
      const delay = parseFloat(element.dataset.delay) || 0;

      this.gsap.from(element, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });

    console.log(`⬆️ Fade-up animations: ${fadeElements.length} elements`);
  }

  /**
   * Setup stagger animations for groups
   */
  setupStaggerAnimations() {
    const staggerContainers = document.querySelectorAll('[data-animate="stagger"]');

    staggerContainers.forEach((container) => {
      const children = container.children;

      this.gsap.from(children, {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        ease: 'power2.out',
        stagger: {
          amount: 0.4,
          from: 'start'
        },
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });
    });

    console.log(`🎯 Stagger animations: ${staggerContainers.length} containers`);
  }

  /**
   * Setup section-based color mode switching (like Simone)
   * Sections alternate between light/dark modes
   */
  setupSectionModeSwitch() {
    const sections = document.querySelectorAll('[data-section-mode]');

    sections.forEach((section, index) => {
      const mode = section.dataset.sectionMode;

      this.ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => this.applySectionMode(mode, section, index),
        onEnterBack: () => this.applySectionMode(mode, section, index),
      });
    });

    console.log(`🎨 Section mode switching: ${sections.length} sections`);
  }

  applySectionMode(mode, section, index) {
    const body = document.body;

    // Remove previous mode classes
    body.classList.remove('mode-light', 'mode-dark');
    body.classList.add(`mode-${mode}`);

    // Update visualizer based on section
    if (this.visualizers) {
      const config = this.getVisualizerConfigForSection(mode, index);
      if (this.visualizers.updateForStage) {
        this.visualizers.updateForStage(config);
      }
    }

    // Emit custom event for other systems
    document.dispatchEvent(new CustomEvent('sectionModeChange', {
      detail: { mode, section, index }
    }));
  }

  getVisualizerConfigForSection(mode, index) {
    const configs = {
      light: {
        hue: 0.52 + (index * 0.05),
        intensity: 0.25,
        chaos: 0.12,
        saturation: 0.65,
        gridDensity: 28,
        speed: 0.6
      },
      dark: {
        hue: 0.15 + (index * 0.08),
        intensity: 0.42,
        chaos: 0.18,
        saturation: 0.85,
        gridDensity: 38,
        speed: 0.85
      }
    };

    return configs[mode] || configs.light;
  }

  /**
   * Setup parallax layers for depth
   */
  setupParallaxLayers() {
    const parallaxSections = document.querySelectorAll('[data-parallax]');

    parallaxSections.forEach((section) => {
      const speed = parseFloat(section.dataset.parallax) || 0.5;

      this.gsap.to(section, {
        y: () => (this.ScrollTrigger.maxScroll(window) * speed),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    });

    console.log(`🌊 Parallax layers: ${parallaxSections.length} sections`);
  }

  /**
   * Setup micro-interactions and hover effects
   */
  setupMicroInteractions() {
    // Button hover effects
    const buttons = document.querySelectorAll('.button');
    buttons.forEach((button) => {
      button.addEventListener('mouseenter', () => {
        this.gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      button.addEventListener('mouseleave', () => {
        this.gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Card hover effects
    const cards = document.querySelectorAll('.narrative__item, .metric-card, .badge');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        this.gsap.to(card, {
          y: -8,
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        this.gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    });

    console.log(`✨ Micro-interactions: ${buttons.length} buttons, ${cards.length} cards`);
  }

  /**
   * Refresh ScrollTrigger (useful after dynamic content)
   */
  refresh() {
    this.ScrollTrigger.refresh();
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.lenis) {
      this.lenis.destroy();
    }
    this.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    this.gsap.ticker.remove(this.lenis?.raf);
  }
}
