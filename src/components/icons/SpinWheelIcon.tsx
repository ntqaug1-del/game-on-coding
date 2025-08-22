import React from 'react';

export const SpinWheelIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full animate-spin-slow"
    >
      {/* Outer circle with gradient */}
      <defs>
        <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6C3CE9" />
          <stop offset="100%" stopColor="#B01EFF" />
        </linearGradient>
      </defs>
      
      {/* Main wheel circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="url(#wheelGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse"
      />
      
      {/* Spokes */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        const x1 = 12 + Math.cos(angle) * 5;
        const y1 = 12 + Math.sin(angle) * 5;
        const x2 = 12 + Math.cos(angle) * 10;
        const y2 = 12 + Math.sin(angle) * 10;
        
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#wheelGradient)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
      
      {/* Center circle with glow effect */}
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="url(#wheelGradient)"
        className="animate-pulse"
      />
      
      {/* Decorative elements */}
      <circle
        cx="12"
        cy="12"
        r="1"
        fill="white"
        className="animate-pulse"
      />
    </svg>
  );
}; 