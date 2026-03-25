// src/hooks/useCountUp.ts
import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration = 1400, start = true) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!start) return
    const startTime = performance.now()
    const step = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(ease * target))
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration, start])

  return value
}

export function useScrollReveal() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80)
          observer.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
    reveals.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
