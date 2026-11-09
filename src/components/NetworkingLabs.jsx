import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Globe2,
  Network,
  Server,
  Share2,
  GitBranch,
  Terminal,
  Wrench,
  ChevronRight,
  X,
} from 'lucide-react';

import { networkingLabs, getLabsByStatus } from '../data/labs';
import { buildLabCarouselItems } from '../data/carouselCovers';
import CircularCarousel from './CircularCarousel';
import StarBorder from './StarBorder';
import usePortfolioTheme from '../utils/usePortfolioTheme';
import {
  Reveal,
  SectionHeader,
  SectionTitle,
  Stagger,
  StaggerItem,
  tapSoft,
  useReduced,
} from '../utils/motion-primitives';

import '../styles/components/labs.css';
import '../styles/components/bento.css';

const labIcons = { Globe2, Network, Server, Share2, GitBranch, Terminal, Wrench };

const statusStyles = {
  'COMPLETED': { tone: 'ok', label: 'COMPLETED' },
  'IN PROGRESS': { tone: 'info', label: 'IN PROGRESS' },
  'LEARNING': { tone: 'warn', label: 'LEARNING' },
  'PLANNED': { tone: 'muted', label: 'PLANNED' },
  'NEXT': { tone: 'muted', label: 'NEXT' },
};

/* ------------------------------------------------------------------ */
/*  Summary counters                                                   */
/* ------------------------------------------------------------------ */
function SummaryBar() {
  const groups = {
    'COMPLETED': getLabsByStatus('COMPLETED'),
    'IN PROGRESS': getLabsByStatus('IN PROGRESS'),
    'LEARNING': getLabsByStatus('LEARNING'),
    'PLANNED': [...getLabsByStatus('PLANNED'), ...getLabsByStatus('NEXT')],
  };

  return (
    <Reveal kind="lead" className="labs-summary" delay={0.1} aria-label="Lab progress summary">
      <Stagger className="labs-summary-row" gap={0.07}>
        {Object.entries(groups).map(([status, labs]) => {
          const cfg = statusStyles[status] || statusStyles['PLANNED'];
          return (
            <StaggerItem key={status} className="summary-item">
              <span className="summary-count">{labs.length}</span>
              <span className={`summary-label summary-label--${cfg.tone}`}>
                {cfg.label}
              </span>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Lab details modal                                                  */
/* ------------------------------------------------------------------ */
function LabModal({ labId, onClose, theme }) {
  const lab = networkingLabs.find((item) => item.id === labId);
  const modalRef = useRef(null);
  const prevFocusRef = useRef(null);
  const reduced = useReduced();

  useEffect(() => {
    prevFocusRef.current = document.activeElement;
    modalRef.current?.focus();
    /* The page scrolls inside <main class="snap-container">, not <body>,
       so lock the real scroll root or the page scrolls behind the modal. */
    const scroller = document.getElementById('top');
    const prevOverflow = scroller ? scroller.style.overflow : '';
    document.body.style.overflow = 'hidden';
    if (scroller) scroller.style.overflow = 'hidden';

    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') trapFocus(event);
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      if (scroller) scroller.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      prevFocusRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const trapFocus = (event) => {
    const nodes = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (!nodes?.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!lab) return null;

  const Icon = labIcons[lab.icon] || Globe2;
  const cfg = statusStyles[lab.status] || statusStyles['PLANNED'];

  const body = (
    <div
      className="modal-content lab-modal"
      ref={modalRef}
      tabIndex={-1}
      onClick={(event) => event.stopPropagation()}
    >
      <StarBorder
        as={motion.button}
        type="button"
        className="modal-close"
        theme={theme}
        radius={999}
        hover="reveal"
        onClick={onClose}
        aria-label="Close lab details"
        whileHover={{ scale: 1.08, rotate: 90 }}
        whileTap={tapSoft}
        transition={{ duration: 0.2 }}
      >
        <X size={20} aria-hidden="true" />
      </StarBorder>

      <div className="modal-header">
        <div className="modal-meta">
          <span className="project-number">{lab.number}</span>
          <span className="micro-label">NETWORKING LAB NOTE</span>
        </div>
        <h2 id="lab-modal-title" className="modal-title">
          {lab.name}
        </h2>
        <div className={`modal-status badge badge--${cfg.tone}`}>
          <Icon size={12} aria-hidden="true" />
          <span>{cfg.label}</span>
        </div>
      </div>

      <div className="modal-body">
        <section className="modal-section">
          <h3>OVERVIEW</h3>
          <p>{lab.detail || lab.summary}</p>
        </section>

        <section className="modal-section">
          <h3>OBJECTIVE</h3>
          <p>{lab.objective}</p>
        </section>

        <section className="modal-section">
          <h3>TOOLS</h3>
          <div className="tech-grid">
            {lab.tools.map((tool) => (
              <span key={tool} className="tech-tag">
                {tool}
              </span>
            ))}
          </div>
        </section>

        <section className="modal-section">
          <h3>CONFIGURATION</h3>
          <ul className="feature-list">
            {lab.configuration.map((step) => (
              <li key={step}>
                <ChevronRight size={14} aria-hidden="true" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="modal-section">
          <h3>TESTING</h3>
          <ul className="feature-list">
            {lab.testing.map((test) => (
              <li key={test}>
                <ChevronRight size={14} aria-hidden="true" />
                <span>{test}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="modal-section">
          <h3>RESULT</h3>
          <p>{lab.result}</p>
        </section>

        <section className="modal-section">
          <h3>WHAT I LEARNED</h3>
          <p>{lab.learned}</p>
        </section>
      </div>
    </div>
  );

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lab-modal-title"
    >
      <AnimatePresence>
        {reduced ? (
          body
        ) : (
          <motion.div
            className="modal-shell"
            initial={{ opacity: 0, scale: 0.97, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {body}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export default function NetworkingLabs() {
  const theme = usePortfolioTheme();
  const [selectedLab, setSelectedLab] = useState(null);
  const carouselItems = useMemo(() => buildLabCarouselItems(networkingLabs), []);
  const fadeColor = theme === 'light' ? '#eef1f6' : '#07090c';

  return (
    <section id="labs" className="labs section-wrap" aria-labelledby="labs-heading">
      <SectionHeader className="section-header">
        <SectionTitle num="03" kicker="hands-on practice" id="labs-heading">
          Networking
          <br />
          <em>lab notes.</em>
        </SectionTitle>
        <Reveal kind="lead" as="p" delay={0.08} className="muted">
          Networking is more than a list on a resume. These are the topics I am
          actively translating into repeatable practice.
        </Reveal>
      </SectionHeader>

      <SummaryBar />

      <Reveal kind="card" className="section-carousel-block" delay={0.12}>
        <div className="section-carousel__head">
          <span className="section-carousel__eyebrow">Lab notes ring</span>
          <span className="section-carousel__hint">Drag to rotate · Click a card to open its notes</span>
        </div>
        <div className="section-carousel section-carousel--labs">
          <CircularCarousel
            items={carouselItems}
            preset="cylinder"
            intro="rise"
            autoplay={selectedLab ? 'off' : 'drift'}
            cardWidth={540}
            aspectRatio={1.5}
            gap={24}
            speed={8}
            fadeColor={fadeColor}
            depthFade={theme === 'light' ? 0.3 : 0.55}
            cornerRadius={16}
            captions
            onItemClick={(item) => setSelectedLab(item.id)}
            className="section-carousel__widget"
          />
        </div>
      </Reveal>

      <Reveal kind="lead" as="p" className="labs-disclaimer" delay={0.05}>
        <strong>Note:</strong> Labs marked <b>PLANNED</b> or <b>LEARNING</b> are in
        progress or scheduled. Only <b>COMPLETED</b> labs have been fully executed
        and verified.
      </Reveal>

      <AnimatePresence>
        {selectedLab && (
          <LabModal
            labId={selectedLab}
            theme={theme}
            onClose={() => setSelectedLab(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}