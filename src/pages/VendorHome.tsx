import React from 'react';
import KanbanBoard from '../components/conversations/KanbanBoard';

const VendorHome: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Conversations</h1>
        <p className="text-gray-600">Manage customer conversations and assist the AI agent</p>
      </div>
      
      <KanbanBoard />
    </div>
  );
};

export default VendorHome;