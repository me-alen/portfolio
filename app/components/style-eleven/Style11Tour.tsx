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
const START_AGENTS = 8;
// Each run's whole crew is capped at a random size in this range.
const CREW_MIN = 15;
const CREW_MAX = 19;

// Base timings in ms at 1×; the animation clock runs 2× or 4× faster.
const HOLD = 120;
const FADE = 300;
const IMAGE_FADE = 520;
const DUPLICATE_HOLD = 260;
const TYPE_PER_CHAR = 9;
const TYPE_MIN = 160;
const TYPE_MAX = 700;

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
  rest: number;
};
type Tween = { t: number; dur: number; frame?: (k: number) => void; done: () => void };
type Job = (agent: Agent, el: HTMLElement) => Promise<void>;
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
  const [agentCount, setAgentCount] = useState(0);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [touring, setTouring] = useState(true);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [summary, setSummary] = useState("");
  const [closing, setClosing] = useState(false);
  const touringRef = useRef(true);
  const ownScrollRef = useRef(0);
  const speedRef = useRef(1);
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
    const crewCap = CREW_MIN + Math.floor(Math.random() * (CREW_MAX - CREW_MIN + 1));
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
    ownScrollRef.current = 0;

    const markBuilt = (el: HTMLElement) => {
      if (doneSet.has(el)) {
        return;
      }
      el.removeAttribute("data-wait");
      doneSet.add(el);
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
      setAgentCount(agents.length);
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
      if (agents.length >= crewCap) {
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
        x,
        y,
        lastX: x,
        lean: 0,
        press: 0,
        move: null,
        anchor: null,
        park: null,
        rest: 0,
      });
      updateCrew();
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
      } else if (agent.park && target) {
        // Parked agents ride along with their element if the page scrolls.
        agent.x = target.x;
        agent.y = target.y;
      }

      // Agents without work drift around, pausing between short glides.
      if (!agent.busy && !agent.move && (agent.rest -= dt) <= 0) {
        agent.rest = 0.4 + Math.random() * 1.2;
        void moveTo(agent, idlePoint(agent), { pace: 0.45 });
      }

      // Lean into horizontal travel and squish briefly on each click.
      const vx = real > 0 ? (agent.x - agent.lastX) / real : 0;
      agent.lastX = agent.x;
      agent.lean += (clamp(vx / 60, -16, 16) - agent.lean) * Math.min(1, real * 10);
      agent.press = Math.max(0, agent.press - real * 5);
      agent.el.style.transform = `translate3d(${agent.x.toFixed(1)}px, ${agent.y.toFixed(1)}px, 0)`;
      agent.body.style.transform = `rotate(${agent.lean.toFixed(1)}deg) scale(${(1 - agent.press * 0.18).toFixed(3)})`;
    };

    // Work queue: the nearest free agent takes the next layer, so agents that
    // join mid-phase pitch in straight away.
    let queue: HTMLElement[] = [];
    let job: Job | null = null;
    let inflight = 0;
    let phaseDone: (() => void) | null = null;

    const settlePhase = () => {
      if (!queue.length && !inflight && phaseDone) {
        const done = phaseDone;
        phaseDone = null;
        job = null;
        done();
      }
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
      const work = job;
      queue = queue.filter((el) => !doneSet.has(el));
      while (work && !cancelled && queue.length) {
        const free = agents.filter((agent) => !agent.busy);
        if (!free.length) {
          return;
        }
        let index = queue.findIndex(ready);
        if (index < 0) {
          // Blocked only by work outside this screen: take the next layer
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
        work(agent, el)
          .catch(fail)
          .finally(() => {
            agent.busy = false;
            inflight--;
            dispatch();
            settlePhase();
          });
      }
    };

    const runPhase = (tasks: HTMLElement[], work: Job) =>
      new Promise<void>((resolve) => {
        queue = [...tasks];
        job = work;
        phaseDone = resolve;
        dispatch();
        settlePhase();
      });

    // One frame loop drives every cursor, tween and spawn.
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      try {
        // Clamped so the first frame after a hidden-tab pause never teleports.
        const real = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0;
        lastFrame = now;
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
        agents.forEach((agent, i) => stepAgent(agent, dt, real, targets[i]));

        if (building && !finished) {
          spawnCooldown -= dt;
          // The crew grows with the work on screen, up to this run's cap.
          const want = clamp(START_AGENTS + queue.length + inflight, START_AGENTS, crewCap);
          if (spawnCooldown <= 0 && agents.length < want) {
            spawn();
            spawnCooldown = 0.08;
          }
          dispatch();
          settlePhase();
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

    const makePlaceholder = (el: HTMLElement, kind: Kind) => {
      const r = el.getBoundingClientRect();
      const ph = document.createElement("div");
      ph.className = `s11-ph s11-ph-${kind}`;
      place(ph, r.left + window.scrollX, r.top + window.scrollY, r.width, r.height);
      ph.innerHTML = `<span class="s11-ph-fill"></span><i></i><i></i><i></i><i></i><span class="s11-ph-size">${Math.round(r.width)} × ${Math.round(r.height)}</span>`;
      page.appendChild(ph);
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
    const measure = (from: DOMRect, to: DOMRect) => {
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
      ghost.style.width = `${from.width}px`;
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
      if (cancelled) {
        return;
      }
      // Swap: the copy fades out while the real tile, content and all, fades in.
      ghost.style.transition = "opacity 0.3s ease";
      ghost.style.opacity = "0";
      [target, ...target.querySelectorAll<HTMLElement>(LAYER_SELECTOR)].forEach((node) => {
        if (layerSet.has(node)) {
          markBuilt(node);
        }
      });
      marks.forEach((mark) => mark.remove());
      await sleep(320);
      ghost.remove();
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
          const reach = (shown / count) * totalWidth;
          let index = 0;
          let before = 0;
          while (index < lines.length - 1 && before + widths[index] < reach) {
            before += widths[index];
            index++;
          }
          const line = lines[index];
          const x = Math.min(line.right, line.left + (reach - before));
          el.style.clipPath = `polygon(0 0, 100% 0, 100% ${line.top}px, ${x}px ${line.top}px, ${x}px ${line.bottom}px, 0 ${line.bottom}px)`;
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
      ownScrollRef.current = window.scrollY;
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

      // Build screen by screen: wireframe everything in view, then fill it.
      let stuck = 0;
      while (!cancelled && doneSet.size < layers.length) {
        if (touringRef.current && Math.abs(window.scrollY - ownScrollRef.current) > 60) {
          stopTouring();
        }
        const batch = layers.filter((el) => !doneSet.has(el) && isInView(el));
        if (!batch.length) {
          if (!touringRef.current) {
            await wait(300);
            continue;
          }
          const next = layers.find((el) => !doneSet.has(el));
          if (!next) {
            break;
          }
          const before = window.scrollY;
          const targetY =
            window.scrollY + next.getBoundingClientRect().top - window.innerHeight * 0.1;
          window.scrollTo({ top: targetY, behavior: "smooth" });
          await settleScroll();
          // Smooth scrolling needs animation frames (none in a background tab).
          if (Math.abs(window.scrollY - before) < 2) {
            window.scrollTo({ top: targetY, behavior: "instant" });
            ownScrollRef.current = window.scrollY;
          }
          // Fallback for a layer the camera can never bring into view.
          if (Math.abs(window.scrollY - before) < 2 && ++stuck > 1) {
            markBuilt(next);
            stuck = 0;
          }
          continue;
        }
        stuck = 0;
        await runPhase(batch, build);
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
        // Spread across the screen: every n-th candidate in page order.
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
        void moveTo(agent, agent.park, { pace: 0.6 });
      });
      setSummary(`Rebuilt by ${spawned} agents in ${seconds}s`);
      setPhase("done");
    };

    run().catch(fail);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
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
    setAgentCount(0);
    setAvatars([]);
    setSummary("");
    setRunId((id) => id + 1);
  };

  const toggleTouring = () => {
    touringRef.current = !touringRef.current;
    ownScrollRef.current = window.scrollY;
    setTouring(touringRef.current);
  };

  const cycleSpeed = () => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    speedRef.current = SPEEDS[nextIndex];
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
    <div className={`s11-tour${closing ? " s11-tour-closing" : ""}`}>
      <div ref={pageRef} className="s11-tour-page" aria-hidden="true" />
      <div ref={viewRef} className="s11-tour-view" aria-hidden="true" />
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
              <strong>{agentCount}</strong> agents
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
