import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Download, FileText } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

import { socialLinks, siteConfig } from '../data/socials';
import profileWebp from '../assets/images/albert-profile.webp';
import profileJpg from '../assets/images/albert-profile.jpg';

import HeroNetwork from './HeroNetwork';
import {
  EASE,
  floatLoop,
  heroStep,
  hoverIconShift,
  hoverPrimary,
  hoverProfile,
  hoverSecondary,
  hoverSocial,
  hoverZoom,
  tapSoft,
} from '../utils/motion';
import {
  useIsDesktop,
  usePointerParallax,
  useReduced,
} from '../utils/motion-primitives';

import '../styles/components/hero.css';

const socialIcons = { FaGithub, FaLinkedin, SiGmail };

/**
 * The name is animated word by word. We split off any trailing
 * punctuation so we can render it in the accent colour without
 * ever doubling it up.
 */
const heroWords = siteConfig.heroIntro.replace(/\.+$/, '').split(/\s+/);
const heroPeriod = siteConfig.heroIntro.match(/\.+$/)?.[0] ?? '';

/* Motes drifting across the portrait. Kept deliberately sparse so the
   photo stays readable. */
const MOTE_COUNT = 18;

/** Deterministic pseudo-random so the build never mismatches. */
function makeRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function HeroMotes() {
  const reduced = useReduced();

  const motes = useMemo(() => {
    const rand = makeRandom(20261002); // stable seed
    return Array.from({ length: MOTE_COUNT }, (_, i) => ({
      id: i,
      left: 5 + rand() * 90,
      top: 5 + rand() * 90,
      size: 1 + rand() * 2.4,
      opacity: 0.18 + rand() * 0.42,
      duration: 9 + rand() * 12,
      delay: -rand() * 16,
      drift: 10 + rand() * 18,
    }));
  }, []);

  if (reduced) return null;

  return (
    <div className="hero-motes" aria-hidden="true">
      {motes.map((m) => (
        <motion.span
          key={m.id}
          className="hero-mote"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            opacity: m.opacity,
          }}
          animate={{ x: [0, m.drift * 0.35, 0], y: [0, -m.drift, 0] }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            ease: EASE.inOut,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const reduced = useReduced();
  const isDesktop = useIsDesktop(1024);
  const { x: px, y: py, setX, setY } = usePointerParallax(3);

  const hasResume = siteConfig.resumeExists;
  const resumePath = `/${siteConfig.resumeFileName}`;

  // Reduced motion renders the final state directly and drops every
  // hover / tap / loop, so the markup stays a single tree.
  const enter = (delay, y) => ({
    initial: reduced ? false : 'hidden',
    animate: 'show',
    variants: heroStep(delay, y),
  });
  const hov = (value) => (reduced ? undefined : value);

  const resumeCta = hasResume
    ? {
        href: resumePath,
        download: siteConfig.resumeFileName,
        label: 'DOWNLOAD RESUME',
        Icon: Download,
      }
    : { href: '#contact', label: 'REQUEST RESUME', Icon: FileText };
  const ResumeIcon = resumeCta.Icon;

  const onMove = (e) => {
    if (!isDesktop) return;
    const r = e.currentTarget.getBoundingClientRect();
    setX(((e.clientX - r.left) / r.width) * 2 - 1);
    setY(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section className="hero section-wrap" aria-labelledby="hero-heading" id="top">
      <div className="hero-container">
        {/* ------------------------------- TEXT COLUMN ------------------- */}
        <div className="hero-content" onPointerMove={onMove}>
          <motion.div className="hero-eyebrow" {...enter(0.0, 14)}>
            {!reduced && (
              <motion.span
                className="status-dot"
                aria-hidden="true"
                animate={{
                  boxShadow: [
                    '0 0 0 3px rgba(77,163,255,0.18)',
                    '0 0 0 7px rgba(77,163,255,0.30)',
                    '0 0 0 3px rgba(77,163,255,0.18)',
                  ],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: EASE.inOut,
                }}
              />
            )}
            {reduced && <span className="status-dot" aria-hidden="true" />}
            <span>{siteConfig.availabilityStatus}</span>
          </motion.div>

          <motion.h1 id="hero-heading" className="hero-title" {...enter(0.1, 28)}>
            {heroWords.map((word, i) => (
              <span key={i} style={{ display: 'inline-block' }}>
                {word}
                {i === heroWords.length - 1 && (
                  <span className="accent">{heroPeriod}</span>
                )}
                {' '}
              </span>
            ))}
          </motion.h1>

          <motion.p className="hero-professional-title" {...enter(0.18, 20)}>
            {siteConfig.title}
          </motion.p>

          <motion.p className="hero-tagline" {...enter(0.22, 18)}>
            {siteConfig.tagline}
          </motion.p>

          <motion.p className="hero-description" {...enter(0.26, 18)}>
            {siteConfig.description}
          </motion.p>

          <motion.div className="hero-actions" {...enter(0.36, 16)}>
            <motion.a
              href="#projects"
              className="btn btn-primary"
              whileHover={hov(hoverPrimary)}
              whileTap={hov(tapSoft)}
            >
              VIEW PROJECTS
              <motion.span variants={hov(hoverIconShift(4))}>
                <ArrowUpRight size={16} aria-hidden="true" />
              </motion.span>
            </motion.a>

            <motion.a
              href={resumeCta.href}
              className="btn btn-ghost"
              whileHover={hov(hoverSecondary)}
              whileTap={hov(tapSoft)}
              {...(resumeCta.download ? { download: resumeCta.download } : {})}
            >
              <ResumeIcon size={15} aria-hidden="true" /> {resumeCta.label}
            </motion.a>
          </motion.div>

          <motion.div
            className="hero-social"
            role="list"
            aria-label="Social links"
            {...enter(0.45, 14)}
          >
            {socialLinks.map(
              ({ label, icon: IconName, href, external, ariaLabel }, i) => {
                const Icon = socialIcons[IconName];
                return (
                  <motion.a
                    key={label}
                    href={href}
                    className="social-btn"
                    aria-label={ariaLabel}
                    role="listitem"
                    initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: reduced ? 0 : 0.5 + i * 0.07,
                      duration: 0.45,
                      ease: EASE.entrance,
                    }}
                    whileHover={hov(hoverSocial)}
                    whileTap={hov(tapSoft)}
                    {...(external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </motion.a>
                );
              },
            )}
          </motion.div>
        </div>

        {/* ------------------------------ MEDIA COLUMN ------------------- */}
        <motion.div className="hero-visual" {...enter(0.52, 24)}>
          <div className="hero-stage">
            <HeroNetwork />

            <motion.div
              className="profile-frame"
              style={isDesktop ? { x: px, y: py } : undefined}
              {...(reduced
                ? {}
                : { variants: floatLoop, initial: 'hidden', animate: 'animate' })}
              whileHover={hov(hoverProfile)}
            >
              <picture>
                <source srcSet={profileWebp} type="image/webp" />
                <motion.img
                  src={profileJpg}
                  alt="Professional portrait of Albert"
                  loading="eager"
                  decoding="async"
                  width="610"
                  height="714"
                  whileHover={hov(hoverZoom(1.02))}
                />
              </picture>

              <HeroMotes />

              {/* slow diagonal light sweep across the glass */}
              {!reduced && (
                <motion.div
                  className="glass-reflection"
                  initial={{ x: '-110%' }}
                  animate={{ x: ['-110%', '110%'] }}
                  transition={{
                    duration: 7.5,
                    ease: EASE.inOut,
                    repeat: Infinity,
                    repeatDelay: 4,
                  }}
                />
              )}
            </motion.div>
          </div>

          <motion.div
            className="hero-status"
            role="status"
            aria-live="polite"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduced ? 0 : 0.72,
              duration: 0.6,
              ease: EASE.entrance,
            }}
          >
            <div>
              <span className="status-dot" aria-hidden="true" />
              <span className="micro-label">STATUS</span>
            </div>
            <strong>{siteConfig.availabilityStatus.split(' ')[0]}</strong>
            <span>
              {siteConfig.availabilityStatus.split(' ').slice(1).join(' ')}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}