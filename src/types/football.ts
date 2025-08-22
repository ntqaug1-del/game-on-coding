export interface Position {
  top: string;
  left: string;
}

export interface Player {
  id: string;
  number: string;
  name: string;
  position: string;
  isStarting: boolean;
  x?: string;
  y?: string;
  color?: string; // Màu sắc cho cầu thủ
  imageUrl?: string; // URL ảnh cầu thủ
  stats?: {
    speed?: number; // Tốc độ (1-10)
    strength?: number; // Sức mạnh (1-10)
    technique?: number; // Kỹ thuật (1-10)
    defense?: number; // Phòng ngự (1-10)
    attack?: number; // Tấn công (1-10)
  };
  age?: number; // Tuổi cầu thủ
  height?: number; // Chiều cao (cm)
  weight?: number; // Cân nặng (kg)
  nationality?: string; // Quốc tịch
}