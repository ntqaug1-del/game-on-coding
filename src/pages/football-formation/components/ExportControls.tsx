import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Download, RefreshCw, FileImage, Image, Gauge } from 'lucide-react';

interface ExportControlsProps {
  exportFormat: string;
  setExportFormat: (value: string) => void;
  exportQuality: string;
  setExportQuality: (value: string) => void;
  onDownload: () => void;
  onReset: () => void;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  exportFormat,
  setExportFormat,
  exportQuality,
  setExportQuality,
  onDownload,
  onReset
}) => {
  return (
    <div className="space-y-4">
      {/* Sử dụng grid-cols-1 cho mobile và tất cả các loại tablet, grid-cols-2 chỉ cho màn hình lớn */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Định dạng xuất</label>
          <ToggleGroup
            type="single"
            value={exportFormat}
            onValueChange={setExportFormat}
            className="flex justify-between w-full"
          >
            <ToggleGroupItem
              value="png"
              className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 dark:border-gray-700 rounded-l-md data-[state=on]:bg-emerald-500 data-[state=on]:text-white dark:data-[state=on]:bg-emerald-600"
            >
              <FileImage className="h-4 w-4" />
              <span className="text-sm">PNG</span>
            </ToggleGroupItem>

            <ToggleGroupItem
              value="jpeg"
              className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 dark:border-gray-700 rounded-r-md data-[state=on]:bg-emerald-500 data-[state=on]:text-white dark:data-[state=on]:bg-emerald-600"
            >
              <Image className="h-4 w-4" />
              <span className="text-sm">JPEG</span>
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {exportFormat === 'png' ? 'Nền trong suốt, phù hợp cho web' : 'Chất lượng cao, phù hợp cho in ấn'}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              <span>Độ phân giải</span>
            </div>
          </label>
          <ToggleGroup
            type="single"
            value={exportQuality}
            onValueChange={setExportQuality}
            className="flex justify-between w-full"
          >
            <ToggleGroupItem
              value="low"
              className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 dark:border-gray-700 rounded-l-md data-[state=on]:bg-blue-500 data-[state=on]:text-white dark:data-[state=on]:bg-blue-600"
            >
              <div className="flex flex-col items-center">
                <span className="text-sm">Thấp</span>
                <span className="text-[10px]">Nhanh</span>
              </div>
            </ToggleGroupItem>

            <ToggleGroupItem
              value="medium"
              className="flex-1 flex items-center justify-center gap-1 py-2 border-y border-gray-200 dark:border-gray-700 data-[state=on]:bg-blue-500 data-[state=on]:text-white dark:data-[state=on]:bg-blue-600"
            >
              <div className="flex flex-col items-center">
                <span className="text-sm">TB</span>
                <span className="text-[10px]">Cân bằng</span>
              </div>
            </ToggleGroupItem>

            <ToggleGroupItem
              value="high"
              className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 dark:border-gray-700 rounded-r-md data-[state=on]:bg-blue-500 data-[state=on]:text-white dark:data-[state=on]:bg-blue-600"
            >
              <div className="flex flex-col items-center">
                <span className="text-sm">Cao</span>
                <span className="text-[10px]">Chất lượng</span>
              </div>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="flex gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-white border-none dark:bg-amber-600 dark:hover:bg-amber-500 transition-colors"
                onClick={onReset}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tạo mới
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Xóa tất cả cầu thủ và bắt đầu lại</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white border-none dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors"
                onClick={onDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Tải về {exportFormat.toUpperCase()}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tải về đội hình dưới dạng {exportFormat.toUpperCase()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
