import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string | undefined;
  onSelectCategory: (category: string | undefined) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          <Tag className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm text-gray-700">
            {selectedCategory ? (
              <span className="font-medium text-blue-700">{selectedCategory}</span>
            ) : (
              <span className="text-gray-500">All Categories</span>
            )}
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
            <div 
              className={cn(
                "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between group",
                !selectedCategory && "bg-blue-50 text-blue-700"
              )}
              onClick={() => {
                onSelectCategory(undefined);
                setIsOpen(false);
              }}
            >
              <div className="flex-1 truncate pr-4">All Categories</div>
              {!selectedCategory && <Check className="h-4 w-4 text-blue-500" />}
            </div>
            
            {categories.map((category) => (
              <div 
                key={category}
                className={cn(
                  "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between group",
                  selectedCategory === category && "bg-blue-50 text-blue-700"
                )}
                onClick={() => {
                  onSelectCategory(category);
                  setIsOpen(false);
                }}
              >
                <div className="flex-1 truncate pr-4">{category}</div>
                {selectedCategory === category && <Check className="h-4 w-4 text-blue-500" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
