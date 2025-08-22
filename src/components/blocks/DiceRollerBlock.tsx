import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Dice1 } from 'lucide-react';

interface DiceRollerBlockProps {
  title: string;
  description: string;
  className?: string;
  id: number;
}

const DiceRollerBlock: React.FC<DiceRollerBlockProps> = ({ 
  title, 
  description,
  className,
  id
}) => {
  return (
    <Link to={`/utility/${id}`} className="block">
      <div className={cn(
        "bg-white rounded-xl p-4 sm:p-6 shadow-md transition-all duration-300 flex flex-col h-full", 
        "hover:shadow-lg hover:scale-105 hover:bg-gray-50 hover:border-purple-300 hover:border-2 transform",
        className
      )}>
        <div className="mb-3 sm:mb-4 flex justify-start">
          <div className="relative h-12 sm:h-16 w-12 sm:w-16">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Dice1 className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
            </div>
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-left text-gray-800">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 text-left">{description}</p>
      </div>
    </Link>
  );
};

export default DiceRollerBlock; 