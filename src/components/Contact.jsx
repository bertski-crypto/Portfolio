import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Send, Check, ExternalLink } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

import { socialLinks } from '../data/socials';
import {
  Reveal,
  SectionHeader,
  SectionTitle,
  Stagger,
  StaggerItem,
  hoverCard,
  hoverIconShift,
  hoverIconPop,
  hoverPrimary,
  hoverSocial,
  hoverSoft,
  tapSoft,
} from '../utils/motion-primitives';
import '../styles/components/contact.css';

const socialIcons = { FaGithub, FaLinkedin, SiGmail };

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const update = (e) => {
    setSent(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    if (!form.email.includes('@')) return;

    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    setBusy(false);
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="contact section-wrap" aria-labelledby="contact-heading">
      <SectionHeader className="section-header">
        <SectionTitle num="09" kicker="open channel" id="contact-heading">
          Let&apos;s work
          <br />
          <em>together.</em>
        </SectionTitle>
        <Reveal kind="lead" as="p" delay={0.08} className="muted">
          I'm open to discussing IT opportunities, technical projects,
          internships, junior roles, and collaboration.
        </Reveal>
      </SectionHeader>

      <Stagger className="contact-bento" gap={0.12}>
        {/* ---------------------- info card ---------------------- */}
        <StaggerItem className="contact-slot contact-slot--info">
          <motion.aside
            className="contact-info glass-card"
            aria-label="Contact channels"
            whileHover={hoverCard}
          >
            <motion.a
              className="contact-email"
              href="mailto:humanperson0816@gmail.com"
              whileHover={hoverSoft}
              whileTap={tapSoft}
            >
              <Mail size={18} aria-hidden="true" />
              <span>humanperson0816@gmail.com</span>
            </motion.a>

            <Stagger className="contact-links" gap={0.08} role="list">
              {socialLinks.map(({ label, icon: IconName, href, external, ariaLabel }) => {
                const Icon = socialIcons[IconName];
                return (
                  <StaggerItem key={label} as="div">
                    <motion.a
                      href={href}
                      className="contact-link"
                      aria-label={ariaLabel}
                      role="listitem"
                      whileHover={hoverSocial}
                      whileTap={tapSoft}
                      {...(external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      <motion.span
                        className="contact-link-icon"
                        aria-hidden="true"
                        whileHover={hoverIconPop(1.06, -2)}
                      >
                        <Icon size={20} />
                      </motion.span>
                      <span>{label}</span>
                      {external && (
                        <motion.span
                          className="contact-link-arrow"
                          variants={hoverIconShift(3)}
                          aria-hidden="true"
                        >
                          <ExternalLink size={13} />
                        </motion.span>
                      )}
                    </motion.a>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </motion.aside>
        </StaggerItem>

        {/* ---------------------- form card ---------------------- */}
        <StaggerItem className="contact-slot contact-slot--form">
          <motion.div className="contact-form-card glass-card" whileHover={hoverCard}>
            <form className="contact-form" onSubmit={submit} noValidate>
              <Stagger className="form-row" gap={0.08}>
                <StaggerItem className="form-field">
                  <label htmlFor="name">
                    Name
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={update}
                      placeholder="Your name"
                      required
                      autoComplete="name"
                    />
                  </label>
                </StaggerItem>

                <StaggerItem className="form-field">
                  <label htmlFor="email">
                    Email
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={update}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                    />
                  </label>
                </StaggerItem>
              </Stagger>

              <Reveal kind="item" delay={0.16}>
                <label className="form-field" htmlFor="message">
                  Message
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={update}
                    placeholder="Tell me a little about the opportunity..."
                    rows="4"
                    required
                  />
                </label>
              </Reveal>

              <Reveal kind="item" delay={0.22}>
                <motion.button
                  type="submit"
                  className="btn btn-primary form-submit"
                  disabled={busy}
                  aria-busy={busy}
                  whileHover={hoverPrimary}
                  whileTap={tapSoft}
                >
                  {busy ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      SEND MESSAGE
                      <motion.span variants={hoverIconShift(4)}>
                        <Send size={17} aria-hidden="true" />
                      </motion.span>
                    </>
                  )}
                </motion.button>
              </Reveal>

              {sent && (
                <motion.p
                  className="form-success"
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  <Check size={15} aria-hidden="true" />
                  Thanks for reaching out. This frontend form is ready to connect
                  to a backend service.
                </motion.p>
              )}
            </form>
          </motion.div>
        </StaggerItem>
      </Stagger>
    </section>
  );
}