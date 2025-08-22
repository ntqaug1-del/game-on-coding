import { useState } from 'react';

export const usePitchSettings = () => {
  // Tùy chỉnh sân bóng
  const [pitchType, setPitchType] = useState<string>('natural'); // 'natural', 'artificial', 'futsal'
  const [pitchColor, setPitchColor] = useState<string>('dark'); // 'dark', 'light'
  const [showPitchLines, setShowPitchLines] = useState<boolean>(true);
  const [pitchLinesColor, setPitchLinesColor] = useState<string>('border-white');
  const [pitchMarkingsColor, setPitchMarkingsColor] = useState<string>('bg-white');

  // Tính toán các lớp CSS cho sân bóng dựa trên các tùy chọn
  const getPitchClasses = () => {
    // Sử dụng tỷ lệ khác nhau cho mobile và desktop
    let baseClasses = "relative w-full rounded-xl overflow-hidden shadow-2xl ";
    // Thêm responsive aspect ratio và border - trên mobile sẽ có tỷ lệ và viền khác
    baseClasses += "aspect-[4/5] md:aspect-[2/2.5] border-2 md:border-4 ";
    let bgClasses = "";
    let borderClasses = "border-white dark:border-gray-700 ";

    // Loại sân
    if (pitchType === 'natural') {
      bgClasses += pitchColor === 'dark'
        ? "bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-800 dark:from-emerald-800 dark:via-emerald-900 dark:to-green-950 "
        : "bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 dark:from-emerald-700 dark:via-emerald-800 dark:to-green-900 ";
    } else if (pitchType === 'artificial') {
      bgClasses += pitchColor === 'dark'
        ? "bg-gradient-to-b from-green-600 via-green-700 to-green-800 dark:from-green-800 dark:via-green-900 dark:to-green-950 "
        : "bg-gradient-to-b from-green-500 via-green-600 to-green-700 dark:from-green-700 dark:via-green-800 dark:to-green-900 ";
    } else if (pitchType === 'futsal') {
      bgClasses += pitchColor === 'dark'
        ? "bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-blue-950 "
        : "bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 ";
    }

    return baseClasses + bgClasses + borderClasses;
  };

  // Xác định màu sắc cho các đường kẻ sân
  const getPitchLinesColor = () => {
    // Sử dụng màu được chọn bởi người dùng
    return pitchLinesColor;
  };

  // Xác định màu sắc cho các điểm trên sân (penalty, vòng tròn giữa sân)
  const getPitchMarkingsColor = () => {
    // Sử dụng màu được chọn bởi người dùng
    return pitchMarkingsColor;
  };

  return {
    pitchType,
    setPitchType,
    pitchColor,
    setPitchColor,
    showPitchLines,
    setShowPitchLines,
    pitchLinesColor,
    setPitchLinesColor,
    pitchMarkingsColor,
    setPitchMarkingsColor,
    getPitchClasses,
    getPitchLinesColor,
    getPitchMarkingsColor
  };
};
