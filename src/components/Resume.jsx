import { motion } from 'framer-motion';
import { Download, FileText, ExternalLink, Check, X, ChevronDown } from 'lucide-react';

import { siteConfig } from '../data/socials';
import {
  Reveal,
  SectionHeader,
  SectionTitle,
  Stagger,
  StaggerItem,
  hoverCard,
  hoverIconPop,
  hoverIconShift,
  hoverPrimary,
  hoverSecondary,
  tapSoft,
} from '../utils/motion-primitives';
import '../styles/components/resume.css';

export default function Resume() {
  const hasResume = siteConfig.resumeExists;
  const resumePath = `/${siteConfig.resumeFileName}`;

  return (
    <section id="resume" className="resume section-wrap" aria-labelledby="resume-heading">
      <SectionHeader className="section-header">
        <SectionTitle num="08" kicker="resume" id="resume-heading">
          Resume
        </SectionTitle>
      </SectionHeader>

      <Reveal kind="card">
        <motion.article className="resume-card glass-card" whileHover={hoverCard}>
          <motion.div
            className="resume-icon"
            aria-hidden="true"
            whileHover={hoverIconPop(1.06, -2)}
          >
            <FileText size={36} />
          </motion.div>

          <h3 className="resume-lede">
            A concise summary of my technical background, projects, and skills.
          </h3>

          {hasResume ? (
            <Stagger className="resume-actions" gap={0.08}>
              <StaggerItem className="resume-action">
                <motion.a
                  href={resumePath}
                  download={siteConfig.resumeFileName}
                  className="btn btn-primary"
                  whileHover={hoverPrimary}
                  whileTap={tapSoft}
                >
                  <Download size={17} aria-hidden="true" />
                  DOWNLOAD RESUME
                </motion.a>
              </StaggerItem>
              <StaggerItem className="resume-action">
                <motion.a
                  href={resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                  whileHover={hoverSecondary}
                  whileTap={tapSoft}
                >
                  <ExternalLink size={17} aria-hidden="true" />
                  VIEW IN BROWSER
                </motion.a>
              </StaggerItem>
            </Stagger>
          ) : (
            <Stagger className="resume-placeholder" gap={0.09}>
              <StaggerItem>
                <h4>Resume Not Yet Available</h4>
              </StaggerItem>
              <StaggerItem as="p">
                A formal resume PDF will be linked here when ready. In the
                meantime, my <a href="#projects">projects</a>,{' '}
                <a href="#skills">skills</a>, and{' '}
                <a href="#experience">practical experience</a> sections provide a
                comprehensive view of my capabilities.
              </StaggerItem>

              <StaggerItem>
                <Stagger className="placeholder-status" gap={0.06}>
                  <StaggerItem className="status-item">
                    <X size={14} aria-hidden="true" className="status-icon--muted" />
                    PDF file not added to public/
                  </StaggerItem>
                  <StaggerItem className="status-item">
                    <Check size={14} aria-hidden="true" className="status-icon--ok" />
                    Projects documented on GitHub
                  </StaggerItem>
                  <StaggerItem className="status-item">
                    <Check size={14} aria-hidden="true" className="status-icon--ok" />
                    Skills and experience detailed above
                  </StaggerItem>
                </Stagger>
              </StaggerItem>
            </Stagger>
          )}

          <details className="resume-summary">
            <summary>
              <motion.span
                variants={{ rotate: 0 }}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} aria-hidden="true" />
              </motion.span>
              View plain-text resume summary
            </summary>
            <div className="resume-text">
              <pre>{`${siteConfig.name.toUpperCase()}
${siteConfig.title}
${siteConfig.tagline}

${siteConfig.description}

TECHNICAL SKILLS
- IT Support: Hardware troubleshooting, Windows support, Software installation, Technical documentation
- Networking: TCP/IP, IPv4 & subnetting, DHCP & DNS, Network troubleshooting, Linux networking
- Web Development: HTML5, CSS3, JavaScript (ES6+), React, Responsive design, REST APIs
- Programming: Python (Flask, SQLAlchemy), JavaScript (Node.js, Express), PHP, SQL
- Tools & Platforms: Git/GitHub, Docker, VS Code, Linux, Windows, XAMPP

FEATURED PROJECTS
1. IT SUPPORT & NETWORK MANAGEMENT PORTAL (IN DEVELOPMENT)
   React/Express/SQLite - RBAC - Ticket lifecycle - Asset inventory - Docker
   https://github.com/bertski-crypto/ITSNMP

2. AI-POWERED CHILD IMMUNIZATION MONITORING SYSTEM (IN DEVELOPMENT)
   React/Flask/SQLite - scikit-learn - SMS notifications - RBAC - Audit logging
   https://github.com/bertski-crypto/immunization-monitoring-system

3. CALCULATOR WEB APPLICATION (COMPLETED)
   HTML/CSS/JS - Docker - Themes - Keyboard support - Demo payment flow
   https://github.com/bertski-crypto/calculator-project

4. 1002 GROCERY INVENTORY MANAGEMENT SYSTEM (COMPLETED)
   PHP/MySQL - FEFO/FIFO - POS - Purchase orders - Multi-role access
   https://github.com/bertski-crypto/1002-grocery-inventory-system

EDUCATION
Bachelor of Science in Information Technology

CERTIFICATIONS
Python Essentials 1 - DICT-ITU DTC Initiative / Cisco Networking Academy

CONTACT
GitHub: https://github.com/bertski-crypto
Email: humanperson0816@gmail.com`}</pre>
            </div>
          </details>
        </motion.article>
      </Reveal>
    </section>
  );
}