import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, FileText } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

import { socialLinks, siteConfig } from '../data/socials';
import profileWebp from '../assets/images/albert-profile.webp';
import profileJpg from '../assets/images/albert-profile.jpg';

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
 * The greeting is animated word by word. We split off any trailing
 * punctuation so we can render the period in the accent colour without
 * ever doubling it up.
 */
const heroWords = siteConfig.heroIntro.replace(/\.+$/, '').split(/\s+/);
const heroPeriod = siteConfig.heroIntro.match(/\.+$/)?.[0] ?? '';

export default function Hero() {
  const reduced = useReduced();
  const isDesktop = useIsDesktop(1024);
  const { x: px, y: py, setX, setY } = usePointerParallax(3);

  // Static markup when reduced motion is on — no blur, no y, no loops.
  if (reduced) {
    return (
      <section className="hero section-wrap" aria-labelledby="hero-heading" id="top">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="status-dot" aria-hidden="true" />
              <span>{siteConfig.availabilityStatus}</span>
            </div>

            <h1 id="hero-heading" className="hero-title">
              {heroWords.map((word, i) => (
                <span key={i} style={{ display: 'inline-block' }}>
                  {word}
                  {i === heroWords.length - 1 && (
                    <span className="accent">{heroPeriod}</span>
                  )}
                  {' '}
                </span>
              ))}
            </h1>

            <p className="hero-professional-title">{siteConfig.title}</p>
            <p className="hero-tagline">{siteConfig.tagline}</p>
            <p className="hero-description">{siteConfig.description}</p>

            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">
                VIEW MY PROJECTS <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <a href="#contact" className="btn btn-ghost">
                <FileText size={15} aria-hidden="true" /> REQUEST RESUME
              </a>
            </div>

            <div className="hero-social" role="list" aria-label="Social links">
              {socialLinks.map(
                ({ label, icon: IconName, href, external, ariaLabel }) => {
                  const Icon = socialIcons[IconName];
                  return (
                    <a
                      key={label}
                      href={href}
                      className="social-btn"
                      aria-label={ariaLabel}
                      role="listitem"
                      {...(external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </a>
                  );
                },
              )}
            </div>
          </div>

          <div className="hero-visual">
            <div className="profile-frame">
              <picture>
                <source srcSet={profileWebp} type="image/webp" />
                <img
                  src={profileJpg}
                  alt="Professional portrait of Albert"
                  loading="eager"
                  decoding="async"
                  width="610"
                  height="714"
                />
              </picture>
            </div>

            <div className="hero-status" role="status" aria-live="polite">
              <div>
                <span className="status-dot" aria-hidden="true" />
                <span className="micro-label">STATUS</span>
              </div>
              <strong>
                {siteConfig.availabilityStatus.split(' ')[0]}
              </strong>
              <span>
                {siteConfig.availabilityStatus.split(' ').slice(1).join(' ')}
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
          <motion.div
            className="hero-eyebrow"
            variants={heroStep(0.0, 14)}
            initial="hidden"
            animate="show"
          >
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
              transition={{ duration: 2.4, repeat: Infinity, ease: EASE.inOut }}
            />
            <span>{siteConfig.availabilityStatus}</span>
          </motion.div>

          <motion.h1
            id="hero-heading"
            className="hero-title"
            variants={heroStep(0.1, 28)}
            initial="hidden"
            animate="show"
          >
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

          <motion.p
            className="hero-professional-title"
            variants={heroStep(0.18, 20)}
            initial="hidden"
            animate="show"
          >
            {siteConfig.title}
          </motion.p>

          <motion.p
            className="hero-tagline"
            variants={heroStep(0.22, 18)}
            initial="hidden"
            animate="show"
          >
            {siteConfig.tagline}
          </motion.p>

          <motion.p
            className="hero-description"
            variants={heroStep(0.26, 18)}
            initial="hidden"
            animate="show"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            className="hero-actions"
            variants={heroStep(0.36, 16)}
            initial="hidden"
            animate="show"
          >
            <motion.a
              href="#projects"
              className="btn btn-primary"
              whileHover={hoverPrimary}
              whileTap={tapSoft}
            >
              VIEW MY PROJECTS
              <motion.span variants={hoverIconShift(4)}>
                <ArrowUpRight size={16} aria-hidden="true" />
              </motion.span>
            </motion.a>

            <motion.a
              href="#contact"
              className="btn btn-ghost"
              whileHover={hoverSecondary}
              whileTap={tapSoft}
            >
              <FileText size={15} aria-hidden="true" /> REQUEST RESUME
            </motion.a>
          </motion.div>

          <motion.div
            className="hero-social"
            role="list"
            aria-label="Social links"
            variants={heroStep(0.45, 14)}
            initial="hidden"
            animate="show"
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.5 + i * 0.07,
                      duration: 0.45,
                      ease: EASE.entrance,
                    }}
                    whileHover={hoverSocial}
                    whileTap={tapSoft}
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
        <motion.div
          className="hero-visual"
          variants={heroStep(0.52, 24)}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="profile-frame"
            style={isDesktop ? { x: px, y: py } : undefined}
            variants={floatLoop}
            initial="hidden"
            animate="animate"
            whileHover={hoverProfile}
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
                whileHover={hoverZoom(1.02)}
              />
            </picture>

            {/* slow diagonal light sweep across the glass */}
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
          </motion.div>

          <motion.div
            className="hero-status"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.6, ease: EASE.entrance }}
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