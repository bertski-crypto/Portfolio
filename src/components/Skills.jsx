import { motion } from 'framer-motion';
import { Wrench, Network, Code2, Terminal, Container } from 'lucide-react';
import {
  SiReact,
  SiVite,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiBootstrap,
  SiHtml5,
  SiCss,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiFlask,
  SiPhp,
  SiJsonwebtokens,
  SiAxios,
  SiMysql,
  SiSqlite,
  SiScikitlearn,
  SiDocker,
  SiNginx,
  SiApache,
  SiLinux,
  SiUbuntu,
  SiCisco,
  SiWireshark,
  SiGit,
  SiGithub,
  SiVscodium,
  SiPostman,
  SiNpm,
  SiMarkdown,
} from 'react-icons/si';

import { skillGroups } from '../data/skills';
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

// Filter out Web Development, Programming, and Tools & Platforms as requested
const coreSkillGroups = skillGroups.filter(
  (group) =>
    group.label !== 'WEB DEVELOPMENT' &&
    group.label !== 'PROGRAMMING' &&
    group.label !== 'TOOLS & PLATFORMS'
);

const ALL_PROJECT_TECH_LOGOS = [
  // Web & Frontend
  { node: <SiReact />, title: 'React', href: 'https://react.dev', hoverColor: '#61dafb' },
  { node: <SiVite />, title: 'Vite', href: 'https://vite.dev', hoverColor: '#646cff' },
  { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org', hoverColor: '#3178c6' },
  { node: <SiJavascript />, title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', hoverColor: '#f7df1e' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com', hoverColor: '#06b6d4' },
  { node: <SiBootstrap />, title: 'Bootstrap', href: 'https://getbootstrap.com', hoverColor: '#7952b3' },
  { node: <SiHtml5 />, title: 'HTML5', href: 'https://developer.mozilla.org/en-US/docs/Glossary/HTML5', hoverColor: '#e34f26' },
  { node: <SiCss />, title: 'CSS3', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS', hoverColor: '#1572b6' },
  { node: <SiFramer />, title: 'Framer Motion', href: 'https://motion.dev', hoverColor: '#0055ff' },

  // Backend & APIs
  { node: <SiNodedotjs />, title: 'Node.js', href: 'https://nodejs.org', hoverColor: '#339933' },
  { node: <SiExpress />, title: 'Express.js', href: 'https://expressjs.com', hoverColor: '#ffffff' },
  { node: <SiPython />, title: 'Python', href: 'https://www.python.org', hoverColor: '#3776ab' },
  { node: <SiFlask />, title: 'Flask', href: 'https://flask.palletsprojects.com', hoverColor: '#00bc8c' },
  { node: <SiPhp />, title: 'PHP', href: 'https://www.php.net', hoverColor: '#777bb3' },
  { node: <SiJsonwebtokens />, title: 'JWT', href: 'https://jwt.io', hoverColor: '#d63aff' },
  { node: <SiAxios />, title: 'Axios', href: 'https://axios-http.com', hoverColor: '#5a29e4' },

  // Databases & Storage
  { node: <SiMysql />, title: 'MySQL', href: 'https://www.mysql.com', hoverColor: '#00618a' },
  { node: <SiSqlite />, title: 'SQLite', href: 'https://www.sqlite.org', hoverColor: '#003b57' },

  // Machine Learning & Analytics
  { node: <SiScikitlearn />, title: 'scikit-learn', href: 'https://scikit-learn.org', hoverColor: '#f7931e' },

  // DevOps, Servers & Systems
  { node: <SiDocker />, title: 'Docker', href: 'https://www.docker.com', hoverColor: '#0db9ed' },
  { node: <SiNginx />, title: 'Nginx', href: 'https://nginx.org', hoverColor: '#009639' },
  { node: <SiApache />, title: 'Apache', href: 'https://httpd.apache.org', hoverColor: '#d22128' },
  { node: <SiLinux />, title: 'Linux', href: 'https://www.linux.org', hoverColor: '#fcc624' },
  { node: <SiUbuntu />, title: 'Ubuntu', href: 'https://ubuntu.com', hoverColor: '#e95420' },

  // Networking & Lab Infrastructure
  { node: <SiCisco />, title: 'Cisco Packet Tracer', href: 'https://www.netacad.com', hoverColor: '#1ba0d7' },
  { node: <SiWireshark />, title: 'Wireshark', href: 'https://www.wireshark.org', hoverColor: '#1679a7' },

  // Development Workflow & Tooling
  { node: <SiGit />, title: 'Git', href: 'https://git-scm.com', hoverColor: '#f05032' },
  { node: <SiGithub />, title: 'GitHub', href: 'https://github.com', hoverColor: '#e6edf3' },
  { node: <SiVscodium />, title: 'VS Code', href: 'https://code.visualstudio.com', hoverColor: '#007acc' },
  { node: <SiPostman />, title: 'Postman', href: 'https://www.postman.com', hoverColor: '#ff6c37' },
  { node: <SiNpm />, title: 'npm', href: 'https://www.npmjs.com', hoverColor: '#cb3837' },
  { node: <SiMarkdown />, title: 'Markdown', href: 'https://daringfireball.net/projects/markdown/', hoverColor: '#ffffff' },
];

/* ------------------------------------------------------------------ */
/*  Skill category card                                                */
/* ------------------------------------------------------------------ */
function SkillCategory({ group }) {
  const Icon = skillIcons[group.icon] || Code2;
  const reduced = useReduced();

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

      {/* Standalone LogoLoop ticker strip — NO CARD wrapper, clean full-width ribbon */}
      <Reveal kind="card" className="skills-loop-strip" delay={0.1}>
        <LogoLoop
          logos={ALL_PROJECT_TECH_LOGOS}
          speed={65}
          direction="left"
          logoHeight={44}
          gap={60}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          ariaLabel="Technologies used across all projects"
        />
      </Reveal>

      {/* Bento Grid */}
      <Stagger className="skills-bento" gap={0.1}>
        {coreSkillGroups.map((group, i) => (
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
