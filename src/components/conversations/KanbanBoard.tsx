import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useConversationsStore } from '../../stores/conversationsStore';
import KanbanColumn from './KanbanColumn';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

const KanbanBoard: React.FC = () => {
  const { conversations, setConversations, moveConversation, fetchConversations } = useConversationsStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  useEffect(() => {
    const loadConversations = async () => {
      await fetchConversations();
      setLoading(false);
    };
    
    loadConversations();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('conversations-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'conversations' 
      }, (payload) => {
        // Handle different events
        if (payload.eventType === 'INSERT') {
          const newConversation = payload.new;
          setConversations([...conversations, newConversation]);
          toast.success('New conversation received!', {
            icon: '🔔',
            position: 'top-right',
          });
          // Play notification sound
          const audio = new Audio('/notification.mp3');
          audio.play().catch(e => console.error('Could not play notification sound:', e));
        } else if (payload.eventType === 'UPDATE') {
          fetchConversations();
        } else if (payload.eventType === 'DELETE') {
          const deletedId = payload.old.id;
          setConversations(conversations.filter(c => c.id !== deletedId));
        }
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchConversations, setConversations]);
  
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const conversationId = active.id as string;
    const targetStatus = over.id as string;
    
    // Don't do anything if dropped in the same place
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation || conversation.status === targetStatus) return;
    
    try {
      // Optimistically update the UI
      moveConversation(conversationId, targetStatus);
      
      // Update in the database
      const { error } = await supabase
        .from('conversations')
        .update({ 
          status: targetStatus,
          assigned_to: user?.id || null // Assign to current user
        })
        .eq('id', conversationId);
        
      if (error) throw error;
      
      // Show success message
      toast.success(`Conversation moved to ${targetStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating conversation status:', error);
      toast.error('Failed to update conversation status');
      // Revert the change by refreshing data
      fetchConversations();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const inProgressConversations = conversations.filter(c => c.status === 'in_progress');
  const waitingHumanConversations = conversations.filter(c => c.status === 'waiting_human');
  const completedConversations = conversations.filter(c => c.status === 'completed');
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <KanbanColumn
          id="in_progress"
          title="In Progress (AI)"
          conversations={inProgressConversations}
          colorClass="bg-blue-100 border-blue-300"
          iconColorClass="text-blue-600"
        />
        
        <KanbanColumn
          id="waiting_human"
          title="Awaiting Human Service"
          conversations={waitingHumanConversations}
          colorClass="bg-yellow-100 border-yellow-300"
          iconColorClass="text-yellow-600"
        />
        
        <KanbanColumn
          id="completed"
          title="Completed"
          conversations={completedConversations}
          colorClass="bg-green-100 border-green-300"
          iconColorClass="text-green-600"
        />
      </div>
    </DndContext>
  );
};

export default KanbanBoard;