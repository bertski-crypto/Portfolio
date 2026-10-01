import { Award, ExternalLink, FileText } from 'lucide-react';
import { certifications, getVerifiedCertifications } from '../data/certifications';
import '../styles/components/certifications.css';

export default function Certifications() {
  const verifiedCerts = getVerifiedCertifications();

  return (
    <section id="certifications" className="certifications section-wrap" aria-labelledby="certifications-heading">
      <div className="section-header">
        <div className="kicker">
          <span>05</span>
          <span>certifications</span>
        </div>
        <h2 id="certifications-heading" className="heading-lg">Certifications</h2>
        <p className="muted">Professional learning and certifications completed during my IT development journey.</p>
      </div>

      <div className="bento cert-bento">
        {verifiedCerts.length === 0 ? (
          <article className="bento-item cert-card glass-card cert-placeholder">
            <div className="cert-placeholder-content">
              <Award size={48} aria-hidden="true" style={{ color: 'var(--muted)', opacity: 0.5, marginBottom: 'var(--sp-4)' }} />
              <h3 style={{ margin: '0 0 var(--sp-2)', fontSize: '18px', color: 'var(--text-dim)' }}>No certifications yet</h3>
              <p style={{ margin: 0, color: 'var(--muted)', maxWidth: '360px' }}>
                This section will be populated as certifications are obtained.
                Planned certifications are tracked in the <a href="#learning" style={{ color: 'var(--accent)' }}>Currently Learning</a> section.
              </p>
            </div>
          </article>
        ) : (
          verifiedCerts.map((cert) => (
            <article key={cert.id} className="bento-item cert-card glass-card cert-card--featured">
              <div className="cert-header">
                <div className="cert-icon" aria-hidden="true">
                  <Award size={28} />
                </div>
                <div className="cert-title">
                  <h3>{cert.name}</h3>
                  <span className="badge badge--ok">COMPLETED</span>
                </div>
              </div>

              <div className="cert-body">
                <p className="cert-description">{cert.description}</p>

                <div className="cert-details">
                  <div className="cert-detail-item">
                    <span className="cert-detail-label">Provider</span>
                    <span className="cert-detail-value">{cert.provider}</span>
                  </div>
                  <div className="cert-detail-item">
                    <span className="cert-detail-label">Program</span>
                    <span className="cert-detail-value">{cert.program}</span>
                  </div>
                  <div className="cert-detail-item">
                    <span className="cert-detail-label">Completed</span>
                    <span className="cert-detail-value">{cert.completedLabel}</span>
                  </div>
                  <div className="cert-detail-item">
                    <span className="cert-detail-label">Instructor</span>
                    <span className="cert-detail-value">{cert.instructor}</span>
                  </div>
                  <div className="cert-detail-item">
                    <span className="cert-detail-label">Credential ID</span>
                    <span className="cert-detail-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', wordBreak: 'break-all' }}>{cert.credentialId}</span>
                  </div>
                </div>
              </div>

              <div className="cert-footer">
                {cert.file ? (
                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary cert-btn"
                    aria-label={`View ${cert.name} certificate`}
                  >
                    <FileText size={16} aria-hidden="true" />
                    VIEW CERTIFICATE <ExternalLink size={14} aria-hidden="true" />
                  </a>
                ) : (
                  <button className="btn btn-ghost cert-btn" disabled aria-label="Certificate PDF not yet available - add certificate.pdf to src/assets/certificate/">
                    <FileText size={16} aria-hidden="true" />
                    ADD CERTIFICATE PDF
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}