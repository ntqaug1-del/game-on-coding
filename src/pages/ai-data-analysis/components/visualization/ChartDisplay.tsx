import React from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart as RechartPieChart, Pie, Cell, LineChart as RechartLineChart, Line,
  ScatterChart, Scatter, ZAxis, ReferenceArea } from 'recharts';
import { cn } from '@/lib/utils';
import { ZoomOut, AlertCircle } from 'lucide-react';

interface ChartDisplayProps {
  chartType: string;
  selectedMetric: string;
  selectedField: string;
  selectedFields: string[];
  showMultipleFields: boolean;
  visibleFields: {[key: string]: boolean};
  colors: string[];
  lineThickness: number;
  pointSize: number;
  showGrid: boolean;
  showLegend: boolean;
  showLabels: boolean;
  data: any[];
  isZoomMode: boolean;
  zoomArea: {x1: number, y1: number, x2: number, y2: number} | null;
  refAreaLeft: string;
  refAreaRight: string;
  zoomOut: () => void;
  handleMouseDown: (e: any) => void;
  handleMouseMove: (e: any) => void;
  handleMouseUp: () => void;
  customTooltip: ({ active, payload, label }: any) => JSX.Element | null;
  chartContainerRef: React.RefObject<HTMLDivElement>;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  chartType,
  selectedMetric,
  selectedField,
  selectedFields,
  showMultipleFields,
  visibleFields,
  colors,
  lineThickness,
  pointSize,
  showGrid,
  showLegend,
  showLabels,
  data,
  isZoomMode,
  zoomArea,
  refAreaLeft,
  refAreaRight,
  zoomOut,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  customTooltip,
  chartContainerRef
}) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-indigo-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Không có dữ liệu</h3>
        <p className="text-gray-500 text-center max-w-md">Không có dữ liệu để hiển thị với các tham số đã chọn. Vui lòng thử thay đổi các tham số hoặc kiểm tra lại dữ liệu.</p>
      </div>
    );
  }

  // Cấu hình chung cho các biểu đồ
  const commonProps = {
    onMouseDown: isZoomMode ? handleMouseDown : undefined,
    onMouseMove: isZoomMode ? handleMouseMove : undefined,
    onMouseUp: isZoomMode ? handleMouseUp : undefined,
  };

  // Xử lý hiển thị nhiều trường dữ liệu
  const getMultiFieldLines = () => {
    if (!showMultipleFields || selectedMetric !== 'distribution') return null;

    return selectedFields.map((field, index) => {
      if (!visibleFields[field]) return null;

      const fieldColor = colors[index % colors.length];

      return (
        <Line
          key={field}
          type="monotone"
          dataKey={field}
          name={field}
          stroke={fieldColor}
          strokeWidth={lineThickness}
          activeDot={{ r: pointSize }}
          animationDuration={1000}
          animationEasing="ease-in-out"
        />
      );
    });
  };

  // Xử lý hiển thị nhiều trường dữ liệu cho biểu đồ cột
  const getMultiFieldBars = () => {
    if (!showMultipleFields || selectedMetric !== 'distribution') return null;

    return selectedFields.map((field, index) => {
      if (!visibleFields[field]) return null;

      const fieldColor = colors[index % colors.length];

      return (
        <Bar
          key={field}
          dataKey={field}
          name={field}
          fill={fieldColor}
          animationDuration={1000}
          animationEasing="ease-in-out"
        />
      );
    });
  };

  const primaryColor = colors[0];

  switch (chartType) {
    case 'bar':
      return (
        <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm p-4" ref={chartContainerRef}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={data} {...commonProps} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
              {showLabels && <XAxis
                dataKey={selectedMetric === 'distribution' ? 'range' : 'name'}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />}
              {showLabels && <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />}
              <Tooltip
                content={customTooltip}
                cursor={{ fill: 'rgba(236, 236, 254, 0.2)' }}
              />
              {showLegend && <Legend
                wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                iconType="circle"
              />}

              {showMultipleFields && selectedMetric === 'distribution' ? (
                getMultiFieldBars()
              ) : (
                <Bar
                  dataKey="value"
                  name={selectedField || 'Giá trị'}
                  fill={primaryColor}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                  radius={[4, 4, 0, 0]}
                >
                  {data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              )}

              {refAreaLeft && refAreaRight && isZoomMode && (
                <ReferenceArea
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.3}
                  fill={primaryColor}
                  fillOpacity={0.3}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
          {isZoomMode && zoomArea && (
            <button
              className={cn(
                "absolute top-4 right-4 flex items-center gap-1.5 py-1.5 px-3 rounded-lg",
                "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm",
                "text-xs font-medium hover:bg-indigo-100 transition-colors"
              )}
              onClick={zoomOut}
            >
              <ZoomOut className="h-3.5 w-3.5" />
              Reset Zoom
            </button>
          )}
        </div>
      );

    case 'pie':
      return (
        <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <ResponsiveContainer width="100%" height={450}>
            <RechartPieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={showLabels}
                innerRadius={60}
                outerRadius={150}
                fill={primaryColor}
                paddingAngle={2}
                dataKey="value"
                nameKey={selectedMetric === 'distribution' ? 'range' : 'name'}
                label={showLabels ? ({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%` : undefined}
                animationDuration={1000}
                animationEasing="ease-in-out"
              >
                {data.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip
                content={customTooltip}
                wrapperStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              />
              {showLegend && <Legend
                wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                iconType="circle"
                layout="horizontal"
                verticalAlign="bottom"
              />}
            </RechartPieChart>
          </ResponsiveContainer>
        </div>
      );

    case 'line':
      return (
        <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm p-4" ref={chartContainerRef}>
          <ResponsiveContainer width="100%" height={450}>
            <RechartLineChart data={data} {...commonProps} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
              {showLabels && <XAxis
                dataKey={selectedMetric === 'distribution' ? 'range' : 'name'}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />}
              {showLabels && <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />}
              <Tooltip
                content={customTooltip}
                cursor={{ stroke: '#a5b4fc', strokeWidth: 1, strokeDasharray: '5 5' }}
                wrapperStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              />
              {showLegend && <Legend
                wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                iconType="circle"
              />}

              {showMultipleFields && selectedMetric === 'distribution' ? (
                getMultiFieldLines()
              ) : (
                <Line
                  type="monotone"
                  dataKey="value"
                  name={selectedField || 'Giá trị'}
                  stroke={primaryColor}
                  strokeWidth={lineThickness}
                  dot={{ r: pointSize - 1, strokeWidth: 1, fill: '#fff' }}
                  activeDot={{ r: pointSize + 1, strokeWidth: 1, fill: '#fff' }}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              )}

              {refAreaLeft && refAreaRight && isZoomMode && (
                <ReferenceArea
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.3}
                  fill={primaryColor}
                  fillOpacity={0.3}
                />
              )}
            </RechartLineChart>
          </ResponsiveContainer>
          {isZoomMode && zoomArea && (
            <button
              className={cn(
                "absolute top-4 right-4 flex items-center gap-1.5 py-1.5 px-3 rounded-lg",
                "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm",
                "text-xs font-medium hover:bg-indigo-100 transition-colors"
              )}
              onClick={zoomOut}
            >
              <ZoomOut className="h-3.5 w-3.5" />
              Reset Zoom
            </button>
          )}
        </div>
      );

    case 'scatter':
      // Scatter chart chỉ có ý nghĩa với dữ liệu tương quan
      if (selectedMetric === 'correlation') {
        return (
          <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm p-4" ref={chartContainerRef}>
            <ResponsiveContainer width="100%" height={450}>
              <ScatterChart {...commonProps} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
                {showLabels && <XAxis
                  type="number"
                  dataKey="value"
                  name="Hệ số tương quan"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />}
                {showLabels && <YAxis
                  type="category"
                  dataKey="name"
                  name="Biến"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />}
                <ZAxis range={[pointSize * 5, pointSize * 10]} />
                <Tooltip
                  content={customTooltip}
                  cursor={{ strokeDasharray: '5 5', stroke: '#a5b4fc', strokeWidth: 1 }}
                  wrapperStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                />
                {showLegend && <Legend
                  wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                  iconType="circle"
                />}
                <Scatter
                  name="Tương quan"
                  data={data}
                  fill={primaryColor}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                  shape="circle"
                />
                {refAreaLeft && refAreaRight && isZoomMode && (
                  <ReferenceArea
                    x1={refAreaLeft}
                    x2={refAreaRight}
                    strokeOpacity={0.3}
                    fill={primaryColor}
                    fillOpacity={0.3}
                  />
                )}
              </ScatterChart>
            </ResponsiveContainer>
            {isZoomMode && zoomArea && (
              <button
                className={cn(
                  "absolute top-4 right-4 flex items-center gap-1.5 py-1.5 px-3 rounded-lg",
                  "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm",
                  "text-xs font-medium hover:bg-indigo-100 transition-colors"
                )}
                onClick={zoomOut}
              >
                <ZoomOut className="h-3.5 w-3.5" />
                Reset Zoom
              </button>
            )}
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Loại biểu đồ không phù hợp</h3>
            <p className="text-gray-500 text-center max-w-md">Biểu đồ scatter chỉ có sẵn cho dữ liệu tương quan. Vui lòng chọn loại dữ liệu "Tương quan" hoặc chọn loại biểu đồ khác.</p>
          </div>
        );
      }

    default:
      return null;
  }
};

export default ChartDisplay;
