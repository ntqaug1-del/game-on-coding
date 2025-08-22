import React from 'react';

export const TextToSpeechIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6"/>
        <stop offset="100%" stopColor="#1D4ED8"/>
      </linearGradient>
      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#60A5FA"/>
        <stop offset="100%" stopColor="#3B82F6"/>
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
      </filter>
    </defs>

    <circle cx="40" cy="40" r="30" fill="#EFF6FF"/>
    <circle cx="40" cy="40" r="28" fill="#EFF6FF" filter="url(#shadow)"/>
    
    <rect x="25" y="25" width="20" height="30" rx="3" fill="url(#blueGradient)" filter="url(#shadow)"/>
    
    <g>
      <path d="M30 32H40" stroke="white" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
      </path>
      <path d="M30 38H37" stroke="white" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" begin="0.5s"/>
      </path>
      <path d="M30 44H35" stroke="white" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" begin="1s"/>
      </path>
    </g>
    
    <path d="M50 30C50 30 55 35 55 40C55 45 50 50 50 50" 
          stroke="url(#waveGradient)" strokeWidth="2" strokeLinecap="round">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
    </path>
    <path d="M53 33C53 33 58 36 58 40C58 44 53 47 53 47" 
          stroke="url(#waveGradient)" strokeWidth="2" strokeLinecap="round">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin="0.5s"/>
    </path>
    
    <circle cx="50" cy="40" r="2" fill="#93C5FD">
      <animate attributeName="r" values="1.5;2;1.5" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="55" cy="40" r="1.5" fill="#93C5FD">
      <animate attributeName="r" values="1;1.5;1" dur="2s" repeatCount="indefinite" begin="0.5s"/>
    </circle>
    
    <circle cx="45" cy="30" r="1" fill="#60A5FA" opacity="0.4"/>
    <circle cx="48" cy="28" r="1.5" fill="#60A5FA" opacity="0.6"/>
    <circle cx="52" cy="29" r="1" fill="#60A5FA" opacity="0.4"/>
  </svg>
); 