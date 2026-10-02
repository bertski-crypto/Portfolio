import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';

import { education, certifications } from '../data/experience';
import { Timeline, TimelineNode, TimelineRail } from './Timeline';
import {
  SectionHeader,
  SectionTitle,
  Stagger,
  StaggerItem,
  hoverCard,
  hoverIconPop,
  hoverSoft,
  tapSoft,
} from '../utils/motion-primitives';
import '../styles/components/education.css';

export default function Education() {
  return (
    <section
      id="education"
      className="education section-wrap"
      aria-labelledby="education-heading"
    >
      <SectionHeader className="section-header">
        <SectionTitle
          num="06"
          kicker="education &amp; certifications"
          id="education-heading"
        >
          Education
        </SectionTitle>
      </SectionHeader>

      <Timeline>
        <Stagger className="education-grid timeline" gap={0.12}>
          <TimelineRail />
          {education.map((edu, i) => (
            <StaggerItem
              key={edu.id}
              className="education-slot education-slot--main timeline-item"
              parallax
              parallaxIndex={i}
            >
              <TimelineNode />
              <motion.article
                className="education-card glass-card"
                whileHover={hoverCard}
                whileTap={tapSoft}
              >
                <div className="education-header">
                  <motion.div
                    className="education-icon"
                    aria-hidden="true"
                    whileHover={hoverIconPop(1.06, -2)}
                  >
                    <GraduationCap size={22} />
                  </motion.div>

                  <div className="education-heading-text">
                    <h3>{edu.degree}</h3>
                    <p className="education-school">{edu.school}</p>
                  </div>

                  <span className="badge badge--info education-status">
                    {edu.status}
                  </span>
                </div>

                <div className="education-meta">
                  <div className="meta-item">
                    <span className="meta-label">Location</span>
                    <span className="meta-value">{edu.location}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Period</span>
                    <span className="meta-value">{edu.period}</span>
                  </div>
                </div>

                {edu.relevantCoursework?.length > 0 && (
                  <div className="coursework">
                    <h4>Relevant Coursework</h4>
                    <Stagger className="coursework-list" gap={0.04}>
                      {edu.relevantCoursework.map((c) => (
                        <StaggerItem as="li" key={c}>
                          {c}
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>
                )}

                {edu.notes && <p className="education-note">{edu.notes}</p>}
              </motion.article>
            </StaggerItem>
          ))}

          <StaggerItem
            className="education-slot education-slot--side timeline-item"
            parallax
            parallaxIndex={1}
          >
            <TimelineNode />
            <motion.aside
              className="cert-summary glass-card"
              aria-label="Certifications summary"
              whileHover={hoverCard}
              whileTap={tapSoft}
            >
              <h3 className="cert-summary-title">
                <motion.span
                  aria-hidden="true"
                  className="cert-summary-icon"
                  whileHover={hoverIconPop(1.08, -2)}
                >
                  <Award size={16} />
                </motion.span>
                Certifications
              </h3>

              {certifications.length === 0 ? (
                <div className="cert-placeholder">
                  <p className="muted">No certifications earned yet.</p>
                  <p className="cert-note">
                    This section will be populated as certifications are obtained.
                    Planned certifications are tracked in the{' '}
                    <a href="#learning">Currently Learning</a> section.
                  </p>
                </div>
              ) : (
                <Stagger className="cert-list" gap={0.08}>
                  {certifications.map((cert) => (
                    <StaggerItem key={cert.id} as="li" className="cert-item">
                      <div className="cert-info">
                        <h4>{cert.name}</h4>
                        <p>
                          {cert.provider} · {cert.completedLabel}
                        </p>
                      </div>
                      <motion.a
                        href="#certifications"
                        className="cert-verify"
                        aria-label={`View ${cert.name} certificate details`}
                        whileHover={hoverSoft}
                        whileTap={tapSoft}
                      >
                        VIEW
                      </motion.a>
                    </StaggerItem>
                  ))}
                </Stagger>
              )}
            </motion.aside>
          </StaggerItem>
        </Stagger>
      </Timeline>
    </section>
  );
}