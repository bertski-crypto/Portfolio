import { motion } from 'framer-motion';
import { ArrowUp, Cpu } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

import { footerLinks, siteConfig } from '../data/socials';
import {
  Reveal,
  Stagger,
  StaggerItem,
  hoverIconShift,
  hoverSocial,
  tapSoft,
} from '../utils/motion-primitives';
import '../styles/components/footer.css';

const socialIcons = { FaGithub, FaLinkedin, SiGmail };

// footerLinks are keyed by human label — map them to the icon components.
// Never index socialIcons[label] directly or Icon will be undefined.
const ICON_BY_LABEL = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  Email: SiGmail,
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <Stagger className="footer-inner" gap={0.1}>
        <StaggerItem className="footer-brand">
          <motion.span
            className="brand-mark"
            aria-hidden="true"
            whileHover={{ scale: 1.08, rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <Cpu size={17} />
          </motion.span>
          <span>
            {siteConfig.name}
            <span className="brand-dot">.</span>IT
          </span>
        </StaggerItem>

        <StaggerItem className="footer-tagline">
          <span>{siteConfig.title}</span>
          <span>{siteConfig.tagline}</span>
        </StaggerItem>

        <StaggerItem className="footer-links-slot">
          <ul className="footer-links" aria-label="Footer navigation">
            {footerLinks.map(({ label, href, external }) => {
              const Icon = ICON_BY_LABEL[label] ?? socialIcons.FaGithub;
              return (
                <li key={label}>
                  <motion.a
                    href={href}
                    className="footer-link"
                    whileHover={hoverSocial}
                    whileTap={tapSoft}
                    {...(external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    <span className="footer-link-icon" aria-hidden="true">
                      <Icon size={15} />
                    </span>
                    {label}
                  </motion.a>
                </li>
              );
            })}
          </ul>
        </StaggerItem>
      </Stagger>

      {/* viewportMargin: this row is the last content on the page, so the
          default -80px bottom root margin leaves it permanently below the
          observer's edge and it would never reveal. Without this, the
          copyright and the back-to-top link stay at opacity 0 forever. */}
      <Reveal
        kind="lead"
        className="footer-bottom"
        delay={0.05}
        viewportMargin="0px"
      >
        <span className="footer-copyright">
          © {year} {siteConfig.name}
        </span>

        <motion.a
          href="#top"
          className="footer-top"
          whileHover={{ y: -2 }}
          whileTap={tapSoft}
        >
          back to top
          <motion.span variants={hoverIconShift(0, -2)}>
            <ArrowUp size={12} aria-hidden="true" />
          </motion.span>
        </motion.a>
      </Reveal>
    </footer>
  );
}