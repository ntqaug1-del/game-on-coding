import { useState } from 'react';
import { FORMATIONS, DEFAULT_POSITIONS, generatePlayersForFormation } from '@/constants/football-formations';
import { Position } from '@/types/football';

export const useFormation = (initialFormation = '4-4-2', initialPlayerCount = 11) => {
  const [formation, setFormation] = useState(initialFormation);
  const [playerCount, setPlayerCount] = useState(initialPlayerCount);

  const getDefaultPosition = (formation: string, position: string, index: number): Position => {
    const formationPositions = DEFAULT_POSITIONS[formation];
    if (!formationPositions) {
      return { top: '50%', left: '50%' };
    }

    const positions = formationPositions[position as keyof typeof formationPositions];
    if (!positions || !positions[index]) {
      return { top: '50%', left: '50%' };
    }

    return positions[index];
  };

  const parseFormation = (formation: string) => {
    const numbers = formation.split('-').map(Number);
    return {
      defenders: numbers[0] || 0,
      midfielders: numbers[1] || 0,
      forwards: numbers.length > 2 ? numbers.slice(2).reduce((a, b) => a + b, 0) : 0
    };
  };

  const handleFormationChange = (newFormation: string) => {
    setFormation(newFormation);
    return { formation: newFormation, playerCount };
  };

  const handlePlayerCountChange = (count: string) => {
    const newCount = parseInt(count);
    setPlayerCount(newCount);
    
    // Chọn sơ đồ mặc định cho số lượng cầu thủ mới
    const newFormation = FORMATIONS[newCount as keyof typeof FORMATIONS][0];
    setFormation(newFormation);
    
    return { formation: newFormation, playerCount: newCount };
  };

  return {
    formation,
    playerCount,
    handleFormationChange,
    handlePlayerCountChange,
    getDefaultPosition,
    parseFormation,
    availableFormations: FORMATIONS[playerCount as keyof typeof FORMATIONS] || []
  };
};
