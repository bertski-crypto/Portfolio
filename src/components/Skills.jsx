import { motion } from 'framer-motion';
import { Wrench, Network, Code2, Terminal, Container } from 'lucide-react';

import { skillGroups, toolIcons } from '../data/skills';
import {
  Reveal,
  SectionHeader,
  Stagger,
  StaggerItem,
  hoverCardSoft,
  hoverIconPop,
  hoverSoft,
  tapSoft,
} from '../utils/motion-primitives';

import '../styles/components/skills.css';
import '../styles/components/bento.css';

const skillIcons = { Wrench, Network, Code2, Terminal, Container };

/* ------------------------------------------------------------------ */
/*  Tool chip                                                          */
/* ------------------------------------------------------------------ */
function ToolTag({ tool }) {
  return (
    <motion.span
      className="tool-tag"
      role="listitem"
      whileHover={hoverSoft}
      whileTap={tapSoft}
    >
      {tool.name}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Skill category card                                                */
/* ------------------------------------------------------------------ */
function SkillCategory({ group }) {
  const Icon = skillIcons[group.icon] || Code2;

  return (
    <article className="skill-category">
      <h4>
        <motion.span
          className="skill-icon"
          aria-hidden="true"
          whileHover={hoverIconPop(1.08, -2)}
        >
          <Icon size={16} />
        </motion.span>
        {group.label}
      </h4>

      <ul>
        {group.items.map((item) => (
          <motion.li key={item} whileHover={hoverSoft} whileTap={tapSoft}>
            {item}
          </motion.li>
        ))}
      </ul>

      <p className="skill-level">{group.level}</p>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export default function Skills() {
  return (
    <section id="skills" className="skills section-wrap" aria-labelledby="skills-heading">
      <SectionHeader className="section-header">
        <Reveal kind="heading" as="div">
          <div className="kicker">
            <span>04</span>
            <span>technical toolkit</span>
          </div>
          <h2 id="skills-heading" className="heading-lg">
            Tools I use to
            <br />
            <em>make things work.</em>
          </h2>
        </Reveal>
        <Reveal kind="lead" as="p" delay={0.08} className="muted">
          A growing toolkit grounded in fundamentals. Skill levels are
          intentionally described honestly.
        </Reveal>
      </SectionHeader>

      <Stagger className="skills-bento" gap={0.1}>
        {/* tools card — spans full width */}
        <StaggerItem className="skill-category skill-category--tools glass-card">
          <div className="tools-header">
            <h3>Development Environment</h3>
            <p>Daily drivers for development and learning</p>
          </div>

          <Stagger className="tools-cloud" gap={0.035} role="list">
            {toolIcons.map((tool) => (
              <StaggerItem key={tool.name} as="div">
                <ToolTag tool={tool} />
              </StaggerItem>
            ))}
          </Stagger>
        </StaggerItem>

        {/* skill groups */}
        {skillGroups.map((group) => (
          <StaggerItem key={group.label} className="skill-card-slot">
            <motion.div
              className="skill-card-hover"
              whileHover={hoverCardSoft}
              whileTap={tapSoft}
            >
              <SkillCategory group={group} />
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}