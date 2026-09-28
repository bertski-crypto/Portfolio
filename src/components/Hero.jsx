import { ArrowUpRight, Download, FileText } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { socialLinks, siteConfig } from '../data/socials';
import profileImage from '../assets/images/albert-profile.png';

export default function Hero() {
  const socialIcons = {
    FaGithub,
    FaLinkedin,
    SiGmail,
  };

  return (
    <section className="hero section-wrap" aria-labelledby="hero-heading" id="top">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="live-dot" aria-hidden="true" />
          <span>{siteConfig.availabilityStatus}</span>
        </div>
        <h1 id="hero-heading">
          {siteConfig.heroIntro.split(' ').map((word, i) => (
            <span key={i} style={{ display: 'inline-block' }}>
              {word}
              {i === 2 && <span className="accent">.</span>}
              {' '}
            </span>
          ))}
        </h1>
        <p className="hero-lede">{siteConfig.tagline}</p>
        <p className="hero-description">{siteConfig.description}</p>
        <div className="hero-actions">
          <a href="#projects" className="button button-primary">
            VIEW MY PROJECTS <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a href="#contact" className="button button-quiet">
            <FileText size={16} aria-hidden="true" /> REQUEST RESUME
          </a>
        </div>
        <div className="hero-social" role="list" aria-label="Social links">
          {socialLinks.map(({ label, icon: IconName, href, external, ariaLabel }) => {
            const Icon = socialIcons[IconName];
            return (
              <a
                key={label}
                href={href}
                className="social-link"
                aria-label={ariaLabel}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="sr-only">{label}</span>
              </a>
            );
          })}
        </div>
      </div>

      <div className="hero-aside">
        <div className="profile-visual">
          <img
            src={profileImage}
            alt="Professional portrait of Albert"
            loading="eager"
            width="340"
            height="400"
          />
        </div>
        <div className="status-panel" role="status" aria-live="polite">
          <div>
            <span className="status-dot" aria-hidden="true" />
            <span className="micro-label">STATUS</span>
          </div>
          <strong>{siteConfig.availabilityStatus.split(' ')[0]}</strong>
          <span className="panel-note">{siteConfig.availabilityStatus.split(' ').slice(1).join(' ')}</span>
        </div>
      </div>
    </section>
  );
}