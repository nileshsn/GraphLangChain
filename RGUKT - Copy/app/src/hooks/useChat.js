import { useState, useEffect } from 'react';
import { sendMessage, getChatHistory } from '../services/api';
import socketService from '../services/socket';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect to socket
    socketService.connect();

    // Load chat history
    loadChatHistory();

    // Listen for new messages
    socketService.onMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      setMessages(history);
    } catch (err) {
      setError('Failed to load chat history');
    }
  };

  const handleSendMessage = async (text) => {
    setIsLoading(true);
    setError(null);

    try {
      const userMessage = {
        id: Date.now(),
        text,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);

      const response = await sendMessage(text);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage: handleSendMessage
  };
}; 