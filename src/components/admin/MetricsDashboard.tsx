import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { MessageSquare, Clock, CheckCircle } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface MetricsDashboardProps {
  metrics: {
    totalConversations: number;
    aiResolutionRate: number;
    avgResponseTime: number;
    conversationsPerDay: { date: string; count: number }[];
  };
  loading: boolean;
}

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ metrics, loading }) => {
  // Format data for conversationsPerDay chart
  const conversationsChartData = {
    labels: metrics.conversationsPerDay.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Conversations',
        data: metrics.conversationsPerDay.map(item => item.count),
        backgroundColor: 'rgba(30, 136, 229, 0.8)',
        borderColor: 'rgba(30, 136, 229, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Format data for AI resolution rate chart
  const resolutionRateData = {
    labels: ['AI Resolved', 'Human Intervention'],
    datasets: [
      {
        label: 'Resolution Rate',
        data: [
          metrics.aiResolutionRate, 
          Math.max(0, 100 - metrics.aiResolutionRate)
        ],
        backgroundColor: [
          'rgba(38, 166, 154, 0.8)',
          'rgba(255, 171, 64, 0.8)',
        ],
        borderColor: [
          'rgba(38, 166, 154, 1)',
          'rgba(255, 171, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-start">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Conversations</p>
              <h3 className="text-2xl font-bold text-gray-800">{metrics.totalConversations}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-start">
            <div className="rounded-full bg-teal-100 p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">AI Resolution Rate</p>
              <h3 className="text-2xl font-bold text-gray-800">{metrics.aiResolutionRate.toFixed(1)}%</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-start">
            <div className="rounded-full bg-orange-100 p-3 mr-4">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Avg. Response Time</p>
              <h3 className="text-2xl font-bold text-gray-800">{metrics.avgResponseTime.toFixed(1)}s</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Conversations Over Time</h3>
          <div className="h-64">
            <Bar
              data={conversationsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">AI Resolution Rate</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={resolutionRateData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
                cutout: '70%',
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-right">
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium">
          Export Report
        </button>
      </div>
    </div>
  );
};

export default MetricsDashboard;