"use client";

import { useRef, useEffect } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  layer: number; // 0=far, 1=mid, 2=near
  vx: number;
  vy: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let width = 0;
    let height = 0;

    const initStars = () => {
      stars = [];
      const layers = [
        { count: 150, rMin: 0.3, rMax: 0.8, opMin: 0.15, opMax: 0.4, speed: 0.02 },
        { count: 100, rMin: 0.8, rMax: 1.4, opMin: 0.35, opMax: 0.65, speed: 0.06 },
        { count: 50, rMin: 1.4, rMax: 2.2, opMin: 0.6, opMax: 1.0, speed: 0.12 },
      ];

      layers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * (layer.rMax - layer.rMin) + layer.rMin,
            opacity: Math.random() * (layer.opMax - layer.opMin) + layer.opMin,
            twinkleSpeed: Math.random() * 0.002 + 0.0008,
            twinkleOffset: Math.random() * Math.PI * 2,
            layer: layerIndex,
            vx: (Math.random() - 0.5) * layer.speed,
            vy: (Math.random() - 0.5) * layer.speed,
          });
        }
      });
    };

    const spawnMeteor = () => {
      const startX = Math.random() * width * 0.8 + width * 0.1;
      const startY = Math.random() * height * 0.25;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
      const speed = 4 + Math.random() * 4;
      const maxLife = 50 + Math.random() * 70;

      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife,
        maxLife,
        length: 50 + Math.random() * 80,
      });
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // 偶尔生成流星
      if (Math.random() < 0.004) {
        spawnMeteor();
      }

      // 绘制星星
      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const twinkle =
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        const alpha = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // 近层星星光晕（金色+白色）
        if (star.layer === 2) {
          const glowRadius = star.radius * 5;
          ctx.beginPath();
          ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            glowRadius
          );
          glow.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.25})`);
          glow.addColorStop(0.4, `rgba(201, 162, 39, ${alpha * 0.1})`);
          glow.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = glow;
          ctx.fill();
        }
      });

      // 绘制流星
      meteors = meteors.filter((m) => m.life > 0);
      meteors.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        m.life--;

        const progress = m.life / m.maxLife;
        const alpha = progress > 0.3 ? 1 : progress / 0.3;
        const speed = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
        const tailX = m.x - (m.vx / speed) * m.length;
        const tailY = m.y - (m.vy / speed) * m.length;

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.4})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.stroke();
      });

      animationId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
