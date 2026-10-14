import { useEffect, useRef } from 'react';
import { useReduced } from '../utils/motion-primitives';
import '../styles/components/threed-background.css';

/* ------------------------------------------------------------------ */
/*  Deterministic pseudo-random so the layout is stable between loads.  */
/* ------------------------------------------------------------------ */
function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex) {
  const h = hex.trim().replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(n)) return [77, 163, 255];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const rgba = (hex, a) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  const get = (name, fb) => cs.getPropertyValue(name).trim() || fb;
  return {
    accent: get('--accent', '#4da3ff'),
    cyan: get('--accent-cyan', '#5de4ff'),
    violet: get('--accent-violet', '#8b7cff'),
  };
}

const clamp01 = (n) => (n > 0 ? (n < 1 ? n : 1) : 0);
const wrap = (v, min, max) => {
  const r = max - min;
  return min + ((((v - min) % r) + r) % r);
};

/* Cube geometry: 8 corners, 12 edges. */
const CORNERS = [
  [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1],
];
const EDGES = [
  [0, 1], [1, 3], [3, 2], [2, 0],
  [4, 5], [5, 7], [7, 6], [6, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

/* Scroll travel per depth layer — small, controlled distances. */
const LAYER_FACTOR = [0.016, 0.042, 0.085];

export default function ThreeDBackground() {
  const canvasRef = useRef(null);
  const reduced = useReduced();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const desktop = window.matchMedia('(min-width: 768px)').matches;
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    const dpr = Math.min(window.devicePixelRatio || 1, desktop ? 1.5 : 1);

    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const rand = mulberry32(20261009);
    const paletteRef = { current: readPalette() };
    const PALETTE = () => [paletteRef.current.accent, paletteRef.current.cyan, paletteRef.current.violet];

    /* ---------------- scene graph (fixed counts, no per-frame alloc) --- */
    const SHAPE_COUNT = saveData ? 0 : desktop ? 7 : 3;
    const NODE_COUNT = saveData ? 0 : desktop ? 20 : 9;
    const DOT_COUNT = saveData ? 0 : desktop ? 55 : 16;

    const kinds = ['cube', 'ring', 'sphere', 'ring', 'cube', 'sphere', 'cube'];
    const shapes = Array.from({ length: SHAPE_COUNT }, (_, i) => ({
      kind: kinds[i % kinds.length],
      bx: 0.06 + rand() * 0.88,
      by: rand(),
      depth: 0.3 + rand() * 0.7,
      layer: i % 3,
      size: 26 + rand() * 46,
      rx: rand() * Math.PI * 2,
      ry: rand() * Math.PI * 2,
      vrx: (0.05 + rand() * 0.1) * (rand() > 0.5 ? 1 : -1),
      vry: (0.07 + rand() * 0.12) * (rand() > 0.5 ? 1 : -1),
      phase: rand() * Math.PI * 2,
      amp: 10 + rand() * 22,
      dur: 9 + rand() * 14,
      color: i % 3,
    }));

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      bx: rand(),
      by: rand(),
      depth: 0.35 + rand() * 0.65,
      layer: rand() > 0.6 ? 2 : 1,
      phase: rand() * Math.PI * 2,
      dur: 7 + rand() * 10,
      amp: 8 + rand() * 16,
      color: Math.floor(rand() * 3),
    }));

    const dots = Array.from({ length: DOT_COUNT }, () => ({
      bx: rand(),
      by: rand(),
      depth: 0.25 + rand() * 0.75,
      layer: Math.floor(rand() * 3),
      r: 0.6 + rand() * 1.4,
      a: 0.08 + rand() * 0.2,
      phase: rand() * Math.PI * 2,
      dur: 12 + rand() * 18,
      drift: 12 + rand() * 30,
    }));

    /* ---------------- scroll + visibility state (refs only) ------------ */
    let targetScroll = window.scrollY || 0;
    let smoothScroll = targetScroll;
    let running = true;
    let raf = 0;
    const t0 = performance.now();

    const onScroll = () => {
      targetScroll = window.scrollY || 0;
      if (!running) start();
    };
    const onResize = () => resize();
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        targetScroll = window.scrollY || 0;
        if (!running) start();
      }
    };
    const themeObserver = new MutationObserver(() => {
      paletteRef.current = readPalette();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    const proj = new Array(8);

    function drawShape(s, t, heroMix) {
      const pal = PALETTE();
      const col = pal[s.color];
      const yPar = smoothScroll * LAYER_FACTOR[s.layer];
      const cx = s.bx * w + Math.cos((t * 2 * Math.PI) / (s.dur * 1.3) + s.phase) * s.amp * 0.5;
      const cy = wrap(
        s.by * h - yPar + Math.sin((t * 2 * Math.PI) / s.dur + s.phase) * s.amp,
        -220,
        h + 220,
      );
      /* Hero reads slightly deeper; the effect settles as you scroll on. */
      const alphaMul = (0.72 + 0.38 * heroMix) * (0.45 + s.depth * 0.55);
      const scrollTwist = smoothScroll * 0.00003 * (s.layer + 1);
      const rx = s.rx + t * s.vrx;
      const ry = s.ry + t * s.vry + scrollTwist;

      if (s.kind === 'cube') {
        const cX = Math.cos(rx);
        const sX = Math.sin(rx);
        const cY = Math.cos(ry);
        const sY = Math.sin(ry);
        const scale = s.size * (0.5 + s.depth * 0.7);
        for (let i = 0; i < 8; i++) {
          const [x, y, z] = CORNERS[i];
          const x1 = x * cY + z * sY;
          const z1 = -x * sY + z * cY;
          const y1 = y * cX - z1 * sX;
          proj[i] = [cx + x1 * scale, cy + y1 * scale];
        }
        ctx.strokeStyle = rgba(col, 0.22 * alphaMul);
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < EDGES.length; i++) {
          const [a, b] = EDGES[i];
          ctx.moveTo(proj[a][0], proj[a][1]);
          ctx.lineTo(proj[b][0], proj[b][1]);
        }
        ctx.stroke();
      } else if (s.kind === 'ring') {
        const r = s.size * (0.6 + s.depth * 0.8);
        ctx.strokeStyle = rgba(col, 0.2 * alphaMul);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.38, ry, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = rgba(col, 0.1 * alphaMul);
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 1.35, r * 1.35 * 0.38, -ry * 0.7, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        const r = s.size * (0.35 + s.depth * 0.45);
        const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
        g.addColorStop(0, rgba(pal[1], 0.32 * alphaMul));
        g.addColorStop(0.55, rgba(col, 0.12 * alphaMul));
        g.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = rgba(col, 0.28 * alphaMul);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function frame(now) {
      if (!running) return;
      const t = (now - t0) / 1000;

      /* Eased scroll chase — continuous, never jumpy. */
      const diff = targetScroll - smoothScroll;
      smoothScroll += Math.abs(diff) < 0.05 ? diff : diff * 0.07;

      const vh = h || 1;
      const heroMix = clamp01(1 - smoothScroll / (vh * 1.3));
      const pal = PALETTE();

      ctx.clearRect(0, 0, w, h);

      /* Far → mid → fore so nearer shapes naturally overlap. */
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < shapes.length; i++) {
          if (shapes[i].layer === pass) drawShape(shapes[i], t, heroMix);
        }
      }

      /* Network nodes + links (positions resolved once per frame). */
      const px = new Array(nodes.length);
      const py = new Array(nodes.length);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        px[i] = n.bx * w + Math.cos((t * 2 * Math.PI) / n.dur + n.phase) * n.amp * 0.6;
        py[i] = wrap(
          n.by * h - smoothScroll * LAYER_FACTOR[n.layer] + Math.sin((t * 2 * Math.PI) / n.dur + n.phase) * n.amp,
          -60,
          h + 60,
        );
      }
      const linkDist = Math.min(w, h) * (desktop ? 0.17 : 0.24);
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = px[i] - px[j];
          const dy = py[i] - py[j];
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < linkDist) {
            const fade = (1 - d / linkDist) * 0.16 * (0.7 + 0.3 * Math.sin(t * 0.6 + i + j));
            if (fade > 0.01) {
              ctx.strokeStyle = rgba(pal[0], fade);
              ctx.beginPath();
              ctx.moveTo(px[i], py[i]);
              ctx.lineTo(px[j], py[j]);
              ctx.stroke();
            }
          }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulse = 0.75 + 0.25 * Math.sin((t * 2 * Math.PI) / 3.2 + n.phase);
        const r = (1.2 + n.depth * 1.7) * pulse;
        const col = pal[n.color];
        ctx.fillStyle = rgba(col, 0.75);
        ctx.shadowBlur = 8;
        ctx.shadowColor = rgba(col, 0.6);
        ctx.beginPath();
        ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      /* Ambient dust at three depths. */
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const x = d.bx * w;
        const y = wrap(
          d.by * h - smoothScroll * LAYER_FACTOR[d.layer] + Math.sin((t * 2 * Math.PI) / d.dur + d.phase) * d.drift * 0.4 - (t * d.drift * 0.12) % (h + 80),
          -40,
          h + 40,
        );
        ctx.fillStyle = rgba(pal[0], d.a);
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Ambient motion runs continuously; the loop parks only when hidden. */
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }

    running = true;
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      themeObserver.disconnect();
    };
  }, [reduced]);

  /* Static fallback: calm gradient, no motion, same palette tokens. */
  if (reduced) {
    return <div className="threed-layer threed-static" aria-hidden="true" />;
  }

  return (
    <div className="threed-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="threed-canvas" />
      <div className="threed-vignette" />
    </div>
  );
}
