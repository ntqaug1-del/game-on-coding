import React, { useEffect, useState } from 'react';
import { getTotalUniqueVisits, getTodayUniqueVisits, getUserIP, logUniqueVisit } from '@/lib/services/uniqueVisitService';
import { Eye, Users, Calendar, Activity, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface UniqueVisitCounterProps {
  pageName: string;
  className?: string;
  showToday?: boolean;
  incrementOnMount?: boolean;
  variant?: 'minimal' | 'card' | 'pill';
  showAnimation?: boolean;
}

const UniqueVisitCounter: React.FC<UniqueVisitCounterProps> = ({
  pageName,
  className = '',
  showToday = true,
  incrementOnMount = true,
  variant = 'card',
  showAnimation = true
}) => {
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [todayCount, setTodayCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initCounter = async () => {
      try {
        setLoading(true);

        // Nếu cần tăng bộ đếm khi component được mount
        if (incrementOnMount) {
          const ip = await getUserIP();
          await logUniqueVisit(pageName, ip);
        }

        // Lấy số lượt truy cập
        const total = await getTotalUniqueVisits(pageName);
        setTotalCount(total);

        if (showToday) {
          const today = await getTodayUniqueVisits(pageName);
          setTodayCount(today);
        }
      } catch (error) {
        console.error('Error initializing visit counter:', error);
      } finally {
        setLoading(false);
      }
    };

    initCounter();
  }, [pageName, incrementOnMount, showToday]);

  // Render loading state based on variant
  if (loading) {
    return renderLoadingState(variant, className);
  }

  // Render counter based on selected variant
  switch (variant) {
    case 'minimal':
      return renderMinimalVariant(totalCount, todayCount, showToday, className, showAnimation);
    case 'pill':
      return renderPillVariant(totalCount, todayCount, showToday, className, showAnimation);
    case 'card':
    default:
      return renderCardVariant(totalCount, todayCount, showToday, className, showAnimation);
  }
};

// Loading state renderer
const renderLoadingState = (variant: string, className: string) => {
  switch (variant) {
    case 'minimal':
      return (
        <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      );
    case 'pill':
      return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 ${className}`}>
          <Loader2 size={14} className="animate-spin mr-2" />
          <span className="text-xs font-medium">Loading stats...</span>
        </div>
      );
    case 'card':
    default:
      return (
        <div className={`bg-white rounded-lg shadow-sm p-3 flex items-center gap-3 ${className}`}>
          <div className="bg-blue-100 p-2 rounded-full">
            <Loader2 size={18} className="text-blue-500 animate-spin" />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Loading visitor stats...</span>
          </div>
        </div>
      );
  }
};

// Minimal variant renderer
const renderMinimalVariant = (totalCount: number | null, todayCount: number | null, showToday: boolean, className: string, showAnimation: boolean) => {
  const content = (
    <div className={`flex items-center gap-2 text-gray-600 ${className}`}>
      <Eye size={16} className="text-blue-500" />
      <div className="flex flex-col">
        <span className="font-medium">{totalCount !== null ? totalCount.toLocaleString() : 'N/A'} visits</span>
        {showToday && (
          <span className="text-xs text-gray-400">
            {todayCount !== null ? todayCount.toLocaleString() : 'N/A'} today
          </span>
        )}
      </div>
    </div>
  );

  return showAnimation ? wrapWithAnimation(content) : content;
};

// Pill variant renderer
const renderPillVariant = (totalCount: number | null, todayCount: number | null, showToday: boolean, className: string, showAnimation: boolean) => {
  const content = (
    <div className={`flex gap-2 ${className}`}>
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
        <Eye size={14} className="mr-1" />
        <span className="text-xs font-medium">{totalCount !== null ? totalCount.toLocaleString() : 'N/A'} total</span>
      </div>
      {showToday && (
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">
          <Calendar size={14} className="mr-1" />
          <span className="text-xs font-medium">{todayCount !== null ? todayCount.toLocaleString() : 'N/A'} today</span>
        </div>
      )}
    </div>
  );

  return showAnimation ? wrapWithAnimation(content) : content;
};

// Card variant renderer
const renderCardVariant = (totalCount: number | null, todayCount: number | null, showToday: boolean, className: string, showAnimation: boolean) => {
  const content = (
    <div className={`bg-white rounded-lg shadow-sm p-3 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-100 p-2 rounded-full">
          <Users size={18} className="text-blue-500" />
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700">Visitor Statistics</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
          <div className="flex items-center text-blue-500 mb-1">
            <Eye size={14} className="mr-1" />
            <span className="text-xs font-medium text-gray-500">Total</span>
          </div>
          <span className="text-lg font-bold text-gray-800">{totalCount !== null ? totalCount.toLocaleString() : 'N/A'}</span>
        </div>
        {showToday && (
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <div className="flex items-center text-green-500 mb-1">
              <Calendar size={14} className="mr-1" />
              <span className="text-xs font-medium text-gray-500">Today</span>
            </div>
            <span className="text-lg font-bold text-gray-800">{todayCount !== null ? todayCount.toLocaleString() : 'N/A'}</span>
          </div>
        )}
      </div>
    </div>
  );

  return showAnimation ? wrapWithAnimation(content) : content;
};

// Helper to wrap content with animation
const wrapWithAnimation = (content: React.ReactNode) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {content}
    </motion.div>
  );
};

export default UniqueVisitCounter;
