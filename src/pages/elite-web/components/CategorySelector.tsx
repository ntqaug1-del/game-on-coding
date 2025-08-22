import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface Category {
  id: string;
  name: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find the selected category name
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-white border border-indigo-200 focus:border-indigo-400 h-10 px-3 py-2 rounded-lg shadow-sm transition-all hover:border-indigo-300 hover:shadow flex items-center justify-between cursor-pointer",
          isOpen && "ring-2 ring-indigo-400 border-indigo-400"
        )}
      >
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            {selectedCategory ? (
              <span className="font-medium text-indigo-700">{selectedCategory.name}</span>
            ) : (
              <span className="text-gray-400">Select a category</span>
            )}
          </span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-indigo-400 transition-transform duration-200",
          isOpen && "transform rotate-180"
        )} />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-indigo-100 shadow-xl rounded-lg p-2 z-50 animate-in fade-in-80 zoom-in-95">
          {/* Search input */}
          <div className="mb-2 pb-2 border-b border-indigo-50">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-indigo-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-lg shadow-sm transition-all hover:border-indigo-300 hover:shadow bg-white h-9 text-sm"
              />
            </div>
          </div>
          
          <div className="max-h-[200px] overflow-y-auto py-1">
            {filteredCategories.length === 0 ? (
              <div className="py-2 px-3 text-sm text-gray-500 text-center">
                No categories found
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div 
                  key={category.id}
                  className={cn(
                    "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group",
                    selectedCategoryId === category.id && "bg-indigo-50 text-indigo-700"
                  )}
                  onClick={() => {
                    onSelectCategory(category.id);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <div className="flex-1 truncate pr-4">{category.name}</div>
                  {selectedCategoryId === category.id && <Check className="h-4 w-4 text-indigo-500" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
