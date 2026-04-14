import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles } from 'lucide-react';
import { useWardrobe } from '../hooks/useWardrobe';
import { getStylingAdvice } from '../lib/gemini';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const StylistChat = () => {
  const { items } = useWardrobe();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessageInput('');
    setIsLoading(true);

    try {
      const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
      const response = await getStylingAdvice({
        message: messageInput,
        selectedItems: selectedItemsData.map(item => ({
          name: item.name,
          category: item.category,
        })),
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch {
      toast.error('Failed to get styling advice', { duration: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="pl-24 pr-8 py-12 min-h-screen bg-zinc-50 flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col mr-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-serif text-zinc-900 mb-2">AI Stylist</h1>
          <p className="text-zinc-500 font-sans">Get personalized styling advice</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 bg-white rounded-[32px] border border-zinc-100 p-6 flex flex-col mb-6 min-h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="text-zinc-400" size={40} />
                </div>
                <h3 className="text-xl font-medium text-zinc-900 mb-2">Ask your AI stylist</h3>
                <p className="text-zinc-500 max-w-xs">
                  Select items from your wardrobe and get personalized styling advice
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      'flex',
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[70%] px-6 py-3 rounded-2xl',
                        message.sender === 'user'
                          ? 'bg-black text-white'
                          : 'bg-zinc-100 text-zinc-900'
                      )}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-zinc-100 text-zinc-900 px-6 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-3 mt-4">
            <input
              ref={inputRef}
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about styling, outfits, or weather..."
              className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !messageInput.trim()}
              className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Item Picker Sidebar */}
      <div className="w-80">
        <div className="bg-white rounded-[32px] border border-zinc-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-serif text-zinc-900">Selected Items</h3>
            {selectedItems.length > 0 && (
              <button
                onClick={() => setSelectedItems([])}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {selectedItems.length === 0 ? (
            <p className="text-zinc-500 text-sm mb-4">No items selected</p>
          ) : (
            <div className="space-y-2 mb-4">
              {items
                .filter(item => selectedItems.includes(item.id))
                .map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 bg-zinc-50 rounded-xl"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-900 truncate">{item.name}</p>
                      <p className="text-xs text-zinc-500 capitalize">{item.category}</p>
                    </div>
                    <button
                      onClick={() => toggleItemSelection(item.id)}
                      className="text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
            </div>
          )}

          <div className="border-t border-zinc-100 pt-4">
            <h4 className="text-sm font-medium text-zinc-700 mb-3">All Items</h4>
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {items.map(item => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleItemSelection(item.id)}
                  className={cn(
                    'relative aspect-square rounded-xl overflow-hidden border-2 transition-all',
                    selectedItems.includes(item.id)
                      ? 'border-black shadow-lg'
                      : 'border-zinc-200 hover:border-zinc-400'
                  )}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedItems.includes(item.id) && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">+</span>
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
