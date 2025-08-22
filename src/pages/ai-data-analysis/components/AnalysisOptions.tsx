import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, BrainCircuit, Sparkles, Database, BarChart3, Check, ChevronDown, Search, X, Hash, Text, Calendar, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import TabsCustom from './ui/TabsCustom';

interface AnalysisOptionsProps {
  data: any;
  onAnalyze: (options: any) => void;
  isProcessing: boolean;
}

const AnalysisOptions: React.FC<AnalysisOptionsProps> = ({ data, onAnalyze, isProcessing }) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [allColumns, setAllColumns] = useState<string[]>([]);
  const [analysisType, setAnalysisType] = useState<string>('descriptive');
  const [aiModel, setAiModel] = useState<string>('basic');
  const [isOpen, setIsOpen] = useState(false);
  const [isAiModelOpen, setIsAiModelOpen] = useState(false);
  const [columnSearchQuery, setColumnSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const aiModelDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState({
    cleanMissingValues: true,
    removeOutliers: false,
    normalizeData: true,
    correlationAnalysis: true,
    clusterAnalysis: false,
    timeSeriesAnalysis: false,
  });

  // Lấy danh sách cột từ dữ liệu
  useEffect(() => {
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      setAllColumns(columns);
      setSelectedColumns(columns);
    }
  }, [data]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (aiModelDropdownRef.current && !aiModelDropdownRef.current.contains(event.target as Node)) {
        setIsAiModelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Xử lý thay đổi tùy chọn
  const handleOptionChange = (option: string, value: boolean) => {
    setOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  // Xử lý chọn/bỏ chọn tất cả các cột
  const handleSelectAllColumns = (checked: boolean) => {
    if (checked) {
      setSelectedColumns(allColumns);
    } else {
      setSelectedColumns([]);
    }
  };

  // Xử lý chọn các cột theo loại
  const handleSelectColumnsByType = (type: string) => {
    // Đơn giản hóa: chỉ phân loại cột dựa trên tên
    let columnsToSelect: string[] = [];

    if (type === 'numeric') {
      // Chọn các cột có tên chứa các từ khóa liên quan đến số
      columnsToSelect = allColumns.filter(col =>
        /amount|price|cost|value|sum|total|count|number|qty|quantity|age|year|rate|ratio|percent/i.test(col)
      );
    } else if (type === 'date') {
      // Chọn các cột có tên chứa các từ khóa liên quan đến ngày tháng
      columnsToSelect = allColumns.filter(col =>
        /date|time|day|month|year|created|updated|timestamp/i.test(col)
      );
    } else if (type === 'text') {
      // Chọn các cột có tên chứa các từ khóa liên quan đến văn bản
      columnsToSelect = allColumns.filter(col =>
        /name|title|description|comment|address|email|phone|text|note|content|message/i.test(col)
      );
    } else if (type === 'id') {
      // Chọn các cột có tên chứa các từ khóa liên quan đến ID
      columnsToSelect = allColumns.filter(col =>
        /id$|_id|code|key|uuid|guid/i.test(col)
      );
    }

    // Cập nhật danh sách các cột đã chọn
    setSelectedColumns(prev => {
      // Tạo một tập hợp các cột đã chọn hiện tại
      const currentSelected = new Set(prev);

      // Thêm các cột mới vào tập hợp
      columnsToSelect.forEach(col => currentSelected.add(col));

      // Chuyển đổi trở lại thành mảng
      return Array.from(currentSelected);
    });
  };

  // Xử lý chọn/bỏ chọn một cột
  const handleColumnChange = (column: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns(prev => [...prev, column]);
    } else {
      setSelectedColumns(prev => prev.filter(col => col !== column));
    }
  };

  // Gửi tùy chọn phân tích
  const handleSubmit = () => {
    const analysisOptions = {
      columns: selectedColumns,
      type: analysisType,
      model: aiModel,
      ...options
    };

    onAnalyze(analysisOptions);
  };

  return (
    <div className="space-y-6">
      <TabsCustom
        defaultValue="columns"
        gridCols={4}
        layoutId="analysisOptionsTabIndicator"
        wrapContent={false}
        tabs={[
          {
            id: 'columns',
            label: 'Cột dữ liệu',
            icon: <Database className="h-4 w-4" />
          },
          {
            id: 'preprocessing',
            label: 'Tiền xử lý',
            icon: <Sparkles className="h-4 w-4" />
          },
          {
            id: 'analysis',
            label: 'Phân tích',
            icon: <BarChart3 className="h-4 w-4" />
          },
          {
            id: 'ai',
            label: 'Mô hình AI',
            icon: <BrainCircuit className="h-4 w-4" />
          }
        ]}
      >

        <TabsContent value="columns">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Search and select all header */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all"
                        checked={selectedColumns.length === allColumns.length}
                        onCheckedChange={(checked) => handleSelectAllColumns(checked as boolean)}
                        className="h-5 w-5"
                      />
                      <Label htmlFor="select-all" className="font-medium flex items-center">
                        <span>Chọn tất cả cột</span>
                        <Badge variant="outline" className="ml-2 bg-indigo-50 text-indigo-700 border-indigo-200">
                          {selectedColumns.length}/{allColumns.length}
                        </Badge>
                      </Label>
                    </div>

                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-indigo-400" />
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Tìm kiếm cột..."
                        value={columnSearchQuery}
                        onChange={(e) => setColumnSearchQuery(e.target.value)}
                        className="pl-8 pr-4 py-2 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-lg shadow-sm transition-all hover:border-indigo-300 hover:shadow bg-white h-9 text-sm"
                      />
                      {columnSearchQuery && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-7 w-7 rounded-full hover:bg-indigo-50 p-0"
                          onClick={() => setColumnSearchQuery('')}
                        >
                          <X className="h-3 w-3 text-indigo-500" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Quick select buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                      onClick={() => handleSelectColumnsByType('numeric')}
                    >
                      <Hash className="h-3 w-3 mr-1" />
                      Cột số
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                      onClick={() => handleSelectColumnsByType('text')}
                    >
                      <Text className="h-3 w-3 mr-1" />
                      Cột văn bản
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                      onClick={() => handleSelectColumnsByType('date')}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Cột ngày tháng
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                      onClick={() => handleSelectColumnsByType('id')}
                    >
                      <Key className="h-3 w-3 mr-1" />
                      Cột ID
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                      onClick={() => setSelectedColumns([])}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Bỏ chọn tất cả
                    </Button>
                  </div>
                </div>

                {/* Columns grid with filtered results */}
                <div className="mt-4">
                  {/* Filter message when no results */}
                  {allColumns.filter(column =>
                    column.toLowerCase().includes(columnSearchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                      Không tìm thấy cột nào phù hợp
                    </div>
                  )}

                  {/* Scrollable container for columns */}
                  <div className="max-h-[300px] overflow-y-auto pr-2 rounded-lg border border-indigo-100 bg-white shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
                      {allColumns
                        .filter(column => column.toLowerCase().includes(columnSearchQuery.toLowerCase()))
                        .map(column => {
                        // Determine column type based on name (simplified approach)
                        let columnIcon = <Database className="h-3 w-3 text-gray-400" />;
                        let columnTypeClass = "text-gray-400";

                        if (/amount|price|cost|value|sum|total|count|number|qty|quantity|age|year|rate|ratio|percent/i.test(column)) {
                          columnIcon = <Hash className="h-3 w-3 text-blue-500" />;
                          columnTypeClass = "text-blue-500";
                        } else if (/date|time|day|month|year|created|updated|timestamp/i.test(column)) {
                          columnIcon = <Calendar className="h-3 w-3 text-amber-500" />;
                          columnTypeClass = "text-amber-500";
                        } else if (/name|title|description|comment|address|email|phone|text|note|content|message/i.test(column)) {
                          columnIcon = <Text className="h-3 w-3 text-green-500" />;
                          columnTypeClass = "text-green-500";
                        } else if (/id$|_id|code|key|uuid|guid/i.test(column)) {
                          columnIcon = <Key className="h-3 w-3 text-purple-500" />;
                          columnTypeClass = "text-purple-500";
                        }

                        return (
                          <div
                            key={column}
                            className={cn(
                              "flex items-center p-2 rounded-lg border border-transparent hover:bg-indigo-50 hover:border-indigo-100 transition-colors",
                              selectedColumns.includes(column) && "bg-indigo-50 border-indigo-100"
                            )}
                            onClick={() => handleColumnChange(column, !selectedColumns.includes(column))}
                          >
                            <Checkbox
                              id={`column-${column}`}
                              checked={selectedColumns.includes(column)}
                              onCheckedChange={(checked) => handleColumnChange(column, checked as boolean)}
                              className="h-4 w-4 text-indigo-600 rounded"
                            />
                            <div className="ml-2 flex-1 overflow-hidden">
                              <Label
                                htmlFor={`column-${column}`}
                                className="text-sm font-medium cursor-pointer truncate block"
                                title={column} // Show full name on hover
                              >
                                {column}
                              </Label>
                              <div className="flex items-center mt-0.5">
                                {columnIcon}
                                <span className={`text-xs ${columnTypeClass} ml-1`}>
                                  {/amount|price|cost|value|sum|total|count|number|qty|quantity|age|year|rate|ratio|percent/i.test(column) && "Số"}
                                  {/date|time|day|month|year|created|updated|timestamp/i.test(column) && "Ngày tháng"}
                                  {/name|title|description|comment|address|email|phone|text|note|content|message/i.test(column) && "Văn bản"}
                                  {/id$|_id|code|key|uuid|guid/i.test(column) && "ID"}
                                  {!(/amount|price|cost|value|sum|total|count|number|qty|quantity|age|year|rate|ratio|percent|date|time|day|month|year|created|updated|timestamp|name|title|description|comment|address|email|phone|text|note|content|message|id$|_id|code|key|uuid|guid/i.test(column)) && "Dữ liệu"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preprocessing">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="clean-missing-values"
                    checked={options.cleanMissingValues}
                    onCheckedChange={(checked) => handleOptionChange('cleanMissingValues', checked as boolean)}
                  />
                  <Label htmlFor="clean-missing-values">Xử lý giá trị thiếu</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remove-outliers"
                    checked={options.removeOutliers}
                    onCheckedChange={(checked) => handleOptionChange('removeOutliers', checked as boolean)}
                  />
                  <Label htmlFor="remove-outliers">Loại bỏ giá trị ngoại lệ</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="normalize-data"
                    checked={options.normalizeData}
                    onCheckedChange={(checked) => handleOptionChange('normalizeData', checked as boolean)}
                  />
                  <Label htmlFor="normalize-data">Chuẩn hóa dữ liệu</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="analysis-type" className="block mb-2">Loại phân tích</Label>
                  <div className="relative">
                    {/* Selector button */}
                    <div
                      onClick={() => setIsOpen(!isOpen)}
                      className={cn(
                        "w-full bg-white border border-indigo-200 focus:border-indigo-400 h-10 px-3 py-2 rounded-lg shadow-sm transition-all hover:border-indigo-300 hover:shadow flex items-center justify-between cursor-pointer",
                        isOpen ? "ring-2 ring-indigo-400 border-indigo-400" : ""
                      )}
                    >
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-indigo-500" />
                        <span className="text-sm font-medium text-indigo-700">
                          {analysisType === 'descriptive' && 'Phân tích mô tả'}
                          {analysisType === 'exploratory' && 'Phân tích khám phá'}
                          {analysisType === 'predictive' && 'Phân tích dự đoán'}
                          {analysisType === 'diagnostic' && 'Phân tích chẩn đoán'}
                        </span>
                      </div>
                      <ChevronDown className={cn(
                        "h-4 w-4 text-indigo-400 transition-transform duration-200",
                        isOpen && "transform rotate-180"
                      )} />
                    </div>

                    {/* Dropdown menu */}
                    {isOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-indigo-100 shadow-xl rounded-lg p-2 z-50 animate-in fade-in-80 zoom-in-95">
                        <div className="max-h-[200px] overflow-y-auto py-1">
                          <div
                            className={cn(
                              "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group",
                              analysisType === 'descriptive' && "bg-indigo-50 text-indigo-700"
                            )}
                            onClick={() => {
                              setAnalysisType('descriptive');
                              setIsOpen(false);
                            }}
                          >
                            <div className="flex-1 truncate pr-4">Phân tích mô tả</div>
                            {analysisType === 'descriptive' && <Check className="h-4 w-4 text-indigo-500" />}
                          </div>

                          <div
                            className={cn(
                              "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group",
                              analysisType === 'exploratory' && "bg-indigo-50 text-indigo-700"
                            )}
                            onClick={() => {
                              setAnalysisType('exploratory');
                              setIsOpen(false);
                            }}
                          >
                            <div className="flex-1 truncate pr-4">Phân tích khám phá</div>
                            {analysisType === 'exploratory' && <Check className="h-4 w-4 text-indigo-500" />}
                          </div>

                          <div
                            className={cn(
                              "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group",
                              analysisType === 'predictive' && "bg-indigo-50 text-indigo-700"
                            )}
                            onClick={() => {
                              setAnalysisType('predictive');
                              setIsOpen(false);
                            }}
                          >
                            <div className="flex-1 truncate pr-4">Phân tích dự đoán</div>
                            {analysisType === 'predictive' && <Check className="h-4 w-4 text-indigo-500" />}
                          </div>

                          <div
                            className={cn(
                              "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group",
                              analysisType === 'diagnostic' && "bg-indigo-50 text-indigo-700"
                            )}
                            onClick={() => {
                              setAnalysisType('diagnostic');
                              setIsOpen(false);
                            }}
                          >
                            <div className="flex-1 truncate pr-4">Phân tích chẩn đoán</div>
                            {analysisType === 'diagnostic' && <Check className="h-4 w-4 text-indigo-500" />}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="correlation-analysis"
                    checked={options.correlationAnalysis}
                    onCheckedChange={(checked) => handleOptionChange('correlationAnalysis', checked as boolean)}
                  />
                  <Label htmlFor="correlation-analysis">Phân tích tương quan</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cluster-analysis"
                    checked={options.clusterAnalysis}
                    onCheckedChange={(checked) => handleOptionChange('clusterAnalysis', checked as boolean)}
                  />
                  <Label htmlFor="cluster-analysis">Phân tích phân cụm</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="time-series-analysis"
                    checked={options.timeSeriesAnalysis}
                    onCheckedChange={(checked) => handleOptionChange('timeSeriesAnalysis', checked as boolean)}
                  />
                  <Label htmlFor="time-series-analysis">Phân tích chuỗi thời gian</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ai-model" className="block mb-2">Mô hình AI</Label>
                  <div className="relative" ref={aiModelDropdownRef}>
                    {/* Selector button */}
                    <div
                      onClick={() => setIsAiModelOpen(!isAiModelOpen)}
                      className={cn(
                        "w-full bg-white border border-indigo-200 focus:border-indigo-400 h-10 px-3 py-2 rounded-lg shadow-sm transition-all hover:border-indigo-300 hover:shadow flex items-center justify-between cursor-pointer",
                        isAiModelOpen ? "ring-2 ring-indigo-400 border-indigo-400" : ""
                      )}
                    >
                      <div className="flex items-center">
                        <BrainCircuit className="h-4 w-4 mr-2 text-indigo-500" />
                        <span className="text-sm font-medium text-indigo-700">
                          {aiModel === 'basic' && 'Phân tích cơ bản'}
                          {aiModel === 'regression' && 'Hồi quy tuyến tính'}
                          {aiModel === 'classification' && 'Phân loại'}
                          {aiModel === 'clustering' && 'Phân cụm'}
                          {aiModel === 'neural-network' && 'Mạng nơ-ron'}
                        </span>
                      </div>
                      <ChevronDown className={cn(
                        "h-4 w-4 text-indigo-400 transition-transform duration-200",
                        isAiModelOpen && "transform rotate-180"
                      )} />
                    </div>

                    {/* Dropdown menu */}
                    {isAiModelOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-indigo-100 shadow-xl rounded-lg p-2 z-50 animate-in fade-in-80 zoom-in-95">
                        <div className="max-h-[200px] overflow-y-auto py-1">
                          <div
                            className={cn(
                              "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group",
                              aiModel === 'basic' && "bg-indigo-50 text-indigo-700"
                            )}
                            onClick={() => {
                              setAiModel('basic');
                              setIsAiModelOpen(false);
                            }}
                          >
                            <div className="flex-1 truncate pr-4">Phân tích cơ bản</div>
                            {aiModel === 'basic' && <Check className="h-4 w-4 text-indigo-500" />}
                          </div>

                          <div
                            className={cn(
                              "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group",
                              aiModel === 'regression' && "bg-indigo-50 text-indigo-700"
                            )}
                            onClick={() => {
                              setAiModel('regression');
                              setIsAiModelOpen(false);
                            }}
                          >
                            <div className="flex-1 truncate pr-4">Hồi quy tuyến tính</div>
                            {aiModel === 'regression' && <Check className="h-4 w-4 text-indigo-500" />}
                          </div>

                          <div
                            className={cn(
                              "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group",
                              aiModel === 'classification' && "bg-indigo-50 text-indigo-700"
                            )}
                            onClick={() => {
                              setAiModel('classification');
                              setIsAiModelOpen(false);
                            }}
                          >
                            <div className="flex-1 truncate pr-4">Phân loại</div>
                            {aiModel === 'classification' && <Check className="h-4 w-4 text-indigo-500" />}
                          </div>

                          <div
                            className={cn(
                              "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group",
                              aiModel === 'clustering' && "bg-indigo-50 text-indigo-700"
                            )}
                            onClick={() => {
                              setAiModel('clustering');
                              setIsAiModelOpen(false);
                            }}
                          >
                            <div className="flex-1 truncate pr-4">Phân cụm</div>
                            {aiModel === 'clustering' && <Check className="h-4 w-4 text-indigo-500" />}
                          </div>

                          <div
                            className={cn(
                              "py-2 px-3 text-sm cursor-pointer rounded-md my-0.5 font-medium hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between group",
                              aiModel === 'neural-network' && "bg-indigo-50 text-indigo-700"
                            )}
                            onClick={() => {
                              setAiModel('neural-network');
                              setIsAiModelOpen(false);
                            }}
                          >
                            <div className="flex-1 truncate pr-4">Mạng nơ-ron</div>
                            {aiModel === 'neural-network' && <Check className="h-4 w-4 text-indigo-500" />}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-4">
                  <h3 className="text-sm font-medium text-indigo-800 mb-2 flex items-center">
                    <BrainCircuit className="h-4 w-4 mr-2" />
                    Thông tin mô hình
                  </h3>
                  <p className="text-sm text-indigo-700">
                    {aiModel === 'basic' && 'Phân tích cơ bản sử dụng các thuật toán thống kê để cung cấp thông tin tổng quan về dữ liệu.'}
                    {aiModel === 'regression' && 'Hồi quy tuyến tính dự đoán giá trị số dựa trên mối quan hệ giữa các biến.'}
                    {aiModel === 'classification' && 'Phân loại dữ liệu vào các nhóm dựa trên các đặc trưng.'}
                    {aiModel === 'clustering' && 'Phân cụm nhóm dữ liệu tương tự nhau mà không cần nhãn trước.'}
                    {aiModel === 'neural-network' && 'Mạng nơ-ron mô phỏng cách não bộ hoạt động để nhận dạng mẫu phức tạp trong dữ liệu.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </TabsCustom>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || selectedColumns.length === 0}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang phân tích...
            </>
          ) : (
            <>
              <BrainCircuit className="mr-2 h-4 w-4" />
              Phân tích dữ liệu
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AnalysisOptions;
