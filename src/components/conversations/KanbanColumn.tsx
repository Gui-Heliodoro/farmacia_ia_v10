import React from 'react';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import ConversationCard from './ConversationCard';
import { Tables } from '../../lib/supabase';
import { MessageSquare } from 'lucide-react';

type Conversation = Tables<'conversations'>;

interface KanbanColumnProps {
  id: string;
  title: string;
  conversations: Conversation[];
  colorClass: string;
  iconColorClass: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  id, 
  title, 
  conversations,
  colorClass,
  iconColorClass
}) => {
  return (
    <div 
      className={`flex-1 flex flex-col ${colorClass} border rounded-lg shadow-sm overflow-hidden`}
    >
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className={`h-5 w-5 ${iconColorClass} mr-2`} />
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <div className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {conversations.length}
        </div>
      </div>
      
      <div className="flex-1 p-2 overflow-y-auto max-h-[calc(100vh-250px)]">
        <SortableContext
          items={conversations.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {conversations.length > 0 ? (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <ConversationCard 
                  key={conversation.id} 
                  conversation={conversation} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
              <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
              <p>No conversations</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;