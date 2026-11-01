'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useGSAP(() => {
    const cursor = cursorRef.current;
    const body = document.body;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!cursor || !finePointer.matches || reducedMotion.matches) return;

    const moveX = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power3.out' });
    const moveY = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power3.out' });
    const onPointerMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
      cursor.classList.add('is-visible');
    };
    const findTarget = (target: EventTarget | null) => target instanceof Element ? target.closest<HTMLElement>('[data-cursor-label]') : null;
    const onPointerOver = (event: PointerEvent) => {
      const target = findTarget(event.target);
      if (!target) return;
      setLabel(target.dataset.cursorLabel ?? '');
      cursor.classList.add('is-active');
    };
    const onPointerOut = (event: PointerEvent) => {
      const leaving = findTarget(event.target);
      const entering = findTarget(event.relatedTarget);
      if (!leaving || leaving === entering) return;
      if (entering) {
        setLabel(entering.dataset.cursorLabel ?? '');
        return;
      }
      setLabel('');
      cursor.classList.remove('is-active');
    };

    body.classList.add('custom-cursor-enabled');
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);
    return () => {
      body.classList.remove('custom-cursor-enabled');
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
    };
  }, { scope: cursorRef });

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <span className="custom-cursor-ring" />
      <span className="custom-cursor-label">{label}</span>
    </div>
  );
}
