import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  // Quick date range selections
  const setLast7Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    
    onStartDateChange(start.toISOString().split('T')[0]);
    onEndDateChange(end.toISOString().split('T')[0]);
  };
  
  const setLast30Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    
    onStartDateChange(start.toISOString().split('T')[0]);
    onEndDateChange(end.toISOString().split('T')[0]);
  };
  
  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    
    onStartDateChange(start.toISOString().split('T')[0]);
    onEndDateChange(now.toISOString().split('T')[0]);
  };
  
  const setLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    
    onStartDateChange(start.toISOString().split('T')[0]);
    onEndDateChange(end.toISOString().split('T')[0]);
  };
  
  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h3 className="text-gray-800 font-medium mb-2 sm:mb-0">Date Range</h3>
        
        <div className="flex space-x-2">
          <button
            onClick={setLast7Days}
            className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Last 7 days
          </button>
          <button
            onClick={setLast30Days}
            className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Last 30 days
          </button>
          <button
            onClick={setThisMonth}
            className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            This month
          </button>
          <button
            onClick={setLastMonth}
            className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Last month
          </button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="pl-10 block w-full sm:w-auto border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <span className="text-gray-500">to</span>
        
        <div className="w-full sm:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="pl-10 block w-full sm:w-auto border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;