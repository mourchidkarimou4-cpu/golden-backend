// src/components/ui/Slideshow.tsx
import { useState, useEffect } from 'react'

interface SlideshowProps {
  images: { url: string; label?: string; position?: string }[]
  height?: number | string
  interval?: number
  overlay?: string
  style?: React.CSSProperties
}

export function Slideshow({ images, height = 320, interval = 4000, overlay, style }: SlideshowProps) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => {
        setPrev(current)
        setCurrent(c => (c + 1) % images.length)
        setTransitioning(false)
      }, 800)
    }, interval)
    return () => clearInterval(timer)
  }, [current, images.length, interval])

  return (
    <div style={{ position: 'relative', height, overflow: 'hidden', ...style }}>

      {/* Previous image fading out */}
      {prev !== null && transitioning && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          backgroundImage: `url(${images[prev].url})`,
          backgroundSize: 'cover',
          backgroundPosition: images[prev].position ?? 'center',
          opacity: 0,
          transition: 'opacity .8s ease',
        }} />
      )}

      {/* Current image */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        backgroundImage: `url(${images[current].url})`,
        backgroundSize: 'cover',
        backgroundPosition: images[current].position ?? 'center',
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'scale(1.03)' : 'scale(1)',
        transition: 'opacity .8s ease, transform 4s ease',
      }} />

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        background: overlay ?? 'linear-gradient(135deg, rgba(6,6,4,.85) 0%, rgba(6,6,4,.5) 60%, rgba(201,168,76,.06) 100%)',
      }} />

      {/* Gold top line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 4,
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,.5), transparent)',
      }} />

      {/* Label */}
      {images[current].label && (
        <div style={{
          position: 'absolute', bottom: 14, left: 16, zIndex: 4,
          fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase',
          color: 'rgba(201,168,76,.7)',
          opacity: transitioning ? 0 : 1,
          transition: 'opacity .4s ease',
        }}>
          {images[current].label}
        </div>
      )}

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: 14, right: 14, zIndex: 4,
        display: 'flex', gap: 6,
      }}>
        {images.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? 18 : 6,
            height: 6,
            background: i === current ? '#C9A84C' : 'rgba(201,168,76,.3)',
            borderRadius: 3,
            cursor: 'pointer',
            transition: 'all .3s ease',
          }} />
        ))}
      </div>

      {/* Slide counter */}
      <div style={{
        position: 'absolute', top: 14, right: 14, zIndex: 4,
        fontSize: 9, letterSpacing: '.1em', color: 'rgba(201,168,76,.5)',
        fontFamily: '"Cormorant Garamond",serif',
      }}>
        {String(current + 1).padStart(2,'0')} / {String(images.length).padStart(2,'0')}
      </div>
    </div>
  )
}
