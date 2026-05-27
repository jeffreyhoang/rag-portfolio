import { motion, type Easing } from 'framer-motion'

const EASE: Easing = 'easeOut'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: EASE },
})

export default function Hero() {
  return (
    <section
      id="about"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '6rem 1.5rem 3rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Availability badge */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: '2rem' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            border: '1px solid rgba(59,130,246,0.35)',
            borderRadius: 999,
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--blue2)',
            background: 'rgba(59,130,246,0.07)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 6px #22c55e',
              animation: 'dot-pulse 2s ease-in-out infinite',
            }}
          />
          Available for opportunities
        </span>
      </motion.div>

      {/* Avatar */}
      <motion.div {...fadeUp(0.1)} style={{ marginBottom: '1.75rem' }}>
        <div
          style={{
            width: 146,
            height: 146,
            borderRadius: '50%',
            padding: 3,
            background: 'conic-gradient(from 0deg, #3b82f6, #7c3aed, #3b82f6)',
            animation: 'spin-slow 8s linear infinite',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e3a5f, #2d1b69)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.5rem',
              overflow: 'hidden',
            }}
          >
            {/* Placeholder avatar — replace with <img> when avatar.jpg is added */}
            👨‍💻
          </div>
        </div>
      </motion.div>

      {/* Name */}
      <motion.h1
        {...fadeUp(0.2)}
        className="font-cinzel gradient-text"
        style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 700, marginBottom: '0.6rem' }}
      >
        Jeffrey Hoang
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        {...fadeUp(0.3)}
        style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--blue2)',
          marginBottom: '1.25rem',
        }}
      >
        ML Engineer · AI Developer
      </motion.p>

      {/* Bio */}
      <motion.p
        {...fadeUp(0.4)}
        style={{
          maxWidth: 560,
          color: 'var(--muted)',
          fontSize: '1rem',
          lineHeight: 1.75,
          marginBottom: '2rem',
        }}
      >
        Currently pursuing a Master's in Computer Science at SJSU, passionate about building
        scalable, efficient, and user-friendly systems that leverage AI to deliver real-world impact.
      </motion.p>

      {/* Buttons */}
      <motion.div
        {...fadeUp(0.5)}
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}
      >
        <a href="#" className="btn-primary">
          Resume ↗
        </a>
        <button
          className="btn-outline"
          onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Let's Connect
        </button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{ position: 'absolute', bottom: '2rem' }}
      >
        <div className="bounce-arrow" style={{ fontSize: '1.25rem', color: 'var(--muted)' }}>
          ↓
        </div>
      </motion.div>
    </section>
  )
}
