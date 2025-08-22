import { useRef, useState, useCallback, useEffect } from 'react';
import { Player } from '@/types/football';

// Hàm throttle để giới hạn số lần gọi hàm
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return function(this: any, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          const currentArgs = lastArgs;
          lastArgs = null;
          func.apply(this, currentArgs);
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

export const useDragPlayer = (players: Player[], setPlayers: (players: Player[]) => void) => {
  // Refs để lưu trữ thông tin về cầu thủ đang kéo và vị trí hiện tại
  const dragPlayerRef = useRef<{ id: string; startX: number; startY: number } | null>(null);
  const currentPositionRef = useRef<{ x: string; y: string } | null>(null);
  const [hoverPlayerId, setHoverPlayerId] = useState<string | null>(null);

  // State để theo dõi cầu thủ đang được kéo
  const [draggingPlayerId, setDraggingPlayerId] = useState<string | null>(null);

  // Hàm bắt đầu kéo cầu thủ
  const handleDragStart = useCallback((e: React.MouseEvent, playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player || player.position === 'Thủ Môn') return; // Thủ môn không thể di chuyển

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    dragPlayerRef.current = {
      id: playerId,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top
    };

    // Lưu vị trí hiện tại của cầu thủ
    currentPositionRef.current = {
      x: player.x || '50%',
      y: player.y || '50%'
    };

    // Đánh dấu cầu thủ đang được kéo
    setDraggingPlayerId(playerId);

    // Thêm class vào body để ngăn chặn việc chọn văn bản khi kéo
    document.body.classList.add('dragging');
  }, [players]);

  // Hàm xử lý kéo cầu thủ - được tối ưu hóa với throttle
  const handleDragRaw = useCallback((e: React.MouseEvent, pitchRef: React.RefObject<HTMLDivElement>) => {
    if (!dragPlayerRef.current || !pitchRef.current || !currentPositionRef.current) return;

    const pitch = pitchRef.current.getBoundingClientRect();

    // Tính toán vị trí mới
    const x = ((e.clientX - pitch.left) / pitch.width) * 100;
    const y = ((e.clientY - pitch.top) / pitch.height) * 100;

    // Giới hạn trong phạm vi sân
    const boundedX = Math.max(5, Math.min(95, x));
    const boundedY = Math.max(5, Math.min(95, y));

    // Cập nhật vị trí trong ref trước
    currentPositionRef.current = {
      x: `${boundedX}%`,
      y: `${boundedY}%`
    };

    // Cập nhật vị trí mới cho cầu thủ trong DOM trước khi cập nhật state
    const playerElement = document.querySelector(`[data-player-id="${dragPlayerRef.current.id}"]`) as HTMLElement;
    if (playerElement) {
      playerElement.style.transform = `translate(-50%, -50%) translate(${boundedX}%, ${boundedY}%)`;
    }

    // Cập nhật state để React render lại
    setPlayers(prevPlayers => prevPlayers.map(p =>
      p.id === dragPlayerRef.current?.id
        ? { ...p, x: `${boundedX}%`, y: `${boundedY}%` }
        : p
    ));
  }, [setPlayers]);

  // Sử dụng throttle để giới hạn số lần gọi hàm handleDrag
  const handleDrag = useCallback(throttle(handleDragRaw, 16), [handleDragRaw]); // 16ms ~ 60fps

  // Hàm kết thúc kéo cầu thủ
  const handleDragEnd = useCallback(() => {
    // Cập nhật lần cuối vị trí của cầu thủ vào state
    if (dragPlayerRef.current && currentPositionRef.current) {
      setPlayers(prevPlayers => prevPlayers.map(p =>
        p.id === dragPlayerRef.current?.id
          ? { ...p, x: currentPositionRef.current?.x || p.x, y: currentPositionRef.current?.y || p.y }
          : p
      ));
    }

    // Reset các refs và state
    dragPlayerRef.current = null;
    currentPositionRef.current = null;
    setDraggingPlayerId(null);

    // Xóa class khỏi body
    document.body.classList.remove('dragging');
  }, [setPlayers]);

  // Thêm style vào document để ngăn chặn việc chọn văn bản khi kéo
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      body.dragging {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        cursor: grabbing !important;
      }
      body.dragging * {
        cursor: grabbing !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Xử lý sự kiện hover vào cầu thủ
  const handlePlayerMouseEnter = useCallback((playerId: string) => {
    setHoverPlayerId(playerId);
  }, []);

  // Xử lý sự kiện rời chuột khỏi cầu thủ
  const handlePlayerMouseLeave = useCallback(() => {
    setHoverPlayerId(null);
  }, []);

  return {
    dragPlayerRef,
    hoverPlayerId,
    draggingPlayerId,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handlePlayerMouseEnter,
    handlePlayerMouseLeave
  };
};
