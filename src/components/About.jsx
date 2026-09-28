import { ArrowUpRight, Zap } from 'lucide-react';
import { skillGroups } from '../data/skills';

export default function About() {
  return (
    <section id="about" className="section-wrap split-section" aria-labelledby="about-heading">
      <div className="section-kicker">
        <span>01</span>
        <span>about / orientation</span>
      </div>
      <div className="about-content">
        <h2 id="about-heading">Practical by nature.<br /><em>Curious by default.</em></h2>
        <p>
          I'm an IT student and developing IT professional building practical skills across support, networking,
          web development, system administration, and troubleshooting.
        </p>
        <p>
          I enjoy understanding how systems fit together, solving technical problems methodically, and documenting
          what I learn so it can be useful to someone else.
        </p>
        <a href="#contact" className="text-link">
          start a conversation <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="signal-card">
        <div className="signal-top">
          <span className="micro-label">CURRENT FOCUS</span>
          <Zap size={17} aria-hidden="true" />
        </div>
        <div className="signal-bars" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span /><span />
        </div>
        <strong>BUILDING A<br />RELIABLE BASE</strong>
        <small>support / systems / networks</small>
      </div>
    </section>
  );
}