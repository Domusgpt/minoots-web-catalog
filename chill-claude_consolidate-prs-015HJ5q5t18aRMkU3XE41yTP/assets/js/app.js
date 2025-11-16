import { VisualizerConductor } from "./visualizers.js";
import { MorphChoreography } from "./morph-choreography.js";
import { AnimationOrchestrator } from "./animation-orchestrator.js";

const heroMetrics = [
  { value: "99.999%", label: "Orchestration uptime" },
  { value: "<1µs", label: "Dispatch jitter" },
  { value: "12 regions", label: "Active federations" },
  { value: "∞", label: "Horizontal scale" },
];

const heroBadges = [
  "Deterministic replay",
  "Zero-drift timing",
  "Raft + optical quorum",
  "Hardware timestamping",
  "Observability woven in",
  "Composable intents",
  "Operator primitives",
  "Energy-aware autoscale",
];

const capstoneStats = [
  { label: "Temporal horizon", value: "42 hrs predictive" },
  { label: "Continuum archive", value: "18 PB replay" },
  { label: "Intent latency", value: "220 ms human loop" },
  { label: "Build cadence", value: "weekly flights" },
];

const immersionScenes = [
  {
    id: "atelier-wave",
    label: "Atelier Wave Lab",
    title: "Moodboards that breathe with the runtime",
    body:
      "Ideation tables are wired directly into the temporal lattice so sketches can spike light, sound, and vector fields the moment a new primitive lands.",
    detail: "Pressure-sensitive decks melt into the background as you hover, letting the visualizers flood the room with chroma.",
    highlights: ["Analog syncboard", "Holographic drift cues", "Operator chorus"],
    visualizer: { hue: 0.62, accentHue: 0.8, intensity: 0.52, chaos: 0.22, gridDensity: 34, morph: 1.28, speed: 0.86 },
    backdrop: { depth: 0.28, grain: 0.2, glow: 0.9, tilt: 0.22 },
  },
  {
    id: "continuum-stage",
    label: "Continuum Stagecraft",
    title: "Staging rollouts like kinetic performances",
    body:
      "Choreographers scrub the scroll on a wraparound wall. Each cue ripples across the canvases while the system cards fade into scenic lighting and become the scene itself.",
    detail: "Touch, drag, and breathe on the wall to warp projections and capture micro-reactions.",
    highlights: ["Failover dramaturgy", "Looping playback pits", "Realtime applause meters"],
    visualizer: { hue: 0.08, accentHue: 0.02, intensity: 0.46, chaos: 0.18, gridDensity: 30, morph: 1.4, speed: 0.92 },
    backdrop: { depth: 0.22, grain: 0.16, glow: 1.08, tilt: -0.14 },
  },
  {
    id: "optic-loft",
    label: "Optic Loft",
    title: "RGB moiré research loft",
    body:
      "The loft prototypes our offset grids. Cards stretch into architectural planes, stacking translucent films that shimmer as visitors tilt their devices.",
    detail: "Scanlines respond to heartbeat sensors while the accent canvas folds into 4D rotations with every lean.",
    highlights: ["Adaptive moiré glass", "Spatialized synth reacts", "Latency wave-scout"],
    visualizer: { hue: 0.9, accentHue: 0.78, intensity: 0.5, chaos: 0.26, gridDensity: 38, morph: 1.1, speed: 0.74 },
    backdrop: { depth: 0.32, grain: 0.24, glow: 0.86, tilt: 0.35 },
  },
];

const systems = [
  {
    id: "temporal-engine",
    index: "01",
    title: "Temporal Engine",
    tagline: "Deterministic scheduling fabric",
    visualizer: { hue: 0.56, accentHue: 0.64, intensity: 0.44, chaos: 0.18, gridDensity: 38 },
    stages: [
      {
        chip: "Pulse",
        title: "Atomic heartbeats",
        lede: "Phase-aligned clocks fuse GPS, PTP, and hardware timers into a single lattice.",
        body: "Temporal shards reconcile drift every 250µs so the orchestration fabric never misses a beat even as nodes churn and latency breathes.",
        bullets: [
          "Nanosecond skew correction",
          "Adaptive quorum pulses",
          "Quantum jitter dampening",
        ],
        metrics: [
          { value: "250µs", label: "Resync cadence" },
          { value: "<0.8µs", label: "Observed skew" },
        ],
        visualizer: { intensity: 0.42, chaos: 0.16 },
      },
      {
        chip: "Structure",
        title: "Deterministic channeling",
        lede: "Temporal lanes parcel workloads into deterministic bursts.",
        body: "Event horizons form around high-priority lanes, reserving deterministic execution for robotics, trading, and live production cues.",
        bullets: [
          "Priority bands with guardrails",
          "Programmable dispatch arcs",
          "Intelligent load apertures",
        ],
        metrics: [
          { value: "64 lanes", label: "Temporal partitions" },
          { value: "3:1", label: "Burst compression" },
        ],
        visualizer: { hue: 0.58, accentHue: 0.66, gridDensity: 42 },
      },
      {
        chip: "Telemetry",
        title: "Live drift cartography",
        lede: "Every microservice is plotted against the reference clock.",
        body: "The engine renders differential telemetry, flagging outliers with reactive pulses so operators feel drift before logs report it.",
        bullets: [
          "Vector clocks per tenant",
          "Auto calibration sweeps",
          "Deterministic audit feed",
        ],
        metrics: [
          { value: "5ms", label: "Alert preemption" },
          { value: "0 data loss", label: "Reconciliation" },
        ],
        visualizer: { intensity: 0.48, chaos: 0.2 },
      },
      {
        chip: "Story",
        title: "Conduct the swarm",
        lede: "Operators sculpt rollouts as if directing music.",
        body: "Gesture-driven controls overlay the lattice, letting humans accentuate peaks or drop into slow motion during critical releases.",
        bullets: [
          "Haptic baton support",
          "Intent-driven scheduling",
          "Cinematic playback",
        ],
        metrics: [
          { value: "90 s", label: "Full rollback" },
          { value: "1 gesture", label: "Failover trigger" },
        ],
        visualizer: { hue: 0.6, accentHue: 0.7, intensity: 0.52 },
      },
    ],
  },
  {
    id: "consensus-field",
    index: "02",
    title: "Consensus Field",
    tagline: "Raft tuned for kinetic state",
    visualizer: { hue: 0.08, accentHue: 0.03, intensity: 0.36, chaos: 0.14, gridDensity: 34 },
    stages: [
      {
        chip: "Pulse",
        title: "Adaptive quorums",
        lede: "Leader election senses thermal load, routing votes through cooler nodes.",
        body: "Quorums bend without breaking, leveraging optical side-channels to keep the field resilient when networks wobble.",
        bullets: [
          "Witness node assist",
          "Pre-vote safeguards",
          "Optic telemetry hooks",
        ],
        metrics: [
          { value: "45 ms", label: "Election swing" },
          { value: "99.999%", label: "Availability" },
        ],
        visualizer: { hue: 0.09, accentHue: 0.02 },
      },
      {
        chip: "Structure",
        title: "Log braiding",
        lede: "Replication braids logs with checksum harmonics for instant verification.",
        body: "Joint consensus keeps upgrades hot while log streaming applies predictive defrag to avoid slowdowns.",
        bullets: [
          "Snapshot compaction",
          "Predictive defrag",
          "Quorum lens metrics",
        ],
        metrics: [
          { value: "12 µs", label: "Commit confirm" },
          { value: "x4", label: "Throughput lift" },
        ],
        visualizer: { intensity: 0.4, chaos: 0.18 },
      },
      {
        chip: "Telemetry",
        title: "State-space holograms",
        lede: "Topology overlays show quorum health in 4D twists.",
        body: "Operators spot divergence instantly as the accent canvas glows warmer when latency builds on any region.",
        bullets: [
          "Latency isochrones",
          "Anomaly rehearsals",
          "Consensus heatmaps",
        ],
        metrics: [
          { value: "3 hops", label: "Repair radius" },
          { value: "70%", label: "Faster diagnosis" },
        ],
        visualizer: { accentHue: 0.06, accentLift: 0.34 },
      },
      {
        chip: "Story",
        title: "Failover theater",
        lede: "Runbooks transform into cinematic sequences with tactile cues.",
        body: "When the field rehearses a failover, the canvases crescendo while the system records every move for compliance.",
        bullets: [
          "Guided rehearsal mode",
          "Compliance capture",
          "Intent journaling",
        ],
        metrics: [
          { value: "7 min", label: "Global rehearse" },
          { value: "0 drift", label: "Post drill" },
        ],
        visualizer: { hue: 0.1, intensity: 0.46 },
      },
    ],
  },
  {
    id: "execution-mesh",
    index: "03",
    title: "Execution Mesh",
    tagline: "Autopilot workloads across any substrate",
    visualizer: { hue: 0.42, accentHue: 0.5, intensity: 0.38, chaos: 0.16, gridDensity: 36 },
    stages: [
      {
        chip: "Pulse",
        title: "Adaptive lane shifting",
        lede: "Workloads ride fluid pipelines that inhale telemetry in real time.",
        body: "Mesh lanes widen under pressure, streaming compute to GPUs, WASM sandboxes, or edge bursts without friction.",
        bullets: [
          "Resource mirroring",
          "WASM + OCI parity",
          "Latency-aware staging",
        ],
        metrics: [
          { value: "40%", label: "Utilization gain" },
          { value: "120 ms", label: "Edge dispatch" },
        ],
        visualizer: { accentHue: 0.52, intensity: 0.42 },
      },
      {
        chip: "Structure",
        title: "Policy graph choreography",
        lede: "Intent graphs map dependencies and safety rails before execution.",
        body: "Operators sculpt flows using natural language. Policies compile to deterministic graphs with guardrails baked in.",
        bullets: [
          "Human intent parsing",
          "Versioned flow registry",
          "Safe-mode branches",
        ],
        metrics: [
          { value: "<5 min", label: "Graph rollout" },
          { value: "3 modes", label: "Safety tiers" },
        ],
        visualizer: { hue: 0.45, gridDensity: 38 },
      },
      {
        chip: "Telemetry",
        title: "Execution chorus",
        lede: "Timeline heatmaps sing status updates in one sweep.",
        body: "Success, retries, and deferrals animate across the canvases, allowing teams to parse thousands of tasks at a glance.",
        bullets: [
          "Realtime flow playback",
          "Multiplayer annotations",
          "Machine assist triage",
        ],
        metrics: [
          { value: "8×", label: "Faster triage" },
          { value: "50 ms", label: "Update cadence" },
        ],
        visualizer: { accentLift: 0.36, chaos: 0.2 },
      },
      {
        chip: "Story",
        title: "Trust the autopilot",
        lede: "Mesh autopilot whispers when interventions help.",
        body: "Predictive overlays highlight the next best action, while automation scripts co-create patches alongside humans.",
        bullets: [
          "Intelligent guardrails",
          "Explainable reroutes",
          "Intent playback",
        ],
        metrics: [
          { value: "93%", label: "Auto resolution" },
          { value: "1.3×", label: "Ticket reduction" },
        ],
        visualizer: { hue: 0.47, intensity: 0.5 },
      },
    ],
  },
  {
    id: "observability-array",
    index: "04",
    title: "Observability Array",
    tagline: "Sensemaking that feels tactile",
    visualizer: { hue: 0.66, accentHue: 0.72, intensity: 0.34, chaos: 0.14, gridDensity: 30 },
    stages: [
      {
        chip: "Pulse",
        title: "Unified signal fabric",
        lede: "Logs, traces, and metrics stream through a synesthetic palette.",
        body: "Operators toggle focus to hear anomalies through color, vibration, and copy.",
        bullets: [
          "Synced triple ingest",
          "Human-tuned palettes",
          "Latency echo radar",
        ],
        metrics: [
          { value: "2.5 s", label: "Signal fusion" },
          { value: "5×", label: "Anomaly clarity" },
        ],
        visualizer: { hue: 0.68, accentHue: 0.76, intensity: 0.36 },
      },
      {
        chip: "Structure",
        title: "Contextual overlays",
        lede: "Every chart nests intent, owners, and escalation paths.",
        body: "Context ribbons hover near metrics so nobody hunts across tools for accountability.",
        bullets: [
          "Lineage overlays",
          "Intent breadcrumbs",
          "Instant escalation lane",
        ],
        metrics: [
          { value: "12 s", label: "Context switch" },
          { value: "0", label: "Lost alerts" },
        ],
        visualizer: { intensity: 0.38, gridDensity: 32 },
      },
      {
        chip: "Telemetry",
        title: "Narrative incidents",
        lede: "Incidents assemble themselves into living documents.",
        body: "Screenshots, logs, and human notes weave into one timeline you can replay anytime.",
        bullets: [
          "Auto story drafts",
          "Collaborative markup",
          "Artifact exports",
        ],
        metrics: [
          { value: "65%", label: "Faster retros" },
          { value: "24 hr", label: "Replay retention" },
        ],
        visualizer: { accentLift: 0.32, chaos: 0.18 },
      },
      {
        chip: "Story",
        title: "Elastic calm",
        lede: "When the array is green, the accent canvas breathes slow.",
        body: "Teams feel the calm through gentle pulses, building trust in the quiet moments between spikes.",
        bullets: [
          "Biofeedback loops",
          "Calm-mode playlist",
          "Ambient notifications",
        ],
        metrics: [
          { value: "18%", label: "Stress drop" },
          { value: "4.2", label: "NPS uplift" },
        ],
        visualizer: { intensity: 0.28, chaos: 0.12 },
      },
    ],
  },
  {
    id: "resilience-envelope",
    index: "05",
    title: "Resilience Envelope",
    tagline: "Self-healing blast radius control",
    visualizer: { hue: 0.9, accentHue: 0.78, intensity: 0.33, chaos: 0.18, gridDensity: 32 },
    stages: [
      {
        chip: "Pulse",
        title: "Predictive shielding",
        lede: "Thermal models predict blast radius five minutes ahead.",
        body: "Envelope nodes deploy countermeasures before incidents bloom, isolating faults gracefully.",
        bullets: [
          "Chaos rehearsal feed",
          "Circuit breaker mesh",
          "Graceful degrade modes",
        ],
        metrics: [
          { value: "5 min", label: "Forecast lead" },
          { value: "92%", label: "Containment" },
        ],
        visualizer: { hue: 0.92, accentHue: 0.8, intensity: 0.38 },
      },
      {
        chip: "Structure",
        title: "Blast choreography",
        lede: "Every fallback path is rehearsed through interactive timelines.",
        body: "Operators drag along the timeline to preview service impact before they press go.",
        bullets: [
          "Dual-run guardrails",
          "Runtime diffing",
          "Playbook overlays",
        ],
        metrics: [
          { value: "60 s", label: "Failover prep" },
          { value: "4", label: "Fallback tiers" },
        ],
        visualizer: { intensity: 0.4, chaos: 0.22 },
      },
      {
        chip: "Telemetry",
        title: "Healing gradients",
        lede: "Recovery arcs glow as services rebound.",
        body: "Post-incident reports become living gradients showing how risk drains away in real time.",
        bullets: [
          "Dynamic RTO charts",
          "Contract-aware SLAs",
          "Aftershock monitors",
        ],
        metrics: [
          { value: "45%", label: "Faster MTTR" },
          { value: "0 surprise", label: "Aftershocks" },
        ],
        visualizer: { accentLift: 0.34 },
      },
      {
        chip: "Story",
        title: "Immunity theatre",
        lede: "Celebrations pulse when the envelope shields the fleet.",
        body: "Animated ribbons wrap the canvas, turning resilience into a team sport that’s felt, not just logged.",
        bullets: [
          "Scoreboard loops",
          "Gratitude pings",
          "Posture heatmaps",
        ],
        metrics: [
          { value: "28%", label: "Engagement" },
          { value: "12", label: "Monthly saves" },
        ],
        visualizer: { hue: 0.88, intensity: 0.45 },
      },
    ],
  },
  {
    id: "developer-flow",
    index: "06",
    title: "Developer Flow",
    tagline: "A canvas for building temporal plays",
    visualizer: { hue: 0.74, accentHue: 0.84, intensity: 0.34, chaos: 0.12, gridDensity: 28 },
    stages: [
      {
        chip: "Pulse",
        title: "Instant feedback",
        lede: "Local dev sandboxes sync with the global lattice in seconds.",
        body: "Code changes preview the exact orchestration path, with live mocks pushing realistic responses.",
        bullets: [
          "Tight inner loops",
          "Hot reload orchestrations",
          "Design-first CLI",
        ],
        metrics: [
          { value: "12×", label: "Faster prototyping" },
          { value: "90 s", label: "Seed environment" },
        ],
        visualizer: { accentHue: 0.86, accentLift: 0.36 },
      },
      {
        chip: "Structure",
        title: "Composable primitives",
        lede: "Every workflow compiles to reusable motifs.",
        body: "Designers drag-and-drop motifs in the story editor while engineers refine them in code simultaneously.",
        bullets: [
          "Shared motif registry",
          "Live design tokens",
          "Bidirectional docs",
        ],
        metrics: [
          { value: "200+", label: "Library blocks" },
          { value: "dual", label: "Design/dev mode" },
        ],
        visualizer: { gridDensity: 30, intensity: 0.38 },
      },
      {
        chip: "Telemetry",
        title: "Flow analytics",
        lede: "Teams watch adoption and friction across every play.",
        body: "Session replays align with the canvases, revealing where builder attention spikes.",
        bullets: [
          "Co-creation heatmaps",
          "Latency overlays",
          "Guided tours",
        ],
        metrics: [
          { value: "72%", label: "Completion" },
          { value: "-38%", label: "Time-to-ship" },
        ],
        visualizer: { chaos: 0.18, accentLift: 0.32 },
      },
      {
        chip: "Story",
        title: "Living docs",
        lede: "Documentation breathes, reflecting the state of the platform.",
        body: "Writers co-author release stories with the system, capturing haptic cues and visual states for future teams.",
        bullets: [
          "Narrated tours",
          "Live API cards",
          "Semantic search",
        ],
        metrics: [
          { value: "45%", label: "Support drop" },
          { value: "4.8★", label: "Builder satisfaction" },
        ],
        visualizer: { hue: 0.78, intensity: 0.42 },
      },
    ],
  },
  {
    id: "governance-circuit",
    index: "07",
    title: "Governance Circuit",
    tagline: "Policy with grace and feedback",
    visualizer: { hue: 0.14, accentHue: 0.18, intensity: 0.32, chaos: 0.12, gridDensity: 32 },
    stages: [
      {
        chip: "Pulse",
        title: "Living guardrails",
        lede: "Policies pulse with traffic, relaxing when safe and tightening when risk rises.",
        body: "The circuit checks every intent for compliance without blocking flow unless thresholds trip.",
        bullets: [
          "Real-time attestation",
          "Behavioral scoring",
          "Graceful degradations",
        ],
        metrics: [
          { value: "98%", label: "Auto approvals" },
          { value: "0.4 s", label: "Policy eval" },
        ],
        visualizer: { hue: 0.16, intensity: 0.34 },
      },
      {
        chip: "Structure",
        title: "Rights choreography",
        lede: "Access flows through arcs tied to human rituals.",
        body: "Sunset ceremonies and rotation reminders appear as ambient events, not blunt popups.",
        bullets: [
          "Temporal access lanes",
          "Escalation rituals",
          "Audit-ready exports",
        ],
        metrics: [
          { value: "7 min", label: "Rotation" },
          { value: "100%", label: "SOX-ready" },
        ],
        visualizer: { gridDensity: 34, chaos: 0.16 },
      },
      {
        chip: "Telemetry",
        title: "Ethical glass box",
        lede: "Every decision displays the why, not just the what.",
        body: "Stakeholders replay access paths, understanding tradeoffs before approvals land.",
        bullets: [
          "Decision timelines",
          "Bias detectors",
          "Accountability mesh",
        ],
        metrics: [
          { value: "4.6★", label: "Trust index" },
          { value: "-63%", label: "Policy tickets" },
        ],
        visualizer: { accentHue: 0.2, accentLift: 0.3 },
      },
      {
        chip: "Story",
        title: "Graceful compliance",
        lede: "Audits feel like guided stories instead of drills.",
        body: "Curation tools let compliance teams remix evidence into immersive walkthroughs.",
        bullets: [
          "Interactive attestations",
          "Audit storytelling",
          "Multi-sensory receipts",
        ],
        metrics: [
          { value: "30%", label: "Audit speed" },
          { value: "-55%", label: "On-call fatigue" },
        ],
        visualizer: { hue: 0.18, intensity: 0.4 },
      },
    ],
  },
  {
    id: "integration-halo",
    index: "08",
    title: "Integration Halo",
    tagline: "Connect any surface without seams",
    visualizer: { hue: 0.32, accentHue: 0.38, intensity: 0.3, chaos: 0.14, gridDensity: 30 },
    stages: [
      {
        chip: "Pulse",
        title: "Unified schema flux",
        lede: "Schemas reconcile themselves through semantic twins.",
        body: "The halo reads new payloads and offers suggestions before the first error hits.",
        bullets: [
          "Self-healing contracts",
          "Streaming schema diffs",
          "Partner confidence index",
        ],
        metrics: [
          { value: "0.2 s", label: "Sync converge" },
          { value: "92%", label: "Auto mapping" },
        ],
        visualizer: { hue: 0.34, accentHue: 0.4 },
      },
      {
        chip: "Structure",
        title: "Surface adapters",
        lede: "Drag connectors onto the canvas to sketch new unions.",
        body: "Adapters animate between canvases, revealing how data will pulse across boundaries.",
        bullets: [
          "Adapter marketplace",
          "No-code arcs",
          "Sandbox mirroring",
        ],
        metrics: [
          { value: "50+", label: "Native bridges" },
          { value: "<10 min", label: "New integration" },
        ],
        visualizer: { intensity: 0.34, chaos: 0.18 },
      },
      {
        chip: "Telemetry",
        title: "Partner clarity",
        lede: "Shared dashboards keep external teams in sync.",
        body: "Link remote operations to your lattice with shared journeys that highlight exactly where to tweak.",
        bullets: [
          "Cross-tenant transparency",
          "Intent mirroring",
          "Shared success loops",
        ],
        metrics: [
          { value: "3×", label: "Integration velocity" },
          { value: "-48%", label: "Escalations" },
        ],
        visualizer: { accentLift: 0.34, gridDensity: 32 },
      },
      {
        chip: "Story",
        title: "Network glow",
        lede: "Celebrate partner launches with immersive choreography.",
        body: "The halo brightens each time a partner ships, projecting a shared future across the canvases.",
        bullets: [
          "Launch ceremonies",
          "Shared growth loops",
          "In-app gratitude",
        ],
        metrics: [
          { value: "11", label: "Partner galaxies" },
          { value: "220%", label: "Co-sell uplift" },
        ],
        visualizer: { hue: 0.36, intensity: 0.42 },
      },
    ],
  },
  {
    id: "continuum-horizon",
    index: "09",
    title: "Continuum Horizon",
    tagline: "Always-on experimentation",
    visualizer: { hue: 0.52, accentHue: 0.6, intensity: 0.32, chaos: 0.12, gridDensity: 28 },
    stages: [
      {
        chip: "Pulse",
        title: "Hypothesis playground",
        lede: "Launch experiments with guardrails that feel playful, not heavy.",
        body: "Horizon sandboxes spin up on demand with synthetic traffic to de-risk moonshots.",
        bullets: [
          "Scenario composer",
          "Synthetic traffic",
          "Team co-labs",
        ],
        metrics: [
          { value: "3 min", label: "Experiment spin" },
          { value: "+45%", label: "Learning velocity" },
        ],
        visualizer: { hue: 0.54, accentHue: 0.62, intensity: 0.36 },
      },
      {
        chip: "Structure",
        title: "Outcome weaver",
        lede: "Results stitch into the product backlog with context.",
        body: "Experiments annotate metrics, tickets, and design docs automatically.",
        bullets: [
          "Backlog sync",
          "Design playback",
          "Impact labeling",
        ],
        metrics: [
          { value: "72%", label: "Idea adoption" },
          { value: "<1 hr", label: "Insight publish" },
        ],
        visualizer: { gridDensity: 30, chaos: 0.16 },
      },
      {
        chip: "Telemetry",
        title: "Signal loom",
        lede: "Aggregated insights glow brighter when evidence is strong.",
        body: "The loom amplifies the metrics that matter and quiets noise with weighted confidence.",
        bullets: [
          "Evidence scoring",
          "Confidence halos",
          "Auto share-outs",
        ],
        metrics: [
          { value: "88%", label: "Confident calls" },
          { value: "-34%", label: "Decision debt" },
        ],
        visualizer: { accentLift: 0.36, intensity: 0.38 },
      },
      {
        chip: "Story",
        title: "Perpetual beta",
        lede: "Product surfaces stay in motion, gracefully.",
        body: "Customers opt into labs and feel the journey through curated releases woven with gratitude loops.",
        bullets: [
          "Customer councils",
          "Opt-in labs",
          "Appreciation arcs",
        ],
        metrics: [
          { value: "4.9★", label: "Lab happiness" },
          { value: "19", label: "Active journeys" },
        ],
        visualizer: { hue: 0.58, intensity: 0.44 },
      },
    ],
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const numberOr = (value, fallback) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

function setPaletteVariables(element, config = {}, prefix = "--card") {
  if (!element) return;
  const hue = ((config.hue ?? 0.58) % 1 + 1) % 1;
  const accentHue = ((config.accentHue ?? config.hue ?? hue) % 1 + 1) % 1;
  const intensity = clamp(numberOr(config.intensity, 0.4), 0, 1.6);
  const accentLift = clamp(numberOr(config.accentLift ?? intensity * 1.1, 0.55), 0, 2);
  const depth = clamp(numberOr(config.depth ?? intensity * 0.6, 0.22), 0, 1.2);
  const grain = clamp(numberOr(config.grain ?? config.chaos ?? 0.16, 0.16), 0, 1.2);
  const glow = clamp(numberOr(config.glow ?? config.morph ?? 1.1, 1.1), 0.2, 2.4);

  element.style.setProperty(`${prefix}-h`, `${(hue * 360).toFixed(2)}deg`);
  element.style.setProperty(`${prefix}-accent-h`, `${(accentHue * 360).toFixed(2)}deg`);
  element.style.setProperty(`${prefix}-bright`, `${(32 + intensity * 42).toFixed(2)}%`);
  element.style.setProperty(`${prefix}-accent-bright`, `${(46 + accentLift * 34).toFixed(2)}%`);
  element.style.setProperty(`${prefix}-depth`, `${(18 + depth * 42).toFixed(2)}%`);
  element.style.setProperty(`${prefix}-grain`, (0.08 + grain * 0.35).toFixed(3));
  element.style.setProperty(`${prefix}-glow`, (0.42 + glow * 0.08).toFixed(3));
}

function assignVisualizerDataset(element, config = {}) {
  if (!element || !config) return;
  Object.entries(config).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const dataKey = `viz${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    element.dataset[dataKey] = value;
  });
}

function readVisualizerDataset(element) {
  if (!element) return {};
  const output = {};
  Object.keys(element.dataset).forEach((key) => {
    if (!key.startsWith("viz")) return;
    const normalized = key.slice(3);
    if (!normalized) return;
    const prop = normalized.charAt(0).toLowerCase() + normalized.slice(1);
    output[prop] = numberOr(element.dataset[key], element.dataset[key]);
  });
  return output;
}

function applyBackdropPalette(config = {}) {
  setPaletteVariables(document.documentElement, config, "--scene");
  const tilt = numberOr(config.tilt ?? config.parallax ?? 0, 0);
  const sheen = clamp(numberOr(config.sheen ?? config.intensity ?? 0.4, 0.4), 0, 1.8);
  document.documentElement.style.setProperty("--scene-tilt", `${(tilt * 48).toFixed(2)}deg`);
  document.documentElement.style.setProperty("--scene-sheen", (0.25 + sheen * 0.35).toFixed(3));
}

function renderHero() {
  const metricsRoot = document.getElementById("hero-metrics");
  const fragment = document.createDocumentFragment();
  heroMetrics.forEach(({ value, label }) => {
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `
      <span class="metric-card__value">${value}</span>
      <span class="metric-card__label">${label}</span>
    `;
    fragment.appendChild(card);
  });
  metricsRoot.appendChild(fragment);

  const badgesRoot = document.getElementById("hero-badges");
  const badgeFragment = document.createDocumentFragment();
  heroBadges.forEach((label) => {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = label;
    badgeFragment.appendChild(badge);
  });
  badgesRoot.appendChild(badgeFragment);
}

function renderCapstone() {
  const statsRoot = document.getElementById("capstone-stats");
  const fragment = document.createDocumentFragment();
  capstoneStats.forEach(({ label, value }) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    fragment.append(dt, dd);
  });
  statsRoot.appendChild(fragment);
}

function renderImmersionGallery() {
  const gallery = document.getElementById("immersion-gallery");
  if (!gallery) return;

  const fragment = document.createDocumentFragment();
  immersionScenes.forEach((scene, index) => {
    const card = document.createElement("article");
    card.className = "immersion-card";
    card.id = scene.id;
    card.dataset.index = index.toString();
    assignVisualizerDataset(card, scene.visualizer);
    if (scene.backdrop?.depth !== undefined) card.dataset.backdropDepth = scene.backdrop.depth;
    if (scene.backdrop?.grain !== undefined) card.dataset.backdropGrain = scene.backdrop.grain;
    if (scene.backdrop?.glow !== undefined) card.dataset.backdropGlow = scene.backdrop.glow;
    if (scene.backdrop?.tilt !== undefined) card.dataset.backdropTilt = scene.backdrop.tilt;
    setPaletteVariables(card, { ...scene.visualizer, ...scene.backdrop }, "--immersion");

    const highlights = (scene.highlights ?? [])
      .map((item) => `<li><span></span>${item}</li>`)
      .join("");

    card.innerHTML = `
      <div class="immersion-card__frame">
        <div class="immersion-card__background" aria-hidden="true"></div>
        <div class="immersion-card__halo" aria-hidden="true"></div>
        <header class="immersion-card__header">
          <span class="immersion-card__index">${String(index + 1).padStart(2, "0")}</span>
          <div class="immersion-card__headline">
            <span class="immersion-card__label">${scene.label}</span>
            <h3>${scene.title}</h3>
          </div>
        </header>
        <p class="immersion-card__body">${scene.body}</p>
        <div class="immersion-card__footer">
          <p class="immersion-card__detail">${scene.detail}</p>
          <ul class="immersion-card__list">${highlights}</ul>
          <button class="immersion-card__trigger" type="button">Pulse the canvases</button>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  gallery.appendChild(fragment);
}

function renderExpansionContent(expansion, system, stage, stageIndex = 0, stageCount = 1) {
  if (!expansion || !stage) return;

  const metrics = (stage.metrics ?? []).slice(0, 3);
  const bullets = (stage.bullets ?? []).slice(0, Math.max(0, 3 - metrics.length));
  const metaPieces = [
    ...metrics.map(({ value, label }) => `<span>${value}<em>${label}</em></span>`),
    ...bullets.map((bullet) => `<span>${bullet}</span>`),
  ];

  if (!metaPieces.length) {
    metaPieces.push(`<span>${system.tagline}</span>`);
  }

  const phaseLabel = stageCount > 1 ? `Phase ${stageIndex + 1} of ${stageCount}` : `Phase ${stageIndex + 1}`;
  const heading = `${system.index} • ${stage.chip ?? stage.title}`;

  expansion.innerHTML = `
    <div class="scroll-card__expansion-title">${heading}<span class="scroll-card__expansion-phase"> // ${phaseLabel}</span></div>
    <p class="scroll-card__expansion-lede">${stage.lede}</p>
    <p class="scroll-card__expansion-body">${stage.body}</p>
    <div class="scroll-card__expansion-meta">
      ${metaPieces.join("")}
    </div>
  `;
}

function createStage(stage, index) {
  const stageEl = document.createElement("article");
  stageEl.className = "stage";
  stageEl.dataset.index = index.toString();
  stageEl.dataset.active = "false";
  stageEl.innerHTML = `
    <span class="stage__chip">${stage.chip}</span>
    <h3 class="stage__title">${stage.title}</h3>
    <p class="stage__lede">${stage.lede}</p>
    <p class="stage__body">${stage.body}</p>
  `;

  if (stage.bullets?.length) {
    const list = document.createElement("ul");
    list.className = "stage__bullets";
    stage.bullets.forEach((bullet) => {
      const li = document.createElement("li");
      li.textContent = bullet;
      list.appendChild(li);
    });
    stageEl.appendChild(list);
  }

  if (stage.metrics?.length) {
    const metrics = document.createElement("div");
    metrics.className = "stage__metrics";
    stage.metrics.forEach(({ value, label }) => {
      const metric = document.createElement("div");
      metric.className = "stage__metric";
      metric.innerHTML = `
        <span>${value}</span>
        <span>${label}</span>
      `;
      metrics.appendChild(metric);
    });
    stageEl.appendChild(metrics);
  }

  return stageEl;
}

function renderSystems(track) {
  const fragment = document.createDocumentFragment();

  systems.forEach((system, systemIndex) => {
    const section = document.createElement("section");
    section.className = "scroll-card";
    section.id = system.id;
    section.dataset.index = systemIndex.toString();
    section.dataset.stageCount = system.stages.length.toString();
    section.style.setProperty("--stage-count", system.stages.length);
    assignVisualizerDataset(section, system.visualizer);
    setPaletteVariables(section, system.visualizer, "--card");

    const inner = document.createElement("div");
    inner.className = "scroll-card__inner";

    const header = document.createElement("header");
    header.className = "scroll-card__header";
    header.innerHTML = `
      <span class="scroll-card__index">${system.index}</span>
      <div>
        <h3 class="scroll-card__title">${system.title}</h3>
        <p class="scroll-card__tagline">${system.tagline}</p>
      </div>
    `;

    const stagesRoot = document.createElement("div");
    stagesRoot.className = "scroll-card__stages";
    system.stages.forEach((stage, stageIndex) => {
      const stageEl = createStage(stage, stageIndex);
      if (stageIndex === 0) stageEl.dataset.active = "true";
      stagesRoot.appendChild(stageEl);
    });

    const expansion = document.createElement("aside");
    expansion.className = "scroll-card__expansion";
    renderExpansionContent(expansion, system, system.stages[0], 0, system.stages.length);

    inner.append(header, stagesRoot, expansion);
    section.dataset.stage = "0";
    section.style.setProperty("--stage-progress", "0");

    section.append(inner);
    fragment.append(section);
  });

  track.appendChild(fragment);
}

function setupScrollDirector(visualizers) {
  const cards = Array.from(document.querySelectorAll(".scroll-card"));
  const body = document.body;
  let activeCard = null;
  let activeStageIndex = -1;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeCard = entry.target;
          entry.target.dataset.active = "true";
          activeStageIndex = -1;
          update();
        } else if (entry.target === activeCard && !entry.isIntersecting) {
          entry.target.dataset.active = "false";
          entry.target.dataset.immersed = "false";
          if (activeCard === entry.target) {
            activeCard = null;
            activeStageIndex = -1;
          }
        }
      });
    },
    { threshold: 0.45 }
  );

  cards.forEach((card) => observer.observe(card));

  function update() {
    if (!activeCard) return;
    const rect = activeCard.getBoundingClientRect();
    const stageCount = Number(activeCard.dataset.stageCount);
    if (!stageCount) return;

    const viewport = window.innerHeight;
    const center = viewport * 0.5;
    const progress = clamp((center - rect.top) / rect.height, 0, 1 - 1e-6);
    const scaled = progress * stageCount;
    const stageIndex = clamp(Math.floor(scaled), 0, stageCount - 1);
    const stageProgress = scaled - stageIndex;

    activeCard.style.setProperty("--stage-progress", stageProgress.toFixed(3));
    activeCard.style.setProperty("--stage-frac", stageProgress.toFixed(3));
    activeCard.dataset.immersed = stageProgress > 0.62 ? "true" : "false";
    document.documentElement.style.setProperty("--scene-progress", stageProgress.toFixed(3));

    const systemIndex = Number(activeCard.dataset.index);
    const system = systems[systemIndex];
    if (!system) return;

    const stage = system.stages?.[stageIndex];
    const stageConfig = stage?.visualizer ?? {};
    const baseConfig = { ...system.visualizer, ...readVisualizerDataset(activeCard) };
    const palette = { ...baseConfig, ...stageConfig };
    palette.depth = numberOr(palette.depth, 0.28) + stageProgress * 0.26;
    palette.grain = numberOr(palette.grain, palette.chaos ?? 0.16) + stageProgress * 0.12;
    palette.glow = numberOr(palette.glow, palette.morph ?? 1.1) + stageProgress * 0.28;
    palette.tilt = numberOr(stageConfig.tilt ?? baseConfig.tilt ?? 0, 0) + (stageProgress - 0.5) * 0.18;

    setPaletteVariables(activeCard, palette, "--card");
    applyBackdropPalette(palette);
    if (body) {
      body.dataset.scene = `${system.id}-${stageIndex}`;
    }

    if (visualizers?.setScrollProgress) {
      visualizers.setScrollProgress(stageProgress);
    }

    if (stageIndex !== activeStageIndex) {
      activeStageIndex = stageIndex;
      const stages = activeCard.querySelectorAll(".stage");
      stages.forEach((stageEl, idx) => {
        stageEl.dataset.active = idx === stageIndex ? "true" : "false";
      });

      visualizers.updateForStage({ ...baseConfig, ...stageConfig });

      activeCard.dataset.stage = stageIndex.toString();
      const expansion = activeCard.querySelector(".scroll-card__expansion");
      if (expansion) {
        renderExpansionContent(expansion, system, stage, stageIndex, stageCount);
      }
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

function setupImmersionReactivity(visualizers) {
  const gallery = document.getElementById("immersion-gallery");
  if (!gallery) return;

  const scenes = Array.from(gallery.querySelectorAll(".immersion-card"));
  if (!scenes.length) return;
  const body = document.body;

  const focusScene = (scene) => {
    if (!scene) return;
    const palette = { ...readVisualizerDataset(scene) };
    if (scene.dataset.backdropDepth !== undefined) {
      palette.depth = numberOr(scene.dataset.backdropDepth, palette.depth);
    }
    if (scene.dataset.backdropGrain !== undefined) {
      palette.grain = numberOr(scene.dataset.backdropGrain, palette.grain);
    }
    if (scene.dataset.backdropGlow !== undefined) {
      palette.glow = numberOr(scene.dataset.backdropGlow, palette.glow);
    }
    if (scene.dataset.backdropTilt !== undefined) {
      palette.tilt = numberOr(scene.dataset.backdropTilt, palette.tilt ?? 0);
    }
    setPaletteVariables(scene, palette, "--immersion");
    applyBackdropPalette({ ...palette, intensity: numberOr(palette.intensity, 0.42) });
    if (body) {
      body.dataset.scene = `${scene.id}-immersion`;
    }
    if (visualizers) {
      visualizers.updateForStage({ ...palette });
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.dataset.active = "true";
          focusScene(entry.target);
        } else {
          entry.target.dataset.active = "false";
        }
      });
    },
    { threshold: 0.52, rootMargin: "-10% 0% -18%" }
  );

  scenes.forEach((scene) => {
    observer.observe(scene);

    const frame = scene.querySelector(".immersion-card__frame");
    if (frame) {
      const resetTilt = () => {
        frame.style.setProperty("--immersion-tilt-x", "0deg");
        frame.style.setProperty("--immersion-tilt-y", "0deg");
        frame.style.setProperty("--immersion-tilt-mag", "0");
      };

      const handleMove = (event) => {
        if (event.pointerType === "touch") return;
        const rect = frame.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
        const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
        const nx = x * 2 - 1;
        const ny = (0.5 - y) * 2;
        const mag = Math.min(Math.hypot(nx, ny), 1);
        frame.style.setProperty("--immersion-tilt-x", `${(ny * 18).toFixed(3)}deg`);
        frame.style.setProperty("--immersion-tilt-y", `${(nx * 16).toFixed(3)}deg`);
        frame.style.setProperty("--immersion-tilt-mag", mag.toFixed(3));
        if (visualizers?.tiltTo) {
          visualizers.tiltTo(nx * 0.8, ny * 0.8, mag * 0.85);
        }
      };

      frame.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "touch") return;
        scene.dataset.hover = "true";
        if (visualizers?.tiltEngage) visualizers.tiltEngage();
        handleMove(event);
      });
      frame.addEventListener("pointermove", handleMove);
      const leave = () => {
        scene.dataset.hover = "false";
        resetTilt();
        if (visualizers?.tiltRelease) visualizers.tiltRelease();
      };
      frame.addEventListener("pointerleave", leave);
      frame.addEventListener("pointercancel", leave);
    }

    const trigger = scene.querySelector(".immersion-card__trigger");
    if (trigger) {
      trigger.addEventListener("click", () => {
        scene.classList.add("immersion-card--pulsing");
        if (visualizers?.tiltEngage) visualizers.tiltEngage();
        if (visualizers?.tiltTo) visualizers.tiltTo(0.18, -0.22, 1);
        setTimeout(() => {
          scene.classList.remove("immersion-card--pulsing");
          if (visualizers?.tiltRelease) visualizers.tiltRelease();
        }, 760);
      });
    }
  });
}

function setupCardReactivity(visualizers) {
  const cards = Array.from(document.querySelectorAll(".scroll-card"));

  cards.forEach((card) => {
    const inner = card.querySelector(".scroll-card__inner");
    if (!inner) return;

    const resetTilt = () => {
      inner.style.setProperty("--tilt-x", "0deg");
      inner.style.setProperty("--tilt-y", "0deg");
      inner.style.setProperty("--tilt-nx", "0");
      inner.style.setProperty("--tilt-ny", "0");
      inner.style.setProperty("--tilt-strength", "0");
      card.style.setProperty("--tilt-strength", "0");
    };

    const handleMove = (event) => {
      if (event.pointerType === "touch") return;

      const rect = inner.getBoundingClientRect();
      const relativeX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const relativeY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      const normalizedX = relativeX * 2 - 1;
      const normalizedY = (0.5 - relativeY) * 2;

      const tiltX = normalizedY * 14;
      const tiltY = normalizedX * 18;
      const magnitude = Math.min(Math.hypot(normalizedX, normalizedY), 1);

      inner.style.setProperty("--tilt-x", `${tiltX.toFixed(3)}deg`);
      inner.style.setProperty("--tilt-y", `${tiltY.toFixed(3)}deg`);
      inner.style.setProperty("--tilt-nx", normalizedX.toFixed(3));
      inner.style.setProperty("--tilt-ny", normalizedY.toFixed(3));
      inner.style.setProperty("--tilt-strength", magnitude.toFixed(3));
      card.style.setProperty("--tilt-strength", magnitude.toFixed(3));

      if (visualizers?.tiltTo) {
        visualizers.tiltTo(normalizedX, normalizedY, magnitude);
      }
    };

    const handleEnter = (event) => {
      if (event.pointerType === "touch") return;
      card.dataset.hover = "true";
      if (visualizers?.tiltEngage) {
        visualizers.tiltEngage();
      }
      handleMove(event);
    };

    const handleLeave = () => {
      card.dataset.hover = "false";
      resetTilt();
      if (visualizers?.tiltRelease) {
        visualizers.tiltRelease();
      }
    };

    card.addEventListener("pointerenter", handleEnter);
    card.addEventListener("pointermove", handleMove);
    card.addEventListener("pointerleave", handleLeave);
    card.addEventListener("pointercancel", handleLeave);
  });
}

function initFooter() {
  const year = document.getElementById("footer-year");
  if (year) {
    year.textContent = new Date().getFullYear().toString();
  }
}

function init() {
  // Make systems data globally available for morph choreography
  window.APP_DATA = { systems };

  renderHero();
  renderCapstone();
  renderImmersionGallery();
  const track = document.getElementById("card-track");
  if (track) {
    renderSystems(track);
  }

  if (systems[0]?.visualizer) {
    applyBackdropPalette({ ...systems[0].visualizer });
  }

  const visualizers = new VisualizerConductor("visualizer-primary", "visualizer-accent");
  visualizers.start();

  setupImmersionReactivity(visualizers);

  // Initialize comprehensive animation orchestrator
  const animationOrchestrator = new AnimationOrchestrator(visualizers);

  // Initialize GSAP-based morphing choreography
  const morphChoreography = new MorphChoreography(visualizers);

  setupCardReactivity(visualizers);
  initFooter();

  console.log('🚀 Minoots Temporal Systems initialized');
  console.log('   ✨ Lenis smooth scrolling');
  console.log('   🎭 SplitType text animations');
  console.log('   🎬 GSAP morphing choreography');
  console.log('   🎨 Section mode switching');
  console.log('   🌊 Parallax layers');
  console.log('   💫 WebGL 4D visualizers');
}

document.addEventListener("DOMContentLoaded", init);
