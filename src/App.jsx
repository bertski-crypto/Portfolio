import { useEffect, useState } from 'react';
import {
  ArrowUpRight, Check, ChevronRight, Code2, Container,
  Cpu, Download, ExternalLink, FileText, Globe2, Menu, Moon, Network,
  Server, ShieldCheck, Sun, Terminal, Wrench, X, Zap,
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import profileImage from './assets/images/albert-profile.png';

const projects = [
  {
    number: '01',
    title: 'IT SUPPORT & NETWORK MANAGEMENT PORTAL',
    type: 'IT SUPPORT / WEB APPLICATION',
    description: 'A focused system concept for organizing support requests, network issues, technician workflows, and resolution notes in one place.',
    tags: ['React', 'Systems thinking', 'Support workflows'],
    accent: 'lime',
  },
  {
    number: '02',
    title: 'CHILD IMMUNIZATION MONITORING SYSTEM',
    type: 'CAPSTONE / INFORMATION SYSTEM',
    description: 'A proposed information system for monitoring child immunization records and surfacing schedule reminders for health workers and guardians.',
    tags: ['Records', 'Scheduling', 'SMS concept'],
    accent: 'blue',
  },
  {
    number: '03',
    title: 'CALCULATOR WEB APPLICATION',
    type: 'WEB DEVELOPMENT / CONTAINERIZATION',
    description: 'A practical frontend exercise used to develop confidence with interface states, Git workflows, Docker, and deployment fundamentals.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Docker'],
    accent: 'amber',
  },
];

const labs = [
  { name: 'IP ADDRESSING', icon: Globe2, status: 'IN PROGRESS', detail: 'IPv4 addressing, gateways, and network boundaries.' },
  { name: 'SUBNETTING', icon: Network, status: 'LEARNING', detail: 'Breaking networks into useful, manageable segments.' },
  { name: 'DHCP & DNS', icon: Server, status: 'NEXT', detail: 'Understanding the services that make networks usable.' },
  { name: 'LINUX NETWORKING', icon: Terminal, status: 'LEARNING', detail: 'Inspecting interfaces, routes, and connectivity from the shell.' },
];

const skillGroups = [
  { label: 'IT SUPPORT', icon: Wrench, items: ['Hardware troubleshooting', 'Windows support', 'Software installation', 'Technical documentation'] },
  { label: 'NETWORKING', icon: Network, items: ['TCP/IP', 'IPv4 & subnetting', 'DHCP & DNS', 'Network troubleshooting'] },
  { label: 'DEVELOPMENT', icon: Code2, items: ['HTML & CSS', 'JavaScript', 'React', 'Python fundamentals'] },
  { label: 'TOOLS & OS', icon: Container, items: ['Git & GitHub', 'Docker', 'VS Code', 'Windows & Linux'] },
];

const contactLinks = [
  { label: 'GitHub Profile', icon: FaGithub, href: 'https://github.com/bertski-crypto', external: true, ariaLabel: 'GitHub profile' },
  { label: 'Albert Beato', icon: FaLinkedin, href: 'https://www.linkedin.com/in/YOUR_USERNAME', external: true, ariaLabel: 'Albert Beato on LinkedIn' },
  { label: 'Email Me', icon: SiGmail, href: 'mailto:humanperson0816@gmail.com', external: false, ariaLabel: 'Send me an email' },
];

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const updateForm = (event) => {
    setSent(false);
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  const submitForm = (event) => {
    event.preventDefault();
    if (Object.values(formState).every(Boolean) && formState.email.includes('@')) setSent(true);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Albert home" onClick={closeMenu}>
          <span className="brand-mark"><Cpu size={17} /></span>
          <span>ALBERT<span className="brand-dot">.</span>IT</span>
        </a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Primary navigation">
          {['about', 'projects', 'labs', 'skills', 'contact'].map((item) => <a key={item} href={`#${item}`} onClick={closeMenu}>{item}</a>)}
          <a href="/resume/Albert-Resume.pdf" className="nav-resume"><Download size={14} /> resume</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="icon-button menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero section-wrap" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> available for IT opportunities</div>
            <h1 id="hero-heading">HELLO,<br /><span>I'M ALBERT<span className="accent">.</span></span></h1>
            <p className="hero-lede">IT SUPPORT <span>/</span> NETWORKING <span>/</span> WEB DEVELOPMENT</p>
            <p className="hero-description">I build, troubleshoot, and develop practical IT solutions while continuously improving my skills in networking, system development, Linux, and modern web technologies.</p>
            <div className="hero-actions"><a href="#projects" className="button button-primary">view my projects <ArrowUpRight size={17} /></a><a href="/resume/Albert-Resume.pdf" className="button button-quiet"><FileText size={16} /> download resume</a></div>
          </div>
          <div className="hero-aside">
            <div className="profile-visual">
              <img src={profileImage} alt="Professional portrait of Albert" loading="eager" />
            </div>
            <div className="status-panel"><div><span className="status-dot" /> <span className="micro-label">STATUS</span></div><strong>AVAILABLE</strong><span className="panel-note">for IT opportunities</span></div>
          </div>
        </section>

        <section id="about" className="section-wrap split-section">
          <div className="section-kicker"><span>01</span><span>about / orientation</span></div>
          <div className="about-content"><h2>Practical by nature.<br /><em>Curious by default.</em></h2><p>I’m an IT student and developing IT professional building practical skills across support, networking, web development, system administration, and troubleshooting.</p><p>I enjoy understanding how systems fit together, solving technical problems methodically, and documenting what I learn so it can be useful to someone else.</p><a href="#contact" className="text-link">start a conversation <ArrowUpRight size={16} /></a></div>
          <div className="signal-card"><div className="signal-top"><span className="micro-label">CURRENT FOCUS</span><Zap size={17} /></div><div className="signal-bars"><span /><span /><span /><span /><span /><span /><span /><span /></div><strong>BUILDING A<br />RELIABLE BASE</strong><small>support / systems / networks</small></div>
        </section>

        <section id="projects" className="section-wrap projects-section">
          <div className="section-heading"><div><div className="section-kicker"><span>02</span><span>selected work</span></div><h2>Projects with a<br /><em>purpose.</em></h2></div><p>Technical work is where concepts become habits: clear requirements, useful interfaces, and reliable outcomes.</p></div>
          <div className="projects-grid">{projects.map((project) => <article className={`project-card ${project.accent}`} key={project.number}><div className="project-top"><span className="project-number">{project.number}</span><span className="micro-label">{project.type}</span><ArrowUpRight size={18} /></div><div className="project-visual"><div className="grid-pattern" /><div className="project-glyph">{project.number === '01' ? <Wrench size={58} /> : project.number === '02' ? <ShieldCheck size={58} /> : <Code2 size={58} />}</div></div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-footer"><span>details available soon</span><ChevronRight size={16} /></div></article>)}</div>
        </section>

        <section id="labs" className="section-wrap labs-section">
          <div className="section-heading compact"><div><div className="section-kicker"><span>03</span><span>hands-on practice</span></div><h2>Networking<br /><em>lab notes.</em></h2></div><p>Networking is more than a list on a resume. These are the topics I am actively translating into repeatable practice.</p></div>
          <div className="labs-grid">{labs.map((lab) => { const Icon = lab.icon; return <article className="lab-card" key={lab.name}><div className="lab-icon"><Icon size={20} /></div><div className="lab-content"><div className="lab-title"><h3>{lab.name}</h3><span className="lab-status">{lab.status}</span></div><p>{lab.detail}</p><span className="lab-link">view lab <ArrowUpRight size={14} /></span></div></article>; })}</div>
        </section>

        <section id="skills" className="section-wrap skills-section"><div className="section-kicker"><span>04</span><span>technical toolkit</span></div><div className="skills-layout"><div><h2>Tools I use to<br /><em>make things work.</em></h2><p className="muted-copy">A growing toolkit grounded in fundamentals. Skill levels are intentionally described honestly.</p><div className="tool-cloud">{['React', 'JavaScript', 'Python', 'Linux', 'Docker', 'Git', 'GitHub', 'VS Code'].map((tool, index) => <span key={tool} className={index === 0 ? 'active' : ''}>{tool}</span>)}</div></div><div className="skill-list">{skillGroups.map((group) => { const Icon = group.icon; return <div className="skill-group" key={group.label}><div className="skill-heading"><Icon size={16} /><span>{group.label}</span></div><p>{group.items.join('  /  ')}</p><span className="skill-level">developing toolkit</span></div>; })}</div></div></section>

        <section className="section-wrap experience-section"><div className="section-kicker"><span>05</span><span>practical experience</span></div><div className="experience-grid"><div className="experience-intro"><h2>Learning by<br /><em>shipping.</em></h2><p>My experience so far is built through coursework, technical projects, labs, and the discipline of figuring out what happens when things do not work.</p></div><div className="experience-items"><div><span>01</span><strong>IT SYSTEM DEVELOPMENT</strong><p>Web-based systems, system workflows, documentation, and frontend debugging.</p></div><div><span>02</span><strong>IT SUPPORT</strong><p>Software installation, basic hardware support, and structured troubleshooting.</p></div><div><span>03</span><strong>DEVELOPMENT WORKFLOWS</strong><p>React applications, Git/GitHub workflows, Docker projects, and Linux environments.</p></div></div></div></section>

        <section id="contact" className="section-wrap contact-section"><div className="contact-copy"><div className="section-kicker"><span>06</span><span>open channel</span></div><h2>Let’s work<br /><em>together.</em></h2><p>I’m open to discussing IT opportunities, technical projects, internships, junior roles, and collaboration.</p><div className="contact-email"><span aria-hidden="true">@</span><span>humanperson0816@gmail.com</span></div><div className="contact-links">{contactLinks.map(({ label, icon: Icon, href, external, ariaLabel }) => <a key={label} href={href} aria-label={ariaLabel} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><span className="contact-icon"><Icon size={19} aria-hidden="true" /></span><span>{label}</span><ExternalLink className="contact-arrow" size={13} aria-hidden="true" /></a>)}</div></div><form className="contact-form" onSubmit={submitForm}><label>Name<input name="name" value={formState.name} onChange={updateForm} placeholder="Your name" required /></label><label>Email<input name="email" type="email" value={formState.email} onChange={updateForm} placeholder="you@example.com" required /></label><label>Message<textarea name="message" value={formState.message} onChange={updateForm} placeholder="Tell me a little about the opportunity..." rows="4" required /></label><button className="button button-primary" type="submit">send message <ArrowUpRight size={17} /></button>{sent && <p className="form-success"><Check size={15} /> Thanks. This frontend form is ready to connect to a backend.</p>}</form></section>
      </main>

      <footer className="site-footer"><div className="brand"><span className="brand-mark"><Cpu size={17} /></span><span>ALBERT<span className="brand-dot">.</span>IT</span></div><span>© 2026 / IT SUPPORT · NETWORKING · WEB DEVELOPMENT</span><a href="#top" className="back-top">back to top <ArrowUpRight size={14} /></a></footer>
    </div>
  );
}

export default App;
