import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase';

type Conversation = Tables<'conversations'>;

interface ConversationsState {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  setConversations: (conversations: Conversation[]) => void;
  fetchConversations: () => Promise<void>;
  moveConversation: (id: string, status: string) => void;
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  loading: false,
  error: null,
  
  setConversations: (conversations) => set({ conversations }),
  
  fetchConversations: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_time', { ascending: false });
        
      if (error) throw error;
      
      set({ conversations: data });
    } catch (error) {
      set({ error: (error as Error).message });
      console.error('Error fetching conversations:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  moveConversation: (id, status) => {
    set((state) => {
      const conversationIndex = state.conversations.findIndex(c => c.id === id);
      if (conversationIndex === -1) return state;
      
      const updatedConversations = [...state.conversations];
      updatedConversations[conversationIndex] = {
        ...updatedConversations[conversationIndex],
        status: status as 'in_progress' | 'waiting_human' | 'completed'
      };
      
      return { conversations: updatedConversations };
    });
  }
}));