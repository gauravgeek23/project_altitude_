import { useEffect, useRef } from "react";

/**
 * A line of Ladakhi prayer flags moving in the wind, drawn on a canvas.
 *
 * Each flag is a small texture (its colour, the mantra syllable, a hem) drawn as narrow vertical
 * strips. Every strip is sheared by the wind, stretched by the lift of the free bottom edge and
 * shaded by the fold it sits on, so the cloth ripples, swings and catches the light. Gusts breathe
 * slowly and travel along the line from left to right, so the flags answer one after another.
 * Stops drawing when scrolled out of view, and draws a single still frame for reduced motion.
 */
const FLAGS = [
  { bg: "#2a5bd0", hem: "#5d86e6", ink: "#ffffff", tib: "ༀ", lat: "OM" },
  { bg: "#f4f0e6", hem: "#ffffff", ink: "#1e8a4b", tib: "མ", lat: "MA" },
  { bg: "#d8362c", hem: "#f06a60", ink: "#f6cb47", tib: "ཎི", lat: "NI" },
  { bg: "#178457", hem: "#3bb07a", ink: "#f6cb47", tib: "པདྨེ", lat: "PADME" },
  { bg: "#f3b818", hem: "#ffd863", ink: "#2a5bd0", tib: "ཧཱུྃ", lat: "HUM" },
];
const TIBETAN = `"Noto Serif Tibetan", "Noto Sans Tibetan", Kailasa, "Microsoft Himalaya", Jomolhari, "Tibetan Machine Uni", "DDC Uchen", serif`;
const FW = 34, FH = 44, COLS = 14, TS = 3;   // flag size in CSS px, strips per flag, texture scale

/** whether this browser has a font for the Tibetan syllables (else the flags carry the Latin ones) */
function canDrawTibetan(): boolean {
  const c = document.createElement("canvas"); c.width = c.height = 40;
  const x = c.getContext("2d");
  if (!x) return false;
  const draw = (s: string) => { x.clearRect(0, 0, 40, 40); x.font = `28px ${TIBETAN}`; x.fillText(s, 4, 32); return x.getImageData(0, 0, 40, 40).data; };
  const a = draw("ༀ"), b = draw("");
  let ink = 0, same = true;
  for (let k = 3; k < a.length; k += 4) { ink += a[k]; if (a[k] !== b[k]) same = false; }
  return ink > 0 && !same;
}

function makeTexture(f: (typeof FLAGS)[number], tibetan: boolean): HTMLCanvasElement {
  const w = FW * TS, h = FH * TS;
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  x.fillStyle = f.bg; x.fillRect(0, 0, w, h);
  // the weave: faint threads
  x.globalAlpha = 0.06; x.fillStyle = "#000";
  for (let y = 0; y < h; y += 2 * TS) x.fillRect(0, y, w, TS * 0.6);
  for (let xx = 0; xx < w; xx += 2 * TS) x.fillRect(xx, 0, TS * 0.4, h);
  x.globalAlpha = 1;
  // hem
  x.strokeStyle = f.hem; x.lineWidth = 1.3 * TS; x.strokeRect(1.6 * TS, 1.6 * TS, w - 3.2 * TS, h - 3.2 * TS);
  // the syllable
  x.fillStyle = f.ink; x.textAlign = "center"; x.textBaseline = "middle";
  if (tibetan) {
    x.font = `bold ${15 * TS}px ${TIBETAN}`; x.fillText(f.tib, w / 2, h * 0.37);
    x.font = `bold ${5.4 * TS}px "Helvetica Neue", Helvetica, Arial, sans-serif`; x.fillText(f.lat, w / 2, h * 0.655);
  } else {
    x.font = `bold ${8.5 * TS}px "Helvetica Neue", Helvetica, Arial, sans-serif`; x.fillText(f.lat, w / 2, h * 0.45);
  }
  // a lotus line along the bottom
  x.strokeStyle = f.ink; x.lineWidth = 1.1 * TS; x.globalAlpha = 0.85; x.lineCap = "round";
  x.beginPath();
  for (let k = -1; k <= 1; k++) { const cx = w / 2 + k * 6.5 * TS, cy = h * 0.84; x.moveTo(cx - 3 * TS, cy); x.arc(cx, cy, 3 * TS, Math.PI, 0, false); }
  x.stroke();
  x.beginPath(); x.moveTo(w * 0.22, h * 0.9); x.lineTo(w * 0.78, h * 0.9); x.stroke();
  // ambient occlusion where the cloth hangs from the rope
  const g = x.createLinearGradient(0, 0, 0, h * 0.3); g.addColorStop(0, "rgba(0,0,0,.26)"); g.addColorStop(1, "rgba(0,0,0,0)");
  x.globalAlpha = 1; x.fillStyle = g; x.fillRect(0, 0, w, h * 0.3);
  return c;
}

function makeShadow(): HTMLCanvasElement {
  const c = document.createElement("canvas"); c.width = 96; c.height = 96;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(48, 48, 10, 48, 48, 48);
  g.addColorStop(0, "rgba(0,0,0,.55)"); g.addColorStop(0.55, "rgba(0,0,0,.22)"); g.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g; x.fillRect(0, 0, 96, 96);
  return c;
}

export function PrayerFlags({ height = 88 }: { height?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tex = FLAGS.map((f) => makeTexture(f, canDrawTibetan()));
    const shadow = makeShadow();
    let w = 0, dpr = 1, raf = 0, visible = true, frames = 0;
    let rope = "#e2dbc8", ropeEdge = "rgba(0,0,0,.28)";
    const t0 = performance.now();

    const readColours = () => {
      const s = getComputedStyle(canvas);
      rope = s.getPropertyValue("--rope").trim() || rope;
      ropeEdge = s.getPropertyValue("--rope-edge").trim() || ropeEdge;
    };
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.getBoundingClientRect().width || 400;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(height * dpr);
      readColours();
      if (reduce) draw(3.2);
    };

    // a slow breathing strength with the odd stronger gust, travelling left to right
    const noise = (t: number) => 0.5 + 0.5 * (0.55 * Math.sin(t * 0.31) + 0.3 * Math.sin(t * 0.83 + 1.3) + 0.15 * Math.sin(t * 2.1 + 0.4));
    const gustAt = (t: number, u: number) => { const g = noise(t * 0.9 - u * 1.8); return 0.22 + 0.78 * g * g; };

    function draw(t: number) {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, height);
      const n = Math.max(5, Math.min(10, Math.floor(w / 46)));
      const sag = Math.min(12, w * 0.03), ropeY = 9;
      const ropeAt = (x: number) => { const u = x / w; return ropeY + sag * 4 * u * (1 - u) + 0.7 * Math.sin(t * 0.8 + u * 3.1); };

      // shadows, cast on the panel behind
      for (let i = 0; i < n; i++) {
        const cx = (w * (i + 0.5)) / n, g = gustAt(t, cx / w);
        const shear = 0.1 + 0.45 * g;
        ctx!.globalAlpha = 0.11 + 0.08 * g;
        ctx!.drawImage(shadow, cx - FW / 2 - 8 + shear * FH * 0.5, ropeAt(cx) + 10, FW + 16, FH + 10);
      }
      ctx!.globalAlpha = 1;

      // the rope, with a darker line beneath it for depth
      ctx!.lineCap = "round";
      ctx!.beginPath();
      for (let x = 0; x <= w + 4; x += 6) { const y = ropeAt(Math.min(x, w)); x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y); }
      ctx!.lineWidth = 2.6; ctx!.strokeStyle = ropeEdge; ctx!.stroke();
      ctx!.lineWidth = 1.6; ctx!.strokeStyle = rope; ctx!.stroke();

      // the flags
      for (let i = 0; i < n; i++) {
        const cx = (w * (i + 0.5)) / n, u = cx / w, g = gustAt(t, u);
        const f = tex[i % FLAGS.length];
        const x0 = cx - FW / 2;
        // the free edge swings downwind, and sways
        const shear = 0.1 + 0.42 * g + 0.1 * g * Math.sin(t * 2.3 + i * 1.7);
        const sw = f.width / COLS, dw = FW / COLS;
        for (let c = 0; c < COLS; c++) {
          const v = (c + 0.5) / COLS;
          const ph = v * 9.5 - t * (5 + 7 * g) + i * 1.1;   // a ripple travelling across the cloth
          const x = x0 + c * dw + 1.1 * g * Math.sin(ph);   // threads bunch on the folds
          const top = ropeAt(x + dw / 2) + 0.6;
          const lift = 1 - 0.07 * g - 0.08 * g * (0.5 + 0.5 * Math.sin(ph * 0.8 + 0.9));   // the hem waves up
          const hh = FH * lift;
          ctx!.save();
          ctx!.transform(1, 0, shear, 1, x, top);
          ctx!.drawImage(f, c * sw, 0, sw + 1, f.height, 0, 0, dw + 0.7, hh);
          const light = Math.cos(ph) * 0.2 * g;   // the side of a fold that faces the light
          ctx!.fillStyle = light > 0 ? `rgba(255,255,255,${light.toFixed(3)})` : `rgba(0,0,0,${(-light * 0.9).toFixed(3)})`;
          ctx!.fillRect(0, 0, dw + 0.7, hh);
          ctx!.restore();
        }
        // the knot
        ctx!.beginPath(); ctx!.arc(cx, ropeAt(cx), 1.9, 0, Math.PI * 2); ctx!.fillStyle = rope; ctx!.fill();
        ctx!.lineWidth = 0.8; ctx!.strokeStyle = ropeEdge; ctx!.stroke();
      }
    }

    function frame(now: number) {
      raf = 0;
      if (++frames % 90 === 0) readColours();
      draw((now - t0) / 1000);
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !reduce) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    if (!reduce) raf = requestAnimationFrame(frame);
    return () => { ro.disconnect(); io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [height]);
  return <canvas ref={ref} className="prayer-flags" style={{ height }} aria-hidden="true" />;
}
