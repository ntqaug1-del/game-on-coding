import React from 'react';
import { cn } from '@/lib/utils';

interface JerseyIconProps {
  number: string;
  color: string;
  className?: string;
  textClassName?: string;
  position?: string;
  name?: string;
  showName?: boolean;
}

export const JerseyIcon: React.FC<JerseyIconProps> = ({
  number,
  color,
  className,
  textClassName,
  position,
  name,
  showName = false
}) => {
  // Xác định màu sắc phụ (màu viền, sọc, v.v.)
  const isGoalkeeper = position === 'Thủ Môn';
  const secondaryColor = isGoalkeeper ? '#FCD34D' : 'white';

  // Tạo màu sắc sáng hơn cho phần highlight
  const lighterColor = () => {
    // Chuyển màu hex sang RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Tăng giá trị RGB (giới hạn ở 255)
    const lighter = {
      r: Math.min(r + 40, 255),
      g: Math.min(g + 40, 255),
      b: Math.min(b + 40, 255)
    };

    // Chuyển lại thành màu hex
    return `#${lighter.r.toString(16).padStart(2, '0')}${lighter.g.toString(16).padStart(2, '0')}${lighter.b.toString(16).padStart(2, '0')}`;
  };

  // Tạo màu tối hơn cho phần shadow
  const darkerColor = () => {
    // Chuyển màu hex sang RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Giảm giá trị RGB
    const darker = {
      r: Math.max(r - 40, 0),
      g: Math.max(g - 40, 0),
      b: Math.max(b - 40, 0)
    };

    // Chuyển lại thành màu hex
    return `#${darker.r.toString(16).padStart(2, '0')}${darker.g.toString(16).padStart(2, '0')}${darker.b.toString(16).padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
      style={{
        filter: 'drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.3))'
      }}
    >
      {/* Áo đấu SVG */}
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={`jersey-gradient-${number}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={lighterColor()} />
            <stop offset="100%" stopColor={darkerColor()} />
          </linearGradient>

          {isGoalkeeper && (
            <pattern id={`goalkeeper-pattern-${number}`} patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
              <rect width="6" height="10" fill={color} />
              <rect x="6" width="4" height="10" fill={darkerColor()} />
            </pattern>
          )}
        </defs>

        {/* Thân áo chính */}
        <path
          d="M25,15 C25,15 35,5 50,5 C65,5 75,15 75,15 L88,30 C88,30 83,25 78,27 C73,29 73,35 73,35 L73,105 C73,110 68,110 68,110 L32,110 C32,110 27,110 27,105 L27,35 C27,35 27,29 22,27 C17,25 12,30 12,30 L25,15 Z"
          fill={isGoalkeeper ? `url(#goalkeeper-pattern-${number})` : `url(#jersey-gradient-${number})`}
          stroke={secondaryColor}
          strokeWidth="2"
        />

        {/* Tay áo trái */}
        <path
          d="M27,35 C27,35 15,40 12,50 C9,60 15,65 15,65"
          fill="none"
          stroke={secondaryColor}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Tay áo phải */}
        <path
          d="M73,35 C73,35 85,40 88,50 C91,60 85,65 85,65"
          fill="none"
          stroke={secondaryColor}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Cổ áo */}
        <path
          d="M40,15 C40,15 45,22 50,22 C55,22 60,15 60,15"
          fill="none"
          stroke={secondaryColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Sọc áo */}
        {!isGoalkeeper && (
          <>
            <path
              d="M40,25 L40,80"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeDasharray={isGoalkeeper ? "0" : "3,3"}
            />
            <path
              d="M60,25 L60,80"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeDasharray={isGoalkeeper ? "0" : "3,3"}
            />
          </>
        )}

        {/* Viền dưới */}
        <path
          d="M32,100 L68,100"
          stroke={secondaryColor}
          strokeWidth="2"
        />
      </svg>

      {/* Số áo */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center text-white font-bold",
          textClassName
        )}
        style={{
          textShadow: '0px 2px 3px rgba(0, 0, 0, 0.7)',
          transform: 'translateY(-5%)'
        }}
      >
        {number}
      </div>

      {/* Tên cầu thủ */}
      {showName && name && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/70 rounded-full text-white text-xs font-medium backdrop-blur-sm whitespace-nowrap">
          {name}
        </div>
      )}
    </div>
  );
};
