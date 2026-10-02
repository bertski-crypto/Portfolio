import { motion } from 'framer-motion';

import { EASE } from '../utils/motion';
import { useReduced } from '../utils/motion-primitives';

import '../styles/components/hero-network.css';

/* ------------------------------------------------------------------ */
/*  A hexagonal node lattice that sits beside the portrait.            */
/*  Geometry is fixed so the SVG never needs to re-measure on resize.  */
/* ------------------------------------------------------------------ */

const NODES = [
  { id: 'top', cx: 120, cy: 42, r: 7.5, pulse: 0 },
  { id: 'left', cx: 48, cy: 120, r: 6.5, pulse: 0.7 },
  { id: 'center', cx: 120, cy: 120, r: 8.5, pulse: 0.35 },
  { id: 'right', cx: 192, cy: 120, r: 6.5, pulse: 1.05 },
  { id: 'bottom', cx: 120, cy: 198, r: 7.5, pulse: 1.4 },
];

/** Decorative dots floating off the apex / base corners. */
const SATELLITES = [
  { id: 'tl', cx: 34, cy: 22 },
  { id: 'tr', cx: 206, cy: 22 },
  { id: 'bl', cx: 34, cy: 218 },
  { id: 'br', cx: 206, cy: 218 },
];

/** Lattice edges: apex fans to the middle row, base mirrors it. */
const EDGE_PAIRS = [
  ['top', 'left'],
  ['top', 'center'],
  ['top', 'right'],
  ['left', 'center'],
  ['center', 'right'],
  ['left', 'bottom'],
  ['center', 'bottom'],
  ['right', 'bottom'],
];

/** Short spokes reaching out to the satellites. */
const SPOKE_PAIRS = [
  ['top', 'tl'],
  ['top', 'tr'],
  ['bottom', 'bl'],
  ['bottom', 'br'],
];

const POS = new Map([...NODES, ...SATELLITES].map((n) => [n.id, n]));

const EDGES = [...EDGE_PAIRS, ...SPOKE_PAIRS].map(([from, to]) => ({
  key: `${from}-${to}`,
  x1: POS.get(from).cx,
  y1: POS.get(from).cy,
  x2: POS.get(to).cx,
  y2: POS.get(to).cy,
}));

export default function HeroNetwork() {
  const reduced = useReduced();

  return (
    <div className="hero-network" aria-hidden="true">
      <svg
        className="hero-network-svg"
        viewBox="0 0 240 240"
        focusable="false"
        role="presentation"
      >
        <defs>
          <linearGradient
            id="hero-network-grad"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" className="hero-network-grad-start" />
            <stop offset="100%" className="hero-network-grad-end" />
          </linearGradient>
        </defs>

        {/* Static lattice */}
        <g className="hero-network-edges">
          {EDGES.map((e) => (
            <line key={e.key} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
          ))}
        </g>

        {/* Light travelling along each edge */}
        <g className={reduced ? 'hero-network-flow' : 'hero-network-flow is-live'}>
          {EDGES.map((e, i) => (
            <line
              key={`flow-${e.key}`}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              style={{ animationDelay: `${(i * 0.38).toFixed(2)}s` }}
            />
          ))}
        </g>

        {/* Nodes + expanding pulse rings */}
        <g className="hero-network-nodes">
          {NODES.map((n) => (
            <g key={n.id}>
              {!reduced && (
                <motion.circle
                  className="hero-network-pulse"
                  cx={n.cx}
                  cy={n.cy}
                  r={n.r}
                  initial={{ opacity: 0.45, scale: 1 }}
                  animate={{ opacity: 0, scale: 2.8 }}
                  transition={{
                    duration: 2.8,
                    delay: n.pulse,
                    ease: EASE.out,
                    repeat: Infinity,
                    repeatDelay: 1.6,
                  }}
                />
              )}
              <circle className="hero-network-dot" cx={n.cx} cy={n.cy} r={n.r} />
            </g>
          ))}
        </g>

        {/* Satellites */}
        <g className="hero-network-satellites">
          {SATELLITES.map((s) => (
            <circle key={s.id} cx={s.cx} cy={s.cy} r={3.2} />
          ))}
        </g>
      </svg>
    </div>
  );
}