import { ArrowUpRight } from 'lucide-react';
import { skillGroups } from '../data/skills';
import '../styles/components/about.css';
import '../styles/components/bento.css';

export default function About() {
  return (
    <section id="about" className="about section-wrap" aria-labelledby="about-heading">
      <div className="section-header">
        <div className="kicker">
          <span>01</span>
          <span>about / orientation</span>
        </div>
        <h2 id="about-heading" className="heading-lg">Practical by nature.<br /><em>Curious by default.</em></h2>
      </div>

      <div className="bento about-bento">
        <article className="bento-item about-card about-card--bio glass-card" style={{ gridColumn: 'span 12' }}>
          <div className="about-bio">
            <h3>Hi, I'm Albert.</h3>
            <p>
              I'm an IT student and developing IT professional building practical skills across support, networking,
              web development, system administration, and troubleshooting.
            </p>
            <p>
              I enjoy understanding how systems fit together, solving technical problems methodically, and documenting
              what I learn so it can be useful to someone else.
            </p>
            <a href="#contact" className="link">
              start a conversation <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </article>

        <article className="bento-item about-card about-card--focus glass-card">
          <h3 className="focus-label">Current Focus</h3>
          <div className="focus-list">
            <div className="focus-item">
              <span className="focus-label">IT SUPPORT</span>
              <p>Hardware troubleshooting, software installation, Windows maintenance, user support, technical documentation</p>
            </div>
            <div className="focus-item">
              <span className="focus-label">NETWORKING</span>
              <p>IPv4 addressing & subnetting, DHCP/DNS, router/switch config, Linux networking tools, troubleshooting methodology</p>
            </div>
            <div className="focus-item">
              <span className="focus-label">WEB DEVELOPMENT</span>
              <p>React, vanilla JS, REST APIs, responsive design, Docker containerization, deployment pipelines</p>
            </div>
          </div>
        </article>

        <article className="bento-item about-card about-card--learning glass-card">
          <h3 className="focus-label">Currently Learning</h3>
          <div className="learning-list">
            <div className="learning-item">
              <div className="learning-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <div className="learning-info">
                <h4>Advanced Networking</h4>
                <span className="badge badge--info">IN PROGRESS</span>
              </div>
            </div>
            <div className="learning-item">
              <div className="learning-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </div>
              <div className="learning-info">
                <h4>Linux System Administration</h4>
                <span className="badge badge--warn">IN PROGRESS</span>
              </div>
            </div>
            <div className="learning-item">
              <div className="learning-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div className="learning-info">
                <h4>ITIL / Support Best Practices</h4>
                <span className="badge badge--warn">EXPLORING</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}