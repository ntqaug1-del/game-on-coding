import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Gamepad2, Layers, PaintBucket } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface PitchSettingsProps {
  pitchType: string;
  setPitchType: (value: string) => void;
  pitchColor: string;
  setPitchColor: (value: string) => void;
  showPitchLines: boolean;
  setShowPitchLines: (value: boolean) => void;
  pitchLinesColor: string;
  setPitchLinesColor: (value: string) => void;
  pitchMarkingsColor: string;
  setPitchMarkingsColor: (value: string) => void;
}

export const PitchSettings: React.FC<PitchSettingsProps> = ({
  pitchType,
  setPitchType,
  pitchColor,
  setPitchColor,
  showPitchLines,
  setShowPitchLines,
  pitchLinesColor,
  setPitchLinesColor,
  pitchMarkingsColor,
  setPitchMarkingsColor
}) => {
  return (
    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <Gamepad2 className="h-4 w-4" />
        Tùy chỉnh sân bóng
      </h3>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-gray-600 dark:text-gray-400">Loại sân</label>
          <RadioGroup
            value={pitchType}
            onValueChange={setPitchType}
            className="grid grid-cols-3 gap-1 md:gap-2"
          >
            <div>
              <RadioGroupItem
                value="natural"
                id="pitch-natural"
                className="sr-only"
              />
              <Label
                htmlFor="pitch-natural"
                className={`flex flex-col items-center gap-1 p-1 md:p-2 rounded-md cursor-pointer border ${pitchType === 'natural' ? 'bg-emerald-100 border-emerald-500 dark:bg-emerald-900/30 dark:border-emerald-700' : 'bg-gray-50 border-gray-200 hover:bg-emerald-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'}`}
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-600 mb-1"></div>
                <span className="text-[10px] md:text-xs font-medium">Cỏ tự nhiên</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="artificial"
                id="pitch-artificial"
                className="sr-only"
              />
              <Label
                htmlFor="pitch-artificial"
                className={`flex flex-col items-center gap-1 p-1 md:p-2 rounded-md cursor-pointer border ${pitchType === 'artificial' ? 'bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-700' : 'bg-gray-50 border-gray-200 hover:bg-green-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'}`}
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500 mb-1"></div>
                <span className="text-[10px] md:text-xs font-medium">Cỏ nhân tạo</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="futsal"
                id="pitch-futsal"
                className="sr-only"
              />
              <Label
                htmlFor="pitch-futsal"
                className={`flex flex-col items-center gap-1 p-1 md:p-2 rounded-md cursor-pointer border ${pitchType === 'futsal' ? 'bg-blue-100 border-blue-500 dark:bg-blue-900/30 dark:border-blue-700' : 'bg-gray-50 border-gray-200 hover:bg-blue-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'}`}
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-600 mb-1"></div>
                <span className="text-[10px] md:text-xs font-medium">Sân futsal</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-600 dark:text-gray-400">Màu sắc sân</label>
          <RadioGroup
            value={pitchColor}
            onValueChange={setPitchColor}
            className="grid grid-cols-2 gap-1 md:gap-2"
          >
            <div>
              <RadioGroupItem
                value="dark"
                id="pitch-dark"
                className="sr-only"
              />
              <Label
                htmlFor="pitch-dark"
                className={`flex flex-col items-center gap-1 p-1 md:p-2 rounded-md cursor-pointer border ${pitchColor === 'dark' ? 'bg-emerald-100 border-emerald-500 dark:bg-emerald-900/30 dark:border-emerald-700' : 'bg-gray-50 border-gray-200 hover:bg-emerald-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'}`}
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-800 mb-1"></div>
                <span className="text-[10px] md:text-xs font-medium">Xanh đậm</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="light"
                id="pitch-light"
                className="sr-only"
              />
              <Label
                htmlFor="pitch-light"
                className={`flex flex-col items-center gap-1 p-1 md:p-2 rounded-md cursor-pointer border ${pitchColor === 'light' ? 'bg-emerald-100 border-emerald-500 dark:bg-emerald-900/30 dark:border-emerald-700' : 'bg-gray-50 border-gray-200 hover:bg-emerald-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'}`}
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-500 mb-1"></div>
                <span className="text-[10px] md:text-xs font-medium">Xanh nhạt</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="flex items-center">
          <Checkbox
            id="show-pitch-lines"
            checked={showPitchLines}
            onCheckedChange={(checked) => setShowPitchLines(!!checked)}
            className="dark:border-gray-600"
          />
          <label htmlFor="show-pitch-lines" className="ml-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
            Hiển thị đường kẻ sân
          </label>
        </div>

        {showPitchLines && (
          <div className="space-y-4 pl-6 border-l-2 border-gray-100 dark:border-gray-700">
            <div className="space-y-2">
              <label className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Layers className="h-3 w-3 text-gray-500" />
                Màu đường kẻ sân
              </label>
              <RadioGroup
                value={pitchLinesColor}
                onValueChange={setPitchLinesColor}
                className="grid grid-cols-4 gap-1 md:gap-2"
              >
                <div>
                  <RadioGroupItem
                    value="border-white"
                    id="lines-white"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="lines-white"
                    className={`flex items-center justify-center p-2 rounded-md cursor-pointer border ${pitchLinesColor === 'border-white' ? 'bg-gray-100 border-gray-400' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="border-gray-300"
                    id="lines-gray"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="lines-gray"
                    className={`flex items-center justify-center p-2 rounded-md cursor-pointer border ${pitchLinesColor === 'border-gray-300' ? 'bg-gray-100 border-gray-400' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="border-yellow-300"
                    id="lines-yellow"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="lines-yellow"
                    className={`flex items-center justify-center p-2 rounded-md cursor-pointer border ${pitchLinesColor === 'border-yellow-300' ? 'bg-gray-100 border-gray-400' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-yellow-300"></div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="border-blue-300"
                    id="lines-blue"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="lines-blue"
                    className={`flex items-center justify-center p-2 rounded-md cursor-pointer border ${pitchLinesColor === 'border-blue-300' ? 'bg-gray-100 border-gray-400' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-blue-300"></div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <PaintBucket className="h-3 w-3 text-gray-500" />
                Màu điểm đánh dấu
              </label>
              <RadioGroup
                value={pitchMarkingsColor}
                onValueChange={setPitchMarkingsColor}
                className="grid grid-cols-4 gap-1 md:gap-2"
              >
                <div>
                  <RadioGroupItem
                    value="bg-white"
                    id="markings-white"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="markings-white"
                    className={`flex items-center justify-center p-2 rounded-md cursor-pointer border ${pitchMarkingsColor === 'bg-white' ? 'bg-gray-100 border-gray-400' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="bg-gray-300"
                    id="markings-gray"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="markings-gray"
                    className={`flex items-center justify-center p-2 rounded-md cursor-pointer border ${pitchMarkingsColor === 'bg-gray-300' ? 'bg-gray-100 border-gray-400' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="bg-yellow-300"
                    id="markings-yellow"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="markings-yellow"
                    className={`flex items-center justify-center p-2 rounded-md cursor-pointer border ${pitchMarkingsColor === 'bg-yellow-300' ? 'bg-gray-100 border-gray-400' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-yellow-300"></div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="bg-blue-300"
                    id="markings-blue"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="markings-blue"
                    className={`flex items-center justify-center p-2 rounded-md cursor-pointer border ${pitchMarkingsColor === 'bg-blue-300' ? 'bg-gray-100 border-gray-400' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-blue-300"></div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
