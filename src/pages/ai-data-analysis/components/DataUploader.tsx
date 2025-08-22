import React, { useState, useCallback } from 'react';
import { Upload, FileUp, File, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface DataUploaderProps {
  onDataUpload: (data: any) => void;
}

const DataUploader: React.FC<DataUploaderProps> = ({ onDataUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);

  // Xử lý khi file được thả vào dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (!['csv', 'xlsx', 'xls', 'json'].includes(fileType || '')) {
      setError('Định dạng file không được hỗ trợ. Vui lòng tải lên file CSV, Excel hoặc JSON.');
      return;
    }
    
    setFile(file);
    processFile(file);
  }, []);

  // Cấu hình dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json']
    },
    maxFiles: 1
  });

  // Xử lý file được tải lên
  const processFile = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Giả lập tiến trình tải lên
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const fileType = file.name.split('.').pop()?.toLowerCase();
        let data: any[] = [];
        
        if (fileType === 'csv') {
          // Xử lý file CSV
          const csvData = event.target?.result as string;
          const parsedData = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true
          });
          data = parsedData.data as any[];
        } else if (fileType === 'xlsx' || fileType === 'xls') {
          // Xử lý file Excel
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          data = XLSX.utils.sheet_to_json(worksheet);
        } else if (fileType === 'json') {
          // Xử lý file JSON
          const jsonData = event.target?.result as string;
          data = JSON.parse(jsonData);
          if (!Array.isArray(data)) {
            if (typeof data === 'object' && data !== null) {
              // Nếu là object, chuyển thành array với một phần tử
              data = [data];
            } else {
              throw new Error('Dữ liệu JSON không hợp lệ. Cần là mảng hoặc object.');
            }
          }
        }
        
        // Hiển thị preview (tối đa 5 dòng)
        setPreviewData(data.slice(0, 5));
        
        // Hoàn thành tải lên
        clearInterval(interval);
        setUploadProgress(100);
        
        setTimeout(() => {
          setIsUploading(false);
          onDataUpload(data);
        }, 500);
      } catch (error) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
        setError('Lỗi khi xử lý file. Vui lòng kiểm tra định dạng và thử lại.');
        console.error('Error processing file:', error);
      }
    };
    
    reader.onerror = () => {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      setError('Lỗi khi đọc file. Vui lòng thử lại.');
    };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith('.json')) {
      reader.readAsText(file);
    }
  };

  // Xóa file đã chọn
  const handleRemoveFile = () => {
    setFile(null);
    setPreviewData(null);
    setError(null);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-indigo-400 bg-indigo-50' 
            : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Upload className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              Kéo và thả file vào đây, hoặc click để chọn file
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Hỗ trợ các định dạng CSV, Excel (.xlsx, .xls) và JSON
            </p>
          </div>
          <Button variant="outline" className="mt-2">
            <FileUp className="h-4 w-4 mr-2" />
            Chọn file
          </Button>
        </div>
      </div>
      
      {file && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded">
                <File className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              disabled={isUploading}
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          
          {isUploading && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Đang xử lý...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          {uploadProgress === 100 && !isUploading && (
            <div className="mt-4 flex items-center text-green-600">
              <Check className="h-5 w-5 mr-2" />
              <span>Tải lên thành công!</span>
            </div>
          )}
        </div>
      )}
      
      {previewData && previewData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Xem trước dữ liệu</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(previewData[0]).map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value: any, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Hiển thị {previewData.length} dòng đầu tiên của dữ liệu
          </p>
        </div>
      )}
    </div>
  );
};

export default DataUploader;
