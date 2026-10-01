import { motion } from 'framer-motion';
import { Award, ExternalLink, FileText } from 'lucide-react';

import { getVerifiedCertifications } from '../data/certifications';
import {
  Reveal,
  SectionHeader,
  Stagger,
  StaggerItem,
  hoverCard,
  hoverIconShift,
  hoverPrimary,
  hoverIconPop,
  tapSoft,
} from '../utils/motion-primitives';

import '../styles/components/certifications.css';

export default function Certifications() {
  const certs = getVerifiedCertifications();

  return (
    <section
      id="certifications"
      className="certifications section-wrap"
      aria-labelledby="certifications-heading"
    >
      <SectionHeader className="section-header">
        <Reveal kind="heading" as="div">
          <div className="kicker">
            <span>05</span>
            <span>certifications</span>
          </div>
          <h2 id="certifications-heading" className="heading-lg">
            Certifications
          </h2>
        </Reveal>
        <Reveal kind="lead" as="p" delay={0.08} className="muted">
          Professional learning and certifications completed during my IT
          development journey.
        </Reveal>
      </SectionHeader>

      {certs.length === 0 ? (
        <Reveal kind="card" className="cert-card glass-card cert-placeholder">
          <motion.div
            aria-hidden="true"
            whileHover={hoverIconPop(1.06, -2)}
          >
            <Award size={48} />
          </motion.div>
          <h3>No certifications yet</h3>
          <p>
            This section will be populated as certifications are obtained.
            Planned certifications are tracked in the{' '}
            <a href="#learning">Currently Learning</a> section.
          </p>
        </Reveal>
      ) : (
        <Stagger className="cert-bento" gap={0.12}>
          {certs.map((cert) => (
            <StaggerItem key={cert.id}>
              <motion.article
                className="cert-card glass-card cert-card--featured"
                whileHover={hoverCard}
                whileTap={tapSoft}
              >
                <div className="cert-header">
                  <motion.div
                    className="cert-icon"
                    aria-hidden="true"
                    whileHover={hoverIconPop(1.08, -2)}
                  >
                    <Award size={28} />
                  </motion.div>

                  <div className="cert-title">
                    <h3>{cert.name}</h3>
                    <span className="badge badge--ok">COMPLETED</span>
                  </div>
                </div>

                <div className="cert-body">
                  <p className="cert-description">{cert.description}</p>

                  <Stagger className="cert-details" gap={0.06}>
                    <StaggerItem className="cert-detail-item">
                      <span className="cert-detail-label">Provider</span>
                      <span className="cert-detail-value">{cert.provider}</span>
                    </StaggerItem>
                    <StaggerItem className="cert-detail-item">
                      <span className="cert-detail-label">Program</span>
                      <span className="cert-detail-value">{cert.program}</span>
                    </StaggerItem>
                    <StaggerItem className="cert-detail-item">
                      <span className="cert-detail-label">Completed</span>
                      <span className="cert-detail-value">
                        {cert.completedLabel}
                      </span>
                    </StaggerItem>
                    <StaggerItem className="cert-detail-item">
                      <span className="cert-detail-label">Instructor</span>
                      <span className="cert-detail-value">{cert.instructor}</span>
                    </StaggerItem>
                    <StaggerItem className="cert-detail-item">
                      <span className="cert-detail-label">Credential ID</span>
                      <span className="cert-detail-value cert-detail-value--id">
                        {cert.credentialId}
                      </span>
                    </StaggerItem>
                  </Stagger>
                </div>

                <div className="cert-footer">
                  {cert.file ? (
                    <motion.a
                      href={cert.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary cert-btn"
                      aria-label={`View ${cert.name} certificate`}
                      whileHover={hoverPrimary}
                      whileTap={tapSoft}
                    >
                      <FileText size={16} aria-hidden="true" />
                      VIEW CERTIFICATE
                      <motion.span variants={hoverIconShift(4)}>
                        <ExternalLink size={14} aria-hidden="true" />
                      </motion.span>
                    </motion.a>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-ghost cert-btn"
                      disabled
                      aria-label="Certificate PDF not yet available"
                    >
                      <FileText size={16} aria-hidden="true" />
                      ADD CERTIFICATE PDF
                    </button>
                  )}
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </section>
  );
}