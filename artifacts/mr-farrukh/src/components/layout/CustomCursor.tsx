import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const pos = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);

  // Only show on fine-pointer (mouse) devices, honour reduced-motion
  const isFinePointer = typeof window !== 'undefined'
    ? window.matchMedia('(pointer: fine)').matches
    : false;
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    if (!isFinePointer) return; // touch/coarse devices keep native cursor

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement;
      setIsHovering(
        !!(target.closest('a') ||
           target.closest('button') ||
           target.closest('input') ||
           target.closest('textarea') ||
           target.closest('[role="button"]') ||
           target.closest('select'))
      );
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    const loop = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`;
      }

      if (!prefersReducedMotion) {
        // Smooth lerp for ring
        ring.current.x += (pos.current.x - ring.current.x) * 0.12;
        ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      } else {
        // Skip easing for reduced-motion — snap ring to cursor
        ring.current.x = pos.current.x;
        ring.current.y = pos.current.y;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`;
      }

      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [isFinePointer, prefersReducedMotion, visible]);

  // Don't render at all on non-mouse devices
  if (!isFinePointer) return null;

  return (
    <>
      {/* Small filled dot — snaps to cursor position */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'hsl(217 91% 60%)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: visible ? (isHovering ? 0 : 0.9) : 0,
          transition: 'opacity 0.15s ease',
          willChange: 'transform',
        }}
      />
      {/* Outer ring — lags behind with lerp */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? 40 : 32,
          height: isHovering ? 40 : 32,
          marginLeft: isHovering ? -4 : 0,
          marginTop: isHovering ? -4 : 0,
          borderRadius: '50%',
          border: `1px solid ${isHovering ? 'hsl(217 91% 60% / 0.7)' : 'hsl(217 91% 60% / 0.3)'}`,
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: visible ? 1 : 0,
          transition: 'width 0.2s ease, height 0.2s ease, margin 0.2s ease, border-color 0.15s ease, opacity 0.3s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
}
