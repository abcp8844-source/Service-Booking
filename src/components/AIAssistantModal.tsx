'use client';

import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';
import { ServiceCategory } from '../data/categories';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: ServiceCategory) => void;
}

export default function AIAssistantModal({ isOpen, onClose, onSelectCategory }: AIAssistantModalProps) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'ai'|'user', content: string}[]>([
    { role: 'ai', content: "Welcome! How can I help you book a service today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userQuery = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsLoading(true);

    try {
      // یہاں ہم .env فائل سے کی اٹھا رہے ہیں
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a helpful booking assistant. User asked: ${userQuery}` }] }]
        })
      });
      
      const data = await res.json();
      const reply = data.candidates[0].content.parts[0].text;
      
      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting to the AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[600px]">
        <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <h3 className="font-bold">Booking Assistant</h3>
          </div>
          <button onClick={onClose}><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-indigo-600'} text-white`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-xs text-center text-gray-500">Thinking...</div>}
        </div>

        <div className="p-4 bg-white border-t">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask for a service..."
              className="w-full bg-gray-100 rounded-xl py-3 pl-4 pr-12 focus:outline-none"
            />
            <button type="submit" className="absolute right-2 top-2 p-1.5 text-indigo-600"><Send className="w-5 h-5" /></button>
          </form>
        </div>
      </div>
    </div>
  );
}
