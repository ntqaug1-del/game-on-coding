import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ColorPicker } from '@/components/ui/color-picker';
import { Users, Shirt, Circle, Palette } from 'lucide-react';

interface PlayerSettingsProps {
  playerIconSize: string;
  setPlayerIconSize: (value: string) => void;
  playerShape: string;
  setPlayerShape: (value: string) => void;
  showDetailedStats: boolean;
  setShowDetailedStats: (value: boolean) => void;
  teamColor: string;
  setTeamColor: (value: string) => void;
}

export const PlayerSettings: React.FC<PlayerSettingsProps> = ({
  playerIconSize,
  setPlayerIconSize,
  playerShape,
  setPlayerShape,
  showDetailedStats,
  setShowDetailedStats,
  teamColor,
  setTeamColor
}) => {
  return (
    <>
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Màu áo đội bóng
        </label>
        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm">
          <ColorPicker
            value={teamColor}
            onChange={setTeamColor}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Tùy chỉnh cầu thủ
        </h3>

        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">Kích thước biểu tượng</label>
            <ToggleGroup
              type="single"
              value={playerIconSize}
              onValueChange={setPlayerIconSize}
              className="flex justify-between w-full"
            >
              <ToggleGroupItem
                value="small"
                className="flex-1 flex items-center justify-center gap-1 md:gap-2 py-1 md:py-2 border border-gray-200 dark:border-gray-700 rounded-l-md data-[state=on]:bg-blue-500 data-[state=on]:text-white dark:data-[state=on]:bg-blue-600"
              >
                <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-gray-400 flex items-center justify-center text-[8px] text-white font-bold">S</div>
                <span className="text-[10px] md:text-xs">Nhỏ</span>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="medium"
                className="flex-1 flex items-center justify-center gap-1 md:gap-2 py-1 md:py-2 border-y border-gray-200 dark:border-gray-700 data-[state=on]:bg-blue-500 data-[state=on]:text-white dark:data-[state=on]:bg-blue-600"
              >
                <div className="w-4 h-4 md:w-4.5 md:h-4.5 rounded-full bg-gray-500 flex items-center justify-center text-[10px] text-white font-bold">M</div>
                <span className="text-[10px] md:text-xs">TB</span>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="large"
                className="flex-1 flex items-center justify-center gap-1 md:gap-2 py-1 md:py-2 border border-gray-200 dark:border-gray-700 rounded-r-md data-[state=on]:bg-blue-500 data-[state=on]:text-white dark:data-[state=on]:bg-blue-600"
              >
                <div className="w-5 h-5 md:w-5.5 md:h-5.5 rounded-full bg-gray-600 flex items-center justify-center text-[12px] text-white font-bold">L</div>
                <span className="text-[10px] md:text-xs">Lớn</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">Hình dáng cầu thủ</label>
            <ToggleGroup
              type="single"
              value={playerShape}
              onValueChange={setPlayerShape}
              className="flex justify-between w-full"
            >
              <ToggleGroupItem
                value="circle"
                className="flex-1 flex items-center justify-center gap-1 md:gap-2 py-1 md:py-2 border border-gray-200 dark:border-gray-700 rounded-l-md data-[state=on]:bg-blue-500 data-[state=on]:text-white dark:data-[state=on]:bg-blue-600"
              >
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">10</div>
                <span className="text-[10px] md:text-xs">Hình tròn</span>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="jersey"
                className="flex-1 flex items-center justify-center gap-1 md:gap-2 py-1 md:py-2 border border-gray-200 dark:border-gray-700 rounded-r-md data-[state=on]:bg-blue-500 data-[state=on]:text-white dark:data-[state=on]:bg-blue-600"
              >
                <Shirt className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-[10px] md:text-xs">Áo đấu</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>


      </div>
    </>
  );
};
