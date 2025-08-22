import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

interface CustomDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  icon,
  placeholder = "Chọn...",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Tìm label tương ứng với value hiện tại
  const selectedOption = options.find(option => option.value === value);
  
  // Đóng dropdown khi click ra ngoài
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
      {/* Nút dropdown */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-white border border-indigo-200 h-10 px-3 py-2 rounded-lg shadow-sm transition-all hover:border-indigo-300 flex items-center justify-between cursor-pointer",
          isOpen ? "ring-2 ring-indigo-400 border-indigo-400" : "",
          className
        )}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className="text-sm font-medium text-indigo-700">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-indigo-400 transition-transform duration-200",
          isOpen && "transform rotate-180"
        )} />
      </div>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-indigo-100 shadow-xl rounded-lg p-2 z-50 animate-in fade-in-80 zoom-in-95">
          <div className="max-h-[200px] overflow-y-auto py-1">
            {options.map((option) => (
              <div 
                key={option.value}
                className={cn(
                  "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group",
                  value === option.value && "bg-indigo-50 text-indigo-700"
                )}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <div className="flex-1 truncate pr-4">{option.label}</div>
                {value === option.value && <Check className="h-4 w-4 text-indigo-500" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
