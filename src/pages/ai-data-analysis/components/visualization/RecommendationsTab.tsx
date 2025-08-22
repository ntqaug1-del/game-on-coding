import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bookmark, BookmarkCheck, Link, CheckCircle, ChevronDown, ChevronUp, ExternalLink, ArrowRight, Clock, CheckCircle2, Tag, Filter, BarChart4, Database, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RecommendationsTabProps {
  results: any;
  savedRecommendations: {[key: string]: boolean};
  setSavedRecommendations: (recommendations: {[key: string]: boolean}) => void;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'data_cleaning' | 'feature_engineering' | 'model_selection' | 'visualization';
  status?: 'read' | 'unread' | 'implemented';
  tools?: {
    name: string;
    url: string;
    icon: React.ReactNode;
  }[];
  expanded?: boolean;
}

interface CategoryInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
  count: number;
}

const RecommendationsTab: React.FC<RecommendationsTabProps> = ({
  results,
  savedRecommendations,
  setSavedRecommendations
}) => {
  // Xử lý lưu/bỏ lưu đề xuất
  const toggleSaveRecommendation = (id: string) => {
    setSavedRecommendations({
      ...savedRecommendations,
      [id]: !savedRecommendations[id]
    });
  };

  return (
    <div className="space-y-4">
      <div className={cn(
        "bg-white border rounded-lg p-4 shadow-sm transition-all",
        savedRecommendations['outliers'] ? "border-green-300 bg-green-50" : "border-gray-200"
      )}>
        <div className="flex items-start">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <h4 className="text-sm font-medium text-gray-800">Xử lý giá trị ngoại lệ</h4>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Quan trọng</span>
            </div>
            <p className="text-sm text-gray-600">Xem xét loại bỏ các giá trị ngoại lệ để cải thiện độ chính xác của mô hình. Phát hiện 12% giá trị ngoại lệ trong dữ liệu.</p>
            <div className="mt-2 flex items-center">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2 mr-2"
                onClick={() => toggleSaveRecommendation('outliers')}
              >
                {savedRecommendations['outliers'] ? (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5 mr-1" />
                    Đã lưu
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5 mr-1" />
                    Lưu
                  </>
                )}
              </Button>
              <Button
                variant="link"
                size="sm"
                className="text-xs h-7 px-2"
              >
                <Link className="h-3.5 w-3.5 mr-1" />
                Xem hướng dẫn
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "bg-white border rounded-lg p-4 shadow-sm transition-all",
        savedRecommendations['missing'] ? "border-green-300 bg-green-50" : "border-gray-200"
      )}>
        <div className="flex items-start">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <h4 className="text-sm font-medium text-gray-800">Điền giá trị thiếu</h4>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Đề xuất</span>
            </div>
            <p className="text-sm text-gray-600">Sử dụng phương pháp điền giá trị thiếu (imputation) thay vì loại bỏ các dòng có giá trị thiếu để tránh mất thông tin quan trọng.</p>
            <div className="mt-2 flex items-center">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2 mr-2"
                onClick={() => toggleSaveRecommendation('missing')}
              >
                {savedRecommendations['missing'] ? (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5 mr-1" />
                    Đã lưu
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5 mr-1" />
                    Lưu
                  </>
                )}
              </Button>
              <Button
                variant="link"
                size="sm"
                className="text-xs h-7 px-2"
              >
                <Link className="h-3.5 w-3.5 mr-1" />
                Xem hướng dẫn
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "bg-white border rounded-lg p-4 shadow-sm transition-all",
        savedRecommendations['normalization'] ? "border-green-300 bg-green-50" : "border-gray-200"
      )}>
        <div className="flex items-start">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <h4 className="text-sm font-medium text-gray-800">Chuẩn hóa dữ liệu</h4>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Tùy chọn</span>
            </div>
            <p className="text-sm text-gray-600">Chuẩn hóa các biến số để đưa chúng về cùng một thang đo, giúp cải thiện hiệu suất của các thuật toán học máy nhạy cảm với quy mô.</p>
            <div className="mt-2 flex items-center">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2 mr-2"
                onClick={() => toggleSaveRecommendation('normalization')}
              >
                {savedRecommendations['normalization'] ? (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5 mr-1" />
                    Đã lưu
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5 mr-1" />
                    Lưu
                  </>
                )}
              </Button>
              <Button
                variant="link"
                size="sm"
                className="text-xs h-7 px-2"
              >
                <Link className="h-3.5 w-3.5 mr-1" />
                Xem hướng dẫn
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "bg-white border rounded-lg p-4 shadow-sm transition-all",
        savedRecommendations['feature_selection'] ? "border-green-300 bg-green-50" : "border-gray-200"
      )}>
        <div className="flex items-start">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <h4 className="text-sm font-medium text-gray-800">Lựa chọn đặc trưng</h4>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Đề xuất</span>
            </div>
            <p className="text-sm text-gray-600">Sử dụng phương pháp lựa chọn đặc trưng để giảm số lượng biến và tập trung vào các biến quan trọng nhất, giúp cải thiện hiệu suất mô hình.</p>
            <div className="mt-2 flex items-center">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2 mr-2"
                onClick={() => toggleSaveRecommendation('feature_selection')}
              >
                {savedRecommendations['feature_selection'] ? (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5 mr-1" />
                    Đã lưu
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5 mr-1" />
                    Lưu
                  </>
                )}
              </Button>
              <Button
                variant="link"
                size="sm"
                className="text-xs h-7 px-2"
              >
                <Link className="h-3.5 w-3.5 mr-1" />
                Xem hướng dẫn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsTab;
