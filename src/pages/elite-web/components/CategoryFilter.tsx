import React, { useState } from 'react';
import { Filter, Check, ChevronDown, X } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Find the selected category name
  const selectedCategoryName = selectedCategory
    ? categories.find(cat => cat.id === selectedCategory)?.name
    : null;

  return (
    <div className="relative">
      {/* Filter button with badge */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-white border border-indigo-200 focus:border-indigo-400 h-10 px-3 py-2 rounded-lg shadow-sm transition-all hover:border-indigo-300 hover:shadow flex items-center justify-between cursor-pointer",
          isOpen && "ring-2 ring-indigo-400 border-indigo-400"
        )}
      >
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-indigo-500" />
          <span className="text-sm text-gray-700">
            {selectedCategoryName ? (
              <span className="font-medium text-indigo-700">{selectedCategoryName}</span>
            ) : (
              "All Categories"
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedCategory && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-indigo-50 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory(null);
              }}
            >
              <X className="h-3 w-3 text-indigo-500" />
            </Button>
          )}
          <ChevronDown className={cn(
            "h-4 w-4 text-indigo-400 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} />
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-indigo-100 shadow-xl rounded-lg p-2 z-50 animate-in fade-in-80 zoom-in-95">
          <div className="mb-2 pb-1 border-b border-indigo-50">
            <div className="px-2 py-1 text-xs font-semibold text-indigo-500">
              Filter by Category
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto py-1">
            <div
              className={cn(
                "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group",
                !selectedCategory && "bg-indigo-50 text-indigo-700"
              )}
              onClick={() => {
                onSelectCategory(null);
                setIsOpen(false);
              }}
            >
              <div className="flex-1 truncate pr-4">All Categories</div>
              {!selectedCategory && <Check className="h-4 w-4 text-indigo-500" />}
            </div>

            {categories.map((category) => (
              <div
                key={category.id}
                className={cn(
                  "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group",
                  selectedCategory === category.id && "bg-indigo-50 text-indigo-700"
                )}
                onClick={() => {
                  onSelectCategory(category.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex-1 truncate pr-4">{category.name}</div>
                {selectedCategory === category.id && <Check className="h-4 w-4 text-indigo-500" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;