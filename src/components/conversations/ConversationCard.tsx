import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, User, MessageSquare, PhoneOutgoing } from 'lucide-react';
import { Tables } from '../../lib/supabase';
import { formatTimeAgo } from '../../utils/dateUtils';
import ConversationDetails from './ConversationDetails';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

type Conversation = Tables<'conversations'>;

interface ConversationCardProps {
  conversation: Conversation;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: conversation.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const handleAssignToMe = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          assigned_to: user.id,
          status: 'waiting_human'
        })
        .eq('id', conversation.id);
      
      if (error) throw error;
      
      toast.success('Conversation assigned to you');
    } catch (error) {
      console.error('Error assigning conversation:', error);
      toast.error('Failed to assign conversation');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white rounded-md shadow-sm border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-2">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{conversation.customer_name}</h3>
              <p className="text-xs text-gray-500">{conversation.customer_phone}</p>
            </div>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatTimeAgo(conversation.last_message_time)}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{conversation.last_message}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowDetails(true)}
              className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Details
            </button>
            
            {conversation.status === 'in_progress' && (
              <button 
                onClick={handleAssignToMe}
                disabled={loading}
                className="inline-flex items-center text-xs font-medium text-green-600 hover:text-green-800 disabled:opacity-50"
              >
                <PhoneOutgoing className="h-3 w-3 mr-1" />
                {loading ? 'Assigning...' : 'Assign to me'}
              </button>
            )}
          </div>
          
          <div 
            className={`text-xs px-2 py-0.5 rounded-full ${
              conversation.status === 'in_progress' 
                ? 'bg-blue-100 text-blue-800' 
                : conversation.status === 'waiting_human'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {conversation.status === 'in_progress' ? 'AI Handling' 
              : conversation.status === 'waiting_human' ? 'Human Needed'
              : 'Completed'}
          </div>
        </div>
      </div>
      
      {showDetails && (
        <ConversationDetails 
          conversation={conversation} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </>
  );
};

export default ConversationCard;