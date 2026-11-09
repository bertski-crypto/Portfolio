import { useEffect, useMemo, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

import {
  EASE,
  useHasFinePointer,
  useIsDesktop,
  useReduced,
} from '../utils/motion-primitives';
import '../styles/components/ambient.css';

/* ------------------------------------------------------------------ */
/*  Deterministic pseudo-random so SSR/build never mismatches.         */
/* ------------------------------------------------------------------ */
function makeRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/*  Particle field — slow drift, varied speeds, tiny + decorative      */
/* ------------------------------------------------------------------ */
function ParticleField() {
  const reduced = useReduced();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    setCount(saveData ? 0 : desktop ? 28 : 10);
  }, []);

  const particles = useMemo(() => {
    const rand = makeRandom(20260928); // stable seed
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 1 + rand() * 2,
      opacity: 0.12 + rand() * 0.22,
      duration: 14 + rand() * 16, // 14–30s, desynchronised
      delay: -rand() * 20,
    }));
  }, [count]);

  if (reduced || count === 0) return null;

  /* CSS keyframes per particle: composited on the GPU, zero main-thread
     work. The old framer-motion variants animated 28 elements via JS on
     every frame, forever. Duration/delay stay per-particle and inline. */
  return (
    <div className="ambient-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="ambient-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cursor light — soft, low-opacity, desktop fine-pointer only        */
/* ------------------------------------------------------------------ */
function CursorLight() {
  const enabled = useHasFinePointer();
  const isDesktop = useIsDesktop(1024);
  const reduced = useReduced();

  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 90, damping: 26, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 90, damping: 26, mass: 0.7 });

  useEffect(() => {
    if (!enabled || reduced) return;
    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, reduced, x, y]);

  if (!enabled || !isDesktop || reduced) return null;

  return (
    <motion.div
      className="ambient-cursor"
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.6, ease: EASE.entrance }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Drifting orbs — pure CSS keyframes (GPU-composited, no JS loop,   */
/*  no framer-motion per-frame style writes).                          */
/* ------------------------------------------------------------------ */
const ORBS = [
  { cls: 'ambient-blob--a' },
  { cls: 'ambient-blob--b' },
  { cls: 'ambient-blob--c' },
];

function Orbs() {
  return (
    <>
      {ORBS.map((orb) => (
        <div key={orb.cls} className={`ambient-blob ${orb.cls}`} aria-hidden="true" />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Public component                                                    */
/* ------------------------------------------------------------------ */
export default function Ambient() {
  return (
    <div className="ambient-layer" aria-hidden="true">
      <div className="ambient-grid" aria-hidden="true" />
      <Orbs />
      <ParticleField />
      <CursorLight />
    </div>
  );
}