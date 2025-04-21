import React, { useState, useEffect } from 'react';
import KanbanBoard from '../components/conversations/KanbanBoard';
import MetricsDashboard from '../components/admin/MetricsDashboard';
import DateRangePicker from '../components/admin/DateRangePicker';
import { supabase } from '../lib/supabase';

const AdminHome: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'conversations' | 'metrics'>('metrics');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [metrics, setMetrics] = useState({
    totalConversations: 0,
    aiResolutionRate: 0,
    avgResponseTime: 0,
    conversationsPerDay: [] as { date: string; count: number }[]
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // Fetch total conversations
        const { data: conversationsData, error: conversationsError } = await supabase
          .from('conversations')
          .select('id, status, created_at, ai_handled_count, human_handled_count')
          .gte('created_at', startDate)
          .lte('created_at', endDate);
          
        if (conversationsError) throw conversationsError;
        
        const totalConversations = conversationsData.length;
        
        // Calculate AI resolution rate
        const completedByAI = conversationsData.filter(c => 
          c.status === 'completed' && c.human_handled_count === 0
        ).length;
        
        const aiResolutionRate = totalConversations > 0 
          ? (completedByAI / totalConversations) * 100 
          : 0;
        
        // Fetch response times
        const { data: responseTimesData, error: responseTimesError } = await supabase
          .from('response_times')
          .select('duration')
          .gte('created_at', startDate)
          .lte('created_at', endDate);
          
        if (responseTimesError) throw responseTimesError;
        
        const avgResponseTime = responseTimesData.length > 0
          ? responseTimesData.reduce((acc, curr) => acc + curr.duration, 0) / responseTimesData.length
          : 0;
        
        // Get conversations per day for chart
        const conversationsPerDay: { [key: string]: number } = {};
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Initialize all dates in range with 0
        for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
          const dateString = day.toISOString().split('T')[0];
          conversationsPerDay[dateString] = 0;
        }
        
        // Count conversations by date
        conversationsData.forEach(conv => {
          const date = new Date(conv.created_at).toISOString().split('T')[0];
          conversationsPerDay[date] = (conversationsPerDay[date] || 0) + 1;
        });
        
        // Convert to array for chart
        const convPerDayArray = Object.entries(conversationsPerDay).map(([date, count]) => ({
          date,
          count
        })).sort((a, b) => a.date.localeCompare(b.date));
        
        setMetrics({
          totalConversations,
          aiResolutionRate,
          avgResponseTime,
          conversationsPerDay: convPerDayArray
        });
        
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, [startDate, endDate]);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of pharmacy operations and metrics</p>
      </div>
      
      <div className="mb-6">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('metrics')}
                className={`pb-3 px-1 font-medium text-sm ${
                  selectedTab === 'metrics'
                    ? 'border-b-2 border-[#1e88e5] text-[#1e88e5]'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Metrics Dashboard
              </button>
              <button
                onClick={() => setSelectedTab('conversations')}
                className={`pb-3 px-1 font-medium text-sm ${
                  selectedTab === 'conversations'
                    ? 'border-b-2 border-[#1e88e5] text-[#1e88e5]'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Conversations
              </button>
            </nav>
          </div>
          
          {selectedTab === 'metrics' && (
            <div>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
              <MetricsDashboard 
                metrics={metrics}
                loading={loading}
              />
            </div>
          )}
          
          {selectedTab === 'conversations' && (
            <KanbanBoard />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;