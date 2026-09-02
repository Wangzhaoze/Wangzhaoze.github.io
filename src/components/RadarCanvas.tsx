'use client';

import { useEffect, useRef } from 'react';

type Point = { x: number; y: number; depth: number; phase: number; speed: number };

export default function RadarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let mouseX = 0;
    let mouseY = 0;
    const points: Point[] = Array.from({ length: 78 }, (_, i) => ({
      x: ((i * 47) % 100) / 100,
      y: ((i * 83) % 100) / 100,
      depth: 0.35 + ((i * 29) % 65) / 100,
      phase: (i * 0.71) % (Math.PI * 2),
      speed: 0.25 + ((i * 17) % 50) / 100,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (event: PointerEvent) => {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const cx = width * (0.68 + mouseX * 0.015);
      const cy = height * (0.66 + mouseY * 0.015);

      ctx.save();
      ctx.strokeStyle = 'rgba(202, 255, 233, 0.09)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 7; i += 1) {
        const y = height * 0.53 + i * height * 0.075;
        ctx.beginPath();
        ctx.moveTo(width * 0.38, y);
        ctx.lineTo(width * 1.04, y + (i - 3) * 11);
        ctx.stroke();
      }
      for (let i = 0; i < 9; i += 1) {
        const x = width * 0.44 + i * width * 0.08;
        ctx.beginPath();
        ctx.moveTo(x, height * 0.48);
        ctx.lineTo(cx + (x - cx) * 1.8, height * 1.05);
        ctx.stroke();
      }

      const pulse = ((time * 0.00014) % 1) * Math.min(width, height) * 0.56;
      ctx.strokeStyle = 'rgba(154, 255, 221, 0.16)';
      ctx.beginPath();
      ctx.arc(cx, cy, pulse, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();

      [0.17, 0.29, 0.41].forEach((radius, i) => {
        ctx.strokeStyle = `rgba(154, 255, 221, ${0.085 - i * 0.014})`;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.min(width, height) * radius, Math.PI * 1.08, Math.PI * 1.92);
        ctx.stroke();
      });

      points.forEach((point) => {
        const drift = Math.sin(time * 0.00025 * point.speed + point.phase) * 12;
        const x = width * (0.40 + point.x * 0.62) + mouseX * 18 * point.depth;
        const y = height * (0.34 + point.y * 0.61) + drift + mouseY * 11 * point.depth;
        const flicker = 0.28 + 0.58 * Math.max(0, Math.sin(time * 0.0012 + point.phase));
        ctx.fillStyle = `rgba(180,255,228,${flicker * point.depth})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.7 + point.depth * 1.25, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(219, 255, 241, 0.34)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx - 24, cy + 9);
      ctx.lineTo(cx, cy - 22);
      ctx.lineTo(cx + 24, cy + 9);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} className="radar-canvas" aria-hidden="true" />;
}
