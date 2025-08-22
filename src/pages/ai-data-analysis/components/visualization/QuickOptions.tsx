import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Download, ZoomIn, Move, Grid3X3, Eye, Settings2, Palette, BarChart3, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickOptionsProps {
  isExporting: boolean;
  handleExportChart: () => void;
  isZoomMode: boolean;
  setIsZoomMode: (mode: boolean) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const QuickOptions: React.FC<QuickOptionsProps> = ({
  isExporting,
  handleExportChart,
  isZoomMode,
  setIsZoomMode,
  showGrid,
  setShowGrid,
  showLegend,
  setShowLegend,
  isSettingsOpen,
  setIsSettingsOpen
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-4">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <BarChart3 className="h-4 w-4 text-indigo-500 mr-2" />
            Tùy chọn nhanh
          </h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "p-1.5 rounded-full transition-all",
                  isSettingsOpen
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-500"
                )}
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              >
                <Settings2 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700">
              <p className="text-xs">{isSettingsOpen ? 'Đóng cài đặt' : 'Mở cài đặt tùy chỉnh'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all",
                    "border text-sm font-medium",
                    isZoomMode
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-700 hover:border-indigo-100 hover:bg-indigo-50/30"
                  )}
                  onClick={() => setIsZoomMode(!isZoomMode)}
                >
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full",
                    isZoomMode
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-500"
                  )}>
                    {isZoomMode ? <Move className="h-3.5 w-3.5" /> : <ZoomIn className="h-3.5 w-3.5" />}
                  </div>
                  <span>{isZoomMode ? 'Di chuyển' : 'Phóng to'}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700">
                <p className="text-xs">{isZoomMode ? 'Chuyển sang chế độ di chuyển' : 'Chuyển sang chế độ phóng to'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all",
                    "border text-sm font-medium",
                    showGrid
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-700 hover:border-indigo-100 hover:bg-indigo-50/30"
                  )}
                  onClick={() => setShowGrid(!showGrid)}
                >
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full",
                    showGrid
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-500"
                  )}>
                    <Grid3X3 className="h-3.5 w-3.5" />
                  </div>
                  <span>{showGrid ? 'Ẩn lưới' : 'Hiện lưới'}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700">
                <p className="text-xs">{showGrid ? 'Ẩn đường lưới trên biểu đồ' : 'Hiện đường lưới trên biểu đồ'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all",
                    "border text-sm font-medium",
                    showLegend
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-700 hover:border-indigo-100 hover:bg-indigo-50/30"
                  )}
                  onClick={() => setShowLegend(!showLegend)}
                >
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full",
                    showLegend
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-500"
                  )}>
                    <Eye className="h-3.5 w-3.5" />
                  </div>
                  <span>{showLegend ? 'Ẩn chú thích' : 'Hiện chú thích'}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700">
                <p className="text-xs">{showLegend ? 'Ẩn chú thích biểu đồ' : 'Hiện chú thích biểu đồ'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all",
                    "border text-sm font-medium",
                    isExporting
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border-gray-200 text-gray-700 hover:border-indigo-100 hover:bg-indigo-50/30"
                  )}
                  onClick={handleExportChart}
                  disabled={isExporting}
                >
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full",
                    isExporting
                      ? "bg-gray-200 text-gray-400"
                      : "bg-gray-100 text-gray-500"
                  )}>
                    <Download className="h-3.5 w-3.5" />
                  </div>
                  <span>{isExporting ? 'Đang xuất...' : 'Xuất ảnh'}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700">
                <p className="text-xs">Xuất biểu đồ dưới dạng hình ảnh để sử dụng trong báo cáo hoặc chia sẻ</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default QuickOptions;
