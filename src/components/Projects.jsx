import { useState, useMemo } from 'react';
import { Filter, X, Search } from 'lucide-react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { projects, getFeaturedProjects, getProjectsByCategory } from '../data/projects';

const categories = ['ALL', 'IT SUPPORT', 'NETWORKING', 'WEB DEVELOPMENT', 'SYSTEM DEVELOPMENT', 'ACADEMIC', 'TOOLS', 'DOCKER'];

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
    <section id="projects" className="section-wrap projects-section" aria-labelledby="projects-heading">
      <div className="section-heading">
        <div>
          <div className="section-kicker">
            <span>02</span>
            <span>selected work</span>
          </div>
          <h2 id="projects-heading">Projects with a<br /><em>purpose.</em></h2>
        </div>
        <p>Technical work is where concepts become habits: clear requirements, useful interfaces, and reliable outcomes.</p>
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
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="filter-controls">
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

          <div id="filter-panel" className={`filter-panel ${showFilters ? 'open' : ''}`} role="listbox" aria-label="Project categories">
            {categories
              .filter(cat => hasProjectsForCategory(cat))
              .map((cat) => (
                <button
                  key={cat}
                  role="option"
                  aria-selected={activeFilter === cat}
                  className={`filter-option ${activeFilter === cat ? 'active' : ''}`}
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
          <div className="no-results">
            <p>No projects match your current filters.</p>
            <button className="button button-quiet" onClick={() => { setActiveFilter('ALL'); setSearchQuery(''); }}>
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