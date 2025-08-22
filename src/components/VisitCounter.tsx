import React, { useEffect, useState } from 'react';
import { getVisitCount } from '@/lib/services/visitCounterService';
import { Eye } from 'lucide-react';

interface VisitCounterProps {
  pageName: string;
  className?: string;
}

const VisitCounter: React.FC<VisitCounterProps> = ({ pageName, className = '' }) => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVisitCount = async () => {
      try {
        const visitCount = await getVisitCount(pageName);
        setCount(visitCount);
      } catch (error) {
        console.error('Error fetching visit count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitCount();
  }, [pageName]);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <Eye size={16} />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
      <Eye size={16} />
      <span>{count !== null ? count.toLocaleString() : 'N/A'} visits</span>
    </div>
  );
};

export default VisitCounter;
