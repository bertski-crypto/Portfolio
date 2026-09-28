import { useEffect, useRef } from 'react';
import { X, ExternalLink, ChevronRight, Check, Clock, AlertTriangle } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { projects } from '../data/projects';

const statusConfig = {
  'COMPLETED': { icon: Check, color: 'var(--accent)', label: 'COMPLETED' },
  'IN DEVELOPMENT': { icon: Clock, color: 'var(--blue)', label: 'IN DEVELOPMENT' },
  'PLANNED': { icon: AlertTriangle, color: 'var(--amber)', label: 'PLANNED' },
};

export default function ProjectModal({ projectId, onClose }) {
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

  const { Icon: StatusIcon, color: statusColor } = statusConfig[project.status] || statusConfig['IN DEVELOPMENT'];

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
          <h2 id="modal-title">{project.title}</h2>
          <div className="modal-status" style={{ '--status-color': statusColor }}>
            <StatusIcon size={14} aria-hidden="true" />
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
            className="button button-primary"
          >
            <FaGithub size={17} aria-hidden="true" />
            VIEW ON GITHUB
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-quiet"
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