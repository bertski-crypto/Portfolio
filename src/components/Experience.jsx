import { practicalExperience } from '../data/experience';
import '../styles/components/bento.css';

export default function Experience() {
  return (
    <section id="experience" className="section-wrap" aria-labelledby="experience-heading" style={{ padding: 'var(--sp-8) 0', borderTop: '1px solid var(--line)' }}>
      <div className="section-header">
        <div className="kicker">
          <span>05</span>
          <span>practical experience</span>
        </div>
        <h2 id="experience-heading" className="heading-lg">Learning by<br /><em>shipping.</em></h2>
        <p className="muted">
          My experience so far is built through coursework, technical projects, labs, and the discipline of
          figuring out what happens when things do not work.
        </p>
      </div>

      <div className="bento" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
        {practicalExperience.map((item) => (
          <article
            key={item.id}
            className="bento-item glass-card"
            style={{ gridColumn: 'span 6', minHeight: '280px', padding: 'var(--sp-5)' }}
            role="listitem"
          >
            <span className="micro-label" style={{ color: 'var(--accent)' }}>{item.number}</span>
            <div className="experience-content" style={{ marginTop: 'var(--sp-3)' }}>
              <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.title}</strong>
              <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: '1.7', margin: 'var(--sp-2) 0 0' }}>{item.description}</p>
              <ul className="experience-highlights" style={{ marginTop: 'var(--sp-3)', paddingLeft: 'var(--sp-4)', color: 'var(--muted)', fontSize: '12px', lineHeight: '1.8' }}>
                {item.highlights.map((highlight, i) => (
                  <li key={i}>{highlight}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}