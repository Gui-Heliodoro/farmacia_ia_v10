import React, { useState, useEffect } from 'react';
import { X, Send, User, ArrowLeft } from 'lucide-react';
import { Tables } from '../../lib/supabase';
import { formatDate } from '../../utils/dateUtils';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';

type Conversation = Tables<'conversations'>;

interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender_type: 'customer' | 'ai' | 'staff';
  sender_id: string | null;
  created_at: string;
}

interface ConversationDetailsProps {
  conversation: Conversation;
  onClose: () => void;
}

const ConversationDetails: React.FC<ConversationDetailsProps> = ({ 
  conversation, 
  onClose 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { user, profile } = useAuthStore();
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new messages
    const subscription = supabase
      .channel(`conversation:${conversation.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversation.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [conversation.id]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          content: newMessage.trim(),
          sender_type: 'staff',
          sender_id: user.id
        });
      
      if (error) throw error;
      
      setNewMessage('');
      
      // Update conversation's last message
      await supabase
        .from('conversations')
        .update({
          last_message: newMessage.trim(),
          last_message_time: new Date().toISOString(),
          human_handled_count: conversation.human_handled_count + 1
        })
        .eq('id', conversation.id);
        
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={onClose}
              className="mr-2 text-gray-500 hover:text-gray-700 md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{conversation.customer_name}</h3>
                <p className="text-sm text-gray-500">{conversation.customer_phone}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hidden md:block"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Message list */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${
                    message.sender_type === 'customer' 
                      ? 'justify-start' 
                      : 'justify-end'
                  }`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender_type === 'customer'
                        ? 'bg-gray-200 text-gray-800'
                        : message.sender_type === 'ai'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-[#1e88e5] text-white'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {formatDate(message.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Message input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              type="submit"
              className="bg-[#1e88e5] text-white rounded-r-lg px-4 py-2 font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center disabled:opacity-70 disabled:bg-blue-400"
              disabled={sending || !newMessage.trim()}
            >
              {sending ? (
                <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConversationDetails;