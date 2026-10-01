import { ArrowUpRight, Cpu } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { footerLinks, siteConfig } from '../data/socials';
import '../styles/components/footer.css';

const socialIcons = { FaGithub, FaLinkedin, SiGmail };

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
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

        <ul className="footer-links" role="list" aria-label="Footer navigation">
          {footerLinks.map(({ label, href, external }) => {
            const Icon = socialIcons[label === 'GitHub' ? 'FaGithub' : label === 'LinkedIn' ? 'FaLinkedin' : 'SiGmail'];
            return (
              <li key={label}>
                <a
                  href={href}
                  className="footer-link"
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="footer-bottom">
        <span className="footer-copyright">© {year} {siteConfig.name}</span>
        <a href="#top" className="footer-top">
          back to top <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}