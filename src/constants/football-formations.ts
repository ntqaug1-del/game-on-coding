import { Position, Player } from '@/types/football';

export interface FormationPositions {
  'Thủ Môn': Position[];
  'Hậu Vệ': Position[];
  'Tiền Vệ': Position[];
  'Tiền Đạo': Position[];
}

// Định nghĩa sơ đồ cho mỗi số lượng cầu thủ
export const FORMATIONS = {
  5: ['2-2', '2-1-1', '1-2-1'],
  6: ['2-2-1', '3-1-1', '2-1-2'],
  7: [ '3-2-1', '2-3-1'],
  8: ['3-2-2', '3-3-1', '2-3-2'],
  9: ['3-3-2', '4-3-1', '3-4-1'],
  10: ['4-4-1', '4-3-2', '3-4-2'],
  11: ['4-4-2', '4-3-3', '3-5-2']
} as const;

// Vị trí mặc định cho mỗi sơ đồ
export const DEFAULT_POSITIONS: Record<string, FormationPositions> = {
  '2-2': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '40%' },
      { top: '70%', left: '60%' }
    ],
    'Tiền Vệ': [
      { top: '50%', left: '40%' },
      { top: '50%', left: '60%' }
    ],
    'Tiền Đạo': []
  },
  '2-1-1': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '40%' },
      { top: '70%', left: '60%' }
    ],
    'Tiền Vệ': [
      { top: '50%', left: '50%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '50%' }
    ]
  },
  '1-2-1': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '50%' }
    ],
    'Tiền Vệ': [
      { top: '50%', left: '40%' },
      { top: '50%', left: '60%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '50%' }
    ]
  },
  '3-2-1': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '30%' },
      { top: '70%', left: '50%' },
      { top: '70%', left: '70%' }
    ],
    'Tiền Vệ': [
      { top: '60%', left: '40%' },
      { top: '60%', left: '60%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '50%' }
    ]
  },
  '3-3-1': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '30%' },
      { top: '70%', left: '50%' },
      { top: '70%', left: '70%' }
    ],
    'Tiền Vệ': [
      { top: '60%', left: '30%' },
      { top: '60%', left: '50%' },
      { top: '60%', left: '70%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '50%' }
    ]
  },
  '3-4-1': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '30%' },
      { top: '70%', left: '50%' },
      { top: '70%', left: '70%' }
    ],
    'Tiền Vệ': [
      { top: '60%', left: '20%' },
      { top: '60%', left: '40%' },
      { top: '60%', left: '60%' },
      { top: '60%', left: '80%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '50%' }
    ]
  },
  '4-4-1': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '20%' },
      { top: '70%', left: '40%' },
      { top: '70%', left: '60%' },
      { top: '70%', left: '80%' }
    ],
    'Tiền Vệ': [
      { top: '50%', left: '20%' },
      { top: '50%', left: '40%' },
      { top: '50%', left: '60%' },
      { top: '50%', left: '80%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '50%' }
    ]
  },
  '4-3-2': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '20%' },
      { top: '70%', left: '40%' },
      { top: '70%', left: '60%' },
      { top: '70%', left: '80%' }
    ],
    'Tiền Vệ': [
      { top: '50%', left: '30%' },
      { top: '50%', left: '50%' },
      { top: '50%', left: '70%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '40%' },
      { top: '30%', left: '60%' }
    ]
  },
  '3-4-2': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '30%' },
      { top: '70%', left: '50%' },
      { top: '70%', left: '70%' }
    ],
    'Tiền Vệ': [
      { top: '60%', left: '20%' },
      { top: '60%', left: '40%' },
      { top: '60%', left: '60%' },
      { top: '60%', left: '80%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '40%' },
      { top: '30%', left: '60%' }
    ]
  },
  '3-3-2': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '30%' },
      { top: '70%', left: '50%' },
      { top: '70%', left: '70%' }
    ],
    'Tiền Vệ': [
      { top: '50%', left: '30%' },
      { top: '50%', left: '50%' },
      { top: '50%', left: '70%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '40%' },
      { top: '30%', left: '60%' }
    ]
  },
  '4-3-1': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '20%' },
      { top: '70%', left: '40%' },
      { top: '70%', left: '60%' },
      { top: '70%', left: '80%' }
    ],
    'Tiền Vệ': [
      { top: '50%', left: '30%' },
      { top: '50%', left: '50%' },
      { top: '50%', left: '70%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '50%' }
    ]
  },
  '4-4-2': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '20%' },
      { top: '70%', left: '40%' },
      { top: '70%', left: '60%' },
      { top: '70%', left: '80%' }
    ],
    'Tiền Vệ': [
      { top: '45%', left: '20%' },
      { top: '45%', left: '40%' },
      { top: '45%', left: '60%' },
      { top: '45%', left: '80%' }
    ],
    'Tiền Đạo': [
      { top: '20%', left: '40%' },
      { top: '20%', left: '60%' }
    ]
  },
  '4-3-3': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '20%' },
      { top: '70%', left: '40%' },
      { top: '70%', left: '60%' },
      { top: '70%', left: '80%' }
    ],
    'Tiền Vệ': [
      { top: '45%', left: '30%' },
      { top: '45%', left: '50%' },
      { top: '45%', left: '70%' }
    ],
    'Tiền Đạo': [
      { top: '20%', left: '30%' },
      { top: '20%', left: '50%' },
      { top: '20%', left: '70%' }
    ]
  },
  '3-5-2': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '30%' },
      { top: '70%', left: '50%' },
      { top: '70%', left: '70%' }
    ],
    'Tiền Vệ': [
      { top: '55%', left: '20%' },
      { top: '50%', left: '35%' },
      { top: '45%', left: '50%' },
      { top: '50%', left: '65%' },
      { top: '55%', left: '80%' }
    ],
    'Tiền Đạo': [
      { top: '20%', left: '40%' },
      { top: '20%', left: '60%' }
    ]
  },
  '2-2-1': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '40%' },
      { top: '70%', left: '60%' }
    ],
    'Tiền Vệ': [
      { top: '50%', left: '40%' },
      { top: '50%', left: '60%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '50%' }
    ]
  },
  '3-1-1': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '30%' },
      { top: '70%', left: '50%' },
      { top: '70%', left: '70%' }
    ],
    'Tiền Vệ': [
      { top: '50%', left: '50%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '50%' }
    ]
  },
  '2-1-2': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '40%' },
      { top: '70%', left: '60%' }
    ],
    'Tiền Vệ': [
      { top: '50%', left: '50%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '40%' },
      { top: '30%', left: '60%' }
    ]
  },
  '3-2-1-1': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '30%' },
      { top: '70%', left: '50%' },
      { top: '70%', left: '70%' }
    ],
    'Tiền Vệ': [
      { top: '60%', left: '40%' },
      { top: '60%', left: '60%' }
    ],
    'Tiền Đạo': [
      { top: '40%', left: '50%' },
      { top: '30%', left: '50%' }
    ]
  },
  '2-3-1': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '40%' },
      { top: '70%', left: '60%' }
    ],
    'Tiền Vệ': [
      { top: '60%', left: '30%' },
      { top: '60%', left: '50%' },
      { top: '60%', left: '70%' }
    ],
    'Tiền Đạo': [
      { top: '30%', left: '50%' }
    ]
  },
  '3-2-2': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '30%' },
      { top: '70%', left: '50%' },
      { top: '70%', left: '70%' }
    ],
    'Tiền Vệ': [
      { top: '60%', left: '40%' },
      { top: '60%', left: '60%' }
    ],
    'Tiền Đạo': [
      { top: '40%', left: '40%' },
      { top: '40%', left: '60%' }
    ]
  },
  '2-3-2': {
    'Thủ Môn': [
      { top: '85%', left: '50%' }
    ],
    'Hậu Vệ': [
      { top: '70%', left: '40%' },
      { top: '70%', left: '60%' }
    ],
    'Tiền Vệ': [
      { top: '60%', left: '30%' },
      { top: '60%', left: '50%' },
      { top: '60%', left: '70%' }
    ],
    'Tiền Đạo': [
      { top: '40%', left: '40%' },
      { top: '40%', left: '60%' }
    ]
  }
};

// Dữ liệu cầu thủ mặc định
export const DEFAULT_PLAYERS: Player[] = [
  // 11 cầu thủ mặc định cho đội hình 4-4-2
  { id: '1', number: '1', name: 'Player name', position: 'Thủ Môn', isStarting: true, color: '#FFA500' },
  { id: '2', number: '2', name: 'Player name', position: 'Hậu Vệ', isStarting: true, color: '#FF0000' },
  { id: '3', number: '3', name: 'Player name', position: 'Hậu Vệ', isStarting: true, color: '#FF0000' },
  { id: '4', number: '4', name: 'Player name', position: 'Hậu Vệ', isStarting: true, color: '#FF0000' },
  { id: '5', number: '5', name: 'Player name', position: 'Hậu Vệ', isStarting: true, color: '#FF0000' },
  { id: '6', number: '6', name: 'Player name', position: 'Tiền Vệ', isStarting: true, color: '#FF0000' },
  { id: '7', number: '7', name: 'Player name', position: 'Tiền Vệ', isStarting: true, color: '#FF0000' },
  { id: '8', number: '8', name: 'Player name', position: 'Tiền Vệ', isStarting: true, color: '#FF0000' },
  { id: '9', number: '9', name: 'Player name', position: 'Tiền Vệ', isStarting: true, color: '#FF0000' },
  { id: '10', number: '10', name: 'Player name', position: 'Tiền Đạo', isStarting: true, color: '#FF0000' },
  { id: '11', number: '11', name: 'Player name', position: 'Tiền Đạo', isStarting: true, color: '#FF0000' },
  // Cầu thủ dự bị
  { id: '12', number: '12', name: 'Player name', position: 'Thủ Môn', isStarting: false, color: '#FFA500' },
  { id: '13', number: '13', name: 'Player name', position: 'Hậu Vệ', isStarting: false, color: '#FF0000' },
  { id: '14', number: '14', name: 'Player name', position: 'Tiền Vệ', isStarting: false, color: '#FF0000' },
  { id: '15', number: '15', name: 'Player name', position: 'Tiền Đạo', isStarting: false, color: '#FF0000' },
];

// Hàm tạo danh sách cầu thủ mặc định cho một sơ đồ cụ thể
export const generatePlayersForFormation = (formation: string, playerCount: number): Player[] => {
  // Phân tích sơ đồ để biết số lượng cầu thủ cần cho mỗi vị trí
  const numbers = formation.split('-').map(Number);
  const defenders = numbers[0] || 0;
  const midfielders = numbers[1] || 0;
  const forwards = numbers.length > 2 ? numbers.slice(2).reduce((a, b) => a + b, 0) : 0;

  // Tạo danh sách cầu thủ mới
  const players: Player[] = [];
  let playerIndex = 1;

  // Thêm thủ môn
  players.push({
    id: String(playerIndex),
    number: String(playerIndex),
    name: 'Player name',
    position: 'Thủ Môn',
    isStarting: true,
    color: '#FFA500'
  });
  playerIndex++;

  // Thêm hậu vệ
  for (let i = 0; i < defenders; i++) {
    players.push({
      id: String(playerIndex),
      number: String(playerIndex),
      name: 'Player name',
      position: 'Hậu Vệ',
      isStarting: true,
      color: '#FF0000'
    });
    playerIndex++;
  }

  // Thêm tiền vệ
  for (let i = 0; i < midfielders; i++) {
    players.push({
      id: String(playerIndex),
      number: String(playerIndex),
      name: 'Player name',
      position: 'Tiền Vệ',
      isStarting: true,
      color: '#FF0000'
    });
    playerIndex++;
  }

  // Thêm tiền đạo
  for (let i = 0; i < forwards; i++) {
    players.push({
      id: String(playerIndex),
      number: String(playerIndex),
      name: 'Player name',
      position: 'Tiền Đạo',
      isStarting: true,
      color: '#FF0000'
    });
    playerIndex++;
  }

  // Thêm cầu thủ dự bị
  // Thêm thủ môn dự bị
  players.push({
    id: String(playerIndex),
    number: String(playerIndex),
    name: 'Player name',
    position: 'Thủ Môn',
    isStarting: false,
    color: '#FFA500'
  });
  playerIndex++;

  // Thêm mỗi vị trí thêm 1 cầu thủ dự bị
  players.push({
    id: String(playerIndex),
    number: String(playerIndex),
    name: 'Player name',
    position: 'Hậu Vệ',
    isStarting: false,
    color: '#FF0000'
  });
  playerIndex++;

  players.push({
    id: String(playerIndex),
    number: String(playerIndex),
    name: 'Player name',
    position: 'Tiền Vệ',
    isStarting: false,
    color: '#FF0000'
  });
  playerIndex++;

  players.push({
    id: String(playerIndex),
    number: String(playerIndex),
    name: 'Player name',
    position: 'Tiền Đạo',
    isStarting: false,
    color: '#FF0000'
  });

  return players;
};