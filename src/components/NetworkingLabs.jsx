import { Globe2, Network, Server, Share2, GitBranch, Terminal, Wrench, ChevronRight } from 'lucide-react';
import { networkingLabs, getLabsByStatus } from '../data/labs';

const labIcons = {
  Globe2,
  Network,
  Server,
  Share2,
  GitBranch,
  Terminal,
  Wrench,
};

const statusStyles = {
  'COMPLETED': { color: 'var(--accent)', label: 'COMPLETED' },
  'IN PROGRESS': { color: 'var(--blue)', label: 'IN PROGRESS' },
  'LEARNING': { color: 'var(--amber)', label: 'LEARNING' },
  'PLANNED': { color: 'var(--muted)', label: 'PLANNED' },
  'NEXT': { color: 'var(--muted)', label: 'NEXT' },
};

export default function NetworkingLabs() {
  const labsByStatus = {
    'COMPLETED': getLabsByStatus('COMPLETED'),
    'IN PROGRESS': getLabsByStatus('IN PROGRESS'),
    'LEARNING': getLabsByStatus('LEARNING'),
    'PLANNED': [...getLabsByStatus('PLANNED'), ...getLabsByStatus('NEXT')],
  };

  return (
    <section id="labs" className="section-wrap labs-section" aria-labelledby="labs-heading">
      <div className="section-heading compact">
        <div>
          <div className="section-kicker">
            <span>03</span>
            <span>hands-on practice</span>
          </div>
          <h2 id="labs-heading">Networking<br /><em>lab notes.</em></h2>
        </div>
        <p>Networking is more than a list on a resume. These are the topics I am actively translating into repeatable practice.</p>
      </div>

      <div className="labs-status-summary" aria-label="Lab progress summary">
        {Object.entries(labsByStatus).map(([status, labs]) => (
          <div key={status} className="status-summary-item">
            <span className="status-count">{labs.length}</span>
            <span className="status-label" style={{ color: statusStyles[status]?.color || 'var(--muted)' }}>
              {statusStyles[status]?.label || status}
            </span>
          </div>
        ))}
      </div>

      <div className="labs-grid" role="list" aria-label="Networking labs">
        {networkingLabs.map((lab) => {
          const Icon = labIcons[lab.icon] || Globe2;
          const statusConfig = statusStyles[lab.status] || statusStyles['PLANNED'];

          return (
            <article key={lab.id} className="lab-card" role="listitem">
              <div className="lab-icon" aria-hidden="true">
                <Icon size={20} />
              </div>
              <div className="lab-content">
                <div className="lab-title">
                  <h3>{lab.name}</h3>
                  <span className="lab-status" style={{ color: statusConfig.color }}>
                    {statusConfig.label}
                  </span>
                </div>
                <p>{lab.detail}</p>

                <details className="lab-details">
                  <summary className="lab-link">
                    <ChevronRight size={14} aria-hidden="true" />
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
                        {lab.tools.map((tool) => <li key={tool}>{tool}</li>)}
                      </ul>
                    </div>
                    <div className="lab-detail-section">
                      <h4>CONFIGURATION</h4>
                      <ul>
                        {lab.configuration.map((step) => <li key={step}>{step}</li>)}
                      </ul>
                    </div>
                    <div className="lab-detail-section">
                      <h4>TESTING</h4>
                      <ul>
                        {lab.testing.map((test) => <li key={test}>{test}</li>)}
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
              </div>
            </article>
          );
        })}
      </div>

      <p className="labs-disclaimer">
        <strong>Note:</strong> Labs marked <span className="status-planned">PLANNED</span> or <span className="status-learning">LEARNING</span>
        are in progress or scheduled. Only <span className="status-completed">COMPLETED</span> labs have been fully executed and verified.
      </p>
    </section>
  );
}