const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_geometry;
  uniform float u_gridDensity;
  uniform float u_chaos;
  uniform float u_speed;
  uniform float u_hue;
  uniform float u_intensity;
  uniform float u_saturation;
  uniform float u_morph;
  uniform float u_rot4dXW;
  uniform float u_rot4dYW;
  uniform float u_rot4dZW;
  uniform float u_parallax;

  mat4 rotateXW(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat4(
      c, 0.0, 0.0, -s,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      s, 0.0, 0.0, c
    );
  }

  mat4 rotateYW(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat4(
      1.0, 0.0, 0.0, 0.0,
      0.0, c, 0.0, -s,
      0.0, 0.0, 1.0, 0.0,
      0.0, s, 0.0, c
    );
  }

  mat4 rotateZW(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat4(
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, c, -s,
      0.0, 0.0, s, c
    );
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  vec3 project4Dto3D(vec4 p) {
    float w = 2.5 / (2.5 + p.w);
    return vec3(p.x * w, p.y * w, p.z * w);
  }

  float sphereLattice(vec3 p, float gridSize) {
    vec3 cell = fract(p * gridSize) - 0.5;
    return 1.0 - smoothstep(0.15, 0.28, length(cell));
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - u_resolution.xy * 0.5) / min(u_resolution.x, u_resolution.y);
    float timeSpeed = u_time * 0.0001 * u_speed;

    vec4 pos4d = vec4(uv * (2.6 + u_geometry * 0.35),
                      sin(timeSpeed * 3.1) * u_morph,
                      cos(timeSpeed * 2.4) * u_morph);

    pos4d = rotateXW(u_rot4dXW + timeSpeed * 0.35) * pos4d;
    pos4d = rotateYW(u_rot4dYW + timeSpeed * 0.28) * pos4d;
    pos4d = rotateZW(u_rot4dZW + timeSpeed * 0.22) * pos4d;

    vec3 pos3d = project4Dto3D(pos4d);
    pos3d.xy += uv * u_parallax * 0.35;

    float value = sphereLattice(pos3d, u_gridDensity * 0.08);
    float noise = sin(pos4d.x * 6.0) * cos(pos4d.y * 9.0) * sin(pos4d.w * 4.0);
    value += noise * u_chaos;

    float finalIntensity = pow(1.0 - clamp(abs(value), 0.0, 1.0), 2.2) * u_intensity;
    vec3 color = hsv2rgb(vec3(u_hue, u_saturation, 0.95));

    gl_FragColor = vec4(color * finalIntensity, finalIntensity);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

const defaultParams = {
  geometry: 1.0,
  gridDensity: 28,
  chaos: 0.12,
  speed: 0.8,
  hue: 0.55,
  intensity: 0.35,
  saturation: 0.75,
  morph: 1.05,
  rot4dXW: 0.0,
  rot4dYW: 0.0,
  rot4dZW: 0.0,
  parallax: 0.0,
};

export class QuantumVisualizer {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === "string" ? document.getElementById(canvasId) : canvasId;
    this.gl = this.canvas?.getContext("webgl2") || this.canvas?.getContext("webgl");
    this.options = options;

    if (!this.canvas || !this.gl) {
      console.warn("QuantumVisualizer: WebGL not supported or canvas missing");
      return;
    }

    this.params = { ...defaultParams, ...(options.initial || {}) };
    this.targets = { ...this.params };
    this.lerpFactor = options.lerpFactor ?? 0.045;
    this.dprLimit = options.dprLimit ?? 2;
    this.startTime = performance.now();

    this.program = createProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    if (!this.program) {
      console.warn("QuantumVisualizer: failed to compile program");
      return;
    }

    this.locations = this.captureUniforms();
    this.initBuffers();
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  captureUniforms() {
    const names = [
      "u_resolution",
      "u_time",
      "u_geometry",
      "u_gridDensity",
      "u_chaos",
      "u_speed",
      "u_hue",
      "u_intensity",
      "u_saturation",
      "u_morph",
      "u_rot4dXW",
      "u_rot4dYW",
      "u_rot4dZW",
      "u_parallax",
    ];

    return names.reduce((acc, name) => {
      acc[name] = this.gl.getUniformLocation(this.program, name);
      return acc;
    }, {});
  }

  initBuffers() {
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(this.program, "a_position");
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  resize() {
    if (!this.canvas || !this.gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, this.dprLimit);
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    if (!width || !height) return;

    const displayWidth = Math.floor(width * dpr);
    const displayHeight = Math.floor(height * dpr);

    if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
      this.gl.viewport(0, 0, displayWidth, displayHeight);
    }
  }

  updateTargets(next) {
    Object.assign(this.targets, next);
  }

  step() {
    if (!this.gl || !this.program) return;

    for (const key of Object.keys(this.targets)) {
      this.params[key] += (this.targets[key] - this.params[key]) * this.lerpFactor;
    }

    const time = performance.now() - this.startTime;

    this.gl.useProgram(this.program);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.uniform2f(this.locations.u_resolution, this.canvas.width, this.canvas.height);
    this.gl.uniform1f(this.locations.u_time, time);
    this.gl.uniform1f(this.locations.u_geometry, this.params.geometry);
    this.gl.uniform1f(this.locations.u_gridDensity, this.params.gridDensity);
    this.gl.uniform1f(this.locations.u_chaos, this.params.chaos);
    this.gl.uniform1f(this.locations.u_speed, this.params.speed);
    this.gl.uniform1f(this.locations.u_hue, this.params.hue);
    this.gl.uniform1f(this.locations.u_intensity, this.params.intensity);
    this.gl.uniform1f(this.locations.u_saturation, this.params.saturation);
    this.gl.uniform1f(this.locations.u_morph, this.params.morph);
    this.gl.uniform1f(this.locations.u_rot4dXW, this.params.rot4dXW);
    this.gl.uniform1f(this.locations.u_rot4dYW, this.params.rot4dYW);
    this.gl.uniform1f(this.locations.u_rot4dZW, this.params.rot4dZW);
    this.gl.uniform1f(this.locations.u_parallax, this.params.parallax);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}

export class VisualizerConductor {
  constructor(primaryId, accentId) {
    this.primary = new QuantumVisualizer(primaryId, {
      initial: {
        gridDensity: 36,
        chaos: 0.18,
        intensity: 0.4,
        speed: 0.9,
        saturation: 0.82,
        morph: 1.4,
        hue: 0.56,
      },
      lerpFactor: 0.04,
      dprLimit: 2,
    });

    this.accent = new QuantumVisualizer(accentId, {
      initial: {
        gridDensity: 24,
        chaos: 0.1,
        intensity: 0.28,
        speed: 0.65,
        hue: 0.62,
        saturation: 0.9,
        morph: 0.9,
      },
      lerpFactor: 0.06,
      dprLimit: 1.5,
    });

    this.animationFrame = null;
    this.parallax = { x: 0, y: 0, smoothX: 0, smoothY: 0 };
    this.scrollProgress = 0;
    this.tiltActive = false;
    this.tiltOffsets = {
      primary: { rotXW: 0, rotYW: 0, rotZW: 0, intensity: 0, chaos: 0, morph: 0 },
      accent: { rotXW: 0, rotYW: 0, rotZW: 0, intensity: 0, chaos: 0, morph: 0 },
    };
    this.primaryStageTargets = this.primary?.targets ? { ...this.primary.targets } : {};
    this.accentStageTargets = this.accent?.targets ? { ...this.accent.targets } : {};
    this.bindMouse();
    this.applyCompositeTargets();
  }

  bindMouse() {
    window.addEventListener("pointermove", (event) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 2;
      const y = (event.clientY / innerHeight - 0.5) * 2;
      this.parallax.x = x;
      this.parallax.y = y;
    });
  }

  clearTiltOffsets() {
    const reset = (group) => {
      Object.keys(group).forEach((key) => {
        group[key] = 0;
      });
    };
    reset(this.tiltOffsets.primary);
    reset(this.tiltOffsets.accent);
  }

  applyCompositeTargets() {
    const resolve = (value, fallback) => (Number.isFinite(value) ? value : fallback ?? 0);
    const scroll = this.scrollProgress ?? 0;

    if (this.primary?.targets) {
      const base = this.primaryStageTargets;
      const fallback = this.primary.targets;
      const target = {
        ...base,
        intensity: Math.max(
          0,
          resolve(base.intensity, fallback.intensity) + this.tiltOffsets.primary.intensity + scroll * 0.14
        ),
        chaos: Math.max(
          0,
          resolve(base.chaos, fallback.chaos) + this.tiltOffsets.primary.chaos + scroll * 0.08
        ),
        morph:
          resolve(base.morph, fallback.morph) + this.tiltOffsets.primary.morph + scroll * 0.12,
        geometry: resolve(base.geometry, fallback.geometry) + scroll * 0.35,
        speed: resolve(base.speed, fallback.speed) + scroll * 0.25,
        rot4dXW: resolve(base.rot4dXW, 0) + this.tiltOffsets.primary.rotXW,
        rot4dYW: resolve(base.rot4dYW, 0) + this.tiltOffsets.primary.rotYW,
        rot4dZW: resolve(base.rot4dZW, 0) + this.tiltOffsets.primary.rotZW,
      };
      this.primary.updateTargets(target);
    }

    if (this.accent?.targets) {
      const base = this.accentStageTargets;
      const fallback = this.accent.targets;
      const target = {
        ...base,
        intensity: Math.max(
          0,
          resolve(base.intensity, fallback.intensity) + this.tiltOffsets.accent.intensity + scroll * 0.2
        ),
        chaos: Math.max(
          0,
          resolve(base.chaos, fallback.chaos) + this.tiltOffsets.accent.chaos + scroll * 0.1
        ),
        morph:
          resolve(base.morph, fallback.morph) + this.tiltOffsets.accent.morph + scroll * 0.1,
        geometry: resolve(base.geometry, fallback.geometry) + scroll * 0.28,
        speed: resolve(base.speed, fallback.speed) + scroll * 0.22,
        rot4dXW: resolve(base.rot4dXW, 0) + this.tiltOffsets.accent.rotXW,
        rot4dYW: resolve(base.rot4dYW, 0) + this.tiltOffsets.accent.rotYW,
        rot4dZW: resolve(base.rot4dZW, 0) + this.tiltOffsets.accent.rotZW,
      };
      this.accent.updateTargets(target);
    }
  }

  updateForStage(stageConfig) {
    if (!stageConfig) return;

    if (this.primary?.targets) {
      const keys = [
        "hue",
        "intensity",
        "chaos",
        "gridDensity",
        "parallax",
        "speed",
        "morph",
        "rot4dXW",
        "rot4dYW",
        "rot4dZW",
        "geometry",
        "saturation",
      ];
      const next = { ...this.primaryStageTargets };
      keys.forEach((key) => {
        if (stageConfig[key] !== undefined) {
          next[key] = stageConfig[key];
        }
      });
      this.primaryStageTargets = next;
    }

    if (this.accent?.targets) {
      const keys = [
        "chaos",
        "gridDensity",
        "parallax",
        "speed",
        "morph",
        "rot4dXW",
        "rot4dYW",
        "rot4dZW",
        "geometry",
        "saturation",
      ];
      const next = { ...this.accentStageTargets };
      keys.forEach((key) => {
        if (stageConfig[key] !== undefined) {
          next[key] = stageConfig[key];
        }
      });
      if (stageConfig.accentHue !== undefined) {
        next.hue = stageConfig.accentHue;
      } else if (stageConfig.hue !== undefined && next.hue === undefined) {
        next.hue = stageConfig.hue;
      }
      if (stageConfig.accentLift !== undefined) {
        next.intensity = stageConfig.accentLift;
      }
      this.accentStageTargets = next;
    }

    this.applyCompositeTargets();
  }

  setScrollProgress(progress) {
    this.scrollProgress = Math.min(Math.max(progress, 0), 1);
    this.applyCompositeTargets();
  }

  tiltEngage() {
    this.tiltActive = true;
    if (!this.primary?.targets && !this.accent?.targets) return;
    this.tiltOffsets.primary.intensity = 0.08;
    this.tiltOffsets.primary.chaos = 0.03;
    this.tiltOffsets.primary.morph = 0.06;
    this.tiltOffsets.accent.intensity = 0.12;
    this.tiltOffsets.accent.chaos = 0.04;
    this.tiltOffsets.accent.morph = 0.05;
    this.applyCompositeTargets();
  }

  tiltRelease() {
    this.tiltActive = false;
    if (!this.primary?.targets && !this.accent?.targets) return;
    this.clearTiltOffsets();
    this.applyCompositeTargets();
  }

  tiltTo(nx, ny, magnitude = 1) {
    if (!this.primary?.targets && !this.accent?.targets) return;
    const absX = Math.abs(nx);
    const absY = Math.abs(ny);

    this.tiltOffsets.primary.rotXW = ny * 0.9;
    this.tiltOffsets.primary.rotYW = nx * 0.9;
    this.tiltOffsets.primary.rotZW = (absX + absY) * 0.55;

    this.tiltOffsets.accent.rotXW = ny * 1.2;
    this.tiltOffsets.accent.rotYW = nx * 1.1;
    this.tiltOffsets.accent.rotZW = (absX + absY) * 0.8;

    if (this.tiltActive) {
      const boost = 0.12 + magnitude * 0.18;
      this.tiltOffsets.primary.intensity = boost;
      this.tiltOffsets.accent.intensity = boost * 1.4;
      this.tiltOffsets.primary.chaos = 0.04 + magnitude * 0.12;
      this.tiltOffsets.accent.chaos = 0.03 + magnitude * 0.1;
      this.tiltOffsets.primary.morph = 0.08 + magnitude * 0.18;
      this.tiltOffsets.accent.morph = 0.06 + magnitude * 0.16;
    }

    this.applyCompositeTargets();
  }

  tick() {
    this.parallax.smoothX += (this.parallax.x - this.parallax.smoothX) * 0.04;
    this.parallax.smoothY += (this.parallax.y - this.parallax.smoothY) * 0.04;

    if (this.primary?.targets) {
      const baseParallax = Number.isFinite(this.primaryStageTargets.parallax)
        ? this.primaryStageTargets.parallax
        : this.primary.targets.parallax ?? 0;
      const tiltShift = this.tiltOffsets.primary.rotYW * 0.05;
      this.primary.updateTargets({ parallax: baseParallax + this.parallax.smoothX * 0.5 + tiltShift });
      this.primary.step();
    }

    if (this.accent?.targets) {
      const baseParallax = Number.isFinite(this.accentStageTargets.parallax)
        ? this.accentStageTargets.parallax
        : this.accent.targets.parallax ?? 0;
      const tiltShift = this.tiltOffsets.accent.rotYW * 0.08;
      this.accent.updateTargets({ parallax: baseParallax + this.parallax.smoothX * 1.2 + tiltShift });
      this.accent.step();
    }

    this.animationFrame = requestAnimationFrame(() => this.tick());
  }

  start() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.tick();
  }
}
