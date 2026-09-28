import { ChevronRight, ExternalLink, Code2, ShieldCheck, Wrench, Server } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const projectIcons = {
  'IT SUPPORT / WEB APPLICATION': Wrench,
  'CAPSTONE / INFORMATION SYSTEM': ShieldCheck,
  'WEB DEVELOPMENT / CONTAINERIZATION': Code2,
  'SYSTEM DEVELOPMENT / WEB APPLICATION': Server,
};

const accentColors = {
  lime: 'lime',
  blue: 'blue',
  amber: 'amber',
  green: 'green',
};

export default function ProjectCard({ project, onClick }) {
  const Icon = projectIcons[project.category] || Code2;
  const accentClass = accentColors[project.accent] || 'lime';

  return (
    <article
      className={`project-card ${accentClass}`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }}}
      tabIndex={0}
      role="button"
      aria-label={`View ${project.title} project details`}
    >
      <div className="project-top">
        <span className="project-number">{project.number}</span>
        <span className="micro-label">{project.category}</span>
        <ChevronRight size={18} aria-hidden="true" />
      </div>
      <div className="project-visual">
        <div className="grid-pattern" aria-hidden="true" />
        <div className="project-glyph" aria-hidden="true">
          <Icon size={58} />
        </div>
      </div>
      <h3>{project.title}</h3>
      <p>{project.shortDescription}</p>
      <div className="tag-row" role="list" aria-label="Technologies used">
        {project.technologies.slice(0, 6).map((tag) => (
          <span key={tag} role="listitem">{tag}</span>
        ))}
        {project.technologies.length > 6 && (
          <span>+{project.technologies.length - 6} more</span>
        )}
      </div>
      <div className="project-footer">
        <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
          {project.status}
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
            <FaGithub size={14} aria-hidden="true" />
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
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}