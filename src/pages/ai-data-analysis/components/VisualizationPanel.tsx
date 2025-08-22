import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, FileText, Calculator } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import TabsCustom from './ui/TabsCustom';
import html2canvas from 'html2canvas';

// Import visualization components
import ChartDisplay from './visualization/ChartDisplay';
import ChartControls from './visualization/ChartControls';
import QuickOptions from './visualization/QuickOptions';
import InsightsTab from './visualization/InsightsTab';
import StatisticsTab from './visualization/StatisticsTab';
import RecommendationsTab from './visualization/RecommendationsTab';

interface VisualizationPanelNewProps {
  results: any;
}

// Các bảng màu cho biểu đồ
const COLOR_PALETTES = {
  indigo: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#3b82f6'],
  blue: ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1'],
  green: ['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#34d399', '#6ee7b7', '#a7f3d0', '#6ee7b7', '#34d399'],
  red: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c'],
  purple: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9'],
  orange: ['#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c'],
  gray: ['#6b7280', '#4b5563', '#374151', '#1f2937', '#111827', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937']
};

const VisualizationPanel: React.FC<VisualizationPanelNewProps> = ({ results }) => {
  // Chart type and metric state
  const [chartType, setChartType] = useState('bar');
  const [selectedMetric, setSelectedMetric] = useState('distribution');
  const [isExporting, setIsExporting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Field selection state
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [showMultipleFields, setShowMultipleFields] = useState(false);
  const [visibleFields, setVisibleFields] = useState<{[key: string]: boolean}>({});

  // Chart customization state
  const [selectedPalette, setSelectedPalette] = useState('indigo');
  const [lineThickness, setLineThickness] = useState(2);
  const [pointSize, setPointSize] = useState(8);
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Get colors based on selected palette
  const colors = COLOR_PALETTES[selectedPalette as keyof typeof COLOR_PALETTES];

  // Statistics and filtering state
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState<string>('');

  // Recommendations state
  const [savedRecommendations, setSavedRecommendations] = useState<{[key: string]: boolean}>({});

  // Zoom and pan state
  const [isZoomMode, setIsZoomMode] = useState(false);
  const [zoomArea, setZoomArea] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [zoomedData, setZoomedData] = useState<any>(null);

  // Refs
  const chartRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Extract available fields from data
  useEffect(() => {
    if (results?.distributions?.length > 0) {
      const fields = results.distributions.map((item: any) => item.name);
      setAvailableFields(fields);

      // Set default selected field
      if (fields.length > 0 && !selectedField) {
        setSelectedField(fields[0]);
        setSelectedFields([fields[0]]);
      }

      // Initialize visible fields
      const initialVisibility: {[key: string]: boolean} = {};
      fields.forEach((field: string) => {
        initialVisibility[field] = true;
      });
      setVisibleFields(initialVisibility);
    }
  }, [results]);

  // Zoom functionality
  const zoomIn = () => {
    if (!refAreaLeft || !refAreaRight) return;

    let left = refAreaLeft;
    let right = refAreaRight;

    // Ensure left is less than right
    if (left > right) {
      [left, right] = [right, left];
    }

    // Get data within the zoom area
    const data = getChartData();
    const startIndex = data.findIndex((item: any) =>
      item.range === left || item.name === left
    );
    const endIndex = data.findIndex((item: any) =>
      item.range === right || item.name === right
    );

    if (startIndex !== -1 && endIndex !== -1) {
      const zoomedData = data.slice(startIndex, endIndex + 1);
      setZoomedData(zoomedData);
      setZoomArea({ x1: startIndex, y1: 0, x2: endIndex, y2: 0 });
    }

    setRefAreaLeft('');
    setRefAreaRight('');
  };

  const zoomOut = () => {
    setZoomedData(null);
    setZoomArea(null);
    setRefAreaLeft('');
    setRefAreaRight('');
  };

  const handleMouseDown = (e: any) => {
    if (!isZoomMode) return;
    const { activeLabel } = e;
    setRefAreaLeft(activeLabel);
  };

  const handleMouseMove = (e: any) => {
    if (!isZoomMode || !refAreaLeft) return;
    const { activeLabel } = e;
    setRefAreaRight(activeLabel);
  };

  const handleMouseUp = () => {
    if (!isZoomMode || !refAreaLeft || !refAreaRight) return;
    zoomIn();
  };

  // Data preparation functions
  const getDistributionChartData = () => {
    if (!results?.distributions) return [];

    if (showMultipleFields) {
      // For multiple fields, create a combined dataset
      const distributionsByRange: {[key: string]: any} = {};

      results.distributions.forEach((item: any) => {
        if (selectedFields.includes(item.name) && visibleFields[item.name]) {
          item.distribution.forEach((value: number, index: number) => {
            const range = `Nhóm ${index + 1}`;
            if (!distributionsByRange[range]) {
              distributionsByRange[range] = { range };
            }
            distributionsByRange[range][item.name] = value;
          });
        }
      });

      return Object.values(distributionsByRange);
    } else {
      // For single field, get the selected field's distribution
      const selectedDistribution = results.distributions.find(
        (item: any) => item.name === selectedField
      );

      if (!selectedDistribution) return [];

      return selectedDistribution.distribution.map((value: number, index: number) => ({
        range: `Nhóm ${index + 1}`,
        value
      }));
    }
  };

  const getCorrelationChartData = () => {
    return results?.correlations?.map((item: any) => ({
      name: item.source,
      target: item.target,
      value: item.value
    })) || [];
  };

  const getSummaryChartData = () => {
    return [
      { name: 'Số dòng', value: results?.summary?.rowCount || 0 },
      { name: 'Số cột', value: results?.summary?.columnCount || 0 },
      { name: 'Giá trị thiếu', value: results?.summary?.missingValues || 0 },
      { name: 'Giá trị ngoại lệ', value: results?.summary?.outliers || 0 }
    ];
  };

  // Get chart data based on selected metric
  const getChartData = () => {
    switch (selectedMetric) {
      case 'distribution':
        return getDistributionChartData();
      case 'correlation':
        return getCorrelationChartData();
      case 'summary':
        return getSummaryChartData();
      default:
        return [];
    }
  };

  // Custom tooltip for charts
  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center text-sm">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium">{entry.name}: </span>
            <span className="ml-1 text-gray-600">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  };

  // Export chart as image
  const handleExportChart = async () => {
    if (!chartRef.current) return;

    try {
      setIsExporting(true);

      // Create canvas from chart element
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, // Increase resolution
        useCORS: true, // Allow loading images from other sources
        logging: false, // Disable logging
        backgroundColor: '#ffffff' // White background
      });

      // Create download link
      const link = document.createElement('a');
      const fileName = `chart-${selectedMetric}-${chartType}-${new Date().getTime()}`;
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('An error occurred while exporting the chart. Please try again later.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 space-y-4">
          {/* Chart Controls */}
          <ChartControls
            chartType={chartType}
            setChartType={setChartType}
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
            selectedPalette={selectedPalette}
            setSelectedPalette={setSelectedPalette}
            lineThickness={lineThickness}
            setLineThickness={setLineThickness}
            pointSize={pointSize}
            setPointSize={setPointSize}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            showLegend={showLegend}
            setShowLegend={setShowLegend}
            showLabels={showLabels}
            setShowLabels={setShowLabels}
            selectedField={selectedField}
            setSelectedField={setSelectedField}
            selectedFields={selectedFields}
            setSelectedFields={setSelectedFields}
            availableFields={availableFields}
            showMultipleFields={showMultipleFields}
            setShowMultipleFields={setShowMultipleFields}
            visibleFields={visibleFields}
            setVisibleFields={setVisibleFields}
            COLOR_PALETTES={COLOR_PALETTES}
          />

          {/* Export Button */}
          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 transition-all shadow-sm"
                    onClick={handleExportChart}
                    disabled={isExporting}
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600">
                      <Download className="h-3.5 w-3.5" />
                    </div>
                    <span>{isExporting ? 'Đang xuất...' : 'Xuất biểu đồ'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700 max-w-xs">
                  <p className="text-xs">Xuất biểu đồ dưới dạng hình ảnh để sử dụng trong báo cáo hoặc chia sẻ</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="md:w-2/3">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <CardContent className="p-6" ref={chartRef}>
              {/* Quick Options */}
              <QuickOptions
                isExporting={isExporting}
                handleExportChart={handleExportChart}
                isZoomMode={isZoomMode}
                setIsZoomMode={setIsZoomMode}
                showGrid={showGrid}
                setShowGrid={setShowGrid}
                showLegend={showLegend}
                setShowLegend={setShowLegend}
                isSettingsOpen={isSettingsOpen}
                setIsSettingsOpen={setIsSettingsOpen}
              />

              {/* Chart Display */}
              <ChartDisplay
                chartType={chartType}
                selectedMetric={selectedMetric}
                selectedField={selectedField}
                selectedFields={selectedFields}
                showMultipleFields={showMultipleFields}
                visibleFields={visibleFields}
                colors={colors}
                lineThickness={lineThickness}
                pointSize={pointSize}
                showGrid={showGrid}
                showLegend={showLegend}
                showLabels={showLabels}
                data={zoomedData || getChartData()}
                isZoomMode={isZoomMode}
                zoomArea={zoomArea}
                refAreaLeft={refAreaLeft}
                refAreaRight={refAreaRight}
                zoomOut={zoomOut}
                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                handleMouseUp={handleMouseUp}
                customTooltip={customTooltip}
                chartContainerRef={chartContainerRef}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <TabsCustom
        defaultValue="insights"
        gridCols={3}
        tabs={[
          {
            id: 'insights',
            label: 'Thông tin chi tiết',
            icon: <FileText className="h-4 w-4" />
          },
          {
            id: 'statistics',
            label: 'Thống kê',
            icon: <Calculator className="h-4 w-4" />
          },
          {
            id: 'recommendations',
            label: 'Đề xuất',
            icon: <BarChart3 className="h-4 w-4" />
          }
        ]}
        layoutId="visualizationTabIndicator"
      >
        <TabsContent value="insights">
          <InsightsTab results={results} />
        </TabsContent>
        <TabsContent value="statistics">
          <StatisticsTab
            results={results}
            filterText={filterText}
            setFilterText={setFilterText}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />
        </TabsContent>
        <TabsContent value="recommendations">
          <RecommendationsTab
            results={results}
            savedRecommendations={savedRecommendations}
            setSavedRecommendations={setSavedRecommendations}
          />
        </TabsContent>
      </TabsCustom>
    </div>
  );
};

export default VisualizationPanel;
