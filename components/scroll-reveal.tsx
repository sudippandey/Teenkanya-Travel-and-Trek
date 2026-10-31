'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    setReady(true)
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal${ready && !visible ? ' is-pending' : ''}${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
