import { createContext, useContext, useEffect, useRef } from 'react';

import { registerTimeline, registerTimelineNode } from '../utils/scroll-motion';
import '../styles/components/timeline.css';

/* ============================================================
 *  TIMELINE
 *  A vertical progress rail plus one node per entry.
 *
 *  Usage:
 *    <Timeline>                            <- renders no DOM
 *      <Stagger className="grid timeline">  <- the rail lives in here
 *        <TimelineRail />
 *        <StaggerItem className="... timeline-item">
 *          <TimelineNode />
 *          <YourCard />
 *        </StaggerItem>
 *      </Stagger>
 *    </Timeline>
 *
 *  `Timeline` deliberately renders nothing, so it can wrap an existing
 *  grid without disturbing any `.section-wrap > .grid` direct-child
 *  selectors. `TimelineRail` is absolutely positioned inside the grid,
 *  so it takes no part in grid layout.
 * ============================================================ */

const TimelineContext = createContext(null);

/** Shares the rail element between the rail itself and its nodes. */
export function Timeline({ children }) {
  const railRef = useRef(null);

  return (
    <TimelineContext.Provider value={railRef}>
      {children}
    </TimelineContext.Provider>
  );
}

/**
 * The vertical rail: an empty track with an accent fill whose height
 * tracks `--tl-progress`, written each frame by the scroll motion engine.
 * It owns the shared ref, which the nodes read to know which rail they
 * belong to. Purely decorative, so it is hidden from assistive technology.
 */
export function TimelineRail() {
  const railRef = useContext(TimelineContext);

  useEffect(() => {
    if (!railRef) return;
    return registerTimeline(railRef.current);
  }, [railRef]);

  return (
    <span className="timeline-rail" ref={railRef} aria-hidden="true">
      <span className="timeline-rail-fill" />
    </span>
  );
}

/**
 * One entry marker, sitting on the left edge of its card. Reads
 * `--tl-reached` and `--tl-current` from the engine; both default to 0,
 * so the marker degrades gracefully if the engine never attaches.
 */
export function TimelineNode({ className = '' }) {
  const railRef = useContext(TimelineContext);
  const ref = useRef(null);

  useEffect(() => {
    if (!railRef) return;
    return registerTimelineNode(railRef.current, ref.current);
  }, [railRef]);

  return (
    <span className={`timeline-node ${className}`.trim()} ref={ref} aria-hidden="true">
      <span className="timeline-node-tick" />
    </span>
  );
}