import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Speed {
  value: number;
  name: string;
  description: string;
}

interface SpeedSelectorProps {
  selectedSpeed: number;
  onSelectSpeed: (speed: number) => void;
}

const SpeedSelector: React.FC<SpeedSelectorProps> = ({
  selectedSpeed,
  onSelectSpeed,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Speed options
  const speeds: Speed[] = [
    { value: 0.5, name: '0.5x', description: 'Slow & Clear' },
    { value: 0.75, name: '0.75x', description: 'Relaxed' },
    { value: 1.0, name: '1.0x', description: 'Natural' },
    { value: 1.25, name: '1.25x', description: 'Quick' },
    { value: 1.5, name: '1.5x', description: 'Fast' },
    { value: 2.0, name: '2.0x', description: 'Very Fast' },
  ];

  // Find the selected speed
  const selectedSpeedObj = speeds.find(speed => speed.value === selectedSpeed) || speeds[2]; // Default to 1.0x

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-white border border-blue-200 h-10 px-3 py-2 rounded-lg shadow-sm transition-all hover:border-blue-300 flex items-center justify-between cursor-pointer",
          isOpen ? "ring-2 ring-blue-400 border-blue-400" : ""
        )}
      >
        <div className="flex items-center">
          <Gauge className="h-4 w-4 mr-2 text-blue-500" />
          <div>
            <span className="text-sm font-medium text-blue-700">
              {selectedSpeedObj.name}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {selectedSpeedObj.description}
            </span>
          </div>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-blue-400 transition-transform duration-200",
          isOpen && "transform rotate-180"
        )} />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-100 shadow-xl rounded-lg p-2 z-50 animate-in fade-in-80 zoom-in-95">
          <div className="max-h-[250px] overflow-y-auto py-1">
            {speeds.map((speed) => (
              <div
                key={speed.value}
                className={cn(
                  "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between group",
                  Math.abs(selectedSpeed - speed.value) < 0.01 && "bg-blue-50 text-blue-700"
                )}
                onClick={() => {
                  onSelectSpeed(speed.value);
                  setIsOpen(false);
                }}
              >
                <div className="flex-1 truncate pr-4">
                  <span className="font-medium">{speed.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {speed.description}
                  </span>
                </div>
                {Math.abs(selectedSpeed - speed.value) < 0.01 && <Check className="h-4 w-4 text-blue-500" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedSelector;
