import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FORMATIONS } from '@/constants/football-formations';
import { Users, LayoutGrid, Shirt } from 'lucide-react';

interface FormationControlsProps {
  formation: string;
  playerCount: number;
  onFormationChange: (formation: string) => void;
  onPlayerCountChange: (count: string) => void;
}

export const FormationControls: React.FC<FormationControlsProps> = ({
  formation,
  playerCount,
  onFormationChange,
  onPlayerCountChange
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            Số lượng cầu thủ
          </label>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
            {playerCount} cầu thủ
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-750 p-3 rounded-lg border border-blue-200 dark:border-blue-900/30 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onPlayerCountChange("5")}
              className={`p-3 rounded-md border ${playerCount === 5 ? 'bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-700 shadow' : 'bg-white hover:bg-blue-50 border-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 shadow-sm hover:shadow'} transition-all`}
            >
              <div className="text-center">
                <div className="text-lg font-bold">5</div>
                <div className="text-xs">Futsal</div>
                <div className="mt-2 flex justify-center gap-1 opacity-0">
                  <div className="h-4"></div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onPlayerCountChange("7")}
              className={`p-3 rounded-md border ${playerCount === 7 ? 'bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-700 shadow' : 'bg-white hover:bg-blue-50 border-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 shadow-sm hover:shadow'} transition-all`}
            >
              <div className="text-center">
                <div className="text-lg font-bold">7</div>
                <div className="text-xs">Mini</div>
                <div className="mt-2 flex justify-center gap-1 opacity-0">
                  <div className="h-4"></div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onPlayerCountChange("9")}
              className={`p-3 rounded-md border ${playerCount === 9 ? 'bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-700 shadow' : 'bg-white hover:bg-blue-50 border-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 shadow-sm hover:shadow'} transition-all`}
            >
              <div className="text-center">
                <div className="text-lg font-bold">9</div>
                <div className="text-xs">Nhỏ</div>
                <div className="mt-2 flex justify-center gap-1 opacity-0">
                  <div className="h-4"></div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onPlayerCountChange("11")}
              className={`p-3 rounded-md border ${playerCount === 11 ? 'bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-700 shadow' : 'bg-white hover:bg-blue-50 border-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 shadow-sm hover:shadow'} transition-all`}
            >
              <div className="text-center">
                <div className="text-lg font-bold">11</div>
                <div className="text-xs">Tiêu chuẩn</div>
                <div className="mt-2 flex justify-center gap-1 opacity-0">
                  <div className="h-4"></div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-emerald-500" />
            Sơ đồ chiến thuật
          </label>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
            {formation}
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-gray-800 dark:to-gray-750 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/30 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            {FORMATIONS[playerCount as keyof typeof FORMATIONS]?.map((formationOption) => {
              // Tạo mảng các số từ sơ đồ
              const numbers = formationOption.split('-').map(Number);

              return (
                <button
                  key={formationOption}
                  type="button"
                  onClick={() => onFormationChange(formationOption)}
                  className={`p-3 rounded-md border ${formation === formationOption
                    ? 'bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-600 dark:border-emerald-700 shadow'
                    : 'bg-white hover:bg-emerald-50 border-emerald-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 shadow-sm hover:shadow'} transition-all`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">{formationOption}</div>
                    <div className="mt-2 flex justify-center gap-1">
                      {/* Thủ môn */}
                      <div className="flex flex-col items-center">
                        <Shirt className="h-4 w-4 text-yellow-500" />
                        <span className="text-[10px]">1</span>
                      </div>

                      {/* Hậu vệ */}
                      <div className="flex flex-col items-center">
                        <Shirt className="h-4 w-4 text-blue-500" />
                        <span className="text-[10px]">{numbers[0]}</span>
                      </div>

                      {/* Tiền vệ */}
                      <div className="flex flex-col items-center">
                        <Shirt className="h-4 w-4 text-green-500" />
                        <span className="text-[10px]">{numbers[1]}</span>
                      </div>

                      {/* Tiền đạo */}
                      <div className="flex flex-col items-center">
                        <Shirt className="h-4 w-4 text-red-500" />
                        <span className="text-[10px]">{numbers[2] || 0}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
