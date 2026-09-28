import { useEffect, useState, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import NetworkingLabs from './components/NetworkingLabs';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import CurrentlyLearning from './components/CurrentlyLearning';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';

const sectionIds = [
  'about',
  'projects',
  'labs',
  'skills',
  'experience',
  'education',
  'learning',
  'resume',
  'contact',
];

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');
  const [activeSection, setActiveSection] = useState('about');
  const observerRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1,
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    observerRef.current = observer;
    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <Navbar
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        activeSection={activeSection}
      />

      <main id="top">
        <Hero />
        <About />
        <Projects />
        <NetworkingLabs />
        <Skills />
        <Experience />
        <Education />
        <CurrentlyLearning />
        <Resume />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}