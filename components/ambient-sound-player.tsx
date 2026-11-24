'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Play, Square, Volume2, Waves } from 'lucide-react'

export function AmbientSoundPlayer() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 420)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [pathname])

  if (pathname === '/contact') return null

  return (
    <aside className={`ambient-sound-player${isVisible ? ' is-visible' : ''}`} aria-label="Himalayan nature soundscape" aria-hidden={!isVisible}>
      <div className="ambient-sound-heading">
        <span className="ambient-sound-icon"><Waves aria-hidden="true" /></span>
        <div>
          <p>Listen to the Himalayas</p>
          <span>Nature recordings coming soon</span>
        </div>
      </div>
      <div className="ambient-sound-controls" role="group" aria-label="Sound controls">
        <button type="button" disabled aria-label="Play Himalayan nature sounds. Audio is not available yet.">
          <Play aria-hidden="true" />
        </button>
        <label className="sr-only" htmlFor="ambient-volume">Volume</label>
        <input id="ambient-volume" type="range" min="0" max="100" defaultValue="45" disabled aria-label="Volume. Audio is not available yet." />
        <Volume2 aria-hidden="true" />
        <button type="button" disabled aria-label="Stop Himalayan nature sounds. Audio is not available yet.">
          <Square aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}
