import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Mail, Clock, Calendar, Settings, Loader2, Check, Copy, FileDown, FileType, FileOutput, Smartphone } from 'lucide-react';
import TabsCustom from './ui/TabsCustom';
import CustomDropdown from './ui/CustomDropdown';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, HeadingLevel, TextRun, BorderStyle } from 'docx';
import * as XLSX from 'xlsx';

interface ReportGeneratorProps {
  data: any;
  results: any;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ data, results }) => {
  const [reportType, setReportType] = useState<string>('executive');
  const [reportFormat, setReportFormat] = useState<string>('docx');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [reportTitle, setReportTitle] = useState<string>('Báo cáo phân tích dữ liệu');
  const [reportDescription, setReportDescription] = useState<string>('Báo cáo tóm tắt kết quả phân tích dữ liệu và các thông tin chi tiết.');
  const [scheduleType, setScheduleType] = useState<string>('once');
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'summary', 'visualizations', 'trends', 'anomalies', 'recommendations'
  ]);

  // Thêm state cho tùy chỉnh giao diện báo cáo
  const [reportTheme, setReportTheme] = useState<string>('default');
  const [reportFont, setReportFont] = useState<string>('arial');
  const [reportAccentColor, setReportAccentColor] = useState<string>('#4f46e5'); // Indigo-600
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Xử lý khi chọn/bỏ chọn một phần của báo cáo
  const handleSectionChange = (section: string, checked: boolean) => {
    if (checked) {
      setSelectedSections(prev => [...prev, section]);
    } else {
      setSelectedSections(prev => prev.filter(s => s !== section));
    }
  };

  // Tham chiếu đến báo cáo đã tạo
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const reportContentRef = useRef<HTMLDivElement>(null);

  // Xử lý khi tạo báo cáo
  const handleGenerateReport = () => {
    setIsGenerating(true);

    // Tạo nội dung báo cáo dựa trên dữ liệu và kết quả phân tích
    setTimeout(() => {
      try {
        // Tạo cấu trúc báo cáo
        const report = {
          title: reportTitle,
          description: reportDescription,
          type: reportType,
          format: reportFormat,
          sections: selectedSections,
          createdAt: new Date().toISOString(),
          summary: results?.summary || {},
          insights: results?.insights || [],
          fieldStats: results?.fieldStats || [],
          correlations: results?.correlations || [],
          distributions: results?.distributions || [],
          theme: reportTheme,
          font: reportFont,
          accentColor: reportAccentColor,
          content: generateReportContent()
        };

        setGeneratedReport(report);
        setIsGenerating(false);
        setIsGenerated(true);
      } catch (error) {
        console.error('Error generating report:', error);
        setIsGenerating(false);
        alert('Có lỗi xảy ra khi tạo báo cáo. Vui lòng thử lại sau.');
      }
    }, 2000);
  };

  // Tạo nội dung báo cáo
  const generateReportContent = () => {
    const content = [];

    // Thêm các phần vào báo cáo dựa trên các phần đã chọn
    if (selectedSections.includes('summary')) {
      // Tạo phần tóm tắt chi tiết hơn
      const summarySection = {
        title: 'Tóm tắt',
        text: `Báo cáo này phân tích ${results?.summary?.rowCount || 0} dòng dữ liệu với ${results?.summary?.columnCount || 0} trường. Phát hiện ${results?.summary?.missingValues || 0} giá trị thiếu và ${results?.summary?.outliers || 0} giá trị ngoại lệ.`,
        summaryData: {
          rowCount: results?.summary?.rowCount || 0,
          columnCount: results?.summary?.columnCount || 0,
          missingValues: results?.summary?.missingValues || 0,
          outliers: results?.summary?.outliers || 0
        },
        insights: results?.insights?.filter((insight: any) => insight.type === 'summary') || []
      };

      // Thêm thông tin về các trường dữ liệu
      if (results?.fieldStats && results.fieldStats.length > 0) {
        summarySection.fieldTypes = {
          numeric: results.fieldStats.filter((stat: any) => stat.type === 'numeric').length,
          categorical: results.fieldStats.filter((stat: any) => stat.type === 'categorical').length,
          temporal: results.fieldStats.filter((stat: any) => stat.type === 'temporal').length,
          text: results.fieldStats.filter((stat: any) => stat.type === 'text').length
        };
      }

      content.push(summarySection);
    }

    if (selectedSections.includes('visualizations')) {
      // Tạo phần trực quan hóa chi tiết hơn
      const visualizationSection = {
        title: 'Biểu đồ và trực quan hóa',
        text: 'Các biểu đồ và trực quan hóa dữ liệu được tạo ra từ kết quả phân tích.',
        charts: results?.distributions || [],
        insights: results?.insights?.filter((insight: any) => insight.type === 'distribution') || [],
        correlations: results?.correlations || []
      };

      // Thêm thông tin về phân phối dữ liệu
      if (results?.fieldStats) {
        visualizationSection.distributions = results.fieldStats
          .filter((stat: any) => stat.type === 'numeric' || stat.type === 'categorical')
          .map((stat: any) => ({
            field: stat.field,
            type: stat.type,
            distribution: stat.distribution || [],
            values: stat.values || {}
          }));
      }

      content.push(visualizationSection);
    }

    if (selectedSections.includes('trends')) {
      // Tạo phần phân tích xu hướng chi tiết hơn
      const trendSection = {
        title: 'Phân tích xu hướng',
        text: 'Phân tích xu hướng dữ liệu và dự đoán các giá trị trong tương lai.',
        trends: results?.fieldStats?.filter((stat: any) => stat.type === 'numeric').map((stat: any) => ({
          field: stat.field,
          trend: stat.trend || [],
          values: stat.values || {},
          growthRate: stat.values?.growthRate,
          seasonality: stat.values?.seasonality,
          forecast: stat.values?.forecast || []
        })) || [],
        insights: results?.insights?.filter((insight: any) => insight.type === 'trend') || []
      };

      // Thêm thông tin về các mô hình dự đoán
      trendSection.predictionModels = [
        {
          name: 'Tuyến tính',
          description: 'Mô hình dự đoán tuyến tính dựa trên xu hướng hiện tại của dữ liệu.',
          accuracy: results?.predictionMetrics?.linear?.accuracy || '85%'
        },
        {
          name: 'Hàm mũ',
          description: 'Mô hình dự đoán tăng trưởng theo hàm mũ, phù hợp với dữ liệu có tốc độ tăng trưởng không đều.',
          accuracy: results?.predictionMetrics?.exponential?.accuracy || '80%'
        },
        {
          name: 'Theo mùa',
          description: 'Mô hình dự đoán có tính đến yếu tố mùa vụ và chu kỳ trong dữ liệu.',
          accuracy: results?.predictionMetrics?.seasonal?.accuracy || '90%'
        }
      ];

      content.push(trendSection);
    }

    if (selectedSections.includes('anomalies')) {
      // Tạo phần phát hiện bất thường chi tiết hơn
      const anomalySection = {
        title: 'Phát hiện bất thường',
        text: 'Phát hiện các điểm dữ liệu bất thường và ngoại lệ.',
        anomalies: results?.summary?.outliers || 0,
        anomalyDetails: results?.anomalyDetails || [],
        insights: results?.insights?.filter((insight: any) => insight.type === 'anomaly') || []
      };

      // Thêm thông tin về các phương pháp phát hiện bất thường
      anomalySection.detectionMethods = [
        {
          name: 'Z-Score',
          description: 'Phát hiện bất thường dựa trên độ lệch chuẩn từ giá trị trung bình.',
          threshold: results?.anomalySettings?.zscoreThreshold || 2.0
        },
        {
          name: 'IQR (Khoảng tứ phân vị)',
          description: 'Phát hiện bất thường dựa trên khoảng tứ phân vị của dữ liệu.',
          threshold: results?.anomalySettings?.iqrMultiplier || 1.5
        }
      ];

      // Thêm thông tin về các trường có nhiều bất thường nhất
      if (results?.fieldStats) {
        anomalySection.fieldAnomalies = results.fieldStats
          .filter((stat: any) => stat.type === 'numeric')
          .map((stat: any) => ({
            field: stat.field,
            outlierCount: stat.values?.outliers || 0,
            outlierPercentage: stat.values?.outlierPercentage || 0
          }))
          .sort((a: any, b: any) => b.outlierCount - a.outlierCount)
          .slice(0, 5); // Top 5 trường có nhiều bất thường nhất
      }

      content.push(anomalySection);
    }

    if (selectedSections.includes('recommendations')) {
      // Tạo phần khuyến nghị chi tiết hơn
      const recommendationSection = {
        title: 'Khuyến nghị',
        text: 'Dựa trên kết quả phân tích, chúng tôi đề xuất các khuyến nghị sau:',
        recommendations: [
          'Xem xét xử lý các giá trị thiếu trước khi phân tích sâu hơn.',
          'Kiểm tra và xử lý các giá trị ngoại lệ để cải thiện độ chính xác của mô hình.',
          'Xem xét các mối tương quan mạnh để tối ưu hóa các quyết định kinh doanh.'
        ],
        insights: results?.insights?.filter((insight: any) => insight.type === 'recommendation') || []
      };

      // Thêm khuyến nghị dựa trên kết quả phân tích
      if (results?.summary?.missingValues > 0) {
        recommendationSection.recommendations.push(
          `Cần xử lý ${results.summary.missingValues} giá trị thiếu trong dữ liệu để cải thiện độ chính xác của mô hình.`
        );
      }

      if (results?.correlations && results.correlations.length > 0) {
        const strongCorrelations = results.correlations.filter((corr: any) => Math.abs(corr.value) > 0.7);
        if (strongCorrelations.length > 0) {
          recommendationSection.recommendations.push(
            `Phát hiện ${strongCorrelations.length} mối tương quan mạnh. Xem xét sử dụng các biến này trong mô hình dự đoán.`
          );
        }
      }

      content.push(recommendationSection);
    }

    // Thêm phần phụ lục nếu được chọn
    if (selectedSections.includes('appendix')) {
      const appendixSection = {
        title: 'Phụ lục',
        text: 'Thông tin bổ sung và chi tiết kỹ thuật về phân tích dữ liệu.',
        technicalDetails: []
      };

      // Thêm thông tin kỹ thuật về các trường dữ liệu
      if (results?.fieldStats) {
        appendixSection.technicalDetails.push({
          title: 'Thống kê chi tiết theo trường',
          data: results.fieldStats.map((stat: any) => ({
            field: stat.field,
            type: stat.type,
            values: stat.values || {}
          }))
        });
      }

      // Thêm thông tin về các phương pháp phân tích được sử dụng
      appendixSection.technicalDetails.push({
        title: 'Phương pháp phân tích',
        methods: [
          {
            name: 'Phân tích thống kê mô tả',
            description: 'Tính toán các thống kê cơ bản như trung bình, trung vị, độ lệch chuẩn, min, max cho các trường số.'
          },
          {
            name: 'Phân tích tương quan',
            description: 'Tính toán hệ số tương quan Pearson giữa các cặp biến số.'
          },
          {
            name: 'Phân tích phân phối',
            description: 'Phân tích phân phối của các trường dữ liệu để hiểu hình dạng và đặc điểm của dữ liệu.'
          },
          {
            name: 'Phát hiện bất thường',
            description: 'Sử dụng phương pháp Z-score và IQR để phát hiện các giá trị ngoại lệ.'
          },
          {
            name: 'Dự đoán xu hướng',
            description: 'Sử dụng các mô hình dự đoán tuyến tính, hàm mũ và theo mùa để dự báo xu hướng trong tương lai.'
          }
        ]
      });

      content.push(appendixSection);
    }

    return content;
  };

  // Xử lý khi tải xuống báo cáo
  const handleDownloadReport = () => {
    if (!generatedReport) return;

    try {
      switch (reportFormat) {
        case 'html':
          downloadHTML();
          break;
        case 'docx':
          downloadDOCX();
          break;
        case 'xlsx':
          downloadXLSX();
          break;
        default:
          downloadHTML();
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Có lỗi xảy ra khi tải xuống báo cáo. Vui lòng thử lại sau.');
    }
  };



  // Tải xuống báo cáo dạng HTML
  const downloadHTML = () => {
    if (!generatedReport) return;

    try {

    // Xác định font chữ dựa trên tùy chọn
    const fontFamily = generatedReport.font === 'arial' ? 'Arial, sans-serif' :
                      generatedReport.font === 'roboto' ? 'Roboto, sans-serif' :
                      generatedReport.font === 'times' ? 'Times New Roman, serif' :
                      generatedReport.font === 'calibri' ? 'Calibri, sans-serif' :
                      generatedReport.font === 'georgia' ? 'Georgia, serif' : 'Arial, sans-serif';

    // Xác định màu chủ đạo
    const accentColor = generatedReport.accentColor || '#4f46e5';

    // Xác định các style dựa trên chủ đề
    let themeStyles = '';

    if (generatedReport.theme === 'modern') {
      themeStyles = `
        h1, h2, h3 { font-weight: 300; }
        th { text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; }
        .section { border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
      `;
    } else if (generatedReport.theme === 'classic') {
      themeStyles = `
        h1, h2, h3 { font-family: 'Times New Roman', serif; }
        .section { border-bottom: 2px solid #eee; border-radius: 0; }
        th { background-color: #f8f8f8; }
      `;
    } else if (generatedReport.theme === 'minimal') {
      themeStyles = `
        body { line-height: 1.8; }
        h1, h2, h3 { font-weight: 400; }
        .section { box-shadow: none; background-color: transparent; padding: 10px 0; }
        table { border: none; }
        th, td { border: none; border-bottom: 1px solid #eee; }
        .chart-placeholder { border-style: solid; border-width: 1px; }
      `;
    }

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body { font-family: ${fontFamily}; margin: 40px; color: #333; }
          h1 { color: ${accentColor}; }
          h2 { color: ${accentColor}; margin-top: 30px; }
          h3 { color: ${accentColor}; margin-top: 20px; }
          .section { margin-bottom: 40px; padding: 20px; border-radius: 8px; background-color: #f9fafb; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .date { color: #6b7280; font-size: 14px; margin-bottom: 20px; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
          th { background-color: ${accentColor}20; }
          .recommendation { margin-left: 20px; }
          .insight { background-color: #eff6ff; padding: 12px; border-radius: 6px; margin: 10px 0; border-left: 4px solid ${accentColor}; }
          .insight-title { font-weight: bold; color: ${accentColor}; }
          .chart-placeholder { background-color: #f3f4f6; height: 200px; display: flex; align-items: center; justify-content: center; border-radius: 6px; margin: 15px 0; border: 1px dashed ${accentColor}40; color: ${accentColor}; }
          .method-card { background-color: #f3f4f6; padding: 12px; border-radius: 6px; margin: 10px 0; }
          .method-title { font-weight: bold; color: #4b5563; }
          .trend-card { background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid ${accentColor}; }
          .anomaly-card { background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid ${accentColor}; }
          .correlation-card { background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid ${accentColor}; }
          .field-stats { display: flex; flex-wrap: wrap; gap: 10px; margin: 15px 0; }
          .field-stat-card { background-color: #f3f4f6; padding: 12px; border-radius: 6px; flex: 1; min-width: 200px; }
          .model-comparison { display: flex; flex-wrap: wrap; gap: 15px; margin: 15px 0; }
          .model-card { background-color: #f3f4f6; padding: 15px; border-radius: 6px; flex: 1; min-width: 200px; border-top: 4px solid ${accentColor}; }
          .accuracy { display: inline-block; padding: 4px 8px; background-color: ${accentColor}20; color: ${accentColor}; border-radius: 4px; font-weight: bold; }
          ${themeStyles}
        </style>
      </head>
      <body>
        <h1>${reportTitle}</h1>
        <p>${reportDescription}</p>
        <p class="date">Ngày tạo: ${new Date().toLocaleDateString()}</p>
    `;

    // Thêm nội dung từng phần
    generatedReport.content.forEach((section: any) => {
      htmlContent += `
        <div class="section">
          <h2>${section.title}</h2>
          <p>${section.text}</p>
      `;

      // Xử lý phần Tóm tắt
      if (section.title === 'Tóm tắt') {
        // Thêm bảng tóm tắt
        htmlContent += `
          <table>
            <tr>
              <th>Số dòng</th>
              <th>Số cột</th>
              <th>Giá trị thiếu</th>
              <th>Giá trị ngoại lệ</th>
            </tr>
            <tr>
              <td>${section.summaryData?.rowCount || 0}</td>
              <td>${section.summaryData?.columnCount || 0}</td>
              <td>${section.summaryData?.missingValues || 0}</td>
              <td>${section.summaryData?.outliers || 0}</td>
            </tr>
          </table>
        `;

        // Thêm thông tin về loại trường dữ liệu
        if (section.fieldTypes) {
          htmlContent += `
            <h3>Phân loại trường dữ liệu</h3>
            <div class="field-stats">
              <div class="field-stat-card">
                <div>Trường số: <strong>${section.fieldTypes.numeric || 0}</strong></div>
              </div>
              <div class="field-stat-card">
                <div>Trường phân loại: <strong>${section.fieldTypes.categorical || 0}</strong></div>
              </div>
              <div class="field-stat-card">
                <div>Trường thời gian: <strong>${section.fieldTypes.temporal || 0}</strong></div>
              </div>
              <div class="field-stat-card">
                <div>Trường văn bản: <strong>${section.fieldTypes.text || 0}</strong></div>
              </div>
            </div>
          `;
        }

        // Thêm insights nếu có
        if (section.insights && section.insights.length > 0) {
          htmlContent += `<h3>Phát hiện chính</h3>`;
          section.insights.forEach((insight: any) => {
            htmlContent += `
              <div class="insight">
                <div class="insight-title">${insight.title}</div>
                <p>${insight.description}</p>
              </div>
            `;
          });
        }
      }

      // Xử lý phần Biểu đồ và trực quan hóa
      if (section.title === 'Biểu đồ và trực quan hóa') {
        // Thêm phần phân phối dữ liệu
        if (section.distributions && section.distributions.length > 0) {
          htmlContent += `<h3>Phân phối dữ liệu</h3>`;

          // Hiển thị thông tin về phân phối của các trường
          htmlContent += `<div class="field-stats">`;
          section.distributions.slice(0, 4).forEach((dist: any) => {
            htmlContent += `
              <div class="field-stat-card">
                <div><strong>${dist.field}</strong> (${dist.type === 'numeric' ? 'Số' : 'Phân loại'})</div>
                <div class="chart-placeholder">Biểu đồ phân phối ${dist.field}</div>
              </div>
            `;
          });
          htmlContent += `</div>`;
        }

        // Thêm phần tương quan
        if (section.correlations && section.correlations.length > 0) {
          htmlContent += `<h3>Tương quan giữa các trường</h3>`;

          // Hiển thị các tương quan mạnh
          const strongCorrelations = section.correlations.filter((corr: any) => Math.abs(corr.value) > 0.7);
          if (strongCorrelations.length > 0) {
            htmlContent += `<p>Phát hiện ${strongCorrelations.length} tương quan mạnh:</p>`;

            strongCorrelations.forEach((corr: any) => {
              htmlContent += `
                <div class="correlation-card">
                  <div><strong>${corr.source}</strong> và <strong>${corr.target}</strong></div>
                  <div>Hệ số tương quan: <strong>${corr.value.toFixed(2)}</strong></div>
                  <div>Loại: <strong>${corr.value > 0 ? 'Tương quan dương' : 'Tương quan âm'}</strong></div>
                  <div class="chart-placeholder">Biểu đồ tương quan</div>
                </div>
              `;
            });
          } else {
            htmlContent += `<p>Không phát hiện tương quan mạnh giữa các trường dữ liệu.</p>`;
          }
        }

        // Thêm insights nếu có
        if (section.insights && section.insights.length > 0) {
          htmlContent += `<h3>Phát hiện từ trực quan hóa</h3>`;
          section.insights.forEach((insight: any) => {
            htmlContent += `
              <div class="insight">
                <div class="insight-title">${insight.title}</div>
                <p>${insight.description}</p>
              </div>
            `;
          });
        }
      }

      // Xử lý phần Phân tích xu hướng
      if (section.title === 'Phân tích xu hướng') {
        // Hiển thị xu hướng của các trường
        if (section.trends && section.trends.length > 0) {
          htmlContent += `<h3>Xu hướng theo trường dữ liệu</h3>`;

          section.trends.slice(0, 3).forEach((trend: any) => {
            const growthRate = trend.growthRate ?
              (trend.growthRate > 0 ? `+${(trend.growthRate * 100).toFixed(1)}%` : `${(trend.growthRate * 100).toFixed(1)}%`) : 'N/A';

            htmlContent += `
              <div class="trend-card">
                <div><strong>${trend.field}</strong></div>
                <div>Tốc độ tăng trưởng: <strong>${growthRate}</strong></div>
                ${trend.seasonality ? `<div>Tính chu kỳ: <strong>${trend.seasonality === 'high' ? 'Cao' : (trend.seasonality === 'medium' ? 'Trung bình' : 'Thấp')}</strong></div>` : ''}
                <div class="chart-placeholder">Biểu đồ xu hướng ${trend.field}</div>
              </div>
            `;
          });
        }

        // Hiển thị thông tin về các mô hình dự đoán
        if (section.predictionModels && section.predictionModels.length > 0) {
          htmlContent += `<h3>So sánh các mô hình dự đoán</h3>`;

          htmlContent += `<div class="model-comparison">`;
          section.predictionModels.forEach((model: any) => {
            htmlContent += `
              <div class="model-card">
                <div><strong>${model.name}</strong></div>
                <p>${model.description}</p>
                <div>Độ chính xác: <span class="accuracy">${model.accuracy}</span></div>
              </div>
            `;
          });
          htmlContent += `</div>`;
        }

        // Thêm insights nếu có
        if (section.insights && section.insights.length > 0) {
          htmlContent += `<h3>Phát hiện xu hướng</h3>`;
          section.insights.forEach((insight: any) => {
            htmlContent += `
              <div class="insight">
                <div class="insight-title">${insight.title}</div>
                <p>${insight.description}</p>
              </div>
            `;
          });
        }
      }

      // Xử lý phần Phát hiện bất thường
      if (section.title === 'Phát hiện bất thường') {
        // Hiển thị tổng quan về bất thường
        htmlContent += `
          <div>
            <p>Tổng số giá trị ngoại lệ phát hiện được: <strong>${section.anomalies}</strong></p>
          </div>
        `;

        // Hiển thị thông tin về các phương pháp phát hiện bất thường
        if (section.detectionMethods && section.detectionMethods.length > 0) {
          htmlContent += `<h3>Phương pháp phát hiện bất thường</h3>`;

          section.detectionMethods.forEach((method: any) => {
            htmlContent += `
              <div class="method-card">
                <div class="method-title">${method.name}</div>
                <p>${method.description}</p>
                <div>Ngưỡng: <strong>${method.threshold}</strong></div>
              </div>
            `;
          });
        }

        // Hiển thị thông tin về các trường có nhiều bất thường nhất
        if (section.fieldAnomalies && section.fieldAnomalies.length > 0) {
          htmlContent += `<h3>Trường dữ liệu có nhiều bất thường nhất</h3>`;

          section.fieldAnomalies.forEach((field: any) => {
            htmlContent += `
              <div class="anomaly-card">
                <div><strong>${field.field}</strong></div>
                <div>Số lượng giá trị ngoại lệ: <strong>${field.outlierCount}</strong></div>
                <div>Tỷ lệ: <strong>${field.outlierPercentage.toFixed(2)}%</strong></div>
              </div>
            `;
          });
        }

        // Thêm insights nếu có
        if (section.insights && section.insights.length > 0) {
          htmlContent += `<h3>Phát hiện bất thường đáng chú ý</h3>`;
          section.insights.forEach((insight: any) => {
            htmlContent += `
              <div class="insight">
                <div class="insight-title">${insight.title}</div>
                <p>${insight.description}</p>
              </div>
            `;
          });
        }
      }

      // Xử lý phần Khuyến nghị
      if (section.title === 'Khuyến nghị') {
        // Thêm danh sách khuyến nghị
        if (section.recommendations && section.recommendations.length > 0) {
          htmlContent += `<ul>`;
          section.recommendations.forEach((rec: string) => {
            htmlContent += `<li class="recommendation">${rec}</li>`;
          });
          htmlContent += `</ul>`;
        }

        // Thêm insights nếu có
        if (section.insights && section.insights.length > 0) {
          htmlContent += `<h3>Khuyến nghị chi tiết</h3>`;
          section.insights.forEach((insight: any) => {
            htmlContent += `
              <div class="insight">
                <div class="insight-title">${insight.title}</div>
                <p>${insight.description}</p>
              </div>
            `;
          });
        }
      }

      // Xử lý phần Phụ lục
      if (section.title === 'Phụ lục') {
        // Hiển thị thông tin kỹ thuật
        if (section.technicalDetails && section.technicalDetails.length > 0) {
          section.technicalDetails.forEach((detail: any) => {
            htmlContent += `<h3>${detail.title}</h3>`;

            if (detail.title === 'Phương pháp phân tích' && detail.methods) {
              detail.methods.forEach((method: any) => {
                htmlContent += `
                  <div class="method-card">
                    <div class="method-title">${method.name}</div>
                    <p>${method.description}</p>
                  </div>
                `;
              });
            }

            if (detail.title === 'Thống kê chi tiết theo trường' && detail.data) {
              // Hiển thị bảng thống kê chi tiết
              htmlContent += `
                <table>
                  <tr>
                    <th>Trường</th>
                    <th>Loại</th>
                    <th>Trung bình</th>
                    <th>Trung vị</th>
                    <th>Độ lệch chuẩn</th>
                    <th>Min</th>
                    <th>Max</th>
                  </tr>
              `;

              detail.data
                .filter((stat: any) => stat.type === 'numeric')
                .forEach((stat: any) => {
                  htmlContent += `
                    <tr>
                      <td>${stat.field}</td>
                      <td>${stat.type === 'numeric' ? 'Số' : (stat.type === 'categorical' ? 'Phân loại' : (stat.type === 'temporal' ? 'Thời gian' : 'Văn bản'))}</td>
                      <td>${stat.values.mean !== undefined ? stat.values.mean.toFixed(2) : 'N/A'}</td>
                      <td>${stat.values.median !== undefined ? stat.values.median.toFixed(2) : 'N/A'}</td>
                      <td>${stat.values.stdDev !== undefined ? stat.values.stdDev.toFixed(2) : 'N/A'}</td>
                      <td>${stat.values.min !== undefined ? stat.values.min.toFixed(2) : 'N/A'}</td>
                      <td>${stat.values.max !== undefined ? stat.values.max.toFixed(2) : 'N/A'}</td>
                    </tr>
                  `;
                });

              htmlContent += `</table>`;
            }
          });
        }
      }

      htmlContent += `</div>`;
    });

    htmlContent += `
      </body>
      </html>
    `;

    // Tạo và tải xuống file HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`);
    } catch (error) {
      console.error('Error generating HTML:', error);
      alert('Có lỗi khi tạo file HTML. Vui lòng thử lại sau.');
    }
  };

  // Tải xuống báo cáo dạng DOCX
  const downloadDOCX = () => {
    try {
      const title = reportTitle || 'Báo cáo phân tích dữ liệu';
      const description = reportDescription || '';

      // Sử dụng các tùy chỉnh giao diện
      const accentColor = generatedReport.accentColor || '#4f46e5';
      const theme = generatedReport.theme || 'default';
      const font = generatedReport.font || 'arial';

      // Tạo document mới
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Tiêu đề
              new Paragraph({
                text: title,
                heading: HeadingLevel.HEADING_1,
                spacing: {
                  after: 200
                }
              }),

              // Mô tả
              new Paragraph({
                text: description,
                spacing: {
                  after: 200
                }
              }),

              // Ngày tạo
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Ngày tạo: ${new Date().toLocaleDateString()}`,
                    italics: true
                  })
                ],
                spacing: {
                  after: 400
                }
              }),
            ]
          }
        ]
      });

      // Thêm nội dung từng phần
      generatedReport.content.forEach((section: any) => {
        // Thêm tiêu đề và nội dung phần vào document hiện tại
        doc.addSection({
          children: [
            new Paragraph({
              text: section.title,
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 300,
                after: 200
              }
            }),

            // Thêm nội dung phần
            new Paragraph({
              text: section.text || '',
              spacing: {
                after: 200
              }
            })
          ]
        });

        // Thêm bảng nếu có
        if (section.title === 'Tóm tắt' && results?.summary) {
          const tableRows = [
            // Header row
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph('Số dòng')],
                  shading: {
                    fill: 'F2F2F2'
                  }
                }),
                new TableCell({
                  children: [new Paragraph('Số cột')],
                  shading: {
                    fill: 'F2F2F2'
                  }
                }),
                new TableCell({
                  children: [new Paragraph('Giá trị thiếu')],
                  shading: {
                    fill: 'F2F2F2'
                  }
                }),
                new TableCell({
                  children: [new Paragraph('Giá trị ngoại lệ')],
                  shading: {
                    fill: 'F2F2F2'
                  }
                })
              ]
            }),
            // Data row
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph(`${results.summary.rowCount || 0}`)]
                }),
                new TableCell({
                  children: [new Paragraph(`${results.summary.columnCount || 0}`)]
                }),
                new TableCell({
                  children: [new Paragraph(`${results.summary.missingValues || 0}`)]
                }),
                new TableCell({
                  children: [new Paragraph(`${results.summary.outliers || 0}`)]
                })
              ]
            })
          ];

          // Tạo bảng với các hàng đã định nghĩa
          const table = new Table({
            rows: tableRows,
            width: {
              size: 100,
              type: 'pct'
            }
          });

          // Thêm bảng vào document
          doc.addSection({
            children: [new Paragraph({ text: '' }), table, new Paragraph({ text: '' })]
          });
        }

        // Thêm khuyến nghị nếu có
        if (section.recommendations) {
          const recommendationParagraphs = section.recommendations.map((rec: string, index: number) => {
            return new Paragraph({
              text: `${index + 1}. ${rec}`,
              spacing: {
                before: 100
              }
            });
          });

          // Thêm các khuyến nghị vào document
          doc.addSection({
            children: [new Paragraph({ text: '' }), ...recommendationParagraphs]
          });
        }
      });

      // Tạo và tải xuống file
      Packer.toBlob(doc).then(blob => {
        saveAs(blob, `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`);
      }).catch(error => {
        console.error('Error creating DOCX blob:', error);
        alert('Có lỗi khi tạo file DOCX. Vui lòng thử lại sau.');
      });
    } catch (error) {
      console.error('Error generating DOCX:', error);
      alert('Có lỗi khi tạo file DOCX. Vui lòng thử lại sau.');
    }
  };

  // Tải xuống báo cáo dạng XLSX
  const downloadXLSX = () => {
    try {
      const title = reportTitle || 'Báo cáo phân tích dữ liệu';

      // Sử dụng các tùy chỉnh giao diện
      const theme = generatedReport.theme || 'default';
      const accentColor = generatedReport.accentColor || '#4f46e5';

      // Tạo workbook mới
      const wb = XLSX.utils.book_new();

      // Tạo worksheet cho thông tin chung
      const infoData = [
        ['Tiêu đề', title],
        ['Mô tả', reportDescription || ''],
        ['Ngày tạo', new Date().toLocaleDateString()],
        ['Loại báo cáo', reportType === 'executive' ? 'Báo cáo tóm tắt' :
                    reportType === 'detailed' ? 'Báo cáo chi tiết' :
                    reportType === 'technical' ? 'Báo cáo kỹ thuật' : 'Báo cáo trình bày']
      ];

      const infoWs = XLSX.utils.aoa_to_sheet(infoData);
      XLSX.utils.book_append_sheet(wb, infoWs, 'Thông tin');

      // Tạo worksheet cho tóm tắt
      if (results?.summary) {
        const summaryData = [
          ['Số dòng', 'Số cột', 'Giá trị thiếu', 'Giá trị ngoại lệ'],
          [
            results.summary.rowCount || 0,
            results.summary.columnCount || 0,
            results.summary.missingValues || 0,
            results.summary.outliers || 0
          ]
        ];

        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Tóm tắt');
      }

      // Tạo worksheet cho thống kê trường
      if (results?.fieldStats && results.fieldStats.length > 0) {
        const numericFields = results.fieldStats.filter((stat: any) => stat.type === 'numeric');

        if (numericFields.length > 0) {
          const fieldStatsData = [
            ['Trường', 'Trung bình', 'Trung vị', 'Độ lệch chuẩn', 'Nhỏ nhất', 'Lớn nhất']
          ];

          numericFields.forEach((field: any) => {
            // Kiểm tra và xử lý các giá trị có thể là undefined
            const mean = typeof field.values.mean === 'number' ? field.values.mean.toFixed(2) : 'N/A';
            const median = typeof field.values.median === 'number' ? field.values.median.toFixed(2) : 'N/A';
            const stdDev = typeof field.values.stdDev === 'number' ? field.values.stdDev.toFixed(2) : 'N/A';
            const min = typeof field.values.min === 'number' ? field.values.min.toFixed(2) : 'N/A';
            const max = typeof field.values.max === 'number' ? field.values.max.toFixed(2) : 'N/A';

            fieldStatsData.push([
              field.field,
              mean,
              median,
              stdDev,
              min,
              max
            ]);
          });

          const statsWs = XLSX.utils.aoa_to_sheet(fieldStatsData);
          XLSX.utils.book_append_sheet(wb, statsWs, 'Thống kê');
        }
      }

      // Tạo worksheet cho khuyến nghị
      const recommendationsSection = generatedReport.content.find((section: any) => section.title === 'Khuyến nghị');

      if (recommendationsSection && recommendationsSection.recommendations) {
        const recData = [
          ['STT', 'Khuyến nghị']
        ];

        recommendationsSection.recommendations.forEach((rec: string, index: number) => {
          recData.push([index + 1, rec]);
        });

        const recWs = XLSX.utils.aoa_to_sheet(recData);
        XLSX.utils.book_append_sheet(wb, recWs, 'Khuyến nghị');
      }

      // Tạo và tải xuống file
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(blob, `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error generating XLSX:', error);
      alert('Có lỗi khi tạo file XLSX. Vui lòng thử lại sau.');
    }
  };

  // Xử lý khi gửi báo cáo qua email
  const handleEmailReport = () => {
    // Trong thực tế, sẽ cần thêm logic để gửi báo cáo qua email
    alert('Tính năng gửi báo cáo qua email sẽ được triển khai trong phiên bản tiếp theo.');
  };

  return (
    <div className="space-y-6">
      <TabsCustom
        defaultValue="content"
        gridCols={4}
        layoutId="reportTabIndicator"
        wrapContent={false}
        tabs={[
          {
            id: 'content',
            label: 'Nội dung báo cáo',
            icon: <FileText className="h-4 w-4" />
          },
          {
            id: 'format',
            label: 'Định dạng',
            icon: <Settings className="h-4 w-4" />
          },
          {
            id: 'appearance',
            label: 'Giao diện',
            icon: <FileType className="h-4 w-4" />
          },
          {
            id: 'schedule',
            label: 'Lịch trình',
            icon: <Calendar className="h-4 w-4" />
          }
        ]}
      >

        <TabsContent value="content" className="pt-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-title" className="block mb-2">Tiêu đề báo cáo</Label>
                  <Input
                    id="report-title"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Nhập tiêu đề báo cáo"
                  />
                </div>

                <div>
                  <Label htmlFor="report-description" className="block mb-2">Mô tả báo cáo</Label>
                  <Textarea
                    id="report-description"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Nhập mô tả báo cáo"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="report-type" className="block mb-2">Loại báo cáo</Label>
                  <CustomDropdown
                    options={[
                      { value: 'executive', label: 'Báo cáo tóm tắt' },
                      { value: 'detailed', label: 'Báo cáo chi tiết' },
                      { value: 'technical', label: 'Báo cáo kỹ thuật' },
                      { value: 'presentation', label: 'Báo cáo trình bày' }
                    ]}
                    value={reportType}
                    onChange={setReportType}
                    icon={<FileText className="h-4 w-4 text-indigo-500" />}
                    placeholder="Chọn loại báo cáo"
                  />
                </div>

                <div>
                  <Label className="block mb-2">Các phần trong báo cáo</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="section-summary"
                        checked={selectedSections.includes('summary')}
                        onCheckedChange={(checked) => handleSectionChange('summary', checked as boolean)}
                      />
                      <Label htmlFor="section-summary">Tóm tắt</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="section-visualizations"
                        checked={selectedSections.includes('visualizations')}
                        onCheckedChange={(checked) => handleSectionChange('visualizations', checked as boolean)}
                      />
                      <Label htmlFor="section-visualizations">Biểu đồ và trực quan hóa</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="section-trends"
                        checked={selectedSections.includes('trends')}
                        onCheckedChange={(checked) => handleSectionChange('trends', checked as boolean)}
                      />
                      <Label htmlFor="section-trends">Phân tích xu hướng</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="section-anomalies"
                        checked={selectedSections.includes('anomalies')}
                        onCheckedChange={(checked) => handleSectionChange('anomalies', checked as boolean)}
                      />
                      <Label htmlFor="section-anomalies">Phát hiện bất thường</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="section-recommendations"
                        checked={selectedSections.includes('recommendations')}
                        onCheckedChange={(checked) => handleSectionChange('recommendations', checked as boolean)}
                      />
                      <Label htmlFor="section-recommendations">Khuyến nghị</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="section-appendix"
                        checked={selectedSections.includes('appendix')}
                        onCheckedChange={(checked) => handleSectionChange('appendix', checked as boolean)}
                      />
                      <Label htmlFor="section-appendix">Phụ lục</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="format" className="pt-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-format" className="block mb-2">Định dạng xuất</Label>
                  <CustomDropdown
                    options={[
                      { value: 'docx', label: 'Word (DOCX)' },
                      { value: 'xlsx', label: 'Excel (XLSX)' },
                      { value: 'html', label: 'HTML' }
                    ]}
                    value={reportFormat}
                    onChange={setReportFormat}
                    icon={<FileOutput className="h-4 w-4 text-indigo-500" />}
                    placeholder="Chọn định dạng xuất"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="page-size" className="block mb-2">Kích thước trang</Label>
                    <CustomDropdown
                      options={[
                        { value: 'a4', label: 'A4' },
                        { value: 'letter', label: 'Letter' },
                        { value: 'legal', label: 'Legal' }
                      ]}
                      value="a4"
                      onChange={() => {}}
                      icon={<FileType className="h-4 w-4 text-indigo-500" />}
                      placeholder="Chọn kích thước trang"
                    />
                  </div>

                  <div>
                    <Label htmlFor="orientation" className="block mb-2">Hướng trang</Label>
                    <CustomDropdown
                      options={[
                        { value: 'portrait', label: 'Dọc' },
                        { value: 'landscape', label: 'Ngang' }
                      ]}
                      value="portrait"
                      onChange={() => {}}
                      icon={<Smartphone className="h-4 w-4 text-indigo-500" />}
                      placeholder="Chọn hướng trang"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="block">Tùy chọn bổ sung</Label>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-toc" defaultChecked />
                    <Label htmlFor="include-toc">Bao gồm mục lục</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-page-numbers" defaultChecked />
                    <Label htmlFor="include-page-numbers">Bao gồm số trang</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-header-footer" defaultChecked />
                    <Label htmlFor="include-header-footer">Bao gồm đầu trang và chân trang</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-cover-page" defaultChecked />
                    <Label htmlFor="include-cover-page">Bao gồm trang bìa</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="pt-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-theme" className="block mb-2">Chủ đề báo cáo</Label>
                  <CustomDropdown
                    options={[
                      { value: 'default', label: 'Mặc định' },
                      { value: 'modern', label: 'Hiện đại' },
                      { value: 'classic', label: 'Điển hình' },
                      { value: 'minimal', label: 'Đơn giản' }
                    ]}
                    value={reportTheme}
                    onChange={setReportTheme}
                    icon={<FileType className="h-4 w-4 text-indigo-500" />}
                    placeholder="Chọn chủ đề báo cáo"
                  />
                </div>

                <div>
                  <Label htmlFor="report-font" className="block mb-2">Font chữ</Label>
                  <CustomDropdown
                    options={[
                      { value: 'arial', label: 'Arial' },
                      { value: 'roboto', label: 'Roboto' },
                      { value: 'times', label: 'Times New Roman' },
                      { value: 'calibri', label: 'Calibri' },
                      { value: 'georgia', label: 'Georgia' }
                    ]}
                    value={reportFont}
                    onChange={setReportFont}
                    icon={<FileType className="h-4 w-4 text-indigo-500" />}
                    placeholder="Chọn font chữ"
                  />
                </div>

                <div>
                  <Label htmlFor="accent-color" className="block mb-2">Màu chủ đạo</Label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Input
                        id="accent-color"
                        type="text"
                        value={reportAccentColor}
                        onChange={(e) => setReportAccentColor(e.target.value)}
                        className="pl-10"
                      />
                      <div
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: reportAccentColor }}
                      ></div>
                    </div>
                    <Input
                      type="color"
                      value={reportAccentColor}
                      onChange={(e) => setReportAccentColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Xem trước báo cáo</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? 'Tắt xem trước' : 'Xem trước'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="pt-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="schedule-type" className="block mb-2">Loại lịch trình</Label>
                  <CustomDropdown
                    options={[
                      { value: 'once', label: 'Một lần' },
                      { value: 'daily', label: 'Hàng ngày' },
                      { value: 'weekly', label: 'Hàng tuần' },
                      { value: 'monthly', label: 'Hàng tháng' }
                    ]}
                    value={scheduleType}
                    onChange={setScheduleType}
                    icon={<Clock className="h-4 w-4 text-indigo-500" />}
                    placeholder="Chọn loại lịch trình"
                  />
                </div>

                {scheduleType !== 'once' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date" className="block mb-2">Ngày bắt đầu</Label>
                      <Input
                        id="start-date"
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <Label htmlFor="end-date" className="block mb-2">Ngày kết thúc (tùy chọn)</Label>
                      <Input
                        id="end-date"
                        type="date"
                      />
                    </div>
                  </div>
                )}

                {scheduleType === 'once' && (
                  <div>
                    <Label htmlFor="schedule-date" className="block mb-2">Ngày tạo báo cáo</Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="schedule-time" className="block mb-2">Thời gian</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    defaultValue="08:00"
                  />
                </div>

                <div>
                  <Label className="block mb-2">Tùy chọn phân phối</Label>

                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox id="email-distribution" defaultChecked />
                    <Label htmlFor="email-distribution">Gửi qua email</Label>
                  </div>

                  <div className="mt-2">
                    <Label htmlFor="email-recipients" className="block mb-2 text-sm">Người nhận email (phân cách bằng dấu phẩy)</Label>
                    <Input
                      id="email-recipients"
                      placeholder="example@example.com, another@example.com"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </TabsCustom>

      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 transition-all"
          onClick={handleEmailReport}
          disabled={isGenerating || !isGenerated}
        >
          <Mail className="h-4 w-4" />
          Gửi qua email
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 transition-all"
          onClick={handleDownloadReport}
          disabled={isGenerating || !isGenerated}
        >
          <FileDown className="h-4 w-4" />
          Tải xuống
        </Button>

        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all px-5 py-2.5"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo báo cáo...
            </>
          ) : isGenerated ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Tạo lại báo cáo
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Tạo báo cáo
            </>
          )}
        </Button>
      </div>

      {isGenerated && (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Báo cáo đã được tạo</h3>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 border-indigo-200"
                onClick={() => navigator.clipboard.writeText('https://example.com/reports/12345')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-gray-800">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span className="font-medium">{reportTitle}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span className="text-sm">Tạo lúc: {new Date().toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Download className="h-4 w-4 text-indigo-500" />
                <span className="text-sm">Định dạng: {reportFormat.toUpperCase()}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedSections.map(section => (
                  <span
                    key={section}
                    className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full shadow-sm"
                  >
                    {section === 'summary' && 'Tóm tắt'}
                    {section === 'visualizations' && 'Biểu đồ'}
                    {section === 'trends' && 'Xu hướng'}
                    {section === 'anomalies' && 'Bất thường'}
                    {section === 'recommendations' && 'Khuyến nghị'}
                    {section === 'appendix' && 'Phụ lục'}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 p-4 bg-indigo-100 rounded-lg border border-indigo-200">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-600 mt-0.5" />
                <p className="text-sm text-indigo-800">
                  Báo cáo đã được tạo thành công và sẵn sàng để tải xuống hoặc gửi qua email. Bạn có thể sử dụng các nút ở trên để tải xuống hoặc gửi báo cáo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Xem trước báo cáo */}
      {showPreview && isGenerated && (
        <Card className="mt-6 border-0 shadow-xl bg-white rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Xem trước báo cáo</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setShowPreview(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            </div>

            <div className="p-6 max-h-[600px] overflow-y-auto" ref={reportContentRef}>
              {/* Báo cáo xem trước */}
              <div className="report-preview" style={{ fontFamily: reportFont === 'arial' ? 'Arial, sans-serif' :
                                                      reportFont === 'roboto' ? 'Roboto, sans-serif' :
                                                      reportFont === 'times' ? 'Times New Roman, serif' :
                                                      reportFont === 'calibri' ? 'Calibri, sans-serif' :
                                                      reportFont === 'georgia' ? 'Georgia, serif' : 'Arial, sans-serif' }}>
                <div className={`report-header ${reportTheme}`}>
                  <h1 style={{ color: reportAccentColor }}>{reportTitle}</h1>
                  <p className="report-description">{reportDescription}</p>
                  <p className="report-date">Ngày tạo: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Nội dung báo cáo */}
                {generatedReport.content.map((section: any, index: number) => (
                  <div key={index} className={`report-section ${reportTheme}`}>
                    <h2 style={{ color: reportAccentColor }}>{section.title}</h2>
                    <p>{section.text}</p>

                    {/* Tóm tắt */}
                    {section.title === 'Tóm tắt' && section.summaryData && (
                      <div className="summary-table">
                        <table style={{ borderColor: reportAccentColor }}>
                          <thead style={{ backgroundColor: `${reportAccentColor}20` }}>
                            <tr>
                              <th>Số dòng</th>
                              <th>Số cột</th>
                              <th>Giá trị thiếu</th>
                              <th>Giá trị ngoại lệ</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{section.summaryData.rowCount}</td>
                              <td>{section.summaryData.columnCount}</td>
                              <td>{section.summaryData.missingValues}</td>
                              <td>{section.summaryData.outliers}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Biểu đồ */}
                    {section.title === 'Biểu đồ và trực quan hóa' && (
                      <div className="visualization-section">
                        <div className="chart-placeholder" style={{ borderColor: `${reportAccentColor}40`, color: reportAccentColor }}>
                          Biểu đồ phân phối dữ liệu
                        </div>
                      </div>
                    )}

                    {/* Xu hướng */}
                    {section.title === 'Phân tích xu hướng' && section.trends && section.trends.length > 0 && (
                      <div className="trends-section">
                        {section.trends.slice(0, 2).map((trend: any, trendIndex: number) => (
                          <div key={trendIndex} className="trend-card" style={{ borderLeftColor: reportAccentColor }}>
                            <h3>{trend.field}</h3>
                            <p>Tốc độ tăng trưởng: <strong>{trend.growthRate ? `${(trend.growthRate * 100).toFixed(1)}%` : 'N/A'}</strong></p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bất thường */}
                    {section.title === 'Phát hiện bất thường' && (
                      <div className="anomalies-section">
                        <p>Tổng số giá trị ngoại lệ: <strong>{section.anomalies}</strong></p>
                      </div>
                    )}

                    {/* Khuyến nghị */}
                    {section.title === 'Khuyến nghị' && section.recommendations && (
                      <div className="recommendations-section">
                        <ul>
                          {section.recommendations.map((rec: string, recIndex: number) => (
                            <li key={recIndex}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <style jsx>{`
              .report-preview {
                color: #333;
                line-height: 1.6;
              }
              .report-header {
                margin-bottom: 2rem;
              }
              .report-header h1 {
                font-size: 1.8rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
              }
              .report-description {
                margin-bottom: 1rem;
                color: #555;
              }
              .report-date {
                font-size: 0.9rem;
                color: #777;
                font-style: italic;
              }
              .report-section {
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #eee;
              }
              .report-section h2 {
                font-size: 1.4rem;
                font-weight: bold;
                margin-bottom: 1rem;
              }
              .report-section p {
                margin-bottom: 1rem;
              }
              .summary-table table {
                width: 100%;
                border-collapse: collapse;
                margin: 1rem 0;
                border: 1px solid #ddd;
              }
              .summary-table th, .summary-table td {
                padding: 0.75rem;
                text-align: left;
                border: 1px solid #ddd;
              }
              .summary-table th {
                font-weight: bold;
              }
              .chart-placeholder {
                height: 150px;
                background-color: #f9f9f9;
                border: 1px dashed #ccc;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 1rem 0;
                border-radius: 4px;
              }
              .trend-card {
                padding: 1rem;
                background-color: #f9f9f9;
                border-left: 4px solid #4f46e5;
                margin: 1rem 0;
                border-radius: 4px;
              }
              .trend-card h3 {
                font-weight: bold;
                margin-bottom: 0.5rem;
              }
              .recommendations-section ul {
                padding-left: 1.5rem;
                list-style-type: disc;
              }
              .recommendations-section li {
                margin-bottom: 0.5rem;
              }

              /* Chủ đề */
              .modern h1, .modern h2, .modern h3 {
                font-weight: 300;
              }
              .modern .summary-table th {
                text-transform: uppercase;
                font-size: 0.8rem;
                letter-spacing: 1px;
              }

              .classic h1, .classic h2, .classic h3 {
                font-family: 'Times New Roman', serif;
              }
              .classic .report-section {
                border-bottom: 2px solid #eee;
              }

              .minimal {
                line-height: 1.8;
              }
              .minimal h1, .minimal h2, .minimal h3 {
                font-weight: 400;
              }
              .minimal .summary-table table {
                border: none;
              }
              .minimal .summary-table th, .minimal .summary-table td {
                border: none;
                border-bottom: 1px solid #eee;
              }
            `}</style>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportGenerator;
