export default function Navbar() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(2,4,8,0.75)',
        borderBottom: '1px solid rgba(99,179,255,0.12)',
        boxShadow: '0 1px 0 rgba(99,179,255,0.06)',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 1.5rem',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          className="font-script"
          style={{ fontSize: '1.5rem', color: 'var(--text)', cursor: 'default' }}
        >
          Jeffrey Hoang
        </span>

        <div style={{ display: 'flex', gap: '2rem' }}>
          {(['about', 'education', 'projects', 'connect'] as const).map(id => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--blue2)')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)')}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
