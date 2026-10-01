import { Globe2, Network, Server, Share2, GitBranch, Terminal, Wrench, ChevronRight, Check, AlertTriangle, Clock } from 'lucide-react';
import { networkingLabs, getLabsByStatus } from '../data/labs';
import '../styles/components/labs.css';
import '../styles/components/bento.css';

const labIcons = { Globe2, Network, Server, Share2, GitBranch, Terminal, Wrench };

const statusStyles = {
  'COMPLETED': { color: 'var(--ok)', label: 'COMPLETED', class: 'lab-status--completed' },
  'IN PROGRESS': { color: 'var(--accent)', label: 'IN PROGRESS', class: 'lab-status--in-progress' },
  'LEARNING': { color: 'var(--warn)', label: 'LEARNING', class: 'lab-status--learning' },
  'PLANNED': { color: 'var(--muted)', label: 'PLANNED', class: 'lab-status--planned' },
  'NEXT': { color: 'var(--muted)', label: 'NEXT', class: 'lab-status--planned' },
};

export default function NetworkingLabs() {
  const labsByStatus = {
    'COMPLETED': getLabsByStatus('COMPLETED'),
    'IN PROGRESS': getLabsByStatus('IN PROGRESS'),
    'LEARNING': getLabsByStatus('LEARNING'),
    'PLANNED': [...getLabsByStatus('PLANNED'), ...getLabsByStatus('NEXT')],
  };

  return (
    <section id="labs" className="labs section-wrap" aria-labelledby="labs-heading">
      <div className="section-header">
        <div className="kicker">
          <span>03</span>
          <span>hands-on practice</span>
        </div>
        <h2 id="labs-heading" className="heading-lg">Networking<br /><em>lab notes.</em></h2>
        <p className="muted">Networking is more than a list on a resume. These are the topics I am actively translating into repeatable practice.</p>
      </div>

      <div className="labs-summary" aria-label="Lab progress summary">
        {Object.entries(labsByStatus).map(([status, labs]) => {
          const config = statusStyles[status] || statusStyles['PLANNED'];
          return (
            <div key={status} className="summary-item">
              <span className="summary-count" style={{ color: config.color }}>{labs.length}</span>
              <span className="summary-label" style={{ color: config.color }}>{config.label}</span>
            </div>
          );
        })}
      </div>

      <div className="labs-grid" role="list" aria-label="Networking labs">
        {networkingLabs.map((lab) => {
          const Icon = labIcons[lab.icon] || Globe2;
          const statusConfig = statusStyles[lab.status] || statusStyles['PLANNED'];

          return (
            <article key={lab.id} className="lab-card glass-card" role="listitem">
              <div className="lab-icon" aria-hidden="true">
                <Icon size={22} />
              </div>
              <div className="lab-header">
                <h3>{lab.number} {lab.name}</h3>
                <span className={`lab-status ${statusConfig.class}`}>{statusConfig.label}</span>
              </div>
              <p className="lab-summary">{lab.summary || lab.detail}</p>
              <details className="lab-details">
                <summary className="lab-link">
                  <ChevronRight size={12} aria-hidden="true" />
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
            </article>
          );
        })}
      </div>

      <p className="labs-disclaimer">
        <strong>Note:</strong> Labs marked <span className="lab-status lab-status--planned">PLANNED</span> or <span className="lab-status lab-status--learning">LEARNING</span>
        are in progress or scheduled. Only <span className="lab-status lab-status--completed">COMPLETED</span> labs have been fully executed and verified.
      </p>
    </section>
  );
}