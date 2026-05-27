import { motion } from 'framer-motion'

const schools = [
  {
    name: 'San Jose State University',
    degree: 'Master of Science in Computer Science',
    period: 'Jan 2026 – Present',
    location: 'San Jose, CA',
    gpa: null,
    awards: [],
    notes: 'Machine Learning · AI · Data Engineering',
  },
  {
    name: 'California State Polytechnic University, Pomona',
    degree: 'Bachelor of Science in Computer Science',
    period: 'Aug 2022 – Dec 2025',
    location: 'Pomona, CA',
    gpa: '3.91/4.0',
    awards: ["Dean's List", "President's List (all semesters)"],
    notes: '',
  },
]

export default function Education() {
  return (
    <section id="education" style={{ background: 'var(--bg2)', position: 'relative', zIndex: 1 }}>
      <div className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-tag">Academic Background</p>
          <h2 className="section-title font-cinzel">Education</h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {schools.map((s, i) => (
            <motion.div
              key={s.name}
              className="card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  marginBottom: '1rem',
                }}
              >
                🎓
              </div>

              <h3
                className="font-cinzel"
                style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text)' }}
              >
                {s.name}
              </h3>

              <p style={{ color: 'var(--blue2)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>
                {s.degree}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="tag">{s.period}</span>
                <span className="tag">{s.location}</span>
                {s.gpa && (
                  <span
                    className="tag"
                    style={{
                      background: 'rgba(34,197,94,0.1)',
                      borderColor: 'rgba(34,197,94,0.3)',
                      color: '#4ade80',
                    }}
                  >
                    GPA {s.gpa}
                  </span>
                )}
                {s.awards.map(a => (
                  <span key={a} className="tag">{a}</span>
                ))}
              </div>

              {s.notes && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--muted)' }}>
                  {s.notes}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
