import { ChevronRight, GraduationCap, BookOpen, Award } from 'lucide-react';
import { education, certifications } from '../data/experience';

export default function Education() {
  return (
    <section id="education" className="section-wrap education-section" aria-labelledby="education-heading">
      <div className="section-kicker">
        <span>06</span>
        <span>education & certifications</span>
      </div>

      <div className="education-grid">
        <div className="education-main">
          <h2 id="education-heading">Education</h2>

          {education.map((edu) => (
            <article key={edu.id} className="education-card">
              <div className="education-header">
                <div className="education-icon" aria-hidden="true">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3>{edu.degree}</h3>
                  <p className="education-school">{edu.school}</p>
                </div>
                <span className={`education-status ${edu.status.toLowerCase().replace(' ', '-')}`}>
                  {edu.status}
                </span>
              </div>

              <div className="education-meta">
                <div className="meta-item">
                  <span className="meta-label">Location</span>
                  <span>{edu.location}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Period</span>
                  <span>{edu.period}</span>
                </div>
              </div>

              {edu.relevantCoursework && (
                <div className="coursework">
                  <h4>Relevant Coursework</h4>
                  <ul>
                    {edu.relevantCoursework.map((course, i) => (
                      <li key={i}>{course}</li>
                    ))}
                  </ul>
                </div>
              )}

              {edu.notes && (
                <p className="education-note">{edu.notes}</p>
              )}
            </article>
          ))}
        </div>

        <div className="certifications-sidebar">
          <h3>
            <Award size={16} aria-hidden="true" />
            Certifications
          </h3>

          {certifications.length === 0 ? (
            <div className="cert-placeholder">
              <p className="muted-copy">No certifications earned yet.</p>
              <p className="cert-note">
                This section will be populated as certifications are obtained.
                Planned certifications are tracked in the <a href="#learning">Currently Learning</a> section.
              </p>
            </div>
          ) : (
            <ul className="cert-list">
              {certifications.map((cert) => (
                <li key={cert.id} className="cert-item">
                  <div className="cert-info">
                    <h4>{cert.name}</h4>
                    <p>{cert.issuer} · {cert.date}</p>
                  </div>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="cert-verify">
                      Verify
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}