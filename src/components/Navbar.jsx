import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Download } from 'lucide-react';
import { socialLinks } from '../data/socials';
import '../styles/components/navbar.css';

const navItems = [
  { id: 'about', label: 'ABOUT' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'labs', label: 'NETWORKING' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'certifications', label: 'CERTIFICATIONS' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'education', label: 'EDUCATION' },
  { id: 'learning', label: 'LEARNING' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Navbar({ theme, onThemeToggle, activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const scrollToSection = (id, e) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} role="banner">
      <div className="navbar-inner">
        <a className="navbar-brand" href="#top" aria-label="Albert — Home" onClick={closeMenu}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
          </svg>
          <span>ALBERT<span className="brand-dot">.</span>IT</span>
        </a>

        <nav className={`navbar-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <ul style={{ display: 'flex', gap: 'var(--sp-5)', listStyle: 'none', padding: 0, margin: '0 auto var(--sp-5)' }}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(item.id, e)}
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#resume" className="nav-link" onClick={closeMenu}>
                <Download size={14} aria-hidden="true" style={{ marginRight: 6 }} /> RESUME
              </a>
            </li>
          </ul>
        </nav>

        <div className="navbar-actions">
          <button
            className="navbar-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={onThemeToggle}
          >
            {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <button
            className="navbar-btn navbar-menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}