import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectorProps {
  selectedSort: string;
  onSelectSort: (sort: string) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({
  selectedSort,
  onSelectSort,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sort options
  const sortOptions: SortOption[] = [
    { value: 'created_at-desc', label: 'Newest First' },
    { value: 'created_at-asc', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'duration-desc', label: 'Longest First' },
    { value: 'duration-asc', label: 'Shortest First' },
  ];

  // Find the selected sort option
  const selectedSortOption = sortOptions.find(option => option.value === selectedSort) || sortOptions[0];

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
          <ArrowUpDown className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm font-medium text-blue-700">
            {selectedSortOption.label}
          </span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-blue-400 transition-transform duration-200",
          isOpen && "transform rotate-180"
        )} />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-100 shadow-xl rounded-lg p-2 z-50 animate-in fade-in-80 zoom-in-95">
          <div className="max-h-[200px] overflow-y-auto py-1">
            {sortOptions.map((option) => (
              <div 
                key={option.value}
                className={cn(
                  "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between group",
                  selectedSort === option.value && "bg-blue-50 text-blue-700"
                )}
                onClick={() => {
                  onSelectSort(option.value);
                  setIsOpen(false);
                }}
              >
                <div className="flex-1 truncate pr-4">{option.label}</div>
                {selectedSort === option.value && <Check className="h-4 w-4 text-blue-500" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortSelector;
