import { BookOpen, Target, TrendingUp, Clock, Check } from 'lucide-react';
import { currentlyLearning } from '../data/experience';
import '../styles/components/bento.css';

const statusIcons = {
  'COMPLETED': Check,
  'IN PROGRESS': TrendingUp,
  'LEARNING': BookOpen,
  'EXPLORING': Target,
  'PLANNED': Clock,
};

const statusColors = {
  'COMPLETED': 'var(--ok)',
  'IN PROGRESS': 'var(--accent)',
  'LEARNING': 'var(--warn)',
  'EXPLORING': 'var(--accent)',
  'PLANNED': 'var(--muted)',
};

const statusBadgeClass = {
  'COMPLETED': 'badge--ok',
  'IN PROGRESS': 'badge--info',
  'LEARNING': 'badge--warn',
  'EXPLORING': 'badge--info',
  'PLANNED': 'badge--muted',
};

export default function CurrentlyLearning() {
  return (
    <section id="learning" className="section-wrap" aria-labelledby="learning-heading" style={{ padding: 'var(--sp-8) 0' }}>
      <div className="section-header">
        <div className="kicker">
          <span>07</span>
          <span>currently learning</span>
        </div>
        <h2 id="learning-heading" className="heading-lg">Always<br /><em>learning.</em></h2>
        <p className="muted">
          These are the topics I'm actively exploring, developing, or planning to study next.
          Status labels reflect current progress honestly.
        </p>
      </div>

      <div className="bento learning-grid" role="list" aria-label="Learning topics" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {currentlyLearning.map((item) => {
          const Icon = statusIcons[item.status] || BookOpen;
          const color = statusColors[item.status] || 'var(--muted)';
          const badgeClass = statusBadgeClass[item.status] || 'badge--muted';

          return (
            <article key={item.topic} className="bento-item glass-card learning-card" role="listitem" style={{ padding: 'var(--sp-5)', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
              <div className="learning-icon" style={{ display: 'grid', placeItems: 'center', width: '44px', height: '44px', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', color: color, background: `${color}1A` }}>
                <Icon size={20} aria-hidden="true" />
              </div>
              <h3 style={{ margin: 'var(--sp-3) 0 var(--sp-2)', fontSize: '16px', fontWeight: '700', lineHeight: '1.3' }}>{item.topic}</h3>
              <span className={`badge ${badgeClass} learning-status`} style={{ alignSelf: 'flex-start', marginBottom: 'var(--sp-3)' }}>{item.status}</span>

              {item.resources && item.resources.length > 0 && (
                <div className="learning-resources" style={{ marginTop: 'auto', paddingTop: 'var(--sp-3)', borderTop: '1px solid var(--line)' }}>
                  <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 'var(--sp-2)' }}>Resources</h4>
                  <ul style={{ paddingLeft: 'var(--sp-4)', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {item.resources.map((resource, i) => (
                      <li key={i} style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: '1.5' }}>{resource}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="learning-legend" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-4)', marginTop: 'var(--sp-6)', padding: 'var(--sp-4)', background: 'var(--glass-secondary)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}>
        {Object.entries(statusIcons).map(([status, Icon]) => (
          <span key={status} className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon size={12} aria-hidden="true" style={{ color: statusColors[status] }} />
            {status}
          </span>
        ))}
      </div>
    </section>
  );
}