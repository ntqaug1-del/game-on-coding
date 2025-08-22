import { useState, useMemo } from 'react';
import { Player } from '@/types/football';
import { DEFAULT_PLAYERS, generatePlayersForFormation } from '@/constants/football-formations';

export const usePlayers = (initialPlayers = DEFAULT_PLAYERS) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  // Lọc ra danh sách cầu thủ đá chính
  const startingPlayers = useMemo(() => {
    return players.filter(player => player.isStarting);
  }, [players]);

  // Lọc ra danh sách cầu thủ dự bị
  const substitutePlayers = useMemo(() => {
    return players.filter(player => !player.isStarting);
  }, [players]);

  const handleAddPlayer = () => {
    const newNumber = String(players.length + 1);
    const newPlayer: Player = {
      id: String(Date.now()),
      number: newNumber,
      name: `Player name`,
      position: 'Tiền Vệ',
      isStarting: false
    };
    setPlayers([...players, newPlayer]);
  };

  const handlePlayerChange = (id: string, field: keyof Player, value: string | boolean) => {
    setPlayers(players.map(player => {
      if (player.id === id) {
        if (field === 'isStarting') {
          const currentStartingCount = players.filter(p => p.isStarting).length;
          const isAddingStarter = value && !player.isStarting;

          // Kiểm tra số lượng cầu thủ đá chính
          if (isAddingStarter && currentStartingCount >= 11) {
            return player;
          }

          // Kiểm tra vị trí Thủ môn
          const isGoalkeeper = player.position === 'Thủ Môn';
          const currentGoalkeepers = players.filter(p => p.isStarting && p.position === 'Thủ Môn').length;

          if (isAddingStarter && isGoalkeeper && currentGoalkeepers >= 1) {
            return player; // Không cho phép thêm thủ môn nếu đã có 1 người
          }

          if (!isAddingStarter && isGoalkeeper && currentGoalkeepers <= 1) {
            return player; // Không cho phép bỏ thủ môn nếu chỉ còn 1 người
          }
        }
        return { ...player, [field]: value };
      }
      return player;
    }));
  };

  const updatePlayersForFormation = (formation: string, playerCount: number) => {
    // Tạo danh sách cầu thủ mới dựa trên sơ đồ mới
    const newPlayers = generatePlayersForFormation(formation, playerCount);
    setPlayers(newPlayers);
    return newPlayers;
  };

  const resetPlayers = () => {
    setPlayers([]);
  };

  return {
    players,
    setPlayers,
    startingPlayers,
    substitutePlayers,
    handleAddPlayer,
    handlePlayerChange,
    updatePlayersForFormation,
    resetPlayers
  };
};
