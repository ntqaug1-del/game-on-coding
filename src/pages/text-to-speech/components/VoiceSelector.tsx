import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Voice {
  id: string;
  name: string;
  description: string;
}

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelectVoice: (voice: string) => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Voice options
  const voices: Voice[] = [
    { id: 'alloy', name: 'Alloy', description: 'Natural & Clear' },
    { id: 'echo', name: 'Echo', description: 'Warm & Friendly' },
    { id: 'fable', name: 'Fable', description: 'Storyteller' },
    { id: 'onyx', name: 'Onyx', description: 'Deep & Authoritative' },
    { id: 'nova', name: 'Nova', description: 'Bright & Energetic' },
    { id: 'shimmer', name: 'Shimmer', description: 'Soft & Gentle' },
  ];

  // Find the selected voice
  const selectedVoiceObj = voices.find(voice => voice.id === selectedVoice) || voices[0];

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
          <Mic className="h-4 w-4 mr-2 text-blue-500" />
          <div>
            <span className="text-sm font-medium text-blue-700">
              {selectedVoiceObj.name}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {selectedVoiceObj.description}
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
            {voices.map((voice) => (
              <div
                key={voice.id}
                className={cn(
                  "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between group",
                  selectedVoice === voice.id && "bg-blue-50 text-blue-700"
                )}
                onClick={() => {
                  onSelectVoice(voice.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex-1 truncate pr-4">
                  <span className="font-medium">{voice.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {voice.description}
                  </span>
                </div>
                {selectedVoice === voice.id && <Check className="h-4 w-4 text-blue-500" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSelector;
