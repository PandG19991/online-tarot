"use client";

import React from "react";

/**
 * NoiseOverlay — MysticDraw V2 全局噪点纹理
 * fixed, inset-0, pointer-events-none, z-50, opacity-0.03
 * 使用 SVG feTurbulence 生成程序化噪点，避免外部资源请求
 */

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export default function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 50,
        opacity: 0.03,
        backgroundImage: `url("${NOISE_SVG}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
}
