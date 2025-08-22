import { useState } from 'react';

export const usePlayerSettings = () => {
  // Tùy chỉnh hiển thị cầu thủ
  const [playerIconSize, setPlayerIconSize] = useState<string>('medium'); // 'small', 'medium', 'large'
  const [playerShape, setPlayerShape] = useState<string>('jersey'); // 'circle', 'jersey'
  const [showDetailedStats, setShowDetailedStats] = useState<boolean>(false); // Ẩn thông tin chi tiết khi hover
  const [teamColor, setTeamColor] = useState<string>('#EF4444'); // Màu mặc định: red-500

  // Tính toán kích thước biểu tượng cầu thủ dựa trên tùy chọn
  const getPlayerIconSize = () => {
    // Thêm responsive classes cho các kích thước
    switch (playerIconSize) {
      case 'small':
        return {
          container: 'w-10 h-16 md:w-12 md:h-18',
          icon: 'w-10 h-10 md:w-12 md:h-12',
          text: 'text-[10px] md:text-xs',
          number: 'text-base md:text-lg'
        };
      case 'large':
        return {
          container: 'w-14 h-20 md:w-16 md:h-22',
          icon: 'w-14 h-14 md:w-16 md:h-16',
          text: 'text-xs md:text-sm',
          number: 'text-xl md:text-2xl'
        };
      case 'medium':
      default:
        return {
          container: 'w-12 h-18 md:w-14 md:h-20',
          icon: 'w-12 h-12 md:w-14 md:h-14',
          text: 'text-[10px] md:text-xs',
          number: 'text-lg md:text-xl'
        };
    }
  };

  return {
    playerIconSize,
    setPlayerIconSize,
    playerShape,
    setPlayerShape,
    showDetailedStats,
    setShowDetailedStats,
    teamColor,
    setTeamColor,
    getPlayerIconSize,
    playerSize: undefined
  };
};
