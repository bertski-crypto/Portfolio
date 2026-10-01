import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Download } from 'lucide-react';

import { hoverSoft, tapSoft, useReduced } from '../utils/motion-primitives';
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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReduced();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // close on escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id, e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    setOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`} role="banner">
      <div className="navbar-inner">
        <motion.a
          className="navbar-brand"
          href="#top"
          aria-label="Albert — back to top"
          onClick={(e) => go('top', e)}
          whileHover={reduced ? undefined : { scale: 1.02 }}
          whileTap={tapSoft}
        >
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            whileHover={reduced ? undefined : { rotate: -6 }}
            transition={{ duration: 0.25 }}
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
          </motion.svg>
          <span>
            ALBERT<span className="brand-dot">.</span>IT
          </span>
        </motion.a>

        {/* ---------------- desktop nav ---------------- */}
        <nav className="navbar-nav" aria-label="Primary">
          <ul>
            {navItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => go(item.id, e)}
                    className={`nav-link ${active ? 'is-active' : ''}`}
                    aria-current={active ? 'true' : undefined}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        className="nav-indicator"
                        layoutId="nav-indicator"
                        transition={
                          reduced
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 380, damping: 32 }
                        }
                      />
                    )}
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href="#resume"
                onClick={(e) => go('resume', e)}
                className="nav-link nav-resume"
              >
                <Download size={13} aria-hidden="true" />
                RESUME
              </a>
            </li>
          </ul>
        </nav>

        {/* ---------------- actions ---------------- */}
        <div className="navbar-actions">
          <motion.button
            type="button"
            className="navbar-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={onThemeToggle}
            whileHover={hoverSoft}
            whileTap={tapSoft}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={reduced ? false : { rotate: -90, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { rotate: 90, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                className="navbar-btn-icon"
              >
                {theme === 'dark' ? (
                  <Sun size={18} aria-hidden="true" />
                ) : (
                  <Moon size={18} aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <motion.button
            type="button"
            className="navbar-btn navbar-menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((v) => !v)}
            whileHover={hoverSoft}
            whileTap={tapSoft}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'menu'}
                initial={reduced ? false : { rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={reduced ? undefined : { rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="navbar-btn-icon"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ---------------- mobile drawer ---------------- */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="primary-nav"
            className="navbar-drawer"
            aria-label="Mobile"
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul>
              {[...navItems, { id: 'resume', label: 'RESUME' }].map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={reduced ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : 0.03 * i, duration: 0.2 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => go(item.id, e)}
                    className={`drawer-link ${
                      activeSection === item.id ? 'is-active' : ''
                    }`}
                    aria-current={activeSection === item.id ? 'true' : undefined}
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}