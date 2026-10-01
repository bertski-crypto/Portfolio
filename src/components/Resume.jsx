import { Download, FileText, ExternalLink, Check, X } from 'lucide-react';
import { siteConfig } from '../data/socials';
import '../styles/components/resume.css';
import '../styles/components/bento.css';

export default function Resume() {
  const resumeExists = siteConfig.resumeExists;
  const resumePath = `/${siteConfig.resumeFileName}`;

  return (
    <section id="resume" className="resume section-wrap" aria-labelledby="resume-heading">
      <div className="section-header">
        <div className="kicker">
          <span>08</span>
          <span>resume</span>
        </div>
        <h2 id="resume-heading" className="heading-lg">Resume</h2>
      </div>

      <div className="bento" style={{ gridTemplateColumns: '1fr' }}>
        <article className="bento-item resume-card glass-card">
          <div className="resume-icon" aria-hidden="true">
            <FileText size={36} />
          </div>
          <h2>A concise summary of my technical background, projects, and skills.</h2>

          <div className="resume-actions">
            {resumeExists ? (
              <>
                <a
                  href={resumePath}
                  download={siteConfig.resumeFileName}
                  className="btn btn-primary"
                >
                  <Download size={17} aria-hidden="true" />
                  DOWNLOAD RESUME
                </a>
                <a
                  href={resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  <ExternalLink size={17} aria-hidden="true" />
                  VIEW IN BROWSER
                </a>
              </>
            ) : (
              <div className="resume-placeholder">
                <h3>Resume Not Yet Available</h3>
                <p>
                  A formal resume PDF will be linked here when ready. In the meantime,
                  my <a href="#projects" style={{ color: 'var(--accent)' }}>projects</a>, <a href="#skills" style={{ color: 'var(--accent)' }}>skills</a>, and
                  <a href="#experience" style={{ color: 'var(--accent)' }}>practical experience</a> sections provide a
                  comprehensive view of my capabilities.
                </p>
                <div className="placeholder-status">
                  <span className="status-item">
                    <X size={14} aria-hidden="true" style={{ color: 'var(--muted)' }} />
                    PDF file not added to public/
                  </span>
                  <span className="status-item">
                    <Check size={14} aria-hidden="true" style={{ color: 'var(--ok)' }} />
                    Projects documented on GitHub
                  </span>
                  <span className="status-item">
                    <Check size={14} aria-hidden="true" style={{ color: 'var(--ok)' }} />
                    Skills and experience detailed above
                  </span>
                </div>
              </div>
            )}
          </div>

          <details className="resume-summary">
            <summary>View plain-text resume summary</summary>
            <div className="resume-text">
              <pre>{`${siteConfig.name.toUpperCase()}
${siteConfig.title}
${siteConfig.tagline}

${siteConfig.description}

TECHNICAL SKILLS
• IT Support: Hardware troubleshooting, Windows support, Software installation, Technical documentation
• Networking: TCP/IP, IPv4 & subnetting, DHCP & DNS, Network troubleshooting, Linux networking
• Web Development: HTML5, CSS3, JavaScript (ES6+), React, Responsive design, REST APIs
• Programming: Python (Flask, SQLAlchemy), JavaScript (Node.js, Express), PHP, SQL
• Tools & Platforms: Git/GitHub, Docker, VS Code, Linux, Windows, XAMPP

FEATURED PROJECTS
1. IT SUPPORT & NETWORK MANAGEMENT PORTAL (IN DEVELOPMENT)
   React/Express/SQLite • RBAC • Ticket lifecycle • Asset inventory • Docker
   https://github.com/bertski-crypto/ITSNMP

2. AI-POWERED CHILD IMMUNIZATION MONITORING SYSTEM (IN DEVELOPMENT)
   React/Flask/SQLite • scikit-learn • SMS notifications • RBAC • Audit logging
   https://github.com/bertski-crypto/immunization-monitoring-system

3. CALCULATOR WEB APPLICATION (COMPLETED)
   HTML/CSS/JS • Docker • Themes • Keyboard support • Demo payment flow
   https://github.com/bertski-crypto/calculator-project

4. 1002 GROCERY INVENTORY MANAGEMENT SYSTEM (COMPLETED)
   PHP/MySQL • FEFO/FIFO • POS • Purchase orders • Multi-role access
   https://github.com/bertski-crypto/1002-grocery-inventory-system

EDUCATION
Bachelor of Science in Information Technology
[UNIVERSITY NAME] — [EXPECTED GRADUATION YEAR]
Relevant: Computer Networks, Database Systems, Web Development, Operating Systems,
Software Engineering, Capstone Project

CONTACT
GitHub: https://github.com/bertski-crypto
LinkedIn: https://www.linkedin.com/in/YOUR_USERNAME
Email: humanperson0816@gmail.com`}</pre>
            </div>
          </details>
        </article>
      </div>
    </section>
  );
}