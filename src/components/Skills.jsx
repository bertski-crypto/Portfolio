import { Wrench, Network, Code2, Terminal, Container, ChevronRight } from 'lucide-react';
import { skillGroups, toolIcons } from '../data/skills';

const skillIcons = {
  Wrench,
  Network,
  Code2,
  Terminal,
  Container,
};

export default function Skills() {
  return (
    <section id="skills" className="section-wrap skills-section" aria-labelledby="skills-heading">
      <div className="section-kicker">
        <span>04</span>
        <span>technical toolkit</span>
      </div>

      <div className="skills-layout">
        <div className="tools-showcase">
          <h2 id="skills-heading">Tools I use to<br /><em>make things work.</em></h2>
          <p className="muted-copy">
            A growing toolkit grounded in fundamentals. Skill levels are intentionally described honestly.
          </p>

          <div className="tool-cloud" role="list" aria-label="Tools and technologies">
            {toolIcons.map((tool) => (
              <span key={tool.name} className="tool-tag" role="listitem">
                {tool.name}
              </span>
            ))}
          </div>
        </div>

        <div className="skill-list" role="list" aria-label="Skill categories">
          {skillGroups.map((group) => {
            const Icon = skillIcons[group.icon] || Code2;
            return (
              <div key={group.label} className="skill-group" role="listitem">
                <div className="skill-heading">
                  <Icon size={16} aria-hidden="true" />
                  <span>{group.label}</span>
                </div>
                <p>{group.items.join('  /  ')}</p>
                <span className="skill-level">{group.level}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}