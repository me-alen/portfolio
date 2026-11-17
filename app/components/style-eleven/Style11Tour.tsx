"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

// Every element matching this waits (hidden via data-wait) until an agent
// builds it. The fade-in transition rule in style11.css lists the same tags.
export const LAYER_SELECTOR = "[data-l], h1, h2, h3, p, li, img, a, button";

const COLORS = [
  "#ef4444",
  "#a78bfa",
  "#34d399",
  "#60a5fa",
  "#fbbf24",
  "#f472b6",
  "#22d3ee",
  "#fb923c",
];
const LETTERS = "ABCDEFGHJKLMNPRSTVWZ";
const SPEEDS = [1, 2, 4];
// The button's "1×" runs the clock at 1.25: a true 1× felt slow.
const BASE_SPEED = 1.25;
const START_AGENTS = 8;
// The whole crew for a run; agents never leave once they arrive.
const CREW_SIZE = 25;

// Base timings in ms at 1×; the animation clock runs 2× or 4× faster.
const HOLD = 120;
const FADE = 300;
const IMAGE_FADE = 520;
const DUPLICATE_HOLD = 260;
const TYPE_PER_CHAR = 9;
const TYPE_MIN = 160;
const TYPE_MAX = 700;
// Backspacing a copied tile's old text runs faster than typing.
const ERASE_PER_CHAR = 3;
const ERASE_MIN = 100;
const ERASE_MAX = 260;
// Camera glide down the page, in px per second at 1×.
const CAMERA_SPEED = 160;
// Top ruler labels every 100px up to 4000px; the viewport clips the rest.
const RULER_X = Array.from({ length: 40 }, (_, i) => (i + 1) * 100);
// Finale swarm: a springy pull to each orbit slot around the pointer.
const ORBIT_SPRING = 30;
const ORBIT_DAMPING = 7;
const ORBIT_MAX_SPEED = 1500;
// The orbit centre trails the pointer by about this long (s): the swarm
// always follows, but a moving pointer runs ahead into the leading agents.
const NUCLEUS_LAG = 0.35;
// A hit is the pointer passing within 3px of an agent's tip. The kick (px/s)
// grows with the pointer's speed relative to the agent: a slow nudge bounces
// it ~60px, a fast swipe sends it off screen before it coasts back.
const HIT_RADIUS = 3;
const BOUNCE_MIN = 60;
const BOUNCE_GAIN = 1.2;
const BOUNCE_MAX = 6000;
const COAST_FRICTION = 3;

// Static markup for the three agent tools: select arrow, draw crosshair, text I-beam.
const CURSOR_SVGS =
  '<svg class="t-arrow" viewBox="0 0 24 24" width="20" height="20"><path d="M4 2.5 20 10l-7.2 2.2L9.9 19.6Z" style="fill:var(--agent)" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>' +
  '<svg class="t-cross" viewBox="0 0 20 20" width="20" height="20"><path d="M10 2v16M2 10h16" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/><path d="M10 2v16M2 10h16" style="stroke:var(--agent)" stroke-width="2" stroke-linecap="round"/></svg>' +
  '<svg class="t-text" viewBox="0 0 20 20" width="20" height="20"><path d="M7 2.5h6M10 2.5v15M7 17.5h6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M7 2.5h6M10 2.5v15M7 17.5h6" fill="none" style="stroke:var(--agent)" stroke-width="1.8" stroke-linecap="round"/></svg>';

type Tool = "arrow" | "cross" | "text";
type Kind = "box" | "text" | "image";
type Point = { x: number; y: number };
type Move = {
  x0: number;
  y0: number;
  to: () => Point;
  t: number;
  dur: number;
  bend: number;
  drag: boolean;
  step?: (progress: number) => void;
  done: () => void;
};
type Agent = {
  el: HTMLDivElement;
  body: HTMLElement;
  letter: string;
  color: string;
  busy: boolean;
  // Checking finished work while idle; any build job takes priority.
  reviewing: boolean;
  x: number;
  y: number;
  lastX: number;
  lean: number;
  press: number;
  move: Move | null;
  // Idle agents drift around this area (the gathering swarm).
  anchor: { x: number; y: number; rx: number; ry: number } | null;
  // Finale: the spot on an element this agent stays on.
  park: (() => Point) | null;
  // Finale: an electron-like orbit around the visitor's pointer.
  orbit: Orbit | null;
  rest: number;
};
type Orbit = {
  radius: number;
  squash: number;
  tilt: number;
  spin: number;
  theta: number;
  vx: number;
  vy: number;
  // Knocked away by a hit: coasting until it slows, then back to orbit.
  coasting: boolean;
};
type Tween = { t: number; dur: number; frame?: (k: number) => void; done: () => void };
type Line = { top: number; bottom: number; left: number; right: number };
type Avatar = { letter: string; color: string };

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
const easeOut = (k: number) => 1 - (1 - k) ** 3;

type Style11TourProps = {
  rootRef: RefObject<HTMLDivElement | null>;
  initials: string;
  onDone: () => void;
};

export default function Style11Tour({
  rootRef,
  initials,
  onDone,
}: Style11TourProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const [runId, setRunId] = useState(0);
  const [phase, setPhase] = useState<"scan" | "build" | "done">("scan");
  const [built, setBuilt] = useState(0);
  const [total, setTotal] = useState(0);
  const [crew, setCrew] = useState({ active: 0, idle: 0 });
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [touring, setTouring] = useState(true);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [summary, setSummary] = useState("");
  const [closing, setClosing] = useState(false);
  // Page height for the left ruler, which scrolls with the page.
  const [docHeight, setDocHeight] = useState(0);
  // Rulers show only while agents measure or drag out boxes.
  const [rulers, setRulers] = useState(false);
  const touringRef = useRef(true);
  const speedRef = useRef(BASE_SPEED);
  const soundRef = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    const page = pageRef.current;
    const view = viewRef.current;
    if (!root || !page || !view) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return;
    }

    let cancelled = false;
    let building = false;
    let finished = false;
    let raf = 0;
    let lastFrame = 0;
    let spawned = 0;
    let spawnCooldown = 0;
    const startedAt = performance.now();
    const timers = new Set<number>();
    const tweens = new Set<Tween>();
    // Site-wide fixed controls (style switcher, resume button) get built too.
    const layers = [
      ...root.querySelectorAll<HTMLElement>(LAYER_SELECTOR),
      ...document.querySelectorAll<HTMLElement>("[data-chrome]"),
    ];
    const layerSet = new Set(layers);
    const doneSet = new Set<HTMLElement>();
    // When each layer was built, so idle agents can review fresh work.
    const builtAt = new Map<HTMLElement, number>();
    const placeholders = new Map<HTMLElement, HTMLDivElement>();
    const agents: Agent[] = [];

    // Repeated tiles (same tag and classes in a row, with content inside) are
    // copied from the first one instead of being built from scratch.
    const templates = new Map<HTMLElement, HTMLElement>();
    layers.forEach((el) => {
      let first: HTMLElement | null = null;
      for (
        let s = el.previousElementSibling;
        s instanceof HTMLElement &&
        layerSet.has(s) &&
        s.tagName === el.tagName &&
        s.className === el.className;
        s = s.previousElementSibling
      ) {
        first = s;
      }
      if (first && el.querySelector(LAYER_SELECTOR)) {
        templates.set(el, first);
      }
    });

    // Tag every element that waits for an agent; a replay re-tags the page as
    // it is now, so cards React re-created since the last run are included.
    layers.forEach((el) => el.setAttribute("data-wait", ""));
    root.setAttribute("data-tagged", "");
    window.scrollTo({ top: 0, behavior: "instant" });

    const markBuilt = (el: HTMLElement) => {
      if (doneSet.has(el)) {
        return;
      }
      el.removeAttribute("data-wait");
      doneSet.add(el);
      builtAt.set(el, performance.now());
      setBuilt(doneSet.size);
    };

    // If the intro breaks, the page must still appear.
    const fail = (error: unknown) => {
      if (cancelled) {
        return;
      }
      console.warn("Intro stopped:", error);
      cancelled = true;
      layers.forEach(markBuilt);
      onDone();
    };

    // Real-time wait, for things outside the animation (scroll settling).
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });
    // Animation-clock tween: follows the speed setting and pauses with the tab.
    const tween = (ms: number, frame?: (k: number) => void) =>
      new Promise<void>((resolve) => {
        tweens.add({ t: 0, dur: Math.max(1, ms) / 1000, frame, done: resolve });
      });
    const sleep = (ms: number) => tween(ms);

    const blip = (frequency: number, duration: number, volume: number) => {
      const ctx = audioRef.current;
      if (!soundRef.current || !ctx) {
        return;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    };

    const kindOf = (el: HTMLElement): Kind => {
      if (el.tagName === "IMG") {
        return "image";
      }
      if (el.querySelector(LAYER_SELECTOR) || !el.textContent?.trim()) {
        return "box";
      }
      return "text";
    };

    const isInView = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return (
        r.width > 0 &&
        r.height > 0 &&
        r.bottom > 0 &&
        r.top < window.innerHeight * 0.96
      );
    };

    const clampX = (x: number) => clamp(x, 8, window.innerWidth - 24);
    const clampY = (y: number) => clamp(y, 8, window.innerHeight - 24);

    const place = (
      node: HTMLElement,
      left: number,
      top: number,
      width: number,
      height: number,
    ) => {
      node.style.left = `${left}px`;
      node.style.top = `${top}px`;
      node.style.width = `${width}px`;
      node.style.height = `${height}px`;
    };

    // A live target on an element, so agents track it while the page scrolls.
    const at = (el: HTMLElement, dx: number, dy: number) => (): Point => {
      const r = el.getBoundingClientRect();
      return { x: clampX(r.left + dx), y: clampY(r.top + dy) };
    };

    // Eased, slightly curved travel; longer trips take a little longer.
    const moveTo = (
      agent: Agent,
      to: Point | (() => Point),
      options: { pace?: number; drag?: boolean; step?: (progress: number) => void } = {},
    ) =>
      new Promise<void>((resolve) => {
        const get = typeof to === "function" ? to : () => to;
        const target = get();
        const dist = Math.hypot(target.x - agent.x, target.y - agent.y);
        agent.move?.done();
        agent.move = null;
        if (dist < 1) {
          options.step?.(1);
          resolve();
          return;
        }
        const side = Math.random() < 0.5 ? -1 : 1;
        agent.move = {
          x0: agent.x,
          y0: agent.y,
          to: get,
          t: 0,
          dur: clamp(0.12 + Math.sqrt(dist) * 0.014, 0.16, 0.6) / (options.pace ?? 1),
          // A hand moving a mouse arcs a little; a marquee drag stays straight.
          bend: options.drag ? 0 : side * Math.min(90, dist * (0.05 + Math.random() * 0.1)),
          drag: Boolean(options.drag),
          step: options.step,
          done: resolve,
        };
      });

    const setTool = (agent: Agent, tool: Tool) => {
      agent.el.dataset.tool = tool;
    };

    const updateCrew = () => {
      setAvatars(agents.slice(-5).map(({ letter, color }) => ({ letter, color })));
    };

    const idlePoint = (agent: Agent): Point => {
      const a = agent.anchor;
      if (a) {
        return {
          x: a.x + (Math.random() * 2 - 1) * a.rx,
          y: a.y + (Math.random() * 2 - 1) * a.ry,
        };
      }
      return {
        x: window.innerWidth * (0.15 + Math.random() * 0.7),
        y: window.innerHeight * (0.18 + Math.random() * 0.62),
      };
    };

    const spawn = () => {
      if (agents.length >= CREW_SIZE) {
        return;
      }
      const index = spawned++;
      const color = COLORS[index % COLORS.length];
      const el = document.createElement("div");
      el.className = "s11-agent";
      el.dataset.tool = "arrow";
      el.style.setProperty("--agent", color);
      el.innerHTML = `<span class="s11-agent-body">${CURSOR_SVGS}</span>`;

      // Enter from just outside a screen edge.
      const w = window.innerWidth;
      const h = window.innerHeight;
      const t = 0.15 + Math.random() * 0.7;
      const side = index % 4;
      const x = side === 0 || side === 2 ? t * w : side === 1 ? w + 30 : -30;
      const y = side === 1 || side === 3 ? t * h : side === 0 ? -30 : h + 30;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      view.appendChild(el);

      agents.push({
        el,
        body: el.firstElementChild as HTMLElement,
        color,
        letter: LETTERS[Math.floor(Math.random() * LETTERS.length)],
        busy: false,
        reviewing: false,
        x,
        y,
        lastX: x,
        lean: 0,
        press: 0,
        move: null,
        anchor: null,
        park: null,
        orbit: null,
        rest: 0,
      });
      updateCrew();
    };

    // The visitor's pointer: the finale swarm always orbits its last known
    // spot. `sweepFrom` is where it was last frame, so a fast swipe that
    // jumps past an agent between frames still counts as a hit.
    let pointer: Point | null = null;
    let nucleus: Point | null = null;
    let sweepFrom: Point | null = null;
    const pointerVel = { x: 0, y: 0 };
    let pointerTime = 0;

    // Shortest distance from p to the segment a→b.
    const segmentDistance = (p: Point, a: Point, b: Point) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len2 = dx * dx + dy * dy;
      const t = len2 ? clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / len2, 0, 1) : 0;
      return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
    };

    // Finale physics: a spring toward the orbit slot around the pointer (or
    // the parked spot before there is one). A hit knocks the agent away at a
    // speed set by how hard it was hit; it coasts, then springs back.
    const orbitStep = (agent: Agent, orbit: Orbit, real: number, park?: Point) => {
      if (pointer && sweepFrom && segmentDistance(agent, sweepFrom, pointer) <= HIT_RADIUS) {
        let rx = pointerVel.x - orbit.vx;
        let ry = pointerVel.y - orbit.vy;
        const rel = Math.hypot(rx, ry);
        if (rel < 1) {
          // A pointer at rest on the agent: push it straight out.
          rx = agent.x - pointer.x || Math.random() - 0.5;
          ry = agent.y - pointer.y || Math.random() - 0.5;
        }
        const len = Math.hypot(rx, ry) || 1;
        const kick = Math.min(BOUNCE_MAX, BOUNCE_MIN + rel * BOUNCE_GAIN);
        orbit.vx = (rx / len) * kick;
        orbit.vy = (ry / len) * kick;
        orbit.coasting = true;
        agent.press = 1;
      }

      if (pointer) {
        orbit.theta += orbit.spin * real;
      }
      if (orbit.coasting) {
        const slow = Math.max(0, 1 - COAST_FRICTION * real);
        orbit.vx *= slow;
        orbit.vy *= slow;
        if (Math.hypot(orbit.vx, orbit.vy) < 60) {
          orbit.coasting = false;
        }
      } else {
        let tx: number;
        let ty: number;
        if (nucleus) {
          const ox = Math.cos(orbit.theta) * orbit.radius;
          const oy = Math.sin(orbit.theta) * orbit.radius * orbit.squash;
          tx = nucleus.x + ox * Math.cos(orbit.tilt) - oy * Math.sin(orbit.tilt);
          ty = nucleus.y + ox * Math.sin(orbit.tilt) + oy * Math.cos(orbit.tilt);
        } else if (park) {
          tx = park.x;
          ty = park.y;
        } else {
          return;
        }
        orbit.vx += ((tx - agent.x) * ORBIT_SPRING - orbit.vx * ORBIT_DAMPING) * real;
        orbit.vy += ((ty - agent.y) * ORBIT_SPRING - orbit.vy * ORBIT_DAMPING) * real;
        const speed = Math.hypot(orbit.vx, orbit.vy);
        if (speed > ORBIT_MAX_SPEED) {
          orbit.vx *= ORBIT_MAX_SPEED / speed;
          orbit.vy *= ORBIT_MAX_SPEED / speed;
        }
      }
      agent.x += orbit.vx * real;
      agent.y += orbit.vy * real;
    };

    const stepAgent = (agent: Agent, dt: number, real: number, target?: Point) => {
      const move = agent.move;
      if (move && target) {
        move.t += dt;
        const k = Math.min(1, move.t / move.dur);
        const e = move.drag ? easeOut(k) : easeInOut(k);
        const dx = target.x - move.x0;
        const dy = target.y - move.y0;
        const len = Math.hypot(dx, dy) || 1;
        const off = Math.sin(Math.PI * e) * move.bend;
        agent.x = move.x0 + dx * e - (dy / len) * off;
        agent.y = move.y0 + dy * e + (dx / len) * off;
        move.step?.(e);
        if (k >= 1) {
          agent.move = null;
          move.done();
        }
      } else if (agent.orbit) {
        orbitStep(agent, agent.orbit, real, target);
      }

      // Agents without work review fresh work; with none in view they drift.
      if (!agent.busy && !agent.reviewing && !agent.move && (agent.rest -= dt) <= 0) {
        agent.rest = 0.1 + Math.random() * 0.3;
        const fresh = building && !finished ? pickReview(agent) : null;
        if (fresh) {
          review(agent, fresh).catch(fail);
        } else {
          void moveTo(agent, idlePoint(agent), { pace: 0.45 });
        }
      }

      // Lean into horizontal travel and squish briefly on each click.
      const vx = real > 0 ? (agent.x - agent.lastX) / real : 0;
      agent.lastX = agent.x;
      agent.lean += (clamp(vx / 60, -16, 16) - agent.lean) * Math.min(1, real * 10);
      agent.press = Math.max(0, agent.press - real * 5);
      agent.el.style.transform = `translate3d(${agent.x.toFixed(1)}px, ${agent.y.toFixed(1)}px, 0)`;
      agent.body.style.transform = `rotate(${agent.lean.toFixed(1)}deg) scale(${(1 - agent.press * 0.18).toFixed(3)})`;
    };

    // Work queue: layers join as they scroll into view, and the nearest free
    // agent takes the first one that is ready.
    let queue: HTMLElement[] = [];
    const queued = new Set<HTMLElement>();
    let inflight = 0;

    const feed = () => {
      layers.forEach((el) => {
        if (!queued.has(el) && !doneSet.has(el) && isInView(el)) {
          queued.add(el);
          queue.push(el);
        }
      });
    };

    const pendingParent = (el: HTMLElement) => {
      const parent = el.parentElement?.closest<HTMLElement>(LAYER_SELECTOR);
      return parent && layerSet.has(parent) && !doneSet.has(parent) ? parent : null;
    };
    const isComplete = (el: HTMLElement) =>
      doneSet.has(el) &&
      [...el.querySelectorAll<HTMLElement>(LAYER_SELECTOR)].every(
        (child) => !layerSet.has(child) || doneSet.has(child),
      );
    // A layer is started only once its parent is built; a repeated tile only
    // once the tile it copies is finished.
    const ready = (el: HTMLElement) => {
      const template = templates.get(el);
      return !pendingParent(el) && (!template || isComplete(template));
    };

    const dispatch = () => {
      queue = queue.filter((el) => !doneSet.has(el));
      while (!cancelled && queue.length) {
        const free = agents.filter((agent) => !agent.busy);
        if (!free.length) {
          return;
        }
        let index = queue.findIndex(ready);
        if (index < 0) {
          // Blocked only by work outside the view: take the next layer
          // anyway (build() does its parent first).
          if (inflight) {
            return;
          }
          index = 0;
        }
        const [el] = queue.splice(index, 1);
        const r = el.getBoundingClientRect();
        const distance = (agent: Agent) => Math.hypot(agent.x - r.left, agent.y - r.top);
        const agent = free.reduce((best, next) => (distance(next) < distance(best) ? next : best));
        agent.busy = true;
        inflight++;
        build(agent, el)
          .catch(fail)
          .finally(() => {
            agent.busy = false;
            inflight--;
            dispatch();
          });
      }
    };

    // Camera: a steady glide down the page while the crew builds what it shows.
    let camOn = false;
    let camY = 0;
    let camV = 0;
    let lastSetY = 0;
    let feedClock = 0;
    let shownActive = -1;
    let shownTotal = -1;
    let rulersOn = false;
    let rulersUntil = 0;
    const showRulers = (ms: number) => {
      rulersUntil = Math.max(rulersUntil, performance.now() + ms);
      if (!rulersOn) {
        rulersOn = true;
        setRulers(true);
      }
    };

    // Fixed layers (nav, style switcher, resume button) never scroll out of
    // view, so they must not hold the camera.
    const pinned = new Set(
      layers.filter((el) => {
        for (let node: HTMLElement | null = el; node; node = node.parentElement) {
          if (getComputedStyle(node).position === "fixed") {
            return true;
          }
        }
        return false;
      }),
    );

    // Camera throttle from the highest unbuilt layer: full speed while it is
    // below 45% of the view, easing to a stop as it nears 12% from the top,
    // so the crew gets time to catch up before the camera has to wait.
    const throttle = () => {
      let highest = Infinity;
      for (const el of queued) {
        if (!doneSet.has(el) && !pinned.has(el)) {
          highest = Math.min(highest, el.getBoundingClientRect().bottom);
        }
      }
      const vh = window.innerHeight;
      return clamp((highest - vh * 0.12) / (vh * 0.33), 0, 1);
    };

    const steerCamera = (dt: number, room: number) => {
      if (!touringRef.current) {
        camOn = false;
        camV = 0;
        return;
      }
      if (!camOn) {
        camOn = true;
        camY = lastSetY = window.scrollY;
      }
      // A scrollbar drag fires no wheel or touch event: catch it here.
      if (Math.abs(window.scrollY - lastSetY) > 30) {
        stopTouring();
        return;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const want = camY >= max ? 0 : CAMERA_SPEED * room;
      // Ease in and out of pauses instead of stopping dead.
      camV += (want - camV) * Math.min(1, dt * 3);
      camY = Math.min(max, camY + camV * dt);
      window.scrollTo({ top: camY, behavior: "instant" });
      lastSetY = window.scrollY;
    };

    // One frame loop drives every cursor, tween and spawn.
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      try {
        // Clamped so the first frame after a hidden-tab pause never teleports.
        const real = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0;
        lastFrame = now;
        // No pointer events for a moment means the pointer has stopped.
        if (now - pointerTime > 100) {
          pointerVel.x = 0;
          pointerVel.y = 0;
        }
        if (pointer && nucleus) {
          const ease = Math.min(1, real / NUCLEUS_LAG);
          nucleus.x += (pointer.x - nucleus.x) * ease;
          nucleus.y += (pointer.y - nucleus.y) * ease;
        }
        if (rulersOn && now > rulersUntil) {
          rulersOn = false;
          setRulers(false);
        }
        const dt = real * speedRef.current;

        tweens.forEach((item) => {
          item.t += dt;
          const k = Math.min(1, item.t / item.dur);
          item.frame?.(k);
          if (k >= 1) {
            tweens.delete(item);
            item.done();
          }
        });

        // Read every target before writing any transform (no layout thrash).
        const targets = agents.map((agent) => (agent.move ? agent.move.to() : agent.park?.()));
        let room = 1;
        if (building && !finished) {
          feedClock -= real;
          if (feedClock <= 0) {
            feedClock = 0.1;
            feed();
          }
          room = throttle();
        }
        agents.forEach((agent, i) => stepAgent(agent, dt, real, targets[i]));
        sweepFrom = pointer ? { x: pointer.x, y: pointer.y } : null;

        if (building && !finished) {
          // Bar counts: active = building or reviewing; idle = drifting.
          const active = agents.filter((agent) => agent.busy || agent.reviewing).length;
          if (active !== shownActive || agents.length !== shownTotal) {
            shownActive = active;
            shownTotal = agents.length;
            setCrew({ active, idle: agents.length - active });
          }
          spawnCooldown -= dt;
          // The crew grows with the work on screen, up to this run's cap.
          const want = clamp(START_AGENTS + queue.length + inflight, START_AGENTS, CREW_SIZE);
          if (spawnCooldown <= 0 && agents.length < want) {
            spawn();
            spawnCooldown = 0.08;
          }
          dispatch();
          steerCamera(dt, room);
        }
      } catch (error) {
        fail(error);
      }
    };
    raf = requestAnimationFrame(tick);

    // Text line boxes relative to the element, for line-by-line typing.
    const measureLines = (el: HTMLElement, r: DOMRect): Line[] => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = [...range.getClientRects()]
        .filter((b) => b.width > 0.5 && b.height > 0.5)
        .sort((a, b) => a.top - b.top || a.left - b.left);
      const lines: Line[] = [];
      for (const b of rects) {
        const last = lines[lines.length - 1];
        if (last && b.top < last.bottom - 2) {
          last.top = Math.min(last.top, b.top);
          last.bottom = Math.max(last.bottom, b.bottom);
          last.left = Math.min(last.left, b.left);
          last.right = Math.max(last.right, b.right);
        } else {
          lines.push({ top: b.top, bottom: b.bottom, left: b.left, right: b.right });
        }
      }
      if (!lines.length) {
        return [{ top: 0, bottom: r.height, left: 0, right: r.width }];
      }
      return lines.map((line) => ({
        top: line.top - r.top,
        bottom: line.bottom - r.top,
        left: line.left - r.left,
        right: line.right - r.left,
      }));
    };

    // A frame over an element: outline, corner handles and a size label.
    const frameFor = (el: HTMLElement, kind: Kind) => {
      const r = el.getBoundingClientRect();
      const ph = document.createElement("div");
      ph.className = `s11-ph s11-ph-${kind}`;
      place(ph, r.left + window.scrollX, r.top + window.scrollY, r.width, r.height);
      ph.innerHTML = `<span class="s11-ph-fill"></span><i></i><i></i><i></i><i></i><span class="s11-ph-size">${Math.round(r.width)} × ${Math.round(r.height)}</span>`;
      page.appendChild(ph);
      return ph;
    };

    const makePlaceholder = (el: HTMLElement, kind: Kind) => {
      const ph = frameFor(el, kind);
      placeholders.set(el, ph);
      return ph;
    };

    // Wireframe pass: drag out a gray box (or a text frame) for one layer.
    const draw = async (agent: Agent, el: HTMLElement) => {
      if (doneSet.has(el)) {
        return;
      }
      const kind = kindOf(el);
      const ph = makePlaceholder(el, kind);
      setTool(agent, kind === "text" ? "arrow" : "cross");
      await moveTo(agent, at(el, 0, 0));
      if (cancelled) {
        return;
      }
      ph.classList.add("is-on");
      if (kind !== "text") {
        const fill = ph.querySelector<HTMLElement>(".s11-ph-fill");
        const r = el.getBoundingClientRect();
        agent.press = 1;
        blip(420, 0.07, 0.03);
        // Rulers for big layout moves only; small boxes come and go constantly.
        if (r.width * r.height > window.innerWidth * window.innerHeight * 0.08) {
          showRulers(1200);
        }
        // The gray box grows with the cursor as it drags to the far corner.
        await moveTo(agent, at(el, r.width, r.height), {
          drag: true,
          step: (progress) => {
            if (fill) {
              fill.style.transform = `scale(${progress})`;
            }
          },
        });
        if (cancelled) {
          return;
        }
      }
      ph.classList.add("is-selected");
      await sleep(HOLD);
      // Drawn: the gray fill fades, leaving only the frame until the fill pass.
      ph.classList.remove("is-selected");
      ph.classList.add("is-framed");
      setTool(agent, "arrow");
    };

    // Red spacing measurement, target outline and alignment guide.
    const measure = (from: DOMRect, to: DOMRect, rulers = true) => {
      if (rulers) {
        showRulers(1600);
      }
      const marks: HTMLElement[] = [];
      const sx = window.scrollX;
      const sy = window.scrollY;
      const sameRow = Math.abs(from.top - to.top) < 4;
      const gap = Math.round(sameRow ? to.left - from.right : to.top - from.bottom);

      const box = document.createElement("div");
      box.className = "s11-redbox";
      place(box, to.left + sx, to.top + sy, to.width, to.height);
      page.appendChild(box);
      marks.push(box);

      if (gap > 0) {
        const line = document.createElement("div");
        line.className = "s11-measure";
        if (sameRow) {
          place(line, from.right + sx, from.top + from.height / 2 + sy, gap, 1);
        } else {
          place(line, to.left + to.width / 2 + sx, from.bottom + sy, 1, gap);
        }
        line.innerHTML = `<span>${gap}</span>`;
        page.appendChild(line);
        marks.push(line);
      }

      const guide = document.createElement("div");
      guide.className = "s11-guide";
      guide.style.left = `${to.left}px`;
      view.appendChild(guide);
      marks.push(guide);
      return marks;
    };

    // Copy a finished tile into this slot, as a designer would: the agent
    // carries the copy over, then it cross-fades into this tile's own content.
    // Fresh work in view for an idle agent to check: nearby first, with some
    // randomness so reviewers spread out instead of crowding one element.
    const underReview = new Set<HTMLElement>();
    const pickReview = (agent: Agent) => {
      const now = performance.now();
      const screen = window.innerWidth * window.innerHeight;
      let best: HTMLElement | null = null;
      let bestScore = Infinity;
      for (const [el, time] of builtAt) {
        if (now - time > 30000 || underReview.has(el) || pinned.has(el)) {
          continue;
        }
        const r = el.getBoundingClientRect();
        if (
          r.width < 30 ||
          r.height < 14 ||
          r.top < 80 ||
          r.bottom > window.innerHeight - 100 ||
          r.width * r.height > screen * 0.3
        ) {
          continue;
        }
        const score = Math.hypot(r.left - agent.x, r.top - agent.y) + Math.random() * 400;
        if (score < bestScore) {
          best = el;
          bestScore = score;
        }
      }
      return best;
    };

    // Review: select the element (outline, handles, size) or measure its gap
    // to the next one. A build job reclaims the agent at any moment.
    const review = async (agent: Agent, el: HTMLElement) => {
      agent.reviewing = true;
      underReview.add(el);
      const marks: HTMLElement[] = [];
      try {
        setTool(agent, "arrow");
        const r = el.getBoundingClientRect();
        await moveTo(agent, at(el, Math.min(r.width / 2, 80), Math.min(r.height / 2, 24)), {
          pace: 0.8,
        });
        if (cancelled || agent.busy) {
          return;
        }
        agent.press = 1;
        const next = el.nextElementSibling;
        const nr = next instanceof HTMLElement && doneSet.has(next) ? next.getBoundingClientRect() : null;
        if (nr && nr.top < window.innerHeight - 100 && Math.random() < 0.5) {
          // A quick spot check: no rulers (they would never go away).
          marks.push(...measure(el.getBoundingClientRect(), nr, false));
        } else {
          const box = frameFor(el, "text");
          box.classList.add("is-on", "is-selected");
          marks.push(box);
        }
        await sleep(700 + Math.random() * 600);
      } finally {
        marks.forEach((mark) => mark.remove());
        underReview.delete(el);
        agent.reviewing = false;
      }
    };

    const copyTile = async (agent: Agent, target: HTMLElement, template: HTMLElement) => {
      // The nearest finished tile before this one (the template at worst).
      let source = template;
      for (let s = target.previousElementSibling; s && s !== template; s = s.previousElementSibling) {
        if (s instanceof HTMLElement && s.className === target.className && isComplete(s)) {
          source = s;
          break;
        }
      }
      setTool(agent, "arrow");
      await moveTo(agent, at(source, 16, 12));
      if (cancelled) {
        return;
      }

      const from = source.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const ghost = source.cloneNode(true) as HTMLElement;
      ghost.removeAttribute("id");
      ghost.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
      ghost.setAttribute("aria-hidden", "true");
      ghost.inert = true;
      ghost.classList.add("s11-ghost");
      // Sized to the slot, so the real tile can replace it without a jump.
      ghost.style.width = `${from.width}px`;
      ghost.style.height = `${to.height}px`;
      ghost.style.overflow = "hidden";
      source.after(ghost);
      const holder = (ghost.offsetParent as HTMLElement | null) ?? document.body;
      const base = holder.getBoundingClientRect();
      ghost.style.left = `${from.left - base.left - holder.clientLeft}px`;
      ghost.style.top = `${from.top - base.top - holder.clientTop}px`;
      ghost.style.transition = "opacity 0.2s ease";

      agent.press = 1;
      blip(660, 0.06, 0.025);
      const grabX = agent.x;
      const grabY = agent.y;
      await moveTo(
        agent,
        { x: grabX + to.left - from.left, y: grabY + to.top - from.top },
        {
          pace: 0.9,
          step: () => {
            ghost.style.transform = `translate(${agent.x - grabX}px, ${agent.y - grabY}px)`;
          },
        },
      );
      ghost.style.transform = `translate(${to.left - from.left}px, ${to.top - from.top}px)`;
      agent.press = 1;

      const marks = measure(from, to);
      await sleep(DUPLICATE_HOLD);
      marks.forEach((mark) => mark.remove());

      // Clear the copy's old text; up to three idle agents pitch in, each
      // backspacing every n-th field.
      const fields = [...ghost.querySelectorAll<HTMLElement>(LAYER_SELECTOR)].filter(
        (node) => kindOf(node) === "text" && node.getBoundingClientRect().height > 0,
      );
      const helpers = [agent, ...agents.filter((other) => !other.busy).slice(0, 3)];
      helpers.forEach((helper) => {
        helper.busy = true;
      });
      await Promise.all(
        helpers.map(async (helper, i) => {
          for (let j = i; j < fields.length && !cancelled; j += helpers.length) {
            await eraseText(helper, fields[j]);
          }
        }),
      );
      helpers.slice(1).forEach((helper) => {
        helper.busy = false;
      });
      if (cancelled) {
        return;
      }
      // The real tile, still empty, takes the copy's place; agents then type
      // its own text into it (its text layers are ready once it is built).
      [target, ...target.querySelectorAll<HTMLElement>(LAYER_SELECTOR)].forEach((node) => {
        if (layerSet.has(node) && kindOf(node) !== "text") {
          markBuilt(node);
        }
      });
      ghost.style.transition = "opacity 0.3s ease";
      ghost.style.opacity = "0";
      await sleep(320);
      ghost.remove();
    };

    // Where the caret sits after `reach` px of text, across wrapped lines.
    const caretAt = (lines: Line[], widths: number[], reach: number) => {
      let index = 0;
      let before = 0;
      while (index < lines.length - 1 && before + widths[index] < reach) {
        before += widths[index];
        index++;
      }
      const line = lines[index];
      return { line, x: Math.min(line.right, line.left + (reach - before)) };
    };

    // Show text up to the caret: every line above it, the current line to x.
    const clipText = (el: HTMLElement, line: Line, x: number) => {
      el.style.clipPath = `polygon(0 0, 100% 0, 100% ${line.top}px, ${x}px ${line.top}px, ${x}px ${line.bottom}px, 0 ${line.bottom}px)`;
    };

    // Backspace a copied tile's old text, right to left, behind a caret.
    const eraseText = async (agent: Agent, el: HTMLElement) => {
      const lines = measureLines(el, el.getBoundingClientRect());
      const widths = lines.map((line) => Math.max(1, line.right - line.left));
      const totalWidth = widths.reduce((sum, width) => sum + width, 0);
      const last = lines[lines.length - 1];

      setTool(agent, "text");
      await moveTo(agent, at(el, last.right + 3, (last.top + last.bottom) / 2), { pace: 2 });
      if (cancelled) {
        return;
      }

      const start = el.getBoundingClientRect();
      const docLeft = start.left + window.scrollX;
      const docTop = start.top + window.scrollY;
      const caret = document.createElement("div");
      caret.className = "s11-caret";
      page.appendChild(caret);
      const count = Math.max(1, (el.textContent ?? "").trim().length);
      let left = -1;
      let caretX = docLeft + last.right;
      let caretY = docTop + (last.top + last.bottom) / 2;

      await tween(clamp(count * ERASE_PER_CHAR, ERASE_MIN, ERASE_MAX), (k) => {
        const next = Math.round((1 - k) * count);
        if (next !== left) {
          if (left >= 0 && next % 2 === 0) {
            blip(1300 + Math.random() * 300, 0.02, 0.01);
          }
          left = next;
          const { line, x } = caretAt(lines, widths, (left / count) * totalWidth);
          clipText(el, line, x);
          caret.style.height = `${line.bottom - line.top}px`;
          caret.style.transform = `translate(${docLeft + x}px, ${docTop + line.top}px)`;
          caretX = docLeft + x;
          caretY = docTop + (line.top + line.bottom) / 2;
        }
        agent.x = caretX - window.scrollX + 3;
        agent.y = clampY(caretY - window.scrollY);
      });

      el.style.visibility = "hidden";
      caret.remove();
      setTool(agent, "arrow");
    };

    // Fill pass for text: type it in behind a caret with a human rhythm.
    const typeIn = async (agent: Agent, el: HTMLElement, ph?: HTMLDivElement) => {
      const lines = measureLines(el, el.getBoundingClientRect());
      const widths = lines.map((line) => Math.max(1, line.right - line.left));
      const totalWidth = widths.reduce((sum, width) => sum + width, 0);
      const first = lines[0];

      setTool(agent, "text");
      await moveTo(agent, at(el, first.left + 3, (first.top + first.bottom) / 2));
      if (cancelled) {
        return;
      }

      // Measured now: the page may have scrolled while the agent travelled.
      const start = el.getBoundingClientRect();
      const docLeft = start.left + window.scrollX;
      const docTop = start.top + window.scrollY;
      ph?.classList.add("is-selected");
      const caret = document.createElement("div");
      caret.className = "s11-caret";
      page.appendChild(caret);
      el.style.transition = "none";
      el.style.clipPath = "polygon(0 0, 0 0, 0 0)";
      markBuilt(el);
      agent.press = 1;

      // Quick letters, longer gaps at spaces, and the odd hesitation.
      const text = (el.textContent ?? "").replace(/\s+/g, " ").trim() || " ";
      const beats: number[] = [];
      let sum = 0;
      for (const ch of text) {
        sum += ch === " " ? 1.5 + Math.random() : 0.5 + Math.random();
        if (Math.random() < 0.03) {
          sum += 3 + Math.random() * 4;
        }
        beats.push(sum);
      }
      const count = beats.length;
      let shown = -1;
      let caretX = docLeft + first.left;
      let caretY = docTop + (first.top + first.bottom) / 2;

      await tween(clamp(count * TYPE_PER_CHAR, TYPE_MIN, TYPE_MAX), (k) => {
        let next = Math.max(shown, 0);
        while (next < count && beats[next] <= k * sum) {
          next++;
        }
        if (k >= 1) {
          next = count;
        }
        if (next !== shown) {
          if (shown >= 0 && next % 2 === 0) {
            blip(1500 + Math.random() * 500, 0.025, 0.012);
          }
          shown = next;
          const { line, x } = caretAt(lines, widths, (shown / count) * totalWidth);
          clipText(el, line, x);
          caret.style.height = `${line.bottom - line.top}px`;
          caret.style.transform = `translate(${docLeft + x}px, ${docTop + line.top}px)`;
          caretX = docLeft + x;
          caretY = docTop + (line.top + line.bottom) / 2;
        }
        // The I-beam rides the caret, even if the visitor scrolls.
        agent.x = caretX - window.scrollX + 3;
        agent.y = clampY(caretY - window.scrollY);
      });

      el.style.clipPath = "";
      el.style.transition = "";
      caret.remove();
      ph?.remove();
      placeholders.delete(el);
      setTool(agent, "arrow");
    };

    // Fill pass: one layer becomes real.
    const fill = async (agent: Agent, el: HTMLElement) => {
      if (doneSet.has(el)) {
        placeholders.get(el)?.remove();
        placeholders.delete(el);
        return;
      }
      const kind = kindOf(el);
      const ph = placeholders.get(el);
      if (kind === "text") {
        await typeIn(agent, el, ph);
        return;
      }

      const r = el.getBoundingClientRect();
      setTool(agent, "arrow");
      await moveTo(agent, at(el, Math.min(r.width / 2, 60), Math.min(r.height / 2, 30)));
      if (cancelled) {
        return;
      }
      agent.press = 1;
      ph?.classList.add("is-selected");
      markBuilt(el);
      blip(kind === "image" ? 300 : 360, 0.09, 0.03);
      await sleep(HOLD);
      ph?.classList.add("is-leaving");
      await sleep(kind === "image" ? IMAGE_FADE : FADE);
      ph?.remove();
      placeholders.delete(el);
    };

    // One layer, start to finish: its frame appears only when work on it begins.
    const build = async (agent: Agent, el: HTMLElement): Promise<void> => {
      if (cancelled || doneSet.has(el)) {
        return;
      }
      // Only on the off-screen fallback: a hidden parent would hide this too.
      const parent = pendingParent(el);
      if (parent) {
        await build(agent, parent);
      }
      const template = templates.get(el);
      if (template && isComplete(template)) {
        await copyTile(agent, el, template);
        return;
      }
      await draw(agent, el);
      if (!cancelled) {
        await fill(agent, el);
      }
    };

    const settleScroll = async () => {
      let last = -1;
      for (let i = 0; i < 30 && !cancelled; i++) {
        await wait(60);
        if (Math.abs(window.scrollY - last) < 1) {
          break;
        }
        last = window.scrollY;
      }
    };

    // Any scroll by the visitor hands the camera back to them.
    const stopTouring = () => {
      if (touringRef.current) {
        touringRef.current = false;
        setTouring(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        stopTouring();
      }
    };
    const onPointer = (event: PointerEvent) => {
      const now = performance.now();
      if (pointer && now > pointerTime) {
        const dt = (now - pointerTime) / 1000;
        // Smoothed, so one jittery event does not decide how hard a hit is.
        pointerVel.x = pointerVel.x * 0.5 + ((event.clientX - pointer.x) / dt) * 0.5;
        pointerVel.y = pointerVel.y * 0.5 + ((event.clientY - pointer.y) / dt) * 0.5;
      }
      pointer = { x: event.clientX, y: event.clientY };
      nucleus ??= { ...pointer };
      pointerTime = now;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("wheel", stopTouring, { passive: true });
    window.addEventListener("touchmove", stopTouring, { passive: true });
    window.addEventListener("keydown", onKey);

    // Keyboard focus must never land on something invisible.
    const onFocus = (event: FocusEvent) => {
      for (
        let el = event.target instanceof HTMLElement ? event.target : null;
        el && el !== root;
        el = el.parentElement
      ) {
        if (el.hasAttribute("data-wait")) {
          markBuilt(el);
          placeholders.get(el)?.remove();
          placeholders.delete(el);
        }
      }
    };
    document.addEventListener("focusin", onFocus);

    skipRef.current = () => {
      cancelled = true;
      layers.forEach(markBuilt);
    };

    const run = async () => {
      await wait(60);
      if (cancelled) {
        return;
      }
      setTotal(layers.length);
      setDocHeight(document.documentElement.scrollHeight);
      layers.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) {
          markBuilt(el);
        }
      });

      // Gather: the crew flies in from the edges and hovers in two swarms.
      for (let i = 0; i < START_AGENTS; i++) {
        spawn();
      }
      agents.forEach((agent, i) => {
        agent.anchor = {
          x: window.innerWidth / 2 + (i % 2 ? 150 : -150),
          y: window.innerHeight / 2 + (i % 2 ? -60 : 70),
          rx: 55,
          ry: 45,
        };
        agent.rest = 0.3 + Math.random() * 0.6;
        void moveTo(agent, idlePoint(agent), { pace: 0.55 });
      });
      await sleep(1500);
      if (cancelled) {
        return;
      }
      agents.forEach((agent) => {
        agent.anchor = null;
      });
      building = true;
      setPhase("build");

      // The frame loop glides the camera down the page while agents build
      // whatever it brings into view; here we only wait for the last layer.
      let quiet = 0;
      while (!cancelled && doneSet.size < layers.length) {
        await wait(250);
        const atBottom =
          window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 2;
        // Safety net: at the bottom with nothing left to start, the rest can
        // never come into view, and would hold the finale forever.
        quiet = touringRef.current && atBottom && !queue.length && !inflight ? quiet + 1 : 0;
        if (quiet > 8) {
          layers.forEach(markBuilt);
        }
      }
      if (cancelled) {
        return;
      }

      // Finale: back to the top; each agent settles on its own element.
      finished = true;
      const seconds = ((performance.now() - startedAt) / 1000).toFixed(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      await settleScroll();
      if (window.scrollY > 2) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      // Visible, modest-sized elements clear of the nav and the tour bar.
      const screen = window.innerWidth * window.innerHeight;
      const spots = layers.filter((el) => {
        const r = el.getBoundingClientRect();
        return (
          r.width >= 20 &&
          r.height >= 12 &&
          r.top >= 70 &&
          r.bottom <= window.innerHeight - 90 &&
          r.width * r.height < screen * 0.2
        );
      });
      agents.forEach((agent, i) => {
        agent.busy = true;
        setTool(agent, "arrow");
        // Each its own slightly tilted, slightly oval orbit, speed and direction.
        agent.orbit = {
          // Closest pass ~30px, so a quick move can catch one.
          radius: 50 + Math.random() * 100,
          squash: 0.6 + Math.random() * 0.4,
          tilt: Math.random() * Math.PI,
          spin: (Math.random() < 0.5 ? -1 : 1) * (0.7 + Math.random() * 1.1),
          theta: Math.random() * Math.PI * 2,
          vx: 0,
          vy: 0,
          coasting: false,
        };
        // Without a pointer, rest on an element: every n-th one in page order.
        const el = spots[Math.floor((i * spots.length) / agents.length)];
        if (!el) {
          return;
        }
        const r = el.getBoundingClientRect();
        const dx = r.width * (0.2 + Math.random() * 0.6);
        const dy = r.height * (0.3 + Math.random() * 0.4);
        agent.park = () => {
          const b = el.getBoundingClientRect();
          return { x: b.left + dx, y: b.top + dy };
        };
      });
      setSummary(`Rebuilt by ${spawned} agents in ${seconds}s`);
      setPhase("done");
    };

    run().catch(fail);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("wheel", stopTouring);
      window.removeEventListener("touchmove", stopTouring);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocus);
      layers.forEach((el) => {
        el.removeAttribute("data-wait");
        el.style.clipPath = "";
        el.style.transition = "";
      });
      root.querySelectorAll(".s11-ghost").forEach((node) => node.remove());
      page.replaceChildren();
      view.replaceChildren();
    };
  }, [rootRef, onDone, runId]);

  useEffect(() => {
    return () => {
      void audioRef.current?.close();
    };
  }, []);

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(onDone, 400);
  }, [onDone]);

  const skip = useCallback(() => {
    skipRef.current();
    close();
  }, [close]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        skip();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [skip]);

  const replay = () => {
    touringRef.current = true;
    setTouring(true);
    setPhase("scan");
    setBuilt(0);
    setTotal(0);
    setCrew({ active: 0, idle: 0 });
    setAvatars([]);
    setSummary("");
    setRunId((id) => id + 1);
  };

  const toggleTouring = () => {
    touringRef.current = !touringRef.current;
    setTouring(touringRef.current);
  };

  const cycleSpeed = () => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    speedRef.current = SPEEDS[nextIndex] * BASE_SPEED;
    setSpeedIndex(nextIndex);
  };

  const toggleSound = () => {
    soundRef.current = !soundRef.current;
    setSoundOn(soundRef.current);
    if (soundRef.current) {
      audioRef.current ??= new AudioContext();
      void audioRef.current.resume();
    }
  };

  const progress = total ? built / total : 0;

  return (
    <div
      className={`s11-tour${closing ? " s11-tour-closing" : ""}${rulers ? " s11-rulers-on" : ""}`}
    >
      <div ref={pageRef} className="s11-tour-page" aria-hidden="true" />
      <div ref={viewRef} className="s11-tour-view" aria-hidden="true" />
      {/* Design-tool rulers: px across the top, page position down the left. */}
      <div className="s11-ruler-x" aria-hidden="true">
        {RULER_X.map((x) => (
          <span key={x} style={{ left: x }}>
            {x}
          </span>
        ))}
      </div>
      <div className="s11-ruler-y" style={{ height: docHeight }} aria-hidden="true">
        {Array.from({ length: Math.floor(docHeight / 100) }, (_, i) => (i + 1) * 100).map(
          (y) => (
            <span key={y} style={{ top: y }}>
              {y}
            </span>
          ),
        )}
      </div>
      <div className="s11-ruler-corner" aria-hidden="true" />
      {phase === "scan" ? (
        <div className="s11-tour-logo" aria-hidden="true">
          {initials}
        </div>
      ) : null}

      <div className="s11-tour-bar" role="group" aria-label="Intro: agents rebuilding the page">
        {phase === "scan" ? (
          <span className="s11-tour-status">Scanning page…</span>
        ) : null}
        {phase === "build" ? (
          <>
            <span className="s11-tour-avatars" aria-hidden="true">
              {avatars.map((avatar, index) => (
                <span key={index} style={{ background: avatar.color }}>
                  {avatar.letter}
                </span>
              ))}
            </span>
            <span>
              <strong>{crew.active}</strong> active · <strong>{crew.idle}</strong> idle
            </span>
            <span className="s11-tour-count">
              <strong>{built}</strong> / {total || "…"} layers
            </span>
          </>
        ) : null}
        {phase === "done" ? (
          <span className="s11-tour-status">{summary}</span>
        ) : null}
        <span className="s11-tour-track" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </span>
        {phase !== "done" ? (
          <>
            <button
              type="button"
              className={touring ? "is-on" : undefined}
              aria-pressed={touring}
              onClick={toggleTouring}
            >
              {touring ? "Touring" : "Tour"}
            </button>
            <button
              type="button"
              onClick={cycleSpeed}
              aria-label={`Speed ${SPEEDS[speedIndex]}×, change speed`}
            >
              {SPEEDS[speedIndex]}×
            </button>
          </>
        ) : null}
        <button
          type="button"
          className={`s11-tour-sound${soundOn ? " is-on" : ""}`}
          aria-pressed={soundOn}
          aria-label={soundOn ? "Sound on, turn off" : "Tap for sound"}
          onClick={toggleSound}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
            <path
              d="M16 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span className="s11-tour-label">
            {soundOn ? "Sound on" : "Tap for sound"}
          </span>
        </button>
        {phase === "done" ? (
          <>
            <button type="button" className="s11-tour-primary" onClick={close}>
              Go live
            </button>
            <button type="button" onClick={replay}>
              Replay
            </button>
          </>
        ) : null}
        <button
          type="button"
          onClick={skip}
          aria-label={phase === "done" ? "Close" : "Skip intro"}
          aria-keyshortcuts="Escape"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
