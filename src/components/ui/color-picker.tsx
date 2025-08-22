import React from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-12 rounded cursor-pointer"
      />
      <span className="text-sm text-gray-600">{value}</span>
    </div>
  );
}; 