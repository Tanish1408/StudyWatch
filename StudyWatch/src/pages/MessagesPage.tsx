import React, { useState, useEffect, useRef } from 'react';
import { useStudy } from '../context/StudyContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Send, ArrowLeft } from 'lucide-react';
import { Message } from '../types';

interface MessagesPageProps {
  onNavigate: (path: string) => void;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { messages, addMessage, markMessageAsRead } = useStudy();
  
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mark messages as read when viewed
  useEffect(() => {
    if (currentUser) {
      messages.forEach(message => {
        if (message.senderId !== currentUser.id && !message.read) {
          markMessageAsRead(message.id);
        }
      });
    }
  }, [messages, currentUser, markMessageAsRead]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() && currentUser) {
      addMessage(newMessage, currentUser.id);
      setNewMessage('');
    }
  };
  
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  
  messages.forEach(message => {
    const date = message.createdAt.split('T')[0];
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });
  
  const sortedDates = Object.keys(groupedMessages).sort();
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          icon={<ArrowLeft size={20} />}
          onClick={() => onNavigate('/')}
          className="mr-4"
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="h-[60vh] overflow-y-auto p-6">
            {sortedDates.length > 0 ? (
              sortedDates.map(date => (
                <div key={date} className="mb-6">
                  <div className="flex justify-center mb-4">
                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {formatMessageDate(date)}
                    </span>
                  </div>
                  
                  {groupedMessages[date].map(message => (
                    <div 
                      key={message.id} 
                      className={`mb-4 flex ${
                        message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.senderId === currentUser?.id
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div 
                          className={`text-xs mt-1 ${
                            message.senderId === currentUser?.id
                              ? 'text-blue-200'
                              : 'text-gray-500'
                          }`}
                        >
                          {formatMessageTime(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <Send size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">No messages yet</h3>
                <p className="text-gray-500 mb-4">
                  Send your first message to start a conversation
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>
      
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <Button 
          type="submit" 
          variant="primary"
          icon={<Send size={18} />}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default MessagesPage;