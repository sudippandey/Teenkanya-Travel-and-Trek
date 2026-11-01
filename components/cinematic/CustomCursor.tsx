'use client';

import { useRef, useState, useEffect } from 'react';

/**
 * Custom cursor system - a small central dot with a larger animated outer ring.
 * Provides cursor-following movement with spring-like interpolation.
 * Respects prefers-reduced-motion.
 */
export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = (event: MouseEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  // Spring-like interpolation
  const interpolatedX = position.x * 0.15;
  const interpolatedY = position.y * 0.15;

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const tick = () => {
      dot.style.left = `${interpolatedX}px`;
      dot.style.top = `${interpolatedY}px`;
      ring.style.width = `${20 + Math.abs(interpolatedX) * 2}px`;
      ring.style.height = `${20 + Math.abs(interpolatedY) * 2}px`;
      requestAnimationFrame(tick);
    };

    tick();
    const timer = setInterval(tick, 16);
    return () => clearInterval(timer);
  }, [position.x, position.y]);

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  return (
    <div
      style={{ pointerEvents: 'none', position: 'fixed', zIndex: 9999 }}
      onMouseMove={(event: MouseEvent) => setPosition({ x: event.clientX, y: event.clientY })}>
      <div className="cursor-dot" ref={dotRef} style={{ left: `${position.x}px`, top: `${position.y}px` }} />
      <div className="cursor-ring" ref={ringRef} style={{ left: `${position.x - 10}px`, top: `${position.y - 10}px` }} />
    </div>
  );
}
