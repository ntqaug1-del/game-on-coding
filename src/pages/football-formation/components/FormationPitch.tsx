import React, { useState, useRef, useEffect } from 'react';
import { Player } from '@/types/football';
import { JerseyIcon } from '@/components/JerseyIcon';
import { PlayerStatsCard } from '@/components/PlayerStatsCard';
import { Input } from '@/components/ui/input';

interface FormationPitchProps {
  pitchRef: React.RefObject<HTMLDivElement>;
  startingPlayers: Player[];
  formation: string;
  pitchClasses: string;
  pitchLinesColor: string;
  pitchMarkingsColor: string;
  showPitchLines: boolean;
  playerShape: string;
  teamColor: string;
  teamName: string; // Thêm tên đội bóng
  playerSize: string; // Kích thước cầu thủ: 'small', 'medium', 'large'
  iconSizes: {
    container: string;
    icon: string;
    text: string;
    number: string;
  };
  showDetailedStats: boolean;
  hoverPlayerId: string | null;
  draggingPlayerId: string | null; // ID của cầu thủ đang được kéo
  dragPlayerRef: React.RefObject<{ id: string; startX: number; startY: number } | null>;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
  onDragStart: (e: React.MouseEvent, playerId: string) => void;
  onPlayerMouseEnter: (playerId: string) => void;
  onPlayerMouseLeave: () => void;
  onPlayerChange: (id: string, field: keyof Player, value: string | boolean) => void; // Thêm hàm cập nhật thông tin cầu thủ
  getDefaultPosition: (formation: string, position: string, index: number) => { top: string; left: string };
}

export const FormationPitch: React.FC<FormationPitchProps> = ({
  pitchRef,
  startingPlayers,
  formation,
  pitchClasses,
  pitchLinesColor,
  pitchMarkingsColor,
  showPitchLines,
  playerShape,
  teamColor,
  teamName,
  playerSize,
  iconSizes,
  showDetailedStats,
  hoverPlayerId,
  draggingPlayerId,
  dragPlayerRef,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
  onDragStart,
  onPlayerMouseEnter,
  onPlayerMouseLeave,
  onPlayerChange,
  getDefaultPosition
}) => {
  // State để theo dõi cầu thủ đang được chỉnh sửa
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Xử lý click ra ngoài input để lưu tên
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        savePlayerName();
      }
    };

    if (editingPlayerId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingPlayerId, editingName]);

  // Bắt đầu chỉnh sửa tên cầu thủ
  const startEditing = (player: Player, e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn chặn sự kiện nổi bọt
    setEditingPlayerId(player.id);
    setEditingName(player.name);
    // Focus vào input sau khi render
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 10);
  };

  // Lưu tên cầu thủ sau khi chỉnh sửa
  const savePlayerName = () => {
    if (editingPlayerId) {
      onPlayerChange(editingPlayerId, 'name', editingName);
      setEditingPlayerId(null);
    }
  };

  // Xử lý khi nhấn Enter để lưu tên
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      savePlayerName();
    } else if (e.key === 'Escape') {
      setEditingPlayerId(null); // Hủy chỉnh sửa
    }
  };
  // Thêm touch-none để ngăn chặn các hành vi chạm mặc định
  return (
    <div
      ref={pitchRef}
      className={`${pitchClasses} touch-none relative pt-14`} // Thêm padding-top để tạo không gian cho tên đội bóng
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
    >
      {/* Tiêu đề đội bóng - được đặt bên trong khu vực sân bóng */}
      {teamName && (
        <div className="absolute top-2 left-0 right-0 text-center z-20">
          <div className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2 rounded-lg shadow-lg border-2 border-white/30">
            <h2 className="text-lg md:text-xl font-bold">{teamName}</h2>
            <div className="text-xs md:text-sm opacity-80">{formation} Formation</div>
          </div>
        </div>
      )}
      <div className="absolute inset-0 top-14 overflow-hidden">
        {/* Họa tiết cỏ sân bóng - kẻ ngang */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-10"></div>
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-[5%]"
              style={{
                top: `${i * 5}%`,
                background: i % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'
              }}
            />
          ))}
        </div>

        {/* Vẽ các đường kẻ sân - responsive cho mobile */}
        {showPitchLines && (
          <div className={`absolute inset-[2%] border-2 md:border-4 ${pitchLinesColor} rounded-lg`}>
            {/* Đường kẻ ngang giữa sân - phân chia sân thành hai nửa */}
            <div className={`absolute top-1/2 left-0 right-0 h-2 md:h-3 ${pitchLinesColor} transform -translate-y-1/2 z-10`}></div>

            {/* Vạch kẻ ngang sân - mô phỏng các vạch cỏ */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`line-${i}`}
                className={`absolute left-0 right-0 h-0.5 ${pitchLinesColor} opacity-20`}
                style={{ top: `${20 + i * 15}%` }}
              />
            ))}

            {/* Vòng tròn giữa sân */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-40 md:h-40 border-2 md:border-4 ${pitchLinesColor} rounded-full`} />
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 ${pitchLinesColor} rounded-full bg-current`} />

            {/* Vùng phạt đền - Phía trên */}
            <div className={`absolute top-0 left-[20%] right-[20%] h-[18%] border-2 md:border-4 border-t-0 ${pitchLinesColor}`} />

            {/* Vùng cấm - Phía trên */}
            <div className={`absolute top-0 left-[30%] right-[30%] h-[8%] border-2 md:border-4 border-t-0 ${pitchLinesColor}`} />

            {/* Điểm phạt đền - Phía trên */}
            <div className={`absolute top-[12%] left-1/2 transform -translate-x-1/2 w-2 h-2 md:w-3 md:h-3 ${pitchLinesColor} rounded-full bg-current`} />

            {/* Vòng cung phạt đền - Phía trên */}
            <div className={`absolute top-[18%] left-1/2 transform -translate-x-1/2 w-24 h-12 md:w-32 md:h-16 border-b-2 md:border-b-4 ${pitchLinesColor} rounded-b-full border-l-0 border-r-0 border-t-0`} />

            {/* Vùng phạt đền - Phía dưới */}
            <div className={`absolute bottom-0 left-[20%] right-[20%] h-[18%] border-2 md:border-4 border-b-0 ${pitchLinesColor}`} />

            {/* Vùng cấm - Phía dưới */}
            <div className={`absolute bottom-0 left-[30%] right-[30%] h-[8%] border-2 md:border-4 border-b-0 ${pitchLinesColor}`} />

            {/* Điểm phạt đền - Phía dưới */}
            <div className={`absolute bottom-[12%] left-1/2 transform -translate-x-1/2 w-2 h-2 md:w-3 md:h-3 ${pitchLinesColor} rounded-full bg-current`} />

            {/* Vòng cung phạt đền - Phía dưới */}
            <div className={`absolute bottom-[18%] left-1/2 transform -translate-x-1/2 w-24 h-12 md:w-32 md:h-16 border-t-2 md:border-t-4 ${pitchLinesColor} rounded-t-full border-l-0 border-r-0 border-b-0`} />

            {/* Góc sân - Trên trái */}
            <div className={`absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 border-r-2 md:border-r-4 border-b-2 md:border-b-4 ${pitchLinesColor} rounded-br-full border-l-0 border-t-0`} />

            {/* Góc sân - Trên phải */}
            <div className={`absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 border-l-2 md:border-l-4 border-b-2 md:border-b-4 ${pitchLinesColor} rounded-bl-full border-r-0 border-t-0`} />

            {/* Góc sân - Dưới trái */}
            <div className={`absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 border-r-2 md:border-r-4 border-t-2 md:border-t-4 ${pitchLinesColor} rounded-tr-full border-l-0 border-b-0`} />

            {/* Góc sân - Dưới phải */}
            <div className={`absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 border-l-2 md:border-l-4 border-t-2 md:border-t-4 ${pitchLinesColor} rounded-tl-full border-r-0 border-b-0`} />

            {/* Khung thành - Phía trên */}
            <div className={`absolute top-[-2%] left-[38%] right-[38%] h-[2%] border-2 md:border-4 ${pitchLinesColor} bg-white/10`} />

            {/* Khung thành - Phía dưới */}
            <div className={`absolute bottom-[-2%] left-[38%] right-[38%] h-[2%] border-2 md:border-4 ${pitchLinesColor} bg-white/10`} />
          </div>
        )}
      </div>

      {/* Players */}
      {startingPlayers.map((player) => {
        const position = player.x && player.y
          ? { top: player.y, left: player.x }
          : getDefaultPosition(
              formation,
              player.position,
              startingPlayers.filter(p => p.position === player.position).findIndex(p => p.id === player.id)
            );

        // Xác định màu sắc cầu thủ
        const playerColor = player.position === 'Thủ Môn' ? '#EAB308' : teamColor;

        return (
          <div
            key={player.id}
            data-player-id={player.id}
            className={`absolute ${iconSizes.container} transform -translate-x-1/2 -translate-y-1/2 cursor-move select-none transition-all duration-300 hover:scale-110
              ${player.position === 'Thủ Môn' ? 'cursor-not-allowed' : ''}
              ${draggingPlayerId === player.id ? 'z-10' : ''}`}
            style={{
              top: position.top,
              left: position.left,
              zIndex: draggingPlayerId === player.id ? 10 : (hoverPlayerId === player.id ? 5 : 1),
              transform: 'translate(-50%, -50%)',
              transition: draggingPlayerId === player.id ? 'none' : 'all 0.3s ease'
            }}
            onMouseDown={e => onDragStart(e, player.id)}
            onMouseEnter={() => onPlayerMouseEnter(player.id)}
            onMouseLeave={onPlayerMouseLeave}
            onTouchStart={e => {
              // Ngăn chặn các hành vi mặc định của trình duyệt trên mobile
              e.preventDefault();
              e.stopPropagation();

              // Lấy thông tin về vị trí chạm
              const touch = e.touches[0];

              // Tạo sự kiện chuột giả lập với các thuộc tính cần thiết
              const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY,
                bubbles: true,
                cancelable: true,
                view: window,
              });

              // @ts-ignore - Gọi hàm xử lý kéo thả với sự kiện chuột giả lập
              onDragStart(mouseEvent, player.id);
            }}
          >
            <div className="flex flex-col items-center relative">
              {/* Hiển thị hình dáng cầu thủ (hình tròn, áo đấu hoặc ảnh) */}
              {player.imageUrl ? (
                <div className="relative">
                  {/* Khung ảnh hình chữ nhật với tỷ lệ 2x3 */}
                  <div
                    className={`relative flex items-center justify-center border-2 border-white dark:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-md transform-gpu`}
                    style={{
                      width: '60px', // Chiều rộng lớn hơn
                      height: '90px', // Chiều cao = 1.5 * chiều rộng (tỷ lệ 2:3)
                      transform: playerSize === 'large' ? 'scale(1.2)' : playerSize === 'small' ? 'scale(0.8)' : 'scale(1)', // Tỷ lệ theo kích thước cầu thủ
                      transformOrigin: 'center center'
                    }}
                  >
                    <img
                      src={player.imageUrl}
                      alt={player.name || 'Player'}
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                      onError={(e) => {
                        // Fallback nếu ảnh lỗi
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXIiPjxwYXRoIGQ9Ik0xOSAyMXYtMmE0IDQgMCAwIDAtNC00SDlhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+';
                      }}
                    />
                    {/* Số áo ở góc dưới bên phải */}
                    <div className="absolute bottom-0 right-0 bg-black/70 px-1.5 py-0.5 rounded-tl-md">
                      <span className="text-white text-[10px] font-bold">{player.number}</span>
                    </div>
                  </div>
                </div>
              ) : playerShape === 'circle' ? (
                <div
                  className={`${iconSizes.icon} rounded-full flex items-center justify-center border-4 border-white dark:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300`}
                  style={{ backgroundColor: playerColor }}
                >
                  <div className={`text-white font-bold ${iconSizes.number}`}>
                    {player.number}
                  </div>
                </div>
              ) : (
                <JerseyIcon
                  number={player.number}
                  color={playerColor}
                  className={iconSizes.icon}
                  textClassName={iconSizes.number}
                  position={player.position}
                />
              )}

              {/* Hiển thị tên cầu thủ - responsive cho mobile với khả năng chỉnh sửa */}
              {/* Điều chỉnh vị trí tên cầu thủ để phù hợp với hình chữ nhật */}
              {editingPlayerId === player.id ? (
                <div
                  className="mt-2 bg-black/90 dark:bg-black/95 rounded-md text-white font-medium backdrop-blur-sm shadow-md transition-all duration-300 border border-white/30 dark:border-white/20 z-30"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    marginTop: player.imageUrl ? '12px' : '4px', // Thêm khoảng cách nếu có ảnh
                    transform: playerSize === 'large' ? 'scale(1.1)' : playerSize === 'small' ? 'scale(0.9)' : 'scale(1)' // Điều chỉnh kích thước theo playerSize
                  }}
                >
                  <Input
                    ref={inputRef}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-6 md:h-7 w-[80px] md:w-[100px] px-2 py-0 text-xs md:text-sm bg-transparent border-0 focus:ring-0 text-white text-center"
                    autoFocus
                  />
                </div>
              ) : (
                <div
                  className="px-1.5 md:px-2 py-0.5 md:py-1 bg-black/70 dark:bg-black/80 rounded-md text-white font-medium backdrop-blur-sm shadow-md transition-all duration-300 border border-white/20 dark:border-white/10 hover:bg-black/80 dark:hover:bg-black/90 cursor-pointer"
                  onClick={(e) => startEditing(player, e)}
                  style={{
                    marginTop: player.imageUrl ? '12px' : '4px', // Thêm khoảng cách nếu có ảnh
                    transform: playerSize === 'large' ? 'scale(1.1)' : playerSize === 'small' ? 'scale(0.9)' : 'scale(1)' // Điều chỉnh kích thước theo playerSize
                  }}
                >
                  <div className="truncate text-center max-w-[80px] md:max-w-[100px]">
                    <span className={iconSizes.text}>{player.name || 'Nhập tên'}</span>
                  </div>
                </div>
              )}

              {/* Hiển thị thông tin chi tiết khi hover */}
              {showDetailedStats && hoverPlayerId === player.id && (
                <PlayerStatsCard player={player} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
