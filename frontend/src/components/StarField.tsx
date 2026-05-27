import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  speed: number
  phase: number
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const STAR_COUNT = 200

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.2 + Math.random() * 1.4,
      speed: 0.08 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
    }))

    let animId: number
    let t = 0

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const s of stars) {
        const opacity = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.015 + s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${opacity})`
        ctx.fill()

        s.y -= s.speed
        if (s.y + s.r < 0) {
          s.y = canvas.height + s.r
          s.x = Math.random() * canvas.width
        }
      }
      t++
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
