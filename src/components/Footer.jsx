import { ArrowUpRight, Cpu } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { footerLinks, siteConfig } from '../data/socials';

const socialIcons = {
  FaGithub,
  FaLinkedin,
  SiGmail,
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-brand">
        <span className="brand-mark" aria-hidden="true">
          <Cpu size={17} />
        </span>
        <span>{siteConfig.name}<span className="brand-dot">.</span>IT</span>
      </div>

      <div className="footer-tagline">
        {siteConfig.title}<br />
        {siteConfig.tagline}
      </div>

      <div className="footer-links" role="list" aria-label="Footer navigation">
        {footerLinks.map(({ label, href, external }) => {
          const Icon = socialIcons[label === 'GitHub' ? 'FaGithub' : label === 'LinkedIn' ? 'FaLinkedin' : 'SiGmail'];
          return (
            <a
              key={label}
              href={href}
              className="footer-link"
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              role="listitem"
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </a>
          );
        })}
      </div>

      <div className="footer-bottom">
        <span>© {year} {siteConfig.name}</span>
        <a href="#top" className="back-top">
          back to top <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}