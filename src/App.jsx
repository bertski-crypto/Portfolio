import { useEffect, useState, useRef } from 'react';
import Ambient from './components/Ambient';
import ThreeDBackground from './components/ThreeDBackground';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import NetworkingLabs from './components/NetworkingLabs';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Experience from './components/Experience';
import Education from './components/Education';
import CurrentlyLearning from './components/CurrentlyLearning';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ScrollContext } from './context/ScrollContext';

const sectionIds = [
  'top',
  'about',
  'projects',
  'labs',
  'skills',
  'certifications',
  'experience',
  'education',
  'learning',
  'resume',
  'contact',
];

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');
  const [activeSection, setActiveSection] = useState('top');
  const mainRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1,
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ScrollContext.Provider value={mainRef}>
      <div className="site-shell">
        <ThreeDBackground />
        <Ambient />
        <ScrollProgress />

        <Navbar
          theme={theme}
          onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          activeSection={activeSection}
        />

        <main id="top" ref={mainRef} className="snap-container">
          <Hero />
          <About />
          <Projects />
          <NetworkingLabs />
          <Skills />
          <Certifications />
          <Experience />
          <Education />
          <CurrentlyLearning />
          <Resume />
          <Contact />
          <Footer />
        </main>
      </div>
    </ScrollContext.Provider>
  );
}
