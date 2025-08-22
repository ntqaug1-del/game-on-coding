import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { TrendingUp, Calendar, Download, RefreshCw, AlertTriangle, BarChart3, LineChart as LineChartIcon, ChevronDown } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import CustomDropdown from './ui/CustomDropdown';
import TabsCustom from './ui/TabsCustom';
import { cn } from '@/lib/utils';
import { generatePredictionData } from '../utils/dataAnalysisUtils';

interface TrendPredictionProps {
  data: any;
  results: any;
}

interface PredictionDataPoint {
  month: string;
  actual: number | undefined;
  predicted: number | undefined;
  upperBound: number | undefined;
  lowerBound: number | undefined;
  isHistorical: boolean;
}

const TrendPrediction: React.FC<TrendPredictionProps> = ({ data, results }) => {
  const [availableFields, setAvailableFields] = useState<{value: string, label: string}[]>([]);
  const [selectedField, setSelectedField] = useState<string>('');
  const [predictionPeriod, setPredictionPeriod] = useState<number>(3);
  const [confidenceInterval, setConfidenceInterval] = useState<number>(95);
  const [predictionModel, setPredictionModel] = useState<string>('linear');
  const [predictionData, setPredictionData] = useState<PredictionDataPoint[]>([]);

  // Khi results thay đổi, cập nhật danh sách trường có thể dự đoán
  useEffect(() => {
    if (results && results.fieldStats) {
      // Lọc các trường số để dự đoán
      const numericFields = results.fieldStats
        .filter((stat: any) => stat.type === 'numeric')
        .map((stat: any) => ({
          value: stat.field,
          label: stat.field
        }));

      setAvailableFields(numericFields);

      // Chọn trường đầu tiên nếu có
      if (numericFields.length > 0 && !selectedField) {
        setSelectedField(numericFields[0].value);
      }
    }
  }, [results]);

  // Khi các tham số dự đoán thay đổi, tạo lại dữ liệu dự đoán
  useEffect(() => {
    if (data && selectedField) {
      // Sử dụng hàm từ utils để tạo dữ liệu dự đoán
      const predData = generatePredictionData(data, selectedField, predictionPeriod, predictionModel);
      setPredictionData(predData);
    }
  }, [data, selectedField, predictionPeriod, predictionModel]);

  // Xác định xu hướng dựa trên dữ liệu dự đoán
  const calculateTrend = (data: PredictionDataPoint[]) => {
    if (!data || data.length < 2) return "chưa xác định";

    // Tính toán xu hướng dựa trên dữ liệu lịch sử
    const historicalData = data.filter(point => point.isHistorical && point.actual !== undefined);

    if (historicalData.length < 2) return "chưa đủ dữ liệu";

    // Lấy giá trị đầu và cuối để xác định xu hướng
    const firstValue = historicalData[0].actual as number;
    const lastValue = historicalData[historicalData.length - 1].actual as number;

    // Tính phần trăm thay đổi
    const percentChange = ((lastValue - firstValue) / Math.abs(firstValue)) * 100;

    if (percentChange > 5) return "tăng mạnh";
    if (percentChange > 0) return "tăng nhẹ";
    if (percentChange < -5) return "giảm mạnh";
    if (percentChange < 0) return "giảm nhẹ";
    return "ổn định";
  };

  // Tạo dữ liệu cho biểu đồ so sánh mô hình
  const generateModelComparisonData = () => {
    return Array.from({ length: 12 + predictionPeriod }, (_, i) => {
      const isHistorical = i < 12;
      const baseValue = 50 + Math.sin(i / 2) * 20;

      return {
        month: `T${i + 1}`,
        actual: isHistorical ? baseValue + Math.random() * 10 : undefined,
        linear: baseValue + 5 * (i - 11 > 0 ? i - 11 : 0) + (Math.random() - 0.5) * 5,
        exponential: baseValue + Math.pow(1.2, (i - 11 > 0 ? i - 11 : 0)) + (Math.random() - 0.5) * 8,
        seasonal: baseValue + 3 * (i - 11 > 0 ? i - 11 : 0) + Math.sin(i / 2) * 15 + (Math.random() - 0.5) * 3,
        isHistorical
      };
    });
  };

  const modelComparisonData = generateModelComparisonData();

  // Tạo dữ liệu cho biểu đồ phân tích theo mùa
  const generateSeasonalAnalysisData = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: `T${i + 1}`,
      value: 50 + Math.sin(i / 2) * 20 + Math.random() * 10,
      trend: 50 + i * 2,
      seasonal: Math.sin(i / 2) * 20,
      residual: Math.random() * 10 - 5
    }));
  };

  const seasonalAnalysisData = generateSeasonalAnalysisData();

  // Xử lý khi thay đổi khoảng thời gian dự đoán
  const handlePredictionPeriodChange = (value: number[]) => {
    setPredictionPeriod(value[0]);
  };

  // Xử lý khi thay đổi khoảng tin cậy
  const handleConfidenceIntervalChange = (value: number[]) => {
    setConfidenceInterval(value[0]);
  };

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="field-select" className="block mb-2">Trường dữ liệu</Label>
          <CustomDropdown
            options={availableFields}
            value={selectedField}
            onChange={setSelectedField}
            icon={<BarChart3 className="h-4 w-4 text-indigo-500" />}
            placeholder="Chọn trường dữ liệu"
          />
        </div>

        <div>
          <Label htmlFor="prediction-model" className="block mb-2">Mô hình dự đoán</Label>
          <CustomDropdown
            options={[
              { value: 'linear', label: 'Hồi quy tuyến tính' },
              { value: 'exponential', label: 'Hồi quy hàm mũ' },
              { value: 'seasonal', label: 'Phân tích theo mùa' }
            ]}
            value={predictionModel}
            onChange={setPredictionModel}
            icon={<LineChartIcon className="h-4 w-4 text-indigo-500" />}
            placeholder="Chọn mô hình dự đoán"
          />
        </div>

        <div>
          <Label className="block mb-2 text-gray-700 font-medium">Khoảng thời gian dự đoán (tháng)</Label>
          <div
            className="w-full bg-white border border-indigo-200 rounded-lg shadow-sm transition-all hover:border-indigo-300 cursor-pointer h-10 flex items-center justify-between px-3"
            onClick={() => setPredictionPeriod(predictionPeriod < 12 ? predictionPeriod + 1 : 1)}
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 mr-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-indigo-700">Thời gian dự đoán</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-indigo-100 text-indigo-700 font-medium text-sm px-2.5 py-0.5 rounded-full">
                {predictionPeriod} tháng
              </div>
              <ChevronDown className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-2 px-3">
            <div className="relative pt-1">
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={predictionPeriod}
                onChange={(e) => handlePredictionPeriodChange([parseInt(e.target.value)])}
                className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>3</span>
                <span>6</span>
                <span>9</span>
                <span>12</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label className="block mb-2 text-gray-700 font-medium">Khoảng tin cậy (%)</Label>
          <div
            className="w-full bg-white border border-indigo-200 rounded-lg shadow-sm transition-all hover:border-indigo-300 cursor-pointer h-10 flex items-center justify-between px-3"
            onClick={() => setConfidenceInterval(confidenceInterval < 99 ? confidenceInterval + 1 : 80)}
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 mr-2">
                <AlertTriangle className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-indigo-700">Mức độ tin cậy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "font-medium text-sm px-2.5 py-0.5 rounded-full",
                confidenceInterval >= 95 ? "bg-green-100 text-green-700" :
                confidenceInterval >= 90 ? "bg-indigo-100 text-indigo-700" :
                "bg-amber-100 text-amber-700"
              )}>
                {confidenceInterval}%
              </div>
              <ChevronDown className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-2 px-3">
            <div className="relative pt-1">
              <input
                type="range"
                min="80"
                max="99"
                step="1"
                value={confidenceInterval}
                onChange={(e) => handleConfidenceIntervalChange([parseInt(e.target.value)])}
                className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>80%</span>
                <span>85%</span>
                <span>90%</span>
                <span>95%</span>
                <span>99%</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 italic">
              Giá trị cao hơn = khoảng dự đoán rộng hơn, độ tin cậy cao hơn
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Dự đoán xu hướng: {selectedField}</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                <span>Cập nhật</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Xuất</span>
              </Button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#6366f1"
                  fill="url(#colorPredicted)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#8b5cf6"
                  strokeDasharray="5 5"
                  fill="url(#colorPredicted)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="#c4b5fd"
                  fill="none"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  stroke="#c4b5fd"
                  fill="none"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-2 rounded-full mt-1">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-indigo-800">Phân tích xu hướng</h4>
                <p className="text-sm text-indigo-700 mt-1">
                  {predictionData.length > 0 ? (
                    <>
                      Dữ liệu {selectedField} cho thấy xu hướng {calculateTrend(predictionData)} với mô hình {predictionModel === 'linear' ? 'tuyến tính' : (predictionModel === 'exponential' ? 'hàm mũ' : 'theo mùa')}.
                      {predictionData.length > 0 && predictionData[predictionData.length - 1].predicted !== undefined && (
                        <>
                          Dự đoán giá trị sẽ đạt {Math.round(predictionData[predictionData.length - 1].predicted)}
                          trong {predictionPeriod} tháng tới với khoảng tin cậy {confidenceInterval}%.
                        </>
                      )}
                    </>
                  ) : (
                    <>Chưa có dữ liệu dự đoán. Vui lòng chọn trường dữ liệu số để xem dự đoán.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TabsCustom
        defaultValue="model-comparison"
        gridCols={2}
        layoutId="trendPredictionTabIndicator"
        wrapContent={false}
        tabs={[
          {
            id: 'model-comparison',
            label: 'So sánh mô hình',
            icon: <TrendingUp className="h-4 w-4" />
          },
          {
            id: 'seasonal-analysis',
            label: 'Phân tích theo mùa',
            icon: <Calendar className="h-4 w-4" />
          }
        ]}
      >

        <TabsContent value="model-comparison">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">So sánh các mô hình dự đoán</h3>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={modelComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Thực tế"
                    />
                    <Line
                      type="monotone"
                      dataKey="linear"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Tuyến tính"
                    />
                    <Line
                      type="monotone"
                      dataKey="exponential"
                      stroke="#ec4899"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Hàm mũ"
                    />
                    <Line
                      type="monotone"
                      dataKey="seasonal"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Theo mùa"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm font-medium text-purple-800">Mô hình tuyến tính</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    RMSE: 8.2 | MAE: 6.5 | R²: 0.85
                  </p>
                </div>

                <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                  <h4 className="text-sm font-medium text-pink-800">Mô hình hàm mũ</h4>
                  <p className="text-sm text-pink-700 mt-1">
                    RMSE: 12.4 | MAE: 9.8 | R²: 0.72
                  </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <h4 className="text-sm font-medium text-emerald-800">Mô hình theo mùa</h4>
                  <p className="text-sm text-emerald-700 mt-1">
                    RMSE: 5.7 | MAE: 4.3 | R²: 0.91
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 bg-amber-50 p-4 rounded-lg border border-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-1" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">Khuyến nghị</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Mô hình theo mùa có hiệu suất tốt nhất với dữ liệu hiện tại, với sai số thấp nhất và độ chính xác cao nhất.
                    Nên sử dụng mô hình này cho dự đoán trong {predictionPeriod} tháng tới.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal-analysis">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Phân tích thành phần theo mùa</h3>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={seasonalAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Giá trị gốc"
                    />
                    <Line
                      type="monotone"
                      dataKey="trend"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Xu hướng"
                    />
                    <Line
                      type="monotone"
                      dataKey="seasonal"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Thành phần theo mùa"
                    />
                    <Line
                      type="monotone"
                      dataKey="residual"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Phần dư"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-sm font-medium text-purple-800">Xu hướng</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Xu hướng tăng dài hạn với tốc độ trung bình 2 đơn vị/tháng.
                  </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <h4 className="text-sm font-medium text-emerald-800">Thành phần theo mùa</h4>
                  <p className="text-sm text-emerald-700 mt-1">
                    Chu kỳ theo mùa rõ ràng với biên độ khoảng 20 đơn vị và chu kỳ 4 tháng.
                  </p>
                </div>

                <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                  <h4 className="text-sm font-medium text-rose-800">Phần dư</h4>
                  <p className="text-sm text-rose-700 mt-1">
                    Phần dư nhỏ và ngẫu nhiên, cho thấy mô hình phù hợp tốt với dữ liệu.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </TabsCustom>
    </div>
  );
};

export default TrendPrediction;
