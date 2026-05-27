import { motion } from 'framer-motion'
import { useState } from 'react'

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

export default function Connect() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  return (
    <section id="connect" style={{ background: 'var(--bg2)', position: 'relative', zIndex: 1 }}>
      <div className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-tag">Say Hello</p>
          <h2 className="section-title font-cinzel">Connect</h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Contact form */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
            />
            <textarea
              className="form-input"
              name="message"
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={handleChange}
            />
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Send Message
            </button>
          </motion.div>

          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <h3
              className="font-cinzel"
              style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}
            >
              Get In Touch
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              I'm open to collaboration, research, and internship opportunities.
            </p>

            {/* Email card */}
            <div className="card" style={{ padding: '1rem 1.25rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Email
              </p>
              <a
                href="mailto:hoangjeffrey04@gmail.com"
                style={{ color: 'var(--blue2)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}
              >
                hoangjeffrey04@gmail.com
              </a>
            </div>

            {/* Location card */}
            <div className="card" style={{ padding: '1rem 1.25rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Location
              </p>
              <p style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>
                San Jose, California, USA
              </p>
            </div>

            {/* Socials */}
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Socials
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a href="https://github.com/jeffreyhoang" target="_blank" rel="noreferrer" className="social-btn" title="GitHub">
                  <GithubIcon />
                </a>
                <a href="https://linkedin.com/in/jeffrey-hoang-095664260" target="_blank" rel="noreferrer" className="social-btn" title="LinkedIn">
                  <LinkedInIcon />
                </a>
                <a href="mailto:hoangjeffrey04@gmail.com" className="social-btn" title="Email">
                  <EmailIcon />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
