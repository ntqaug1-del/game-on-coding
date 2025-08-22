import React from 'react';
import { Player } from '@/types/football';
import { cn } from '@/lib/utils';

interface PlayerStatsCardProps {
  player: Player;
  className?: string;
}

export const PlayerStatsCard: React.FC<PlayerStatsCardProps> = ({ player, className }) => {
  // Tạo dữ liệu thống kê mẫu nếu không có
  const stats = player.stats || {
    speed: Math.floor(Math.random() * 10) + 1,
    strength: Math.floor(Math.random() * 10) + 1,
    technique: Math.floor(Math.random() * 10) + 1,
    defense: Math.floor(Math.random() * 10) + 1,
    attack: Math.floor(Math.random() * 10) + 1,
  };
  
  // Tạo dữ liệu cá nhân mẫu nếu không có
  const age = player.age || Math.floor(Math.random() * 15) + 18; // 18-32 tuổi
  const height = player.height || Math.floor(Math.random() * 30) + 165; // 165-195 cm
  const weight = player.weight || Math.floor(Math.random() * 20) + 65; // 65-85 kg
  const nationality = player.nationality || 'Việt Nam';
  
  // Tính toán màu sắc dựa trên giá trị thống kê
  const getStatColor = (value: number) => {
    if (value >= 8) return 'bg-green-500';
    if (value >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className={cn(
      "absolute top-0 left-full ml-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-20 border border-gray-200 dark:border-gray-700",
      className
    )}>
      <div className="text-center mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="font-bold text-gray-800 dark:text-white">{player.name}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{player.position} | #{player.number}</div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="text-gray-600 dark:text-gray-400">Tuổi:</div>
        <div className="text-gray-800 dark:text-white font-medium">{age}</div>
        
        <div className="text-gray-600 dark:text-gray-400">Chiều cao:</div>
        <div className="text-gray-800 dark:text-white font-medium">{height} cm</div>
        
        <div className="text-gray-600 dark:text-gray-400">Cân nặng:</div>
        <div className="text-gray-800 dark:text-white font-medium">{weight} kg</div>
        
        <div className="text-gray-600 dark:text-gray-400">Quốc tịch:</div>
        <div className="text-gray-800 dark:text-white font-medium">{nationality}</div>
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Chỉ số</div>
        
        {/* Tốc độ */}
        <div className="flex items-center text-xs">
          <span className="w-16 text-gray-600 dark:text-gray-400">Tốc độ:</span>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className={`h-full ${getStatColor(stats.speed || 0)}`} style={{ width: `${(stats.speed || 0) * 10}%` }}></div>
          </div>
          <span className="ml-1 text-gray-800 dark:text-white font-medium">{stats.speed}</span>
        </div>
        
        {/* Sức mạnh */}
        <div className="flex items-center text-xs">
          <span className="w-16 text-gray-600 dark:text-gray-400">Sức mạnh:</span>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className={`h-full ${getStatColor(stats.strength || 0)}`} style={{ width: `${(stats.strength || 0) * 10}%` }}></div>
          </div>
          <span className="ml-1 text-gray-800 dark:text-white font-medium">{stats.strength}</span>
        </div>
        
        {/* Kỹ thuật */}
        <div className="flex items-center text-xs">
          <span className="w-16 text-gray-600 dark:text-gray-400">Kỹ thuật:</span>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className={`h-full ${getStatColor(stats.technique || 0)}`} style={{ width: `${(stats.technique || 0) * 10}%` }}></div>
          </div>
          <span className="ml-1 text-gray-800 dark:text-white font-medium">{stats.technique}</span>
        </div>
        
        {/* Phòng ngự */}
        <div className="flex items-center text-xs">
          <span className="w-16 text-gray-600 dark:text-gray-400">Phòng ngự:</span>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className={`h-full ${getStatColor(stats.defense || 0)}`} style={{ width: `${(stats.defense || 0) * 10}%` }}></div>
          </div>
          <span className="ml-1 text-gray-800 dark:text-white font-medium">{stats.defense}</span>
        </div>
        
        {/* Tấn công */}
        <div className="flex items-center text-xs">
          <span className="w-16 text-gray-600 dark:text-gray-400">Tấn công:</span>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className={`h-full ${getStatColor(stats.attack || 0)}`} style={{ width: `${(stats.attack || 0) * 10}%` }}></div>
          </div>
          <span className="ml-1 text-gray-800 dark:text-white font-medium">{stats.attack}</span>
        </div>
      </div>
    </div>
  );
};
