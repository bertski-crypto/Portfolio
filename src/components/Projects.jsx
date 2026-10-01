import { useState, useMemo, useEffect, useRef } from 'react';
import { Filter, X, Search, ChevronRight, Check, Clock, AlertTriangle, ExternalLink, Download, FileCode, Shield, Server, Wrench, Code2, GitBranch, Terminal, Network, Globe2, Share2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { projects, getFeaturedProjects, getProjectsByCategory } from '../data/projects';
import '../styles/components/projects.css';
import '../styles/components/bento.css';

const categories = ['ALL', 'IT SUPPORT', 'NETWORKING', 'WEB DEVELOPMENT', 'SYSTEM DEVELOPMENT', 'ACADEMIC', 'TOOLS', 'DOCKER'];

const projectIcons = {
  'IT SUPPORT / WEB APPLICATION': Wrench,
  'CAPSTONE / INFORMATION SYSTEM': Shield,
  'WEB DEVELOPMENT / CONTAINERIZATION': Code2,
  'SYSTEM DEVELOPMENT / WEB APPLICATION': Server,
};

const statusConfig = {
  'COMPLETED': { icon: Check, color: 'var(--ok)', label: 'COMPLETED' },
  'IN DEVELOPMENT': { icon: Clock, color: 'var(--accent)', label: 'IN DEVELOPMENT' },
  'PLANNED': { icon: AlertTriangle, color: 'var(--warn)', label: 'PLANNED' },
};

function ProjectCard({ project, onClick }) {
  const Icon = projectIcons[project.category] || Code2;
  const status = statusConfig[project.status] || statusConfig['IN DEVELOPMENT'];

  return (
    <article
      className="project-card glass-card"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }}}
      tabIndex={0}
      role="button"
      aria-label={`View ${project.title} project details`}
    >
      <div className="project-card-header">
        <div>
          <span className="project-number">{project.number}</span>
          <span className="project-category">{project.category}</span>
        </div>
        <div className="project-icon" aria-hidden="true">
          <Icon size={28} />
        </div>
      </div>
      <h3>{project.title}</h3>
      <p>{project.shortDescription}</p>
      <div className="project-tech" role="list" aria-label="Technologies used">
        {project.technologies.slice(0, 6).map((tag) => (
          <span key={tag} className="tag" role="listitem">{tag}</span>
        ))}
        {project.technologies.length > 6 && (
          <span className="tag">+{project.technologies.length - 6} more</span>
        )}
      </div>
      <div className="project-footer">
        <span className={`badge badge--${project.status === 'COMPLETED' ? 'ok' : project.status === 'IN DEVELOPMENT' ? 'info' : 'warn'}`}>
          {status.label}
        </span>
        <div className="project-links">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
            aria-label={`View ${project.title} on GitHub`}
            onClick={(e) => e.stopPropagation()}
          >
            <FaGithub size={15} aria-hidden="true" />
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
              aria-label={`View ${project.title} live demo`}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ProjectModal({ projectId, onClose }) {
  const project = projects.find(p => p.id === projectId);
  const modalRef = useRef(null);
  const prevFocusRef = useRef(null);

  useEffect(() => {
    prevFocusRef.current = document.activeElement;
    modalRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') trapFocus(e);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      prevFocusRef.current?.focus();
    };
  }, [onClose]);

  const trapFocus = (e) => {
    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  };

  if (!project) return null;

  const { icon: StatusIcon, color: statusColor, label: statusLabel } = statusConfig[project.status] || statusConfig['IN DEVELOPMENT'];

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-content"
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close project details">
          <X size={20} aria-hidden="true" />
        </button>

        <div className="modal-header">
          <div className="modal-meta">
            <span className="project-number">{project.number}</span>
            <span className="micro-label">{project.category}</span>
          </div>
          <h2 id="modal-title" className="modal-title">{project.title}</h2>
          <div className="modal-status" style={{ color: statusColor }}>
            <StatusIcon size={12} aria-hidden="true" />
            <span>{project.statusLabel || statusLabel}</span>
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
                <span key={tech} className="tech-tag">{tech}</span>
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
                <span key={tool} className="tech-tag">{tool}</span>
              ))}
            </div>
          </section>

          <section className="modal-section">
            <h3>WHAT I LEARNED</h3>
            <p>{project.learned || 'Project learnings documented in repository.'}</p>
          </section>
        </div>

        <div className="modal-footer">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <FaGithub size={17} aria-hidden="true" />
            VIEW ON GITHUB
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <ExternalLink size={17} aria-hidden="true" />
              LIVE DEMO
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const featuredProjects = getFeaturedProjects();

  const filteredProjects = useMemo(() => {
    let result = featuredProjects;

    if (activeFilter !== 'ALL') {
      result = result.filter(p => p.categoryTags.includes(activeFilter));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.technologies.some(t => t.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeFilter, searchQuery]);

  const handleFilterClick = (category) => {
    setActiveFilter(category);
    setShowFilters(false);
  };

  const openProject = (projectId) => {
    setSelectedProject(projectId);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const hasProjectsForCategory = (cat) => {
    if (cat === 'ALL') return featuredProjects.length > 0;
    return featuredProjects.some(p => p.categoryTags.includes(cat));
  };

  return (
    <section id="projects" className="projects section-wrap" aria-labelledby="projects-heading">
      <div className="section-header">
        <div className="kicker">
          <span>02</span>
          <span>selected work</span>
        </div>
        <h2 id="projects-heading" className="heading-lg">Projects with a<br /><em>purpose.</em></h2>
        <p className="muted">Technical work is where concepts become habits: clear requirements, useful interfaces, and reliable outcomes.</p>
      </div>

      <div className="projects-toolbar">
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
            <button
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)' }}
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="filter-controls" style={{ position: 'relative' }}>
          <button
            className={`filter-toggle ${showFilters ? 'open' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
            aria-label="Filter projects"
          >
            <Filter size={16} aria-hidden="true" />
            <span>{activeFilter}</span>
          </button>

          <div id="filter-panel" className={`filter-panel ${showFilters ? 'is-open' : ''}`} role="listbox" aria-label="Project categories">
            {categories
              .filter(cat => hasProjectsForCategory(cat))
              .map((cat) => (
                <button
                  key={cat}
                  role="option"
                  aria-selected={activeFilter === cat}
                  className={`filter-option ${activeFilter === cat ? 'is-active' : ''}`}
                  onClick={() => handleFilterClick(cat)}
                >
                  {cat}
                </button>
              ))}
          </div>
        </div>
      </div>

      <div className="projects-grid" role="list" aria-label="Featured projects">
        {filteredProjects.length === 0 ? (
          <div className="no-results" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--sp-7)', color: 'var(--muted)' }}>
            <p>No projects match your current filters.</p>
            <button className="btn btn-ghost" onClick={() => { setActiveFilter('ALL'); setSearchQuery(''); }} style={{ marginTop: 'var(--sp-3)' }}>
              Clear filters
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => openProject(project.id)}
            />
          ))
        )}
      </div>

      {selectedProject && (
        <ProjectModal projectId={selectedProject} onClose={closeModal} />
      )}
    </section>
  );
}