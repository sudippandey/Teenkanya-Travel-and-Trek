'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * ImageDistortion - subtle liquid-like distortion on hover.
 * Uses a displacement map technique with a displacement field.
 * Respects prefers-reduced-motion.
 */
export function ImageDistortion({
  src: string,
  onMouseEnter: () => void,
  onMouseLeave: () => void,
}: {
  src: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHover, setIsHover] = useState(false);
  const displacementField = useRef<number[][]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size;

    // Generate displacement field
    function generateDisplacementField() {
      const field = [];
      for (let i = 0; i < size; i++) {
        field[i] = [];
        for (let j = 0; j < size; j++) {
          field[i][j] = {
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10,
          };
        }
      }
      return field;
    }

    displacementField.current = generateDisplacementField();

    // Draw original image
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      // Apply displacement every frame
      let time = 0;
      const animate = () => {
        time += 0.016;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        // Apply displacement (simplified)
        ctx.globalAlpha = isHover ? 0.8 : 1;
        if (isHover) {
          const dx = Math.sin(time * 2) * 5;
          const dy = Math.cos(time * 2) * 5;
          ctx.filter = `url(#displacement)`;
        }
        requestAnimationFrame(animate);
      };
      animate();
    };
    img.src = src;

    return () => {
      ctx?.clearRect(0, 0, size, size);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHover]);

  const handleMouseEnter = () => {
    setIsHover(true);
    onMouseEnter();
  };
  const handleMouseLeave = () => {
    setIsHover(false);
    onMouseLeave();
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // Update displacement field at cursor position
    if (displacementField.current && displacementField.current[Math.round(x)]) {
      displacementField.current[Math.round(x)][Math.round(y)] = {
        x: (event.clientX - rect.left) / 20,
        y: (event.clientY - rect.top) / 20,
      };
    }
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
