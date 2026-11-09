import { motion } from 'framer-motion';
import { Wrench, Network, Code2, Terminal, Container } from 'lucide-react';
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiTailwindcss,
  SiBootstrap,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiPhp,
  SiMysql,
  SiFlask,
  SiGit,
  SiGithub,
  SiDocker,
  SiLinux,
  SiVite,
  SiVscodium,
} from 'react-icons/si';

import { skillGroups, toolIcons } from '../data/skills';
import LogoLoop from './LogoLoop';
import {
  Reveal,
  DUR,
  EASE,
  SectionHeader,
  SectionTitle,
  Stagger,
  StaggerItem,
  hoverCardSoft,
  hoverIconPop,
  hoverSoft,
  tapSoft,
  useReduced,
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
  const reduced = useReduced();

  // The icon inherits the card's reveal label, so it settles a beat
  // after the card itself rather than arriving with it.
  const iconReveal = reduced
    ? undefined
    : {
        hidden: { scale: 0.97 },
        show: {
          scale: 1,
          transition: { duration: DUR.fast, delay: 0.12, ease: EASE.out },
        },
      };

  return (
    <article className="skill-category">
      <h4>
        <motion.span
          className="skill-icon"
          aria-hidden="true"
          variants={iconReveal}
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
        <SectionTitle num="04" kicker="technical toolkit" id="skills-heading">
          Tools I use to
          <br />
          <em>make things work.</em>
        </SectionTitle>
        <Reveal kind="lead" as="p" delay={0.08} className="muted">
          A growing toolkit grounded in fundamentals. Skill levels are
          intentionally described honestly.
        </Reveal>
      </SectionHeader>

      <Stagger className="skills-bento" gap={0.1}>
        {/* tools card — spans full width */}
        <StaggerItem
          className="skill-category skill-category--tools glass-card"
          parallax
          parallaxIndex={0}
        >
          <div className="tools-header">
            <h3>Development Environment</h3>
            <p>Daily drivers for development and learning</p>
          </div>

          <div className="techstack-loop" style={{ marginTop: 24 }}>
            <LogoLoop
              logos={[
                { node: <SiHtml5 />, title: 'HTML5', href: 'https://developer.mozilla.org/en-US/docs/Glossary/HTML5', hoverColor: '#e34f26' },
                { node: <SiCss />, title: 'CSS3', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS', hoverColor: '#1572b6' },
                { node: <SiJavascript />, title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', hoverColor: '#f7df1e' },
                { node: <SiReact />, title: 'React', href: 'https://react.dev', hoverColor: '#61dafb' },
                { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com', hoverColor: '#06b6d4' },
                { node: <SiBootstrap />, title: 'Bootstrap', href: 'https://getbootstrap.com', hoverColor: '#7952b3' },
                { node: <SiNodedotjs />, title: 'Node.js', href: 'https://nodejs.org', hoverColor: '#339933' },
                { node: <SiExpress />, title: 'Express', href: 'https://expressjs.com', hoverColor: '#000000' },
                { node: <SiPython />, title: 'Python', href: 'https://www.python.org', hoverColor: '#3776ab' },
                { node: <SiPhp />, title: 'PHP', href: 'https://www.php.net', hoverColor: '#777bb3' },
                { node: <SiMysql />, title: 'MySQL', href: 'https://www.mysql.com', hoverColor: '#00618a' },
                { node: <SiFlask />, title: 'Flask', href: 'https://flask.palletsprojects.com', hoverColor: '#000000' },
                { node: <SiGit />, title: 'Git', href: 'https://git-scm.com', hoverColor: '#f05032' },
                { node: <SiGithub />, title: 'GitHub', href: 'https://github.com', hoverColor: '#181717' },
                { node: <SiDocker />, title: 'Docker', href: 'https://www.docker.com', hoverColor: '#0db9ed' },
                { node: <SiLinux />, title: 'Linux', href: 'https://www.linux.org', hoverColor: '#fcc624' },
                { node: <SiVscodium />, title: 'VS Code', href: 'https://code.visualstudio.com', hoverColor: '#007acc' },
                { node: <SiVite />, title: 'Vite', href: 'https://vitejs.dev', hoverColor: '#646cff' },
              ]}
              speed={70}
              direction="left"
              logoHeight={44}
              gap={72}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              ariaLabel="Development environment tech stack"
            />
          </div>
        </StaggerItem>

        {/* skill groups */}
        {skillGroups.map((group, i) => (
          <StaggerItem
            key={group.label}
            className="skill-card-slot"
            parallax
            parallaxIndex={i}
          >
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