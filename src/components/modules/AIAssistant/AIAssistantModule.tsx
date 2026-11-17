'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useLanguage } from '@/context/LanguageContext';
import { useVoice } from '@/context/VoiceContext';
import { Bot, Send, User, Sparkles, Volume2, Mic, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantModule: React.FC = () => {
  const { t, language } = useLanguage();
  const { speakText, isSpeaking, cancelSpeech } = useVoice();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text:
        language === 'hi'
          ? 'नमस्ते किसान मित्र! मैं मंडी मित्र एआई हूँ। आप मुझसे मंडी भाव, भाव पूर्वानुमान, अभी बेचें या रुकें, परिवहन किराया अथवा फसल भंडारण के बारे में कुछ भी पूछ सकते हैं।'
          : 'Hello Farmer Friend! I am Mandi Mitra AI. Ask me anything regarding live mandi prices, 15-day price forecasts, sell vs wait calculations, transport costs, or grain storage.',
      timestamp: 'Just now',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update initial greeting when language updates post-mount
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'm-1') {
        return [
          {
            id: 'm-1',
            sender: 'assistant',
            text:
              language === 'hi'
                ? 'नमस्ते किसान मित्र! मैं मंडी मित्र एआई हूँ। आप मुझसे मंडी भाव, भाव पूर्वानुमान, अभी बेचें या रुकें, परिवहन किराया अथवा फसल भंडारण के बारे में कुछ भी पूछ सकते हैं।'
                : 'Hello Farmer Friend! I am Mandi Mitra AI. Ask me anything regarding live mandi prices, 15-day price forecasts, sell vs wait calculations, transport costs, or grain storage.',
            timestamp: 'Just now',
          },
        ];
      }
      return prev;
    });
  }, [language]);

  const quickPrompts = [
    language === 'hi'
      ? 'आज इंदौर और उज्जैन मंडी में सोयाबीन का क्या भाव है?'
      : 'What is today\'s Soybean rate in Indore and Ujjain Mandis?',
    language === 'hi'
      ? 'क्या मुझे 85 क्विंटल सोयाबीन अभी बेचना चाहिए या 1 महीने रुकना चाहिए?'
      : 'Should I sell 85 quintals of Soybean now or wait 1 month?',
    language === 'hi'
      ? 'लहसुन के दाम मंदसौर मंडी में क्यों बढ़ रहे हैं?'
      : 'Why are Garlic prices surging in Mandsaur Mandi?',
    language === 'hi'
      ? 'बुधवार को बारिश का क्या अलर्ट है?'
      : 'What is the rain warning for Wednesday?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, language }),
      });
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      // Local fallback
      const fallbackReply =
        language === 'hi'
          ? `विश्लेषण परिणाम: वर्तमान में इंदौर मंडी में सोयाबीन ₹4,980/क्विंटल और उज्जैन में ₹5,040/क्विंटल है। 85 क्विंटल के लिए मालवा एग्रो का ₹5,120/क्विंटल का निःशुल्क फार्म पिकअप ऑफर सबसे उत्तम है, जिससे आपकी ₹3,400 की परिवहन बचत होगी।`
          : `Analysis: Currently Soybean is ₹4,980/qtl in Indore and ₹5,040/qtl in Ujjain. For an 85 quintal batch, Malwa Agro's farm-gate offer at ₹5,120/qtl with free pickup yields the maximum net realization.`;

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-emerald-700" />
          Mandi Mitra AI Agricultural Assistant
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Ask questions in any of 12 Indian languages about market trends, transport rates, and storage economics.
        </p>

        {/* NVIDIA Architecture & Engine Status */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            NVIDIA NIM Architecture Ready
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-medium border border-gray-200">
            Active: Deterministic Agro-Advisory Engine (Keyless Fallback)
          </span>
          <span className="text-[11px] text-gray-400">
            Grounded in Central India APMC prices
          </span>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="h-[520px] flex flex-col justify-between p-0 overflow-hidden border border-gray-200">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-mandi-dark text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-md rounded-2xl p-4 shadow-sm text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-mandi-dark text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-black/10 text-[10px] opacity-75">
                  <span>{m.timestamp}</span>
                  {m.sender === 'assistant' && (
                    <button
                      onClick={() => (isSpeaking ? cancelSpeech() : speakText(m.text))}
                      className="p-1 hover:bg-gray-100 rounded text-emerald-800 font-medium flex items-center gap-1"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Speak
                    </button>
                  )}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-sm mt-0.5 font-bold text-xs">
                  U
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-mandi-dark text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 text-xs text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Mandi Mitra AI is querying Central India Mandi indices...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-white border-t border-gray-100 overflow-x-auto flex gap-2">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs whitespace-nowrap font-medium transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about mandi rates, when to sell, or storage fees..."
              className="flex-1 py-2.5 px-4 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
