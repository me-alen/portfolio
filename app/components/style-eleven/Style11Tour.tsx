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
const MAX_AGENTS = 40;

// Base timings in ms at 1×; every agent wait is divided by the current speed.
const MOVE = 280;
const DRAW = 260;
const HOLD = 120;
const FADE = 300;
const IMAGE_FADE = 520;
const DUPLICATE_HOLD = 260;
const TYPE_PER_CHAR = 9;
const TYPE_MIN = 160;
const TYPE_MAX = 700;
const TYPE_STEP = 30;

// Static markup for the three agent tools: select arrow, draw crosshair, text I-beam.
const CURSOR_SVGS =
  '<svg class="t-arrow" viewBox="0 0 24 24" width="20" height="20"><path d="M4 2.5 20 10l-7.2 2.2L9.9 19.6Z" style="fill:var(--agent)" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>' +
  '<svg class="t-cross" viewBox="0 0 20 20" width="20" height="20"><path d="M10 2v16M2 10h16" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/><path d="M10 2v16M2 10h16" style="stroke:var(--agent)" stroke-width="2" stroke-linecap="round"/></svg>' +
  '<svg class="t-text" viewBox="0 0 20 20" width="20" height="20"><path d="M7 2.5h6M10 2.5v15M7 17.5h6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M7 2.5h6M10 2.5v15M7 17.5h6" fill="none" style="stroke:var(--agent)" stroke-width="1.8" stroke-linecap="round"/></svg>';

type Tool = "arrow" | "cross" | "text";
type Kind = "box" | "text" | "image";
type Agent = {
  el: HTMLDivElement;
  letter: string;
  color: string;
  busy: boolean;
};
type Line = { top: number; bottom: number; left: number; right: number };
type Avatar = { letter: string; color: string };

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
    let finished = false;
    const startedAt = performance.now();
    const timers = new Set<number>();
    const layers = [...root.querySelectorAll<HTMLElement>(LAYER_SELECTOR)];
    const doneSet = new Set<HTMLElement>();
    const placeholders = new Map<HTMLElement, HTMLDivElement>();
    const agents: Agent[] = [];

    // Tag every element that waits for an agent; a replay re-tags the page as
    // it is now, so cards React re-created since the last run are included.
    layers.forEach((el) => el.setAttribute("data-wait", ""));
    root.setAttribute("data-tagged", "");
    window.scrollTo({ top: 0, behavior: "instant" });
    ownScrollRef.current = 0;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });
    const sleep = (ms: number) => wait(ms / speedRef.current);
    const until = async (check: () => boolean, maxMs: number) => {
      const end = performance.now() + maxMs / speedRef.current;
      while (!cancelled && !check() && performance.now() < end) {
        await wait(50);
      }
    };

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

    const markBuilt = (el: HTMLElement) => {
      if (doneSet.has(el)) {
        return;
      }
      el.removeAttribute("data-wait");
      doneSet.add(el);
      setBuilt(doneSet.size);
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

    const area = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.width * r.height;
    };

    const clampY = (y: number) => Math.min(Math.max(y, 8), window.innerHeight - 24);

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

    const moveAgent = (agent: Agent, x: number, y: number, ms: number) => {
      agent.el.style.transitionDuration = `${ms / speedRef.current}ms`;
      agent.el.style.transform = `translate(${x}px, ${y}px)`;
    };

    const setTool = (agent: Agent, tool: Tool) => {
      agent.el.dataset.tool = tool;
    };

    const wander = (agent: Agent) => {
      moveAgent(
        agent,
        window.innerWidth * (0.12 + Math.random() * 0.76),
        window.innerHeight * (0.15 + Math.random() * 0.65),
        900,
      );
    };

    const spawn = () => {
      if (agents.length >= MAX_AGENTS) {
        return null;
      }
      const index = agents.length;
      const color = COLORS[index % COLORS.length];
      const el = document.createElement("div");
      el.className = "s11-agent";
      el.dataset.tool = "arrow";
      el.style.setProperty("--agent", color);
      el.innerHTML = CURSOR_SVGS;

      // Enter from just outside a screen edge.
      const w = window.innerWidth;
      const h = window.innerHeight;
      const t = Math.random();
      const side = index % 4;
      const x = side === 0 || side === 2 ? t * w : side === 1 ? w + 30 : -30;
      const y = side === 1 || side === 3 ? t * h : side === 0 ? -30 : h + 30;
      el.style.transform = `translate(${x}px, ${y}px)`;
      view.appendChild(el);
      void el.offsetWidth;

      const agent: Agent = {
        el,
        color,
        letter: LETTERS[Math.floor(Math.random() * LETTERS.length)],
        busy: false,
      };
      agents.push(agent);
      setAgentCount(agents.length);
      setAvatars(agents.slice(-5).map(({ letter, color: c }) => ({ letter, color: c })));
      return agent;
    };

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
      ph.style.setProperty("--d", `${DRAW / speedRef.current}ms`);
      ph.innerHTML = `<span class="s11-ph-fill"></span><i></i><i></i><i></i><i></i><span class="s11-ph-size">${Math.round(r.width)} × ${Math.round(r.height)}</span>`;
      page.appendChild(ph);
      placeholders.set(el, ph);
      return { ph, r };
    };

    // Wireframe pass: drag out a gray box (or a text frame) for one layer.
    const draw = async (agent: Agent, el: HTMLElement) => {
      if (doneSet.has(el)) {
        return;
      }
      const kind = kindOf(el);
      const { ph, r } = makePlaceholder(el, kind);
      setTool(agent, kind === "text" ? "arrow" : "cross");
      moveAgent(agent, r.left, clampY(r.top), MOVE);
      await sleep(MOVE);
      if (cancelled) {
        return;
      }
      ph.classList.add("is-on");
      if (kind !== "text") {
        void ph.offsetWidth;
        ph.classList.add("is-drawn");
        moveAgent(
          agent,
          Math.min(r.right, window.innerWidth - 24),
          clampY(r.bottom),
          DRAW,
        );
        blip(420, 0.07, 0.03);
        await sleep(DRAW);
      }
      ph.classList.add("is-selected");
      await sleep(HOLD);
      ph.classList.remove("is-selected");
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

    // Copy the finished previous sibling into this slot, as a designer would.
    const duplicate = async (agent: Agent, source: HTMLElement, target: HTMLElement) => {
      const from = source.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      moveAgent(agent, from.left + 16, clampY(from.top + 12), MOVE);
      await sleep(MOVE);
      if (cancelled) {
        return;
      }

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
      ghost.style.transition = `transform ${MOVE / speedRef.current}ms cubic-bezier(0.45, 0.05, 0.25, 1), opacity 0.2s ease`;
      void ghost.offsetWidth;
      ghost.style.transform = `translate(${to.left - from.left}px, ${to.top - from.top}px)`;
      moveAgent(agent, to.left + 16, clampY(to.top + 12), MOVE);
      blip(660, 0.06, 0.025);
      await sleep(MOVE);

      const marks = measure(from, to);
      await sleep(DUPLICATE_HOLD);
      ghost.style.opacity = "0";
      marks.forEach((mark) => mark.remove());
      await sleep(160);
      ghost.remove();
    };

    // Fill pass for text: reveal line by line behind a moving caret.
    const typeIn = async (agent: Agent, el: HTMLElement, ph?: HTMLDivElement) => {
      const r = el.getBoundingClientRect();
      const docLeft = r.left + window.scrollX;
      const docTop = r.top + window.scrollY;
      const lines = measureLines(el, r);
      const widths = lines.map((line) => Math.max(1, line.right - line.left));
      const totalWidth = widths.reduce((sum, width) => sum + width, 0);
      const chars = Math.max(1, (el.textContent ?? "").trim().length);
      const duration = Math.min(TYPE_MAX, Math.max(TYPE_MIN, chars * TYPE_PER_CHAR));
      const steps = Math.max(2, Math.round(duration / TYPE_STEP));

      setTool(agent, "text");
      moveAgent(agent, r.left + lines[0].left, clampY(r.top + lines[0].top + 8), MOVE);
      await sleep(MOVE);
      if (cancelled) {
        return;
      }

      ph?.classList.add("is-selected");
      const caret = document.createElement("div");
      caret.className = "s11-caret";
      page.appendChild(caret);
      el.style.transition = "none";
      el.style.clipPath = "polygon(0 0, 0 0, 0 0)";
      markBuilt(el);

      for (let step = 1; step <= steps; step++) {
        const target = (step / steps) * totalWidth;
        let index = 0;
        let before = 0;
        while (index < lines.length - 1 && before + widths[index] < target) {
          before += widths[index];
          index++;
        }
        const line = lines[index];
        const x = Math.min(line.right, line.left + (target - before));
        el.style.clipPath = `polygon(0 0, 100% 0, 100% ${line.top}px, ${x}px ${line.top}px, ${x}px ${line.bottom}px, 0 ${line.bottom}px)`;
        caret.style.height = `${line.bottom - line.top}px`;
        caret.style.transform = `translate(${docLeft + x}px, ${docTop + line.top}px)`;
        moveAgent(
          agent,
          docLeft + x - window.scrollX + 3,
          clampY(docTop + (line.top + line.bottom) / 2 - window.scrollY),
          0,
        );
        if (step % 2 === 0) {
          blip(1500 + Math.random() * 500, 0.025, 0.012);
        }
        await sleep(TYPE_STEP);
        if (cancelled) {
          return;
        }
      }

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
      const parentLayer = el.parentElement?.closest<HTMLElement>(LAYER_SELECTOR);
      if (parentLayer && root.contains(parentLayer)) {
        await until(() => doneSet.has(parentLayer), 3000);
      }
      if (cancelled) {
        return;
      }

      const kind = kindOf(el);
      const ph = placeholders.get(el);
      if (kind === "text") {
        await typeIn(agent, el, ph);
        return;
      }

      const source = el.previousElementSibling;
      if (
        kind === "box" &&
        source instanceof HTMLElement &&
        source.matches(LAYER_SELECTOR) &&
        source.tagName === el.tagName &&
        source.className === el.className &&
        !source.classList.contains("s11-ghost")
      ) {
        // Capped so a long grid never turns into a single-file chain of copies.
        await until(() => doneSet.has(source), 600);
        if (!cancelled && doneSet.has(source)) {
          await duplicate(agent, source, el);
        }
      }
      if (cancelled) {
        return;
      }

      const r = el.getBoundingClientRect();
      moveAgent(
        agent,
        r.left + Math.min(r.width / 2, 60),
        clampY(r.top + Math.min(r.height / 2, 30)),
        MOVE,
      );
      await sleep(MOVE);
      if (cancelled) {
        return;
      }
      ph?.classList.add("is-selected");
      markBuilt(el);
      blip(kind === "image" ? 300 : 360, 0.09, 0.03);
      await sleep(HOLD);
      ph?.classList.add("is-leaving");
      await sleep(kind === "image" ? IMAGE_FADE : FADE);
      ph?.remove();
      placeholders.delete(el);
    };

    const runPhase = async (
      tasks: HTMLElement[],
      work: (agent: Agent, el: HTMLElement) => Promise<void>,
    ) => {
      const queue = [...tasks];
      await Promise.all(
        agents.map(async (agent) => {
          while (!cancelled && queue.length) {
            const el = queue.shift();
            if (!el) {
              return;
            }
            agent.busy = true;
            await work(agent, el);
            agent.busy = false;
          }
        }),
      );
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

      // Gather: the crew flies in from the edges into two swarms.
      for (let i = 0; i < START_AGENTS; i++) {
        spawn();
      }
      agents.forEach((agent, i) => {
        const cx = window.innerWidth / 2 + (i % 2 ? 150 : -150);
        const cy = window.innerHeight / 2 + (i % 2 ? -60 : 70);
        moveAgent(
          agent,
          cx + (Math.random() - 0.5) * 90,
          cy + (Math.random() - 0.5) * 80,
          900,
        );
      });
      await sleep(1500);
      if (cancelled) {
        return;
      }
      setPhase("build");

      // The crew keeps growing, and idle agents drift around the page.
      void (async () => {
        while (!cancelled && !finished && agents.length < MAX_AGENTS) {
          await sleep(800);
          if (cancelled || finished) {
            return;
          }
          [spawn(), spawn()].forEach((agent) => agent && wander(agent));
        }
      })();
      void (async () => {
        while (!cancelled && !finished) {
          await wait(1100);
          agents.forEach((agent) => {
            if (!agent.busy && !finished && Math.random() < 0.6) {
              wander(agent);
            }
          });
        }
      })();

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

        const toDraw = batch
          .filter((el) => !placeholders.has(el))
          .sort((a, b) => area(b) - area(a));
        await runPhase(toDraw, draw);
        if (cancelled) {
          return;
        }
        await sleep(120);
        await runPhase(batch, fill);
      }
      if (cancelled) {
        return;
      }

      // Finale: back to the top, crew gathers on the portrait, summary bar.
      finished = true;
      const seconds = ((performance.now() - startedAt) / 1000).toFixed(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      await settleScroll();
      if (window.scrollY > 2) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      const portrait = root.querySelector(".s11-photo-panel")?.getBoundingClientRect();
      agents.forEach((agent) => {
        agent.busy = true;
        setTool(agent, "arrow");
        if (portrait) {
          moveAgent(
            agent,
            portrait.left + portrait.width * (0.25 + Math.random() * 0.5),
            portrait.top + portrait.height * (0.15 + Math.random() * 0.55),
            1100,
          );
        }
      });
      setSummary(`Rebuilt by ${agents.length} agents in ${seconds}s`);
      setPhase("done");
    };

    // If the intro breaks, the page must still appear.
    run().catch((error: unknown) => {
      console.warn("Intro stopped:", error);
      cancelled = true;
      layers.forEach(markBuilt);
      onDone();
    });

    return () => {
      cancelled = true;
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
