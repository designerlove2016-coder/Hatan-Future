import React, { useState, useRef, useCallback } from 'react';

export interface OrganicFloatingCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  enableParallax?: boolean;
  enableFloatLevitation?: boolean;
  floatDelay?: boolean;
  glowColor?: string;
  shadowClassName?: string;
}

export const OrganicFloatingCard: React.FC<OrganicFloatingCardProps> = ({
  children,
  className = '',
  onClick,
  enableParallax = true,
  enableFloatLevitation = true,
  floatDelay = false,
  glowColor = 'rgba(11, 93, 59, 0.15)',
  shadowClassName = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, shineX: 50, shineY: 50, isHovered: false });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableParallax || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (rotateX is inverted for natural tilt)
      const rotateX = ((clientY - centerY) / centerY) * -10;
      const rotateY = ((clientX - centerX) / centerX) * 10;

      // Calculate specular highlight coordinates (percentages)
      const shineX = (clientX / rect.width) * 100;
      const shineY = (clientY / rect.height) * 100;

      setTilt({ x: rotateX, y: rotateY, shineX, shineY, isHovered: true });
    },
    [enableParallax]
  );

  const handleMouseEnter = () => {
    setTilt((prev) => ({ ...prev, isHovered: true }));
  };

  const handleMouseLeave = () => {
    // Reset smoothly to neutral
    setTilt({ x: 0, y: 0, shineX: 50, shineY: 50, isHovered: false });
  };

  const floatClass = enableFloatLevitation && !tilt.isHovered
    ? floatDelay
      ? 'animate-float-delayed'
      : 'animate-float-slow'
    : '';

  return (
    <div
      className="relative perspective-card group select-none py-2"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* 
        3. Living Bottom Floor Shadow
        Decoupled floor shadow underneath expanding/contracting in sync with card altitude
      */}
      <div
        className={`absolute inset-x-4 -bottom-1 h-5 rounded-full pointer-events-none transition-all duration-300 ${
          tilt.isHovered
            ? 'scale-105 opacity-40 blur-lg bg-black/35'
            : `animate-floor-shadow bg-[#202923]/25 dark:bg-black/50 ${shadowClassName}`
        }`}
      />

      {/* 
        1 & 2. Main 3D Card with Organic Levitation and Interactive Parallax Tilt
      */}
      <div
        ref={cardRef}
        style={{
          transform: tilt.isHovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`
            : undefined,
          transition: tilt.isHovered
            ? 'transform 0.08s ease-out'
            : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`
          relative preserve-3d
          rounded-3xl
          bg-white dark:bg-[#18221C]
          border border-slate-200/80 dark:border-slate-800
          shadow-lg shadow-black/5 dark:shadow-black/30
          overflow-hidden
          ${floatClass}
          ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
          ${className}
        `}
      >
        {/* Top Ceramic / Glass Specular Sheen Highlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 via-white/10 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent pointer-events-none z-10" />

        {/* Dynamic Light Reflection tracking cursor */}
        {tilt.isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 255, 255, 0.45) 0%, transparent 60%)`,
            }}
          />
        )}

        {/* Subtle Decorative Ambient Corner Glow */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none z-0"
          style={{ background: glowColor }}
        />

        {/* Card Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};
