import React from 'react';
import KanbanBoard from '../components/conversations/KanbanBoard';

const PharmacistHome: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prescription Conversations</h1>
        <p className="text-gray-600">Review prescription requests and provide consultations</p>
      </div>
      
      <KanbanBoard />
    </div>
  );
};

export default PharmacistHome;