import React from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { BarChart3, PieChart, LineChart, CircleDot, Palette, Grid3X3, Eye, Type, BarChart, PieChartIcon, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CustomDropdown from '../ui/CustomDropdown';

interface ChartControlsProps {
  chartType: string;
  setChartType: (type: string) => void;
  selectedMetric: string;
  setSelectedMetric: (metric: string) => void;
  selectedPalette: string;
  setSelectedPalette: (palette: string) => void;
  lineThickness: number;
  setLineThickness: (thickness: number) => void;
  pointSize: number;
  setPointSize: (size: number) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  selectedField: string;
  setSelectedField: (field: string) => void;
  selectedFields: string[];
  setSelectedFields: (fields: string[]) => void;
  availableFields: string[];
  showMultipleFields: boolean;
  setShowMultipleFields: (show: boolean) => void;
  visibleFields: {[key: string]: boolean};
  setVisibleFields: (fields: {[key: string]: boolean}) => void;
  COLOR_PALETTES: {[key: string]: string[]};
}

const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  setChartType,
  selectedMetric,
  setSelectedMetric,
  selectedPalette,
  setSelectedPalette,
  lineThickness,
  setLineThickness,
  pointSize,
  setPointSize,
  showGrid,
  setShowGrid,
  showLegend,
  setShowLegend,
  showLabels,
  setShowLabels,
  selectedField,
  setSelectedField,
  selectedFields,
  setSelectedFields,
  availableFields,
  showMultipleFields,
  setShowMultipleFields,
  visibleFields,
  setVisibleFields,
  COLOR_PALETTES
}) => {
  // Handle field selection
  const handleFieldChange = (field: string) => {
    setSelectedField(field);

    if (!selectedFields.includes(field)) {
      setSelectedFields([...selectedFields, field]);
    }
  };

  // Handle multiple field selection toggle
  const handleMultipleFieldsToggle = (checked: boolean) => {
    setShowMultipleFields(checked);
  };

  // Handle field visibility toggle
  const handleFieldVisibilityToggle = (field: string, checked: boolean) => {
    setVisibleFields({
      ...visibleFields,
      [field]: checked
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Loại biểu đồ</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={cn(
              "relative flex items-center py-3 px-4 rounded-xl transition-all duration-200",
              "border shadow-sm hover:shadow-md",
              chartType === 'bar'
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-gray-100 text-gray-700 hover:border-indigo-100 hover:bg-indigo-50/30"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-9 h-9 rounded-full mr-3 transition-all",
              chartType === 'bar'
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-500"
            )}>
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">Biểu đồ cột</span>
              <span className="text-xs opacity-70">Hiển thị dữ liệu dạng cột</span>
            </div>
            {chartType === 'bar' && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500"></div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setChartType('line')}
            className={cn(
              "relative flex items-center py-3 px-4 rounded-xl transition-all duration-200",
              "border shadow-sm hover:shadow-md",
              chartType === 'line'
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-gray-100 text-gray-700 hover:border-indigo-100 hover:bg-indigo-50/30"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-9 h-9 rounded-full mr-3 transition-all",
              chartType === 'line'
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-500"
            )}>
              <LineChart className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">Biểu đồ đường</span>
              <span className="text-xs opacity-70">Hiển thị xu hướng dữ liệu</span>
            </div>
            {chartType === 'line' && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500"></div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setChartType('pie')}
            className={cn(
              "relative flex items-center py-3 px-4 rounded-xl transition-all duration-200",
              "border shadow-sm hover:shadow-md",
              chartType === 'pie'
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-gray-100 text-gray-700 hover:border-indigo-100 hover:bg-indigo-50/30"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-9 h-9 rounded-full mr-3 transition-all",
              chartType === 'pie'
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-500"
            )}>
              <PieChart className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">Biểu đồ tròn</span>
              <span className="text-xs opacity-70">Hiển thị tỷ lệ phần trăm</span>
            </div>
            {chartType === 'pie' && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500"></div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setChartType('scatter')}
            className={cn(
              "relative flex items-center py-3 px-4 rounded-xl transition-all duration-200",
              "border shadow-sm hover:shadow-md",
              chartType === 'scatter'
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-gray-100 text-gray-700 hover:border-indigo-100 hover:bg-indigo-50/30"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-9 h-9 rounded-full mr-3 transition-all",
              chartType === 'scatter'
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-500"
            )}>
              <CircleDot className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">Biểu đồ scatter</span>
              <span className="text-xs opacity-70">Hiển thị phân tán dữ liệu</span>
            </div>
            {chartType === 'scatter' && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500"></div>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Loại dữ liệu</h3>
        <CustomDropdown
          options={[
            { value: 'distribution', label: 'Phân phối' },
            { value: 'correlation', label: 'Tương quan' },
            { value: 'summary', label: 'Tổng quan' }
          ]}
          value={selectedMetric}
          onChange={setSelectedMetric}
          icon={<Database className="h-4 w-4 text-indigo-500" />}
          placeholder="Chọn loại dữ liệu"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Trường dữ liệu</h3>
        <CustomDropdown
          options={availableFields.map(field => ({ value: field, label: field }))}
          value={selectedField}
          onChange={handleFieldChange}
          icon={<BarChart3 className="h-4 w-4 text-indigo-500" />}
          placeholder="Chọn trường dữ liệu"
          className={selectedMetric !== 'distribution' ? 'opacity-50 pointer-events-none' : ''}
        />

        {selectedMetric === 'distribution' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="multiple-fields"
              checked={showMultipleFields}
              onCheckedChange={handleMultipleFieldsToggle}
            />
            <Label htmlFor="multiple-fields">Hiển thị nhiều trường</Label>
          </div>
        )}

        {showMultipleFields && selectedMetric === 'distribution' && (
          <Card className="p-3">
            <div className="space-y-2">
              {selectedFields.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`field-${field}`}
                    checked={visibleFields[field]}
                    onCheckedChange={(checked) => handleFieldVisibilityToggle(field, checked as boolean)}
                  />
                  <Label htmlFor={`field-${field}`}>{field}</Label>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Tùy chỉnh biểu đồ</h3>

        <div className="space-y-2">
          <Label htmlFor="color-palette" className="text-xs font-medium mb-1 block">Bảng màu</Label>
          <div className="grid grid-cols-4 gap-1">
            {Object.entries(COLOR_PALETTES).map(([name, colors]) => (
              <button
                key={name}
                className={cn(
                  "h-6 rounded-md border transition-all hover:scale-110",
                  selectedPalette === name ? "ring-2 ring-indigo-500 border-indigo-400" : "border-gray-200"
                )}
                style={{ background: `linear-gradient(to right, ${colors[0]}, ${colors[1]}, ${colors[2]})` }}
                onClick={() => setSelectedPalette(name)}
                aria-label={`Bảng màu ${name}`}
              />
            ))}
          </div>
        </div>

        {(chartType === 'line' || chartType === 'scatter') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="line-thickness" className="text-xs font-medium">Độ dày đường</Label>
              <span className="text-xs text-gray-500">{lineThickness}px</span>
            </div>
            <Slider
              id="line-thickness"
              min={1}
              max={5}
              step={0.5}
              value={[lineThickness]}
              onValueChange={(value) => setLineThickness(value[0])}
            />
          </div>
        )}

        {(chartType === 'scatter' || chartType === 'line') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="point-size" className="text-xs font-medium">Kích thước điểm</Label>
              <span className="text-xs text-gray-500">{pointSize}px</span>
            </div>
            <Slider
              id="point-size"
              min={4}
              max={12}
              step={1}
              value={[pointSize]}
              onValueChange={(value) => setPointSize(value[0])}
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-all duration-200 shadow-sm">
                <Grid3X3 className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <Label htmlFor="show-grid" className="text-sm font-medium text-gray-800">Hiển thị lưới</Label>
                <p className="text-xs text-gray-500 mt-0.5">Hiển thị đường lưới trên biểu đồ</p>
              </div>
            </div>
            <Switch
              id="show-grid"
              checked={showGrid}
              onCheckedChange={setShowGrid}
              className="data-[state=checked]:bg-indigo-600 h-6 w-11 data-[state=unchecked]:bg-gray-200"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-all duration-200 shadow-sm">
                <Eye className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <Label htmlFor="show-legend" className="text-sm font-medium text-gray-800">Hiển thị chú thích</Label>
                <p className="text-xs text-gray-500 mt-0.5">Hiển thị chú thích cho các dữ liệu</p>
              </div>
            </div>
            <Switch
              id="show-legend"
              checked={showLegend}
              onCheckedChange={setShowLegend}
              className="data-[state=checked]:bg-indigo-600 h-6 w-11 data-[state=unchecked]:bg-gray-200"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-all duration-200 shadow-sm">
                <Type className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <Label htmlFor="show-labels" className="text-sm font-medium text-gray-800">Hiển thị nhãn</Label>
                <p className="text-xs text-gray-500 mt-0.5">Hiển thị nhãn giá trị trên biểu đồ</p>
              </div>
            </div>
            <Switch
              id="show-labels"
              checked={showLabels}
              onCheckedChange={setShowLabels}
              className="data-[state=checked]:bg-indigo-600 h-6 w-11 data-[state=unchecked]:bg-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartControls;
