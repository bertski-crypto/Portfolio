import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Filter,
  X,
  Search,
  ChevronRight,
  Check,
  Clock,
  AlertTriangle,
  ExternalLink,
  Shield,
  Server,
  Wrench,
  Code2,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

import { projects, getFeaturedProjects } from '../data/projects';
import {
  Reveal,
  SectionHeader,
  SectionTitle,
  Stagger,
  StaggerItem,
  hoverCard,
  hoverIconShift,
  hoverPrimary,
  hoverSecondary,
  hoverSoft,
  hoverZoom,
  tapSoft,
  useReduced,
} from '../utils/motion-primitives';

import '../styles/components/projects.css';
import '../styles/components/bento.css';

const categories = [
  'ALL',
  'IT SUPPORT',
  'NETWORKING',
  'WEB DEVELOPMENT',
  'SYSTEM DEVELOPMENT',
  'ACADEMIC',
  'TOOLS',
  'DOCKER',
];

const projectIcons = {
  'IT SUPPORT / WEB APPLICATION': Wrench,
  'CAPSTONE / INFORMATION SYSTEM': Shield,
  'WEB DEVELOPMENT / CONTAINERIZATION': Code2,
  'SYSTEM DEVELOPMENT / WEB APPLICATION': Server,
};

const statusConfig = {
  'COMPLETED': { icon: Check, tone: 'ok', label: 'COMPLETED' },
  'IN DEVELOPMENT': { icon: Clock, tone: 'info', label: 'IN DEVELOPMENT' },
  'PLANNED': { icon: AlertTriangle, tone: 'warn', label: 'PLANNED' },
};

/* ================================================================== */
/*  Card                                                               */
/* ================================================================== */
function ProjectCard({ project, onClick }) {
  const reduced = useReduced();
  const Icon = projectIcons[project.category] || Code2;
  const status = statusConfig[project.status] || statusConfig['IN DEVELOPMENT'];

  const card = (
    <article
      className="project-card glass-card"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${project.title} project details`}
    >
      <div className="project-card-header">
        <div>
          <span className="project-number">{project.number}</span>
          <span className="project-category">{project.category}</span>
        </div>
        <motion.div
          className="project-icon"
          aria-hidden="true"
          whileHover={reduced ? undefined : { scale: 1.08 }}
          transition={{ duration: 0.18 }}
        >
          <Icon size={28} />
        </motion.div>
      </div>

      <h3>{project.title}</h3>
      <p>{project.shortDescription}</p>

      <div className="project-tech" role="list" aria-label="Technologies used">
        {project.technologies.slice(0, 6).map((tag) => (
          <span key={tag} className="tag" role="listitem">
            {tag}
          </span>
        ))}
        {project.technologies.length > 6 && (
          <span className="tag">+{project.technologies.length - 6} more</span>
        )}
      </div>

      <div className="project-footer">
        <span className={`badge badge--${status.tone}`}>{status.label}</span>

        <div className="project-links">
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
            aria-label={`View ${project.title} on GitHub`}
            onClick={(e) => e.stopPropagation()}
            whileHover={hoverSoft}
            whileTap={tapSoft}
          >
            <FaGithub size={15} aria-hidden="true" />
          </motion.a>

          {project.demo && (
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
              aria-label={`View ${project.title} live demo`}
              onClick={(e) => e.stopPropagation()}
              whileHover={hoverSoft}
              whileTap={tapSoft}
            >
              <ExternalLink size={15} aria-hidden="true" />
            </motion.a>
          )}
        </div>
      </div>
    </article>
  );

  if (reduced) return card;

  return (
    <motion.div
      className="project-card-wrap"
      whileHover={hoverCard}
      whileTap={tapSoft}
    >
      {card}
    </motion.div>
  );
}

/* ================================================================== */
/*  Modal                                                              */
/* ================================================================== */
function ProjectModal({ projectId, onClose }) {
  const project = projects.find((p) => p.id === projectId);
  const modalRef = useRef(null);
  const prevFocusRef = useRef(null);
  const reduced = useReduced();

  useEffect(() => {
    prevFocusRef.current = document.activeElement;
    modalRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') trapFocus(e);
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
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
      <motion.button
        className="modal-close"
        onClick={onClose}
        aria-label="Close project details"
        whileHover={{ scale: 1.08, rotate: 90 }}
        whileTap={tapSoft}
        transition={{ duration: 0.2 }}
      >
        <X size={20} aria-hidden="true" />
      </motion.button>

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
        <motion.a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          whileHover={hoverPrimary}
          whileTap={tapSoft}
        >
          <FaGithub size={17} aria-hidden="true" />
          VIEW ON GITHUB
        </motion.a>

        {project.demo && (
          <motion.a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            whileHover={hoverSecondary}
            whileTap={tapSoft}
          >
            <ExternalLink size={17} aria-hidden="true" />
            LIVE DEMO
          </motion.a>
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
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const reduced = useReduced();

  const featured = getFeaturedProjects();

  const filtered = useMemo(() => {
    let result = featured;

    if (activeFilter !== 'ALL') {
      result = result.filter((p) => p.categoryTags.includes(activeFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q),
      );
    }

    return result;
  }, [activeFilter, searchQuery, featured]);

  const hasCategory = (cat) =>
    cat === 'ALL' ? featured.length > 0 : featured.some((p) => p.categoryTags.includes(cat));

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

      {/* toolbar */}
      <Reveal kind="lead" className="projects-toolbar" delay={0.12}>
        <div className="search-box" role="search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search projects by name, description, or technology"
          />
          {searchQuery && (
            <motion.button
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={tapSoft}
              transition={{ duration: 0.2 }}
            >
              <X size={14} aria-hidden="true" />
            </motion.button>
          )}
        </div>

        <div className="filter-controls">
          <motion.button
            className={`filter-toggle ${showFilters ? 'open' : ''}`}
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
            aria-label="Filter projects"
            whileHover={hoverSoft}
            whileTap={tapSoft}
          >
            <Filter size={16} aria-hidden="true" />
            <span>{activeFilter}</span>
          </motion.button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                id="filter-panel"
                className="filter-panel is-open"
                role="listbox"
                aria-label="Project categories"
                initial={reduced ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {categories.filter(hasCategory).map((cat) => (
                  <motion.button
                    key={cat}
                    role="option"
                    aria-selected={activeFilter === cat}
                    className={`filter-option ${activeFilter === cat ? 'is-active' : ''}`}
                    onClick={() => {
                      setActiveFilter(cat);
                      setShowFilters(false);
                    }}
                    whileHover={hoverSoft}
                    whileTap={tapSoft}
                  >
                    {cat}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>

      {/* grid */}
      {filtered.length === 0 ? (
        <Reveal kind="lead" className="no-results">
          <p>No projects match your current filters.</p>
          <motion.button
            className="btn btn-ghost"
            onClick={() => {
              setActiveFilter('ALL');
              setSearchQuery('');
            }}
            whileHover={hoverSecondary}
            whileTap={tapSoft}
          >
            Clear filters
          </motion.button>
        </Reveal>
      ) : (
        <Stagger className="projects-grid" gap={0.1} key={`${activeFilter}-${searchQuery}`}>
          {filtered.map((project, i) => (
            <StaggerItem
              key={project.id}
              className="project-card-slot"
              parallax
              parallaxIndex={i}
            >
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project.id)}
              />
            </StaggerItem>
          ))}
        </Stagger>
      )}

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            projectId={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}