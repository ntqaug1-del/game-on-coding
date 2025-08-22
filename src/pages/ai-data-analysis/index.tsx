import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, BarChart3, TrendingUp, AlertTriangle, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TabsCustom from './components/ui/TabsCustom';
import Footer from '@/components/Footer';
import DataUploader from './components/DataUploader';
import AnalysisOptions from './components/AnalysisOptions';
import VisualizationPanel from './components/VisualizationPanel.tsx';
import TrendPrediction from './components/TrendPrediction';
import AnomalyDetection from './components/AnomalyDetection';
import ReportGenerator from './components/ReportGenerator';
import { analyzeData, generateInsights } from './utils/dataAnalysisUtils';

const AIDataAnalysis = () => {
  // State để lưu trữ dữ liệu đã tải lên
  const [uploadedData, setUploadedData] = useState<any>(null);
  // State để lưu trữ kết quả phân tích
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  // State để theo dõi tab hiện tại
  const [activeTab, setActiveTab] = useState('upload');
  // State để theo dõi trạng thái đang xử lý
  const [isProcessing, setIsProcessing] = useState(false);

  // Xử lý khi dữ liệu được tải lên
  const handleDataUpload = (data: any) => {
    setUploadedData(data);
    setActiveTab('analyze');
  };

  // Xử lý khi phân tích dữ liệu
  const handleAnalyze = (options: any) => {
    setIsProcessing(true);

    // Lọc dữ liệu theo các cột được chọn nếu cần
    let dataToAnalyze = uploadedData;
    if (options.columns && options.columns.length > 0) {
      dataToAnalyze = uploadedData.map((row: any) => {
        const filteredRow: any = {};
        options.columns.forEach((col: string) => {
          filteredRow[col] = row[col];
        });
        return filteredRow;
      });
    }

    // Phân tích dữ liệu với các tùy chọn đã chọn
    setTimeout(() => {
      try {
        // Phân tích dữ liệu thực tế từ file đã tải lên
        const results = analyzeData(dataToAnalyze);

        // Tạo insights từ dữ liệu đã phân tích
        const insights = generateInsights(dataToAnalyze, results);
        results.insights = insights;

        setAnalysisResults(results);
        setIsProcessing(false);
        setActiveTab('visualize');
      } catch (error) {
        console.error('Error analyzing data:', error);
        setIsProcessing(false);
        // Có thể hiển thị thông báo lỗi ở đây
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-4 sm:mb-6">
            <Button asChild variant="ghost" className="mb-4 sm:mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại Trang chủ
              </Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg mr-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Phân tích dữ liệu với AI
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Khám phá, phân tích và trực quan hóa dữ liệu của bạn với sức mạnh của AI
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <TabsCustom
              gridCols={6}
              layoutId="activeTabIndicator"
              wrapContent={false}
              defaultValue="upload"
            tabs={[
              {
                id: 'upload',
                icon: <Upload className="h-4 w-4" />,
                label: 'Tải lên'
              },
              {
                id: 'analyze',
                icon: <Database className="h-4 w-4" />,
                label: 'Phân tích',
                disabled: !uploadedData
              },
              {
                id: 'visualize',
                icon: <BarChart3 className="h-4 w-4" />,
                label: 'Trực quan hóa',
                disabled: !analysisResults
              },
              {
                id: 'predict',
                icon: <TrendingUp className="h-4 w-4" />,
                label: 'Dự đoán',
                disabled: !analysisResults
              },
              {
                id: 'anomalies',
                icon: <AlertTriangle className="h-4 w-4" />,
                label: 'Phát hiện bất thường',
                disabled: !analysisResults
              },
              {
                id: 'report',
                icon: <FileText className="h-4 w-4" />,
                label: 'Báo cáo',
                disabled: !analysisResults
              },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >

            <TabsContent value="upload" className="space-y-4 pt-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Upload className="h-5 w-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-800">Tải lên dữ liệu</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Tải lên tệp dữ liệu của bạn để bắt đầu phân tích. Hỗ trợ các định dạng CSV, JSON, Excel.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataUploader onDataUpload={handleDataUpload} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analyze" className="space-y-4 pt-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Database className="h-5 w-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-800">Phân tích dữ liệu</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Chọn các tùy chọn phân tích và thuật toán AI để áp dụng cho dữ liệu của bạn.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalysisOptions
                    data={uploadedData}
                    onAnalyze={handleAnalyze}
                    isProcessing={isProcessing}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visualize" className="space-y-4 pt-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-800">Trực quan hóa dữ liệu</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Khám phá dữ liệu của bạn thông qua các biểu đồ và trực quan hóa tương tác.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VisualizationPanel results={analysisResults} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="predict" className="space-y-4 pt-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-800">Dự đoán xu hướng</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Sử dụng mô hình dự đoán để xác định xu hướng và dự báo giá trị trong tương lai.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TrendPrediction data={uploadedData} results={analysisResults} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="anomalies" className="space-y-4 pt-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-800">Phát hiện bất thường</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Xác định các điểm dữ liệu bất thường và ngoại lệ trong tập dữ liệu của bạn.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnomalyDetection data={uploadedData} results={analysisResults} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="report" className="space-y-4 pt-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-800">Tạo báo cáo</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Tạo báo cáo tự động với các phân tích, biểu đồ và thông tin chi tiết.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReportGenerator data={uploadedData} results={analysisResults} />
                </CardContent>
              </Card>
            </TabsContent>
          </TabsCustom>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AIDataAnalysis;
