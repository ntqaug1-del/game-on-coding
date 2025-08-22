import { useState } from 'react';
import html2canvas from 'html2canvas';

export const useExport = () => {
  const [exportFormat, setExportFormat] = useState<string>('png'); // 'png', 'jpeg'
  const [exportQuality, setExportQuality] = useState<string>('medium'); // 'low', 'medium', 'high'

  const handleDownload = async (pitchRef: React.RefObject<HTMLDivElement>, teamName: string) => {
    if (!pitchRef.current) return;
    try {
      // Tùy chỉnh cấu hình html2canvas dựa trên chất lượng
      const scale = exportQuality === 'high' ? 3 : exportQuality === 'medium' ? 2 : 1;

      const canvas = await html2canvas(pitchRef.current, {
        scale: scale, // Tăng độ phân giải
        useCORS: true, // Cho phép tải hình ảnh từ các nguồn khác
        logging: false, // Tắt log
        backgroundColor: null // Cho phép nền trong suốt
      });

      const link = document.createElement('a');
      const fileName = teamName || 'formation';

      // Xử lý theo định dạng xuất
      if (exportFormat === 'png') {
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL('image/png');
      } else if (exportFormat === 'jpeg') {
        link.download = `${fileName}.jpg`;
        // JPEG không hỗ trợ nền trong suốt, nên cần thêm nền trắng
        link.href = canvas.toDataURL('image/jpeg', 0.9); // 0.9 là chất lượng (0-1)
      }

      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return {
    exportFormat,
    setExportFormat,
    exportQuality,
    setExportQuality,
    handleDownload
  };
};
