import React from 'react';
import UtilityBlock from './UtilityBlock';
import { utilities } from '../data/utilities';

interface UtilityGridProps {
  activeFilter: string;
}

const UtilityGrid: React.FC<UtilityGridProps> = ({ activeFilter }) => {
  const filteredUtilities = utilities.filter(utility => 
    activeFilter === 'All' || utility.category === activeFilter
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
      {filteredUtilities.map((utility) => (
        <UtilityBlock
          key={utility.id}
          id={utility.id}
          title={utility.title}
          description={utility.description}
          className="h-full"
        />
      ))}
    </div>
  );
};

export default UtilityGrid;
