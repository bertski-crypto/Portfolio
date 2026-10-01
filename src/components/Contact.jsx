import { useState } from 'react';
import { Mail, Send, Check, ExternalLink } from 'lucide-react';
import { socialLinks } from '../data/socials';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import '../styles/components/contact.css';
import '../styles/components/bento.css';

const socialIcons = { FaGithub, FaLinkedin, SiGmail };

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateForm = (e) => {
    setSent(false);
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    if (!formState.email.includes('@')) return;

    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitting(false);
    setSent(true);
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="contact section-wrap" aria-labelledby="contact-heading">
      <div className="section-header">
        <div className="kicker">
          <span>09</span>
          <span>open channel</span>
        </div>
        <h2 id="contact-heading" className="heading-lg">Let&apos;s work<br /><em>together.</em></h2>
        <p className="muted">
          I'm open to discussing IT opportunities, technical projects, internships,
          junior roles, and collaboration.
        </p>
      </div>

      <div className="bento contact-bento">
        <article className="bento-item contact-info glass-card">
          <div className="contact-email">
            <Mail size={18} aria-hidden="true" style={{ color: 'var(--accent)' }} />
            <span>humanperson0816@gmail.com</span>
          </div>

          <div className="contact-links" role="list" aria-label="Contact links">
            {socialLinks.map(({ label, icon: IconName, href, external, ariaLabel }) => {
              const Icon = socialIcons[IconName];
              return (
                <a
                  key={label}
                  href={href}
                  className="contact-link"
                  aria-label={ariaLabel}
                  role="listitem"
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="contact-link-icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <span>{label}</span>
                  {external && <ExternalLink className="contact-link-external" size={13} aria-hidden="true" />}
                </a>
              );
            })}
          </div>
        </article>

        <article className="bento-item contact-form-card glass-card">
          <form className="contact-form" onSubmit={submitForm} noValidate>
            <div className="form-row">
              <label htmlFor="name">
                Name
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formState.name}
                  onChange={updateForm}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                />
              </label>
              <label htmlFor="email">
                Email
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={updateForm}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </label>
            </div>
            <label htmlFor="message">
              Message
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={updateForm}
                placeholder="Tell me a little about the opportunity..."
                rows="4"
                required
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary form-submit"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24" aria-hidden="true" style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  SEND MESSAGE <Send size={17} aria-hidden="true" />
                </>
              )}
            </button>
            {sent && (
              <p className="form-success" role="status" aria-live="polite">
                <Check size={15} aria-hidden="true" />
                Thanks for reaching out. This frontend form is ready to connect to a backend service.
              </p>
            )}
          </form>
        </article>
      </div>
    </section>
  );
}