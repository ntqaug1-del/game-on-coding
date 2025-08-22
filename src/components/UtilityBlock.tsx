import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { MessageSquare, Volume2, Users, Mic, Speech, AudioLines, Users2, Mic2, GalleryVertical, AudioWaveform, Briefcase, Sparkles, Text, Volume, CircleDollarSign, Coins, FileText, User, Globe, Scale, QrCode, Dice1, Circle, BarChart3, BrainCircuit } from 'lucide-react';

interface UtilityBlockProps {
  title: string;
  description: string;
  className?: string;
  id: number;
}

const UtilityBlock: React.FC<UtilityBlockProps> = ({
  title,
  description,
  className,
  id
}) => {
  const renderIcon = () => {
    if (title === "Text to Speech") {
      return (
        <div className="relative h-12 sm:h-16 w-12 sm:w-16">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
            <Volume2 className="absolute -bottom-1 -right-1 h-4 sm:h-6 w-4 sm:w-6 text-white bg-indigo-500 rounded-full p-0.5 shadow-lg" />
          </div>
        </div>
      );
    } else if (title === "Football Formation Builder") {
      return (
        <div className="relative h-12 sm:h-16 w-12 sm:w-16">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
            <Circle className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
            <Users2 className="absolute -bottom-1 -right-1 h-4 sm:h-6 w-4 sm:w-6 text-white bg-emerald-500 rounded-full p-0.5 shadow-lg" />
          </div>
        </div>
      );
    } else if (title === "Dice Roller") {
      return (
        <div className="relative h-12 sm:h-16 w-12 sm:w-16">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Dice1 className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
            <Sparkles className="absolute -bottom-1 -right-1 h-4 sm:h-6 w-4 sm:w-6 text-white bg-orange-500 rounded-full p-0.5 shadow-lg" />
          </div>
        </div>
      );
    } else if (title === "Portfolio") {
      return (
        <div className="relative h-12 sm:h-16 w-12 sm:w-16">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Briefcase className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
            <Sparkles className="absolute -bottom-1 -right-1 h-4 sm:h-6 w-4 sm:w-6 text-white bg-pink-500 rounded-full p-0.5 shadow-lg" />
          </div>
        </div>
      );
    } else if (title === "Spin Wheel") {
      return (
        <div className="relative h-12 sm:h-16 w-12 sm:w-16">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <CircleDollarSign className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
            <Coins className="absolute -bottom-1 -right-1 h-4 sm:h-6 w-4 sm:w-6 text-white bg-orange-500 rounded-full p-0.5 shadow-lg" />
          </div>
        </div>
      );
    } else if (title === "My Resume") {
      return (
        <div className="relative h-12 sm:h-16 w-12 sm:w-16">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center">
            <FileText className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
            <User className="absolute -bottom-1 -right-1 h-4 sm:h-6 w-4 sm:w-6 text-white bg-teal-500 rounded-full p-0.5 shadow-lg" />
          </div>
        </div>
      );
    } else if (title === "Elite Web") {
      return (
        <div className="relative h-12 sm:h-16 w-12 sm:w-16">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Globe className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
            <Sparkles className="absolute -bottom-1 -right-1 h-4 sm:h-6 w-4 sm:w-6 text-white bg-cyan-500 rounded-full p-0.5 shadow-lg" />
          </div>
        </div>
      );
    } else if (title === "Unit Converter") {
      return (
        <div className="relative h-12 sm:h-16 w-12 sm:w-16">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Scale className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
            <Sparkles className="absolute -bottom-1 -right-1 h-4 sm:h-6 w-4 sm:w-6 text-white bg-purple-500 rounded-full p-0.5 shadow-lg" />
          </div>
        </div>
      );
    } else if (title === "QR Code Generator") {
      return (
        <div className="relative h-12 sm:h-16 w-12 sm:w-16">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
            <QrCode className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
            <Sparkles className="absolute -bottom-1 -right-1 h-4 sm:h-6 w-4 sm:w-6 text-white bg-green-500 rounded-full p-0.5 shadow-lg" />
          </div>
        </div>
      );
    } else if (title === "AI Data Analysis") {
      return (
        <div className="relative h-12 sm:h-16 w-12 sm:w-16">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
            <BrainCircuit className="absolute -bottom-1 -right-1 h-4 sm:h-6 w-4 sm:w-6 text-white bg-purple-500 rounded-full p-0.5 shadow-lg" />
          </div>
        </div>
      );
    }
    // Default icon if no match
    return (
      <div className="relative h-12 sm:h-16 w-12 sm:w-16">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
          <MessageSquare className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
        </div>
      </div>
    );
  };

  const getLink = () => {
    if (title === "Portfolio") return "/portfolio";
    if (title === "My Resume") return "/resume";
    if (title === "Elite Web") return "/elite-web";
    if (title === "Unit Converter") return "/unit-converter";
    if (title === "Dice Roller") return "/dice-roller";
    if (title === "Football Formation Builder") return "/football-formation-builder";
    if (title === "AI Data Analysis") return "/ai-data-analysis";
    return `/utility/${id}`;
  };

  return (
    <Link to={getLink()} className="block">
      <div className={cn(
        "bg-white rounded-xl p-4 sm:p-6 shadow-md transition-all duration-300 flex flex-col h-full",
        "hover:shadow-lg hover:scale-105 hover:bg-gray-50 hover:border-purple-300 hover:border-2 transform",
        className
      )}>
        <div className="mb-3 sm:mb-4 flex justify-start">
          {renderIcon()}
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-left text-gray-800">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 text-left">{description}</p>
      </div>
    </Link>
  );
};

export default UtilityBlock;
