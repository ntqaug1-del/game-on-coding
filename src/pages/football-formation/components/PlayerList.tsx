import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Image, Upload, X, User } from 'lucide-react';
import { Player } from '@/types/football';

interface PlayerListProps {
  startingPlayers: Player[];
  substitutePlayers: Player[];
  playerCount: number;
  onAddPlayer: () => void;
  onPlayerChange: (id: string, field: keyof Player, value: string | boolean) => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  startingPlayers,
  substitutePlayers,
  playerCount,
  onAddPlayer,
  onPlayerChange
}) => {
  // Tham chiếu đến input file ẩn
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPlayerId, setUploadingPlayerId] = useState<string | null>(null);

  // Hàm xử lý khi người dùng chọn file ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingPlayerId) return;

    // Đọc file và chuyển thành Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      if (imageUrl) {
        onPlayerChange(uploadingPlayerId, 'imageUrl', imageUrl);
      }
    };
    reader.readAsDataURL(file);

    // Reset input file để có thể chọn lại cùng file nếu muốn
    e.target.value = '';
  };

  // Hàm mở hộp thoại chọn file
  const handleUploadClick = (playerId: string) => {
    setUploadingPlayerId(playerId);
    fileInputRef.current?.click();
  };

  // Hàm xóa ảnh cầu thủ
  const handleRemoveImage = (playerId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lên nút upload
    onPlayerChange(playerId, 'imageUrl', '');
  };
  return (
    <>
      {/* Input file ẩn để tải ảnh */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-white">Danh sách cầu thủ</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onAddPlayer}
                size="sm"
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-400 text-white border-none dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-sm"
              >
                <span className="text-lg font-semibold">+</span>
                Thêm cầu thủ
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thêm cầu thủ mới vào danh sách</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Cầu thủ đá chính */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2 dark:text-white">Đội hình chính ({startingPlayers.length}/{playerCount})</h3>
        <div className="grid grid-cols-12 gap-1 sm:gap-2 items-center px-2 mb-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
          <div className="col-span-1 text-center">Ảnh</div>
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-3 sm:col-span-4">Tên cầu thủ</div>
          <div className="col-span-6 sm:col-span-5">Vai trò</div>
          <div className="col-span-1 text-center">Chính</div>
        </div>
        <div className="space-y-2">
          {startingPlayers.map((player) => (
            <div key={player.id} className="grid grid-cols-12 gap-1 sm:gap-2 items-center bg-green-50 dark:bg-green-900/30 p-1 sm:p-2 rounded border border-green-100 dark:border-green-800">
              <div className="col-span-1 flex justify-center">
                <div
                  className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden cursor-pointer group"
                  onClick={() => handleUploadClick(player.id)}
                >
                  {player.imageUrl ? (
                    <>
                      <img
                        src={player.imageUrl}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Upload className="w-4 h-4 text-white" />
                      </div>
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleRemoveImage(player.id, e)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Upload className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-1">
                <Input
                  value={player.number}
                  onChange={(e) => onPlayerChange(player.id, 'number', e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-center font-semibold text-xs sm:text-sm h-8 sm:h-10 px-1 sm:px-2"
                  placeholder="#"
                />
              </div>
              <div className="col-span-3 sm:col-span-4">
                <Input
                  value={player.name}
                  onChange={(e) => onPlayerChange(player.id, 'name', e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-xs sm:text-sm h-8 sm:h-10 px-1 sm:px-2"
                  placeholder="Tên cầu thủ"
                />
              </div>
              <div className="col-span-6 sm:col-span-5">
                <RadioGroup
                  value={player.position}
                  onValueChange={(value) => onPlayerChange(player.id, 'position', value)}
                  className="flex flex-wrap gap-1 sm:gap-2"
                >
                  <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                    <RadioGroupItem value="Thủ Môn" id={`gk-${player.id}`} className="border-yellow-500 text-yellow-500 h-3 w-3 sm:h-4 sm:w-4" />
                    <Label htmlFor={`gk-${player.id}`} className="text-[10px] sm:text-xs cursor-pointer">GK</Label>
                  </div>

                  <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                    <RadioGroupItem value="Hậu Vệ" id={`df-${player.id}`} className="border-blue-500 text-blue-500 h-3 w-3 sm:h-4 sm:w-4" />
                    <Label htmlFor={`df-${player.id}`} className="text-[10px] sm:text-xs cursor-pointer">DF</Label>
                  </div>

                  <div className="flex items-center space-x-1 bg-green-50 dark:bg-green-900/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                    <RadioGroupItem value="Tiền Vệ" id={`mf-${player.id}`} className="border-green-500 text-green-500 h-3 w-3 sm:h-4 sm:w-4" />
                    <Label htmlFor={`mf-${player.id}`} className="text-[10px] sm:text-xs cursor-pointer">MF</Label>
                  </div>

                  <div className="flex items-center space-x-1 bg-red-50 dark:bg-red-900/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                    <RadioGroupItem value="Tiền Đạo" id={`fw-${player.id}`} className="border-red-500 text-red-500 h-3 w-3 sm:h-4 sm:w-4" />
                    <Label htmlFor={`fw-${player.id}`} className="text-[10px] sm:text-xs cursor-pointer">FW</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="col-span-1 flex justify-center">
                <Checkbox
                  checked={player.isStarting}
                  onCheckedChange={(checked) => onPlayerChange(player.id, 'isStarting', !!checked)}
                  className="border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cầu thủ dự bị */}
      <div>
        <h3 className="text-md font-semibold mb-2 dark:text-white">Đội hình dự bị ({substitutePlayers.length})</h3>
        <div className="grid grid-cols-12 gap-1 sm:gap-2 items-center px-2 mb-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
          <div className="col-span-1 text-center">Ảnh</div>
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-3 sm:col-span-4">Tên cầu thủ</div>
          <div className="col-span-6 sm:col-span-5">Vai trò</div>
          <div className="col-span-1 text-center">Chọn</div>
        </div>
        <div className="space-y-2">
          {substitutePlayers.map((player) => (
            <div key={player.id} className="grid grid-cols-12 gap-1 sm:gap-2 items-center p-1 sm:p-2 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="col-span-1 flex justify-center">
                <div
                  className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden cursor-pointer group"
                  onClick={() => handleUploadClick(player.id)}
                >
                  {player.imageUrl ? (
                    <>
                      <img
                        src={player.imageUrl}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Upload className="w-4 h-4 text-white" />
                      </div>
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleRemoveImage(player.id, e)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Upload className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-1">
                <Input
                  value={player.number}
                  onChange={(e) => onPlayerChange(player.id, 'number', e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-center font-semibold text-xs sm:text-sm h-8 sm:h-10 px-1 sm:px-2"
                  placeholder="#"
                />
              </div>
              <div className="col-span-3 sm:col-span-4">
                <Input
                  value={player.name}
                  onChange={(e) => onPlayerChange(player.id, 'name', e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-xs sm:text-sm h-8 sm:h-10 px-1 sm:px-2"
                  placeholder="Tên cầu thủ"
                />
              </div>
              <div className="col-span-6 sm:col-span-5">
                <RadioGroup
                  value={player.position}
                  onValueChange={(value) => onPlayerChange(player.id, 'position', value)}
                  className="flex flex-wrap gap-1 sm:gap-2"
                >
                  <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                    <RadioGroupItem value="Thủ Môn" id={`gk-sub-${player.id}`} className="border-yellow-500 text-yellow-500 h-3 w-3 sm:h-4 sm:w-4" />
                    <Label htmlFor={`gk-sub-${player.id}`} className="text-[10px] sm:text-xs cursor-pointer">GK</Label>
                  </div>

                  <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                    <RadioGroupItem value="Hậu Vệ" id={`df-sub-${player.id}`} className="border-blue-500 text-blue-500 h-3 w-3 sm:h-4 sm:w-4" />
                    <Label htmlFor={`df-sub-${player.id}`} className="text-[10px] sm:text-xs cursor-pointer">DF</Label>
                  </div>

                  <div className="flex items-center space-x-1 bg-green-50 dark:bg-green-900/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                    <RadioGroupItem value="Tiền Vệ" id={`mf-sub-${player.id}`} className="border-green-500 text-green-500 h-3 w-3 sm:h-4 sm:w-4" />
                    <Label htmlFor={`mf-sub-${player.id}`} className="text-[10px] sm:text-xs cursor-pointer">MF</Label>
                  </div>

                  <div className="flex items-center space-x-1 bg-red-50 dark:bg-red-900/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                    <RadioGroupItem value="Tiền Đạo" id={`fw-sub-${player.id}`} className="border-red-500 text-red-500 h-3 w-3 sm:h-4 sm:w-4" />
                    <Label htmlFor={`fw-sub-${player.id}`} className="text-[10px] sm:text-xs cursor-pointer">FW</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="col-span-1 flex justify-center">
                <Checkbox
                  checked={player.isStarting}
                  onCheckedChange={(checked) => onPlayerChange(player.id, 'isStarting', !!checked)}
                  className="border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
