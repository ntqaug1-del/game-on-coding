import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TabItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

interface TabsCustomProps {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  children: React.ReactNode;
  defaultValue?: string;
  gridCols: number;
  layoutId?: string;
  wrapContent?: boolean;
}

const TabsCustom: React.FC<TabsCustomProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children,
  defaultValue,
  gridCols,
  layoutId = "activeTabIndicator",
  wrapContent = true
}) => {
  // Xác định xem component có được kiểm soát từ bên ngoài hay không
  const isControlled = activeTab !== undefined && onTabChange !== undefined;

  // State nội bộ để theo dõi tab đang active khi không được kiểm soát từ bên ngoài
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue || (tabs.length > 0 ? tabs[0].id : ''));

  // Xử lý thay đổi tab
  const handleTabChange = (value: string) => {
    if (isControlled && onTabChange) {
      onTabChange(value);
    } else {
      setInternalActiveTab(value);
    }
  };

  // Cập nhật state nội bộ khi defaultValue thay đổi
  useEffect(() => {
    if (!isControlled && defaultValue) {
      setInternalActiveTab(defaultValue);
    }
  }, [defaultValue, isControlled]);

  // Xác định tab đang active
  const currentActiveTab = isControlled ? activeTab : internalActiveTab;

  return (
    <Tabs
      value={isControlled ? activeTab : internalActiveTab}
      onValueChange={handleTabChange}
      defaultValue={defaultValue}
      className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/80 to-purple-100/80 rounded-xl blur-xl opacity-70 -z-10" />
        <TabsList className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-md border border-indigo-100/50">
          <div className={cn(
            "grid grid-cols-2 gap-1 w-full",
            gridCols === 2 && "md:grid-cols-2",
            gridCols === 3 && "md:grid-cols-3",
            gridCols === 4 && "md:grid-cols-4",
            gridCols === 5 && "md:grid-cols-5",
            gridCols === 6 && "md:grid-cols-6"
          )}>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                disabled={tab.disabled}
                className={cn(
                  "relative flex flex-col md:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg transition-all duration-200",
                  "text-sm font-medium",
                  "data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md",
                  "data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-indigo-50/50 data-[state=inactive]:hover:text-indigo-700",
                  "data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-transparent data-[disabled]:hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center",
                  "md:mr-1"
                )}>
                  {tab.icon}
                </div>
                <span className="hidden md:inline">{tab.label}</span>
                <span className="text-xs md:hidden">{tab.label}</span>

                {/* Hiển thị indicator cho tab đang active */}
                {tab.id === currentActiveTab && (
                  <motion.div
                    layoutId={layoutId}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full mx-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </TabsTrigger>
            ))}
          </div>
        </TabsList>
      </div>

      {wrapContent ? children : <div className="mt-4">{children}</div>}
    </Tabs>
  );
};

export default TabsCustom;
