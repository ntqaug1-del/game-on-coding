import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { AlertTriangle, BarChart3, LineChart, Download, RefreshCw, Info, Search, Calendar, ChevronDown, Gauge } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartLineChart, Line, ZAxis, Cell, BarChart, Bar } from 'recharts';
import CustomDropdown from './ui/CustomDropdown';
import TabsCustom from './ui/TabsCustom';
import { cn } from '@/lib/utils';
import { detectAnomalies, generateZScoreDistribution } from '../utils/dataAnalysisUtils';

interface AnomalyDetectionProps {
  data: any;
  results: any;
}

const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({ data, results }) => {
  const [selectedField, setSelectedField] = useState<string>('');
  const [detectionMethod, setDetectionMethod] = useState<string>('zscore');
  const [sensitivityLevel, setSensitivityLevel] = useState<number>(2);
  const [timeRange, setTimeRange] = useState<string>('all');
  const [anomalyData, setAnomalyData] = useState<any[]>([]);
  const [zScoreDistribution, setZScoreDistribution] = useState<any[]>([]);
  const [availableFields, setAvailableFields] = useState<{value: string, label: string}[]>([]);

  // Khi results thay đổi, cập nhật danh sách trường có thể phân tích
  useEffect(() => {
    if (results && results.fieldStats) {
      // Lọc các trường số để phân tích
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

  // Khi các tham số phát hiện thay đổi, tạo lại dữ liệu bất thường
  useEffect(() => {
    if (data && selectedField) {
      // Sử dụng hàm từ utils để phát hiện bất thường
      const anomalies = detectAnomalies(data, selectedField, sensitivityLevel);
      setAnomalyData(anomalies);

      // Tạo dữ liệu phân phối Z-score
      const distribution = generateZScoreDistribution(anomalies, sensitivityLevel);
      setZScoreDistribution(distribution);
    }
  }, [data, selectedField, sensitivityLevel, detectionMethod]);

  // Lọc dữ liệu bất thường
  const anomalies = anomalyData.filter(item => item.isAnomaly);

  // Tạo dữ liệu cho biểu đồ phân tích theo thời gian
  const timeSeriesData = anomalyData.slice(0, Math.min(50, anomalyData.length));

  // Xử lý khi thay đổi mức độ nhạy
  const handleSensitivityChange = (value: number[]) => {
    setSensitivityLevel(value[0]);
  };

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
          <Label htmlFor="detection-method" className="block mb-2">Phương pháp phát hiện</Label>
          <CustomDropdown
            options={[
              { value: 'zscore', label: 'Z-Score' },
              { value: 'iqr', label: 'IQR (Khoảng tứ phân vị)' },
              { value: 'isolation', label: 'Isolation Forest' },
              { value: 'dbscan', label: 'DBSCAN' }
            ]}
            value={detectionMethod}
            onChange={setDetectionMethod}
            icon={<AlertTriangle className="h-4 w-4 text-indigo-500" />}
            placeholder="Chọn phương pháp"
          />
        </div>

        <div>
          <Label className="block mb-2 text-gray-700 font-medium">Mức độ nhạy (Threshold)</Label>
          <div
            className="w-full bg-white border border-indigo-200 rounded-lg shadow-sm transition-all hover:border-indigo-300 cursor-pointer h-10 flex items-center justify-between px-3"
            onClick={() => setSensitivityLevel(sensitivityLevel < 4 ? parseFloat((sensitivityLevel + 0.1).toFixed(1)) : 1)}
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 mr-2">
                <Gauge className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-indigo-700">Ngưỡng phát hiện</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "font-medium text-sm px-2.5 py-0.5 rounded-full",
                sensitivityLevel >= 3 ? "bg-red-100 text-red-700" :
                sensitivityLevel >= 2 ? "bg-amber-100 text-amber-700" :
                "bg-green-100 text-green-700"
              )}>
                {sensitivityLevel.toFixed(1)}
              </div>
              <ChevronDown className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-2 px-3">
            <div className="relative pt-1">
              <input
                type="range"
                min="1"
                max="4"
                step="0.1"
                value={sensitivityLevel}
                onChange={(e) => handleSensitivityChange([parseFloat(e.target.value)])}
                className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1.0</span>
                <span>2.0</span>
                <span>3.0</span>
                <span>4.0</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 italic">
              Giá trị thấp = ít bất thường hơn, giá trị cao = nhiều bất thường hơn
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="time-range" className="block mb-2">Khoảng thời gian</Label>
          <CustomDropdown
            options={[
              { value: 'all', label: 'Tất cả dữ liệu' },
              { value: 'last-week', label: '7 ngày qua' },
              { value: 'last-month', label: '30 ngày qua' },
              { value: 'last-quarter', label: '90 ngày qua' }
            ]}
            value={timeRange}
            onChange={setTimeRange}
            icon={<Calendar className="h-4 w-4 text-indigo-500" />}
            placeholder="Chọn khoảng thời gian"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Phát hiện bất thường: {selectedField}</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => {
                  // Cập nhật lại dữ liệu bất thường với các tham số hiện tại
                  if (data && selectedField) {
                    const anomalies = detectAnomalies(data, selectedField, sensitivityLevel);
                    setAnomalyData(anomalies);
                    const distribution = generateZScoreDistribution(anomalies, sensitivityLevel);
                    setZScoreDistribution(distribution);
                  }
                }}
              >
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
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" name="ID" />
                <YAxis dataKey="value" name="Giá trị" />
                <ZAxis range={[60, 60]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter
                  name="Dữ liệu bình thường"
                  data={anomalyData.filter(item => !item.isAnomaly)}
                  fill="#6366f1"
                />
                <Scatter
                  name="Bất thường"
                  data={anomalies}
                  fill="#f43f5e"
                  shape="triangle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 bg-amber-50 p-4 rounded-lg border border-amber-100">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full mt-1">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-800">Tóm tắt phát hiện</h4>
                <p className="text-sm text-amber-700 mt-1">
                  {anomalyData.length > 0 ? (
                    <>Đã phát hiện {anomalies.length} điểm dữ liệu bất thường trong {anomalyData.length} mẫu ({(anomalies.length / anomalyData.length * 100).toFixed(1)}%).</>
                  ) : (
                    <>Chưa có dữ liệu để phát hiện bất thường. Vui lòng chọn trường dữ liệu số.</>
                  )}
                  Sử dụng phương pháp {
                    detectionMethod === 'zscore' ? 'Z-Score' :
                    detectionMethod === 'iqr' ? 'IQR' :
                    detectionMethod === 'isolation' ? 'Isolation Forest' : 'DBSCAN'
                  } với ngưỡng {sensitivityLevel.toFixed(1)}.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Phân phối Z-Score</h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={zScoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bin" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Số lượng">
                    {zScoreDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isAnomaly ? '#f43f5e' : '#6366f1'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-start gap-3 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <Info className="h-5 w-5 text-indigo-600 mt-1" />
              <div>
                <h4 className="text-sm font-medium text-indigo-800">Thông tin</h4>
                <p className="text-sm text-indigo-700 mt-1">
                  Z-Score đo lường mức độ khác biệt của một điểm dữ liệu so với giá trị trung bình.
                  Các giá trị nằm ngoài khoảng [-{sensitivityLevel.toFixed(1)}, {sensitivityLevel.toFixed(1)}] được coi là bất thường.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Phân tích theo thời gian</h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartLineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    name="Giá trị"
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      if (payload.isAnomaly) {
                        return (
                          <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="#f43f5e" viewBox="0 0 24 24">
                            <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 8v2h2v-2h-2zm0-6v4h2V8h-2z" />
                          </svg>
                        );
                      }
                      return (
                        <circle cx={cx} cy={cy} r={4} fill="#6366f1" />
                      );
                    }}
                  />
                </RechartLineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-start gap-3 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <Search className="h-5 w-5 text-indigo-600 mt-1" />
              <div>
                <h4 className="text-sm font-medium text-indigo-800">Chi tiết</h4>
                <p className="text-sm text-indigo-700 mt-1">
                  Biểu đồ hiển thị các điểm bất thường (màu đỏ) trong chuỗi thời gian.
                  Các điểm này có thể chỉ ra sự kiện đặc biệt hoặc lỗi trong dữ liệu.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <TabsCustom
        defaultValue="anomaly-details"
        gridCols={2}
        layoutId="anomalyDetectionTabIndicator"
        wrapContent={false}
        tabs={[
          {
            id: 'anomaly-details',
            label: 'Chi tiết bất thường',
            icon: <AlertTriangle className="h-4 w-4" />
          },
          {
            id: 'recommendations',
            label: 'Khuyến nghị',
            icon: <Info className="h-4 w-4" />
          }
        ]}
      >

        <TabsContent value="anomaly-details">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Chi tiết các điểm bất thường</h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Z-Score</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mức độ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {anomalies.map((anomaly) => (
                      <tr key={anomaly.id}>
                        <td className="px-4 py-3 text-sm text-gray-500">{anomaly.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{anomaly.time}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{anomaly.value.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{anomaly.zScore.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            Math.abs(anomaly.zScore) > 3
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {Math.abs(anomaly.zScore) > 3 ? 'Nghiêm trọng' : 'Vừa phải'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Khuyến nghị và hành động</h3>

              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <h4 className="text-sm font-medium text-indigo-800 mb-2">Phân tích nguyên nhân</h4>
                  <p className="text-sm text-indigo-700">
                    Các điểm bất thường có thể do nhiều nguyên nhân khác nhau, bao gồm lỗi đo lường, sự kiện đặc biệt,
                    hoặc thay đổi trong quy trình. Nên kiểm tra lại nguồn dữ liệu và bối cảnh của các điểm này.
                  </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <h4 className="text-sm font-medium text-emerald-800 mb-2">Hành động đề xuất</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-emerald-700">
                    {anomalies.length > 0 ? (
                      <>
                        <li>Kiểm tra lại quy trình thu thập dữ liệu tại các điểm bất thường đã phát hiện</li>
                        <li>Xem xét loại bỏ các điểm bất thường trước khi thực hiện phân tích dự đoán</li>
                        <li>Thiết lập hệ thống cảnh báo để phát hiện bất thường trong thời gian thực</li>
                        <li>Điều chỉnh ngưỡng phát hiện dựa trên đặc điểm của dữ liệu và yêu cầu nghiệp vụ</li>
                      </>
                    ) : (
                      <li>Chưa có đủ dữ liệu để đưa ra khuyến nghị. Vui lòng chọn trường dữ liệu số và điều chỉnh ngưỡng phát hiện.</li>
                    )}
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <h4 className="text-sm font-medium text-amber-800 mb-2">Cải thiện mô hình</h4>
                  <p className="text-sm text-amber-700">
                    {anomalyData.length > 0 ? (
                      <>
                        Phương pháp {
                          detectionMethod === 'zscore' ? 'Z-Score' :
                          detectionMethod === 'iqr' ? 'IQR' :
                          detectionMethod === 'isolation' ? 'Isolation Forest' : 'DBSCAN'
                        } hoạt động tốt với dữ liệu hiện tại, nhưng có thể cân nhắc kết hợp nhiều phương pháp
                        để tăng độ chính xác. Đối với dữ liệu chuỗi thời gian, nên xem xét thêm các phương pháp
                        phát hiện bất thường dựa trên mô hình dự đoán.
                      </>
                    ) : (
                      <>Thử điều chỉnh ngưỡng phát hiện hoặc chọn trường dữ liệu khác để tìm các điểm bất thường. Phương pháp Z-Score hoạt động tốt nhất với dữ liệu có phân phối chuẩn.</>
                    )}
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

export default AnomalyDetection;
