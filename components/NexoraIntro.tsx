'use client';

import React, { useEffect, useMemo, useState } from 'react';

interface NexoraIntroProps {
  onComplete: () => void;
}

interface ParticleDef {
  left: string;
  top: string;
  delay: string;
  duration: string;
  size: string;
  opacity: number;
}

export default function NexoraIntro({ onComplete }: NexoraIntroProps) {
  const [phase, setPhase] = useState<'particles' | 'text' | 'tagline' | 'exit'>('particles');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 400);      // letters start rising
    const t2 = setTimeout(() => setPhase('tagline'), 1800);  // tagline & sub fade in
    const t3 = setTimeout(() => setPhase('exit'), 3100);     // entire screen fades out
    const t4 = setTimeout(onComplete, 3750);                 // navigation fires after fade

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  // Stable particle positions — computed once, not on re-render
  const particles: ParticleDef[] = useMemo(() => {
    // Use a seeded-like approach with fixed values so SSR ≈ client
    return Array.from({ length: 42 }, (_, i) => {
      const seed = i * 137.508; // golden angle
      return {
        left:     `${(seed * 0.71) % 100}%`,
        top:      `${(seed * 0.53) % 100}%`,
        delay:    `${(i * 0.19) % 3}s`,
        duration: `${2.5 + (i * 0.13) % 3}s`,
        size:     `${1 + (i % 3)}px`,
        opacity:  0.15 + (i % 5) * 0.09,
      };
    });
  }, []);

  const letters = ['N', 'E', 'X', 'O', 'R', 'A'];
  const isExiting = phase === 'exit';
  const showCenter = phase !== 'particles';
  const showTagline = phase === 'tagline' || phase === 'exit';

  return (
    <div
      className={`nexora-intro-root${isExiting ? ' nexora-intro-exit' : ''}`}
      role="status"
      aria-label="Nexora — Loading"
    >
      {/* Deep-space ambient orbs */}
      <div className="nexora-bg-orb nexora-bg-orb-1" />
      <div className="nexora-bg-orb nexora-bg-orb-2" />
      <div className="nexora-bg-orb nexora-bg-orb-3" />

      {/* Cyber grid */}
      <div className="nexora-grid-overlay" />

      {/* Floating particle field */}
      <div className="nexora-particles">
        {particles.map((p, i) => (
          <span
            key={i}
            className="nexora-particle"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* ── Main centre content ── */}
      <div className={`nexora-intro-center${showCenter ? ' nexora-intro-center-visible' : ''}`}>

        {/* NEXORA lettermark */}
        <div className="nexora-letters-wrap" aria-label="NEXORA">
          {letters.map((letter, i) => (
            <span
              key={i}
              className="nexora-letter"
              style={{ animationDelay: `${0.04 + i * 0.08}s` }}
              aria-hidden="true"
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Glowing gradient rule */}
        <div className="nexora-underline" style={{ transitionDelay: '0.65s' }} />

        {/* Pulse dots */}
        <div className="nexora-dot-row" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="nexora-dot"
              style={{ animationDelay: `${0.75 + i * 0.18}s` }}
            />
          ))}
        </div>

        {/* Tagline */}
        <p className={`nexora-tagline${showTagline ? ' nexora-tagline-visible' : ''}`}>
          Academic &amp; Career Command Platform
        </p>

        {/* Sub-tagline */}
        <p className={`nexora-subtagline${showTagline ? ' nexora-subtagline-visible' : ''}`}>
          Initializing nexus gateway&hellip;
        </p>
      </div>

      {/* Version badge */}
      <div className="nexora-version-badge" aria-hidden="true">
        <span className="nexora-version-dot" />
        <span>v2.0 &middot; OFFICIAL LAUNCH &middot; NEXORAEDU.CO.IN</span>
      </div>
    </div>
  );
}
