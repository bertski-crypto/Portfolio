import { useState } from 'react';
import { Menu, X, Sun, Moon, Download } from 'lucide-react';
import { socialLinks } from '../data/socials';

const navItems = [
  { id: 'about', label: 'ABOUT' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'labs', label: 'NETWORKING' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'education', label: 'EDUCATION' },
  { id: 'learning', label: 'LEARNING' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Navbar({ theme, onThemeToggle, activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  };

  return (
    <header className="site-header" role="banner">
      <a className="brand" href="#top" aria-label="Albert home" onClick={closeMenu}>
        <span className="brand-mark" aria-hidden="true">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>
        </span>
        <span>ALBERT<span className="brand-dot">.</span>IT</span>
      </a>

      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
            className={activeSection === item.id ? 'active' : ''}
            aria-current={activeSection === item.id ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
        <a href="#resume" className="nav-resume" onClick={closeMenu}>
          <Download size={14} aria-hidden="true" /> RESUME
        </a>
      </nav>

      <div className="header-actions">
        <button
          className="icon-button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={onThemeToggle}
        >
          {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
        </button>
        <button
          className="icon-button menu-button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}