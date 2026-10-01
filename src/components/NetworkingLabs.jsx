import { motion } from 'framer-motion';
import {
  Globe2,
  Network,
  Server,
  Share2,
  GitBranch,
  Terminal,
  Wrench,
  ChevronRight,
} from 'lucide-react';

import { networkingLabs, getLabsByStatus } from '../data/labs';
import {
  Reveal,
  SectionHeader,
  Stagger,
  StaggerItem,
  hoverCardSoft,
  hoverIconPop,
  tapSoft,
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
/*  Lab card                                                           */
/* ------------------------------------------------------------------ */
function LabCard({ lab }) {
  const Icon = labIcons[lab.icon] || Globe2;
  const cfg = statusStyles[lab.status] || statusStyles['PLANNED'];

  return (
    <article className="lab-card glass-card">
      <motion.div
        className="lab-icon"
        aria-hidden="true"
        whileHover={hoverIconPop(1.08, -2)}
      >
        <Icon size={22} />
      </motion.div>

      <div className="lab-header">
        <h3>
          {lab.number} {lab.name}
        </h3>
        <span className={`lab-status lab-status--${cfg.tone}`}>{cfg.label}</span>
      </div>

      <p className="lab-summary">{lab.summary || lab.detail}</p>

      <details className="lab-details">
        <summary className="lab-link">
          <motion.span variants={{ rotate: 0 }} whileHover={{ rotate: 90 }}>
            <ChevronRight size={12} aria-hidden="true" />
          </motion.span>
          View lab details
        </summary>

        <div className="lab-detail-content">
          <div className="lab-detail-section">
            <h4>OBJECTIVE</h4>
            <p>{lab.objective}</p>
          </div>
          <div className="lab-detail-section">
            <h4>TOOLS</h4>
            <ul>
              {lab.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="lab-detail-section">
            <h4>CONFIGURATION</h4>
            <ul>
              {lab.configuration.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="lab-detail-section">
            <h4>TESTING</h4>
            <ul>
              {lab.testing.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="lab-detail-section">
            <h4>RESULT</h4>
            <p>{lab.result}</p>
          </div>
          <div className="lab-detail-section">
            <h4>WHAT I LEARNED</h4>
            <p>{lab.learned}</p>
          </div>
        </div>
      </details>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export default function NetworkingLabs() {
  return (
    <section id="labs" className="labs section-wrap" aria-labelledby="labs-heading">
      <SectionHeader className="section-header">
        <Reveal kind="heading" as="div">
          <div className="kicker">
            <span>03</span>
            <span>hands-on practice</span>
          </div>
          <h2 id="labs-heading" className="heading-lg">
            Networking
            <br />
            <em>lab notes.</em>
          </h2>
        </Reveal>
        <Reveal kind="lead" as="p" delay={0.08} className="muted">
          Networking is more than a list on a resume. These are the topics I am
          actively translating into repeatable practice.
        </Reveal>
      </SectionHeader>

      <SummaryBar />

      <Stagger className="labs-grid" gap={0.09}>
        {networkingLabs.map((lab) => (
          <StaggerItem key={lab.id} className="lab-card-slot">
            <motion.div
              className="lab-card-hover"
              whileHover={hoverCardSoft}
              whileTap={tapSoft}
            >
              <LabCard lab={lab} />
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal kind="lead" as="p" className="labs-disclaimer" delay={0.05}>
        <strong>Note:</strong> Labs marked <b>PLANNED</b> or <b>LEARNING</b> are in
        progress or scheduled. Only <b>COMPLETED</b> labs have been fully executed
        and verified.
      </Reveal>
    </section>
  );
}