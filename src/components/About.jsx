import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import {
  SectionHeader,
  SectionTitle,
  Stagger,
  StaggerItem,
  hoverSoft,
  tapSoft,
} from '../utils/motion-primitives';

import '../styles/components/about.css';
import '../styles/components/bento.css';

function FocusItem({ label, children }) {
  return (
    <motion.div className="focus-item" whileHover={hoverSoft} whileTap={tapSoft}>
      <span className="focus-label">{label}</span>
      <p>{children}</p>
    </motion.div>
  );
}

function LearningItem({ icon, title, status, statusClass }) {
  return (
    <div className="learning-item">
      <motion.div
        className="learning-icon"
        aria-hidden="true"
        whileHover={{ scale: 1.08, y: -2 }}
        transition={{ duration: 0.18 }}
      >
        {icon}
      </motion.div>
      <div className="learning-info">
        <h4>{title}</h4>
        <span className={`badge ${statusClass}`}>{status}</span>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="about section-wrap" aria-labelledby="about-heading">
      <SectionHeader className="section-header">
        <SectionTitle num="01" kicker="about / orientation" id="about-heading">
          Practical by nature.
          <br />
          <em>Curious by default.</em>
        </SectionTitle>
      </SectionHeader>

      <Stagger className="about-bento" gap={0.12}>
        <StaggerItem
          as="article"
          className="bento-item about-card about-card--bio glass-card"
          parallax
          parallaxIndex={0}
        >
          <div className="about-bio">
            <h3>Hi, I'm Albert.</h3>
            <p>
              I'm an IT student and developing IT professional building practical
              skills across support, networking, web development, system
              administration, and troubleshooting.
            </p>
            <p>
              I enjoy understanding how systems fit together, solving technical
              problems methodically, and documenting what I learn so it can be
              useful to someone else.
            </p>
            <motion.a
              href="#contact"
              className="link"
              whileHover={{ x: 5 }}
              whileTap={tapSoft}
              transition={{ duration: 0.18 }}
            >
              start a conversation <ArrowUpRight size={14} aria-hidden="true" />
            </motion.a>
          </div>
        </StaggerItem>

        <StaggerItem
          as="article"
          className="bento-item about-card about-card--focus glass-card"
          parallax
          parallaxIndex={1}
        >
          <h3 className="focus-label">Current Focus</h3>
          <div className="focus-list">
            <FocusItem label="IT SUPPORT">
              Hardware troubleshooting, software installation, Windows maintenance,
              user support, technical documentation
            </FocusItem>
            <FocusItem label="NETWORKING">
              IPv4 addressing &amp; subnetting, DHCP/DNS, router/switch config, Linux
              networking tools, troubleshooting methodology
            </FocusItem>
            <FocusItem label="WEB DEVELOPMENT">
              React, vanilla JS, REST APIs, responsive design, Docker
              containerization, deployment pipelines
            </FocusItem>
          </div>
        </StaggerItem>

        <StaggerItem
          as="article"
          className="bento-item about-card about-card--learning glass-card"
          parallax
          parallaxIndex={2}
        >
          <h3 className="focus-label">Currently Learning</h3>
          <div className="learning-list">
            <LearningItem
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              }
              title="Advanced Networking"
              status="IN PROGRESS"
              statusClass="badge--info"
            />
            <LearningItem
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              }
              title="Linux System Administration"
              status="IN PROGRESS"
              statusClass="badge--warn"
            />
            <LearningItem
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
              title="ITIL / Support Best Practices"
              status="EXPLORING"
              statusClass="badge--warn"
            />
          </div>
        </StaggerItem>
      </Stagger>
    </section>
  );
}