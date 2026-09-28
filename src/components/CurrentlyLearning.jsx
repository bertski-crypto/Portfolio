import { BookOpen, Target, TrendingUp, Clock, Zap, Check } from 'lucide-react';
import { currentlyLearning } from '../data/experience';

const statusIcons = {
  'COMPLETED': Check,
  'IN PROGRESS': TrendingUp,
  'LEARNING': BookOpen,
  'EXPLORING': Target,
  'PLANNED': Clock,
};

const statusColors = {
  'COMPLETED': 'var(--accent)',
  'IN PROGRESS': 'var(--blue)',
  'LEARNING': 'var(--amber)',
  'EXPLORING': 'var(--blue)',
  'PLANNED': 'var(--muted)',
};

export default function CurrentlyLearning() {
  return (
    <section id="learning" className="section-wrap learning-section" aria-labelledby="learning-heading">
      <div className="section-kicker">
        <span>07</span>
        <span>currently learning</span>
      </div>

      <div className="learning-header">
        <h2 id="learning-heading">Always<br /><em>learning.</em></h2>
        <p className="muted-copy">
          These are the topics I'm actively exploring, developing, or planning to study next.
          Status labels reflect current progress honestly.
        </p>
      </div>

      <div className="learning-grid" role="list" aria-label="Learning topics">
        {currentlyLearning.map((item) => {
          const Icon = statusIcons[item.status] || BookOpen;
          const color = statusColors[item.status] || 'var(--muted)';

          return (
            <article key={item.topic} className="learning-card" role="listitem" style={{ '--status-color': color }}>
              <div className="learning-icon" style={{ color }}>
                <Icon size={20} aria-hidden="true" />
              </div>
              <h3>{item.topic}</h3>
              <span className="learning-status" style={{ color }}>{item.status}</span>

              {item.resources && item.resources.length > 0 && (
                <div className="learning-resources">
                  <h4>Resources</h4>
                  <ul>
                    {item.resources.map((resource, i) => (
                      <li key={i}>{resource}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="learning-legend" aria-label="Status legend">
        {Object.entries(statusIcons).map(([status, Icon]) => (
          <span key={status} className="legend-item">
            <Icon size={12} aria-hidden="true" style={{ color: statusColors[status] }} />
            {status}
          </span>
        ))}
      </div>
    </section>
  );
}