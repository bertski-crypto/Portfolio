import { GraduationCap, BookOpen, Award } from 'lucide-react';
import { education, certifications } from '../data/experience';
import '../styles/components/bento.css';

export default function Education() {
  return (
    <section id="education" className="section-wrap" aria-labelledby="education-heading" style={{ padding: 'var(--sp-8) 0' }}>
      <div className="section-header">
        <div className="kicker">
          <span>06</span>
          <span>education & certifications</span>
        </div>
        <h2 id="education-heading" className="heading-lg">Education</h2>
      </div>

      <div className="bento" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
        <article className="bento-item glass-card" style={{ gridColumn: 'span 8', padding: 'var(--sp-5)' }}>
          {education.map((edu) => (
            <div key={edu.id} className="education-card">
              <div className="education-header" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
                <div className="education-icon" style={{ display: 'grid', placeItems: 'center', width: '48px', height: '48px', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', color: 'var(--accent)', flexShrink: 0 }} aria-hidden="true">
                  <GraduationCap size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 var(--sp-1)', fontSize: '18px', fontWeight: '700' }}>{edu.degree}</h3>
                  <p className="education-school" style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>{edu.school}</p>
                </div>
                <span className={`education-status badge badge--${edu.status.toLowerCase().replace(' ', '-') === 'in-progress' ? 'info' : 'warn'}`} style={{ whiteSpace: 'nowrap', fontSize: '8px' }}>
                  {edu.status}
                </span>
              </div>

              <div className="education-meta" style={{ display: 'flex', gap: 'var(--sp-5)', marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
                <div className="meta-item" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="meta-label" style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>Location</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>{edu.location}</span>
                </div>
                <div className="meta-item" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="meta-label" style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>Period</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>{edu.period}</span>
                </div>
              </div>

              {edu.relevantCoursework && (
                <div className="coursework">
                  <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: 'var(--sp-2)' }}>Relevant Coursework</h4>
                  <ul style={{ paddingLeft: 'var(--sp-4)', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {edu.relevantCoursework.map((course, i) => (
                      <li key={i} style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: '1.5' }}>{course}</li>
                    ))}
                  </ul>
                </div>
              )}

              {edu.notes && (
                <p className="education-note" style={{ marginTop: 'var(--sp-3)', fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>{edu.notes}</p>
              )}
            </div>
          ))}
        </article>

        <article className="bento-item glass-card" style={{ gridColumn: 'span 4', padding: 'var(--sp-5)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 'var(--sp-4)' }}>
            <Award size={16} aria-hidden="true" />
            Certifications
          </h3>

          {certifications.length === 0 ? (
            <div className="cert-placeholder" style={{ textAlign: 'center', padding: 'var(--sp-5)', border: '1px dashed var(--line)', borderRadius: 'var(--r-lg)' }}>
              <p className="muted" style={{ marginBottom: 'var(--sp-2)' }}>No certifications earned yet.</p>
              <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                This section will be populated as certifications are obtained.
                Planned certifications are tracked in the <a href="#learning" style={{ color: 'var(--accent)' }}>Currently Learning</a> section.
              </p>
            </div>
          ) : (
            <ul className="cert-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {certifications.map((cert) => (
                <li key={cert.id} className="cert-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sp-3)', background: 'var(--glass-secondary)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)' }}>
                  <div className="cert-info">
                    <h4 style={{ margin: '0 0 4px', fontSize: '14px' }}>{cert.name}</h4>
                    <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12px' }}>{cert.issuer} · {cert.date}</p>
                  </div>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="cert-verify" style={{ padding: '4px 12px', border: '1px solid var(--line)', borderRadius: '6px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Verify
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}