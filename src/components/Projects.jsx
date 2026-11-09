import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect, useRef } from 'react';
import {
  X,
  ChevronRight,
  Check,
  Clock,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

import { projects, getFeaturedProjects } from '../data/projects';
import { buildProjectCarouselItems } from '../data/carouselCovers';
import StarBorder from './StarBorder';
import CircularCarousel from './CircularCarousel';
import usePortfolioTheme from '../utils/usePortfolioTheme';
import {
  Reveal,
  SectionHeader,
  SectionTitle,
  hoverPrimary,
  hoverSecondary,
  tapSoft,
  useReduced,
} from '../utils/motion-primitives';

import '../styles/components/projects.css';
import '../styles/components/bento.css';

const statusConfig = {
  'COMPLETED': { icon: Check, tone: 'ok', label: 'COMPLETED' },
  'IN DEVELOPMENT': { icon: Clock, tone: 'info', label: 'IN DEVELOPMENT' },
  'PLANNED': { icon: AlertTriangle, tone: 'warn', label: 'PLANNED' },
};

/* ================================================================== */
/*  Modal                                                              */
/* ================================================================== */
function ProjectModal({ projectId, onClose, theme }) {
  const project = projects.find((p) => p.id === projectId);
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

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') trapFocus(e);
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

  const trapFocus = (e) => {
    const nodes = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (!nodes?.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!project) return null;

  const StatusIcon = (statusConfig[project.status] || statusConfig['IN DEVELOPMENT']).icon;
  const statusTone = (statusConfig[project.status] || statusConfig['IN DEVELOPMENT']).tone;

  const body = (
    <div className="modal-content" ref={modalRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
      <StarBorder
        as={motion.button}
        type="button"
        className="modal-close"
        theme={theme}
        radius={999}
        hover="reveal"
        onClick={onClose}
        aria-label="Close project details"
        whileHover={{ scale: 1.08, rotate: 90 }}
        whileTap={tapSoft}
        transition={{ duration: 0.2 }}
      >
        <X size={20} aria-hidden="true" />
      </StarBorder>

      <div className="modal-header">
        <div className="modal-meta">
          <span className="project-number">{project.number}</span>
          <span className="micro-label">{project.category}</span>
        </div>
        <h2 id="modal-title" className="modal-title">
          {project.title}
        </h2>
        <div className={`modal-status badge badge--${statusTone}`}>
          <StatusIcon size={12} aria-hidden="true" />
          <span>{project.statusLabel || project.status}</span>
        </div>
      </div>

      <div className="modal-body">
        <section className="modal-section">
          <h3>OVERVIEW</h3>
          <p>{project.longDescription}</p>
        </section>
        <section className="modal-section">
          <h3>PROBLEM</h3>
          <p>{project.problem}</p>
        </section>
        <section className="modal-section">
          <h3>SOLUTION</h3>
          <p>{project.solution}</p>
        </section>

        <section className="modal-section">
          <h3>KEY FEATURES</h3>
          <ul className="feature-list">
            {project.features.map((feature, i) => (
              <li key={i}>
                <ChevronRight size={14} aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="modal-section">
          <h3>TECHNOLOGIES</h3>
          <div className="tech-grid">
            {project.technologies.map((tech) => (
              <span key={tech} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>
        </section>

        <section className="modal-section">
          <h3>DEVELOPMENT APPROACH</h3>
          <p>{project.developmentApproach}</p>
        </section>

        <section className="modal-section">
          <h3>TOOLS USED</h3>
          <div className="tech-grid">
            {project.toolsUsed.map((tool) => (
              <span key={tool} className="tech-tag">
                {tool}
              </span>
            ))}
          </div>
        </section>

        <section className="modal-section">
          <h3>WHAT I LEARNED</h3>
          <p>{project.learned || 'Project learnings documented in repository.'}</p>
        </section>
      </div>

      <div className="modal-footer">
        <StarBorder
          as={motion.a}
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          theme={theme}
          color="#ffffff"
          radius={16}
          whileHover={hoverPrimary}
          whileTap={tapSoft}
        >
          <FaGithub size={17} aria-hidden="true" />
          VIEW ON GITHUB
        </StarBorder>

        {project.demo && (
          <StarBorder
            as={motion.a}
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            theme={theme}
            radius={16}
            whileHover={hoverSecondary}
            whileTap={tapSoft}
          >
            <ExternalLink size={17} aria-hidden="true" />
            LIVE DEMO
          </StarBorder>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
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

/* ================================================================== */
/*  Section                                                            */
/* ================================================================== */
export default function Projects() {
  const theme = usePortfolioTheme();
  const [selectedProject, setSelectedProject] = useState(null);

  const featured = useMemo(() => getFeaturedProjects(), []);
  const carouselItems = useMemo(() => buildProjectCarouselItems(featured), [featured]);
  const fadeColor = theme === 'light' ? '#eef1f6' : '#07090c';

  return (
    <section id="projects" className="projects section-wrap" aria-labelledby="projects-heading">
      <SectionHeader className="section-header">
        <SectionTitle num="02" kicker="selected work" id="projects-heading">
          Projects with a
          <br />
          <em>purpose.</em>
        </SectionTitle>
        <Reveal kind="lead" as="p" delay={0.08} className="muted">
          Technical work is where concepts become habits: clear requirements,
          useful interfaces, and reliable outcomes.
        </Reveal>
      </SectionHeader>

      <Reveal kind="card" className="section-carousel-block" delay={0.1}>
        <div className="section-carousel__head">
          <span className="section-carousel__eyebrow">Featured work</span>
          <span className="section-carousel__hint">Drag to rotate · Click a card to open the case study</span>
        </div>
        <div className="section-carousel section-carousel--projects">
          <CircularCarousel
            items={carouselItems}
            preset="cylinder"
            intro="rise"
            autoplay={selectedProject ? 'off' : 'drift'}
            cardWidth={560}
            aspectRatio={1.5}
            gap={26}
            speed={9}
            fadeColor={fadeColor}
            depthFade={theme === 'light' ? 0.3 : 0.55}
            cornerRadius={16}
            captions
            onItemClick={(item) => setSelectedProject(item.id)}
            className="section-carousel__widget"
          />
        </div>
      </Reveal>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            projectId={selectedProject}
            theme={theme}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}