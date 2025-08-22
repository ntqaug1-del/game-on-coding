import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Info, BarChart4, PieChart, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle, Lightbulb, Eye, EyeOff, BarChart3, ScatterChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import TabsCustom from '../ui/TabsCustom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart as RechartPieChart, Pie, Cell, ScatterChart as RechartScatterChart, Scatter, ZAxis } from 'recharts';

interface InsightsTabProps {
  results: any;
}

interface DataQualityScore {
  category: string;
  score: number;
  status: 'good' | 'warning' | 'bad';
  description: string;
}

interface DataInsight {
  id: string;
  type: 'warning' | 'trend' | 'info';
  title: string;
  description: string;
  field?: string;
  icon: React.ReactNode;
  expanded?: boolean;
  chartData?: any[];
  chartType?: 'bar' | 'line' | 'pie' | 'scatter';
}

interface InsightChartProps {
  data: any[];
  type: 'bar' | 'line' | 'pie' | 'scatter';
  field?: string;
}

const InsightChart: React.FC<InsightChartProps> = ({ data, type, field }) => {
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

  if (!data || data.length === 0) {
    return <div className="h-40 flex items-center justify-center text-gray-400">Không có dữ liệu</div>;
  }

  switch (type) {
    case 'bar':
      return (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="range" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    case 'line':
      return (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    case 'pie':
      return (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RechartPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartPieChart>
          </ResponsiveContainer>
        </div>
      );
    case 'scatter':
      return (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RechartScatterChart>
              <XAxis dataKey="x" name="x" fontSize={10} />
              <YAxis dataKey="y" name="y" fontSize={10} />
              <ZAxis range={[50, 50]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Values" data={data} fill="#6366f1" />
            </RechartScatterChart>
          </ResponsiveContainer>
        </div>
      );
    default:
      return <div className="h-40 flex items-center justify-center text-gray-400">Không hỗ trợ loại biểu đồ này</div>;
  }
};

const InsightsTab: React.FC<InsightsTabProps> = ({ results }) => {
  const [expandedInsights, setExpandedInsights] = useState<{[key: string]: boolean}>({});
  const [hiddenInsights, setHiddenInsights] = useState<{[key: string]: boolean}>({});

  // Chỉ số chất lượng dữ liệu
  const [dataQualityScores, setDataQualityScores] = useState<DataQualityScore[]>([]);
  const [insights, setInsights] = useState<DataInsight[]>([]);

  // Xử lý dữ liệu khi results thay đổi
  useEffect(() => {
    if (results) {
      // Tạo chỉ số chất lượng dữ liệu từ kết quả phân tích
      generateDataQualityScores();

      // Sử dụng insights từ kết quả phân tích nếu có
      if (results.insights && Array.isArray(results.insights)) {
        const formattedInsights = results.insights.map((insight: any) => {
          // Chuyển đổi icon từ chuỗi thành component
          let iconComponent;
          switch (insight.icon) {
            case 'AlertTriangle':
              iconComponent = <AlertTriangle className="h-5 w-5 text-amber-500" />;
              break;
            case 'TrendingUp':
              iconComponent = <TrendingUp className="h-5 w-5 text-blue-500" />;
              break;
            case 'BarChart3':
              iconComponent = <BarChart3 className="h-5 w-5 text-indigo-500" />;
              break;
            case 'AlertCircle':
              iconComponent = <AlertCircle className="h-5 w-5 text-red-500" />;
              break;
            case 'Info':
              iconComponent = <Info className="h-5 w-5 text-indigo-500" />;
              break;
            case 'ScatterChart':
              iconComponent = <ScatterChart className="h-5 w-5 text-purple-500" />;
              break;
            default:
              iconComponent = <Info className="h-5 w-5 text-indigo-500" />;
          }

          return {
            ...insight,
            icon: iconComponent
          };
        });

        setInsights(formattedInsights);
      } else {
        // Nếu không có insights, tạo một insight mặc định
        setInsights([{
          id: 'no-insights',
          type: 'info',
          title: 'Chưa có phát hiện',
          description: 'Chưa có phát hiện nào được tạo ra từ dữ liệu hiện tại.',
          icon: <Info className="h-5 w-5 text-indigo-500" />
        }]);
      }
    }
  }, [results]);

  // Tạo chỉ số chất lượng dữ liệu từ kết quả phân tích
  const generateDataQualityScores = () => {
    if (!results || !results.summary) return;

    const { rowCount, columnCount, missingValues, outliers } = results.summary;
    const totalCells = rowCount * columnCount;

    // Tính toán điểm chất lượng
    const completenessScore = Math.round(100 - (missingValues / totalCells * 100));
    const accuracyScore = Math.round(100 - (outliers / rowCount * 100));

    // Tạo chỉ số chất lượng dữ liệu
    const scores: DataQualityScore[] = [
      {
        category: 'Tính đầy đủ',
        score: completenessScore,
        status: completenessScore > 90 ? 'good' : (completenessScore > 70 ? 'warning' : 'bad'),
        description: `Dữ liệu có ${100 - completenessScore}% giá trị thiếu.`
      },
      {
        category: 'Tính chính xác',
        score: accuracyScore,
        status: accuracyScore > 90 ? 'good' : (accuracyScore > 70 ? 'warning' : 'bad'),
        description: `Phát hiện ${outliers} giá trị ngoại lệ (${100 - accuracyScore}% dữ liệu).`
      }
    ];

    setDataQualityScores(scores);
  };

  // Xử lý mở rộng/thu gọn insight
  const toggleInsightExpand = (id: string) => {
    setExpandedInsights(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Xử lý ẩn/hiện insight
  const toggleInsightVisibility = (id: string) => {
    setHiddenInsights(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Lọc các insights không bị ẩn
  const visibleInsights = insights.filter(insight => !hiddenInsights[insight.id]);

  // Hiển thị trạng thái của chỉ số chất lượng
  const getStatusIcon = (status: 'good' | 'warning' | 'bad') => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'bad':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Lấy màu cho thanh tiến trình dựa trên trạng thái
  const getProgressColor = (status: 'good' | 'warning' | 'bad') => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'bad':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <TabsCustom
        defaultValue="insights"
        gridCols={2}
        layoutId="insightsTabIndicator"
        tabs={[
          {
            id: 'insights',
            label: 'Phát hiện',
            icon: <Lightbulb className="h-4 w-4" />
          },
          {
            id: 'quality',
            label: 'Chất lượng dữ liệu',
            icon: <CheckCircle2 className="h-4 w-4" />
          }
        ]}>

        <TabsContent value="insights" className="space-y-4">
          {visibleInsights.length > 0 ? (
            visibleInsights.map((insight) => (
              <Card
                key={insight.id}
                className={`p-4 border-l-4 ${insight.type === 'warning' ? 'border-l-amber-500' :
                  insight.type === 'trend' ? 'border-l-blue-500' : 'border-l-indigo-500'}
                  hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start">
                  <div className="mt-0.5 mr-3">{insight.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-800">{insight.title}</h4>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => toggleInsightVisibility(insight.id)}
                        >
                          <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => toggleInsightExpand(insight.id)}
                        >
                          {expandedInsights[insight.id] ?
                            <ChevronUp className="h-4 w-4 text-gray-400 hover:text-gray-600" /> :
                            <ChevronDown className="h-4 w-4 text-gray-400 hover:text-gray-600" />}
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    {insight.field && <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">Trường: {insight.field}</span>}

                    {expandedInsights[insight.id] && insight.chartData && insight.chartType && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <InsightChart data={insight.chartData} type={insight.chartType} field={insight.field} />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Tất cả các phát hiện đã được ẩn. Làm mới trang để hiển thị lại.</p>
            </div>
          )}

          {hiddenInsights && Object.keys(hiddenInsights).length > 0 && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setHiddenInsights({})}
              >
                <Eye className="h-3.5 w-3.5 mr-1" />
                Hiện tất cả phát hiện
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-5">
            <h3 className="text-sm font-medium text-indigo-800 mb-4">Chỉ số chất lượng dữ liệu</h3>
            <div className="space-y-4">
              {dataQualityScores.map((score, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(score.status)}
                      <span className="ml-2 text-sm font-medium text-gray-700">{score.category}</span>
                    </div>
                    <span className="text-sm font-medium">{score.score}%</span>
                  </div>
                  <Progress
                    value={score.score}
                    className="h-2"
                    // indicatorClassName={getProgressColor(score.status)}
                  />
                  <p className="text-xs text-gray-500 mt-1">{score.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-5">
            <h3 className="text-sm font-medium text-indigo-800 mb-4">Tóm tắt dữ liệu</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Số lượng bản ghi:</span>
                  <span className="font-medium text-indigo-700">{results?.summary?.rowCount || 1000}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Số lượng trường:</span>
                  <span className="font-medium text-indigo-700">{results?.summary?.columnCount || 15}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Giá trị thiếu:</span>
                  <span className="font-medium text-indigo-700">{results?.summary?.missingValues || 150} ({((results?.summary?.missingValues || 150) / (results?.summary?.rowCount || 1000) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Giá trị ngoại lệ:</span>
                  <span className="font-medium text-indigo-700">{results?.summary?.outliers || 75} ({((results?.summary?.outliers || 75) / (results?.summary?.rowCount || 1000) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </TabsCustom>
    </div>
  );
};

export default InsightsTab;
