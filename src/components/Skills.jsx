import { Wrench, Network, Code2, Terminal, Container } from 'lucide-react';
import { skillGroups, toolIcons } from '../data/skills';
import '../styles/components/skills.css';
import '../styles/components/bento.css';

const skillIcons = { Wrench, Network, Code2, Terminal, Container };

export default function Skills() {
  return (
    <section id="skills" className="skills section-wrap" aria-labelledby="skills-heading">
      <div className="section-header">
        <div className="kicker">
          <span>04</span>
          <span>technical toolkit</span>
        </div>
        <h2 id="skills-heading" className="heading-lg">Tools I use to<br /><em>make things work.</em></h2>
        <p className="muted">A growing toolkit grounded in fundamentals. Skill levels are intentionally described honestly.</p>
      </div>

      <div className="bento skills-bento">
        <article className="bento-item skill-category skill-category--tools glass-card">
          <div className="tools-header">
            <h3>Development Environment</h3>
            <p>Daily drivers for development and learning</p>
          </div>
          <div className="tools-cloud" role="list" aria-label="Tools and technologies">
            {toolIcons.map((tool) => (
              <span key={tool.name} className="tool-tag" role="listitem">
                {tool.name}
              </span>
            ))}
          </div>
        </article>

        {skillGroups.map((group) => {
          const Icon = skillIcons[group.icon] || Code2;
          return (
            <article key={group.label} className="bento-item skill-category skill-category--group glass-card">
              <h4>
                <Icon size={16} aria-hidden="true" />
                {group.label}
              </h4>
              <ul>
                {group.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="muted" style={{ marginTop: 'var(--sp-3)', fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {group.level}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}