import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import CustomDropdown from "../ui/CustomDropdown";

interface StatisticsTabProps {
  results: any;
  filterText: string;
  setFilterText: (text: string) => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

interface FilterRange {
  min: number | null;
  max: number | null;
}

interface SparklineTooltipProps {
  active?: boolean;
  payload?: any[];
}



const SparklineTooltip: React.FC<SparklineTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-sm text-xs">
        <p className="font-medium">{`Giá trị: ${payload[0].value.toFixed(1)}`}</p>
      </div>
    );
  }
  return null;
};

const StatisticsTab: React.FC<StatisticsTabProps> = ({
  results,
  filterText,
  setFilterText,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection
}) => {
  // State cho phân trang và bộ lọc
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const [filterRanges, setFilterRanges] = useState<Record<string, FilterRange>>({
    mean: { min: null, max: null },
    median: { min: null, max: null },
    stdDev: { min: null, max: null },
    min: { min: null, max: null },
    max: { min: null, max: null }
  });

  // Sử dụng dữ liệu thống kê từ kết quả phân tích
  const statisticsData = results?.fieldStats || [];

  // Tạo dữ liệu xu hướng nếu chưa có
  const processedStatisticsData = statisticsData.map((item: any) => {
    // Chỉ xử lý các trường số
    if (item.type !== 'numeric') return null;

    // Sử dụng dữ liệu xu hướng nếu có, hoặc tạo mới
    const trend = item.trend || Array(10).fill(0).map((_, i) => ({ value: item.values.min + Math.random() * (item.values.max - item.values.min) }));

    return {
      ...item,
      trend
    };
  }).filter(Boolean);

  // Tính toán xu hướng cho mỗi trường
  const calculateTrend = (trend: any[]) => {
    if (trend?.length < 2) return 'neutral';
    const firstValue = trend[0].value;
    const lastValue = trend[trend.length - 1].value;
    if (lastValue > firstValue) return 'up';
    if (lastValue < firstValue) return 'down';
    return 'neutral';
  };

  // Lọc dữ liệu theo văn bản tìm kiếm và khoảng giá trị
  const filteredData = processedStatisticsData.filter((item: any) => {
    // Lọc theo tên trường
    if (!item.field.toLowerCase().includes(filterText.toLowerCase())) {
      return false;
    }

    // Lọc theo khoảng giá trị
    for (const [field, range] of Object.entries(filterRanges)) {
      if (range.min !== null && item.values[field] < range.min) return false;
      if (range.max !== null && item.values[field] > range.max) return false;
    }

    return true;
  });

  // Sắp xếp dữ liệu
  const sortedData = [...filteredData].sort((a: any, b: any) => {
    let valueA, valueB;

    if (sortField === 'name') {
      valueA = a.field;
      valueB = b.field;
    } else {
      valueA = a.values[sortField];
      valueB = b.values[sortField];
    }

    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  // Phân trang
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Xử lý thay đổi trường sắp xếp
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Xử lý thay đổi bộ lọc khoảng giá trị
  const handleRangeFilterChange = (field: string, type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setFilterRanges(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: numValue
      }
    }));
  };

  // Xử lý xóa tất cả bộ lọc
  const clearAllFilters = () => {
    setFilterText('');
    setFilterRanges({
      mean: { min: null, max: null },
      median: { min: null, max: null },
      stdDev: { min: null, max: null },
      min: { min: null, max: null },
      max: { min: null, max: null }
    });
  };

  // Lấy biểu tượng sắp xếp
  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-indigo-500" />
          <Input
            type="text"
            placeholder="Tìm kiếm trường dữ liệu..."
            className="pl-8 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-lg shadow-sm transition-all hover:border-indigo-300 hover:shadow"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <div className="relative" ref={useRef<HTMLDivElement>(null)}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-white border border-indigo-200 h-10 px-3 py-2 rounded-lg shadow-sm transition-all hover:border-indigo-300 hover:shadow flex items-center gap-1"
              >
                <Filter className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-medium text-indigo-700">Bộ lọc</span>
                <ChevronDown className="h-4 w-4 text-indigo-400 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px] border border-indigo-100 shadow-xl rounded-lg p-2 z-50">
              <div className="p-2">
                <div className="font-medium text-sm mb-2 text-indigo-700">Lọc theo giá trị</div>

                {Object.entries(filterRanges).map(([field, range]) => (
                  <div key={field} className="mb-2">
                    <div className="text-xs text-indigo-500 mb-1 capitalize">{field === 'stdDev' ? 'Độ lệch chuẩn' : field}</div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="h-8 text-xs border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-lg"
                        value={range.min === null ? '' : range.min}
                        onChange={(e) => handleRangeFilterChange(field, 'min', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        className="h-8 text-xs border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-lg"
                        value={range.max === null ? '' : range.max}
                        onChange={(e) => handleRangeFilterChange(field, 'max', e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg"
                  onClick={clearAllFilters}
                >
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CustomDropdown
          options={[
            { value: '5', label: '5 dòng' },
            { value: '10', label: '10 dòng' },
            { value: '20', label: '20 dòng' },
            { value: '50', label: '50 dòng' }
          ]}
          value={itemsPerPage.toString()}
          onChange={(value) => setItemsPerPage(parseInt(value))}
          icon={<SlidersHorizontal className="h-4 w-4 text-indigo-500" />}
          className="w-[130px]"
        />

        <Button
          variant="outline"
          className="bg-white border border-indigo-200 h-10 px-3 py-2 rounded-lg shadow-sm transition-all hover:border-indigo-300 hover:shadow text-sm font-medium text-indigo-700"
          onClick={() => setFilterText('')}
          disabled={!filterText && Object.values(filterRanges).every(range => range.min === null && range.max === null)}
        >
          Xóa bộ lọc
        </Button>
      </div>

      {/* Bảng thống kê */}
      <div className="rounded-xl border border-indigo-100 shadow-md hover:shadow-lg transition-all duration-300 hover:border-indigo-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-indigo-50 hover:bg-indigo-50 border-b border-indigo-100">
              <TableHead className="font-medium cursor-pointer text-indigo-700" onClick={() => handleSortChange('name')}>
                <div className="flex items-center gap-1">
                  <span>Trường</span>
                  {getSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="font-medium cursor-pointer text-indigo-700" onClick={() => handleSortChange('mean')}>
                <div className="flex items-center gap-1">
                  <span>Trung bình</span>
                  {getSortIcon('mean')}
                </div>
              </TableHead>
              <TableHead className="font-medium cursor-pointer text-indigo-700" onClick={() => handleSortChange('median')}>
                <div className="flex items-center gap-1">
                  <span>Trung vị</span>
                  {getSortIcon('median')}
                </div>
              </TableHead>
              <TableHead className="font-medium cursor-pointer text-indigo-700" onClick={() => handleSortChange('stdDev')}>
                <div className="flex items-center gap-1">
                  <span>Độ lệch chuẩn</span>
                  {getSortIcon('stdDev')}
                </div>
              </TableHead>
              <TableHead className="font-medium cursor-pointer text-indigo-700" onClick={() => handleSortChange('min')}>
                <div className="flex items-center gap-1">
                  <span>Min</span>
                  {getSortIcon('min')}
                </div>
              </TableHead>
              <TableHead className="font-medium cursor-pointer text-indigo-700" onClick={() => handleSortChange('max')}>
                <div className="flex items-center gap-1">
                  <span>Max</span>
                  {getSortIcon('max')}
                </div>
              </TableHead>
              <TableHead className="font-medium text-indigo-700">
                <span>Xu hướng</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item: any) => {
              const { field, values, trend } = item;
              const trendDirection = calculateTrend(trend);
              const trendColor = trendDirection === 'up' ? '#10b981' : trendDirection === 'down' ? '#ef4444' : '#6366f1';

              return (
                <TableRow key={field} className="hover:bg-indigo-50/30 border-b border-indigo-50 transition-colors">
                  <TableCell className="font-medium text-indigo-700">{field}</TableCell>
                  <TableCell className="text-indigo-600">{values.mean.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}</TableCell>
                  <TableCell className="text-indigo-600">{values.median.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}</TableCell>
                  <TableCell className="text-indigo-600">{values.stdDev.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}</TableCell>
                  <TableCell className="text-indigo-600">{values.min.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}</TableCell>
                  <TableCell className="text-indigo-600">{values.max.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}</TableCell>
                  <TableCell>
                    <div className="w-24 h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trend}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={trendColor}
                            strokeWidth={1.5}
                            dot={false}
                            isAnimationActive={false}
                          />
                          <Tooltip content={<SparklineTooltip />} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-indigo-400">
                  Không tìm thấy dữ liệu phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-indigo-500 font-medium">
            Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData.length)} trên tổng số {sortedData.length} kết quả
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg h-9 w-9 p-0"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium text-indigo-700 px-2">
              Trang {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg h-9 w-9 p-0"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsTab;
