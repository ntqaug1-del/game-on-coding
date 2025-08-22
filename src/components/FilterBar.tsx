
import React from 'react';
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  filters: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  activeFilter, 
  setActiveFilter,
  filters
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2 max-w-full">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? "default" : "outline"}
          className={activeFilter === filter 
            ? "bg-purple-600 hover:bg-purple-700" 
            : "border-gray-300 text-gray-700 hover:bg-gray-100"}
          onClick={() => setActiveFilter(filter)}
        >
          {filter}
        </Button>
      ))}
      <div className="ml-auto flex items-center">
        <Button variant="ghost" className="text-purple-600 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
