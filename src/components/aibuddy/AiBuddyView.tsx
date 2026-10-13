import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';
import { StudyPlannerModal } from './StudyPlannerModal';
import { getApiUrl, getOfflineAiResponse } from '../../utils/apiClient';
import { MathRenderer } from '../common/MathRenderer';
import {
  Sparkles,
  Send,
  Image as ImageIcon,
  X,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Calculator,
  Clock,
  Lightbulb,
} from 'lucide-react';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'model',
    text: `আসসালামু আলাইকুম! আমি তোমার **HSC Study Buddy** 🎓

পদার্থবিজ্ঞান, রসায়ন, উচ্চতর গণিত, জীববিজ্ঞান, ICT বা ইংরেজি — যেকোনো কঠিন অংক বা বিষয়ের ব্যাখ্যা জানতে পারো।
কোনো গাণিতিক সমস্যা বা বইয়ের প্রশ্ন থাকলে **ছবি তুলেও পাঠাতে পারো**! 📸`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export const AiBuddyView: React.FC = () => {
  const { userProfile } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('hsc_ai_messages_v1');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('hsc_ai_messages_v1', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('ছবির সাইজ সর্বোচ্চ ১০ MB হতে পারবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be re-selected if needed
    e.target.value = '';
  };

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt !== undefined ? customPrompt : input;
    if (!promptToSend.trim() && !selectedImage) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: promptToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageBase64: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    const imagePayload = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Build lightweight history context
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch(getApiUrl('/api/ai/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptToSend.trim(),
          history: historyPayload,
          imageBase64: imagePayload || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('সার্ভার থেকে উত্তর পাওয়া যায়নি');
      }

      const data = await response.json();
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: data.reply || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.warn('Network request failed, using intelligent offline tutor mode:', err);
      const offlineReply = getOfflineAiResponse(promptToSend);
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: offlineReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearHistory = () => {
    if (confirm('AI চ্যাট হিস্ট্রি রিসেট করতে চান?')) {
      setMessages(INITIAL_MESSAGES);
    }
  };

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-5 flex flex-col min-h-[92vh]">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Buddy</h1>
          <p className="text-xs text-stone-500 font-medium">
            তোমার সার্বক্ষণিক ব্যক্তিগত HSC শিক্ষক
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={clearHistory}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            title="নতুন চ্যাট শুরু করুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-2xl bg-rose-700 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 fill-white/20" />
          </div>
        </div>
      </div>

      {/* Hero Card */}
      <div className="rounded-3xl p-4.5 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white shadow-xl border border-slate-800 mb-3 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-base font-bold tracking-tight">হ্যালো! আমি Study Buddy</h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            যেকোনো প্রশ্ন করো — অংক, বিজ্ঞান, ইংরেজি। ছবি দিয়েও সমস্যা দেখাতে পারো!
          </p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          {
            icon: BookOpen,
            title: 'পড়ার পরামর্শ',
            color: 'text-amber-800 bg-amber-50 border-amber-200/60',
            prompt: 'HSC বিজ্ঞান বিভাগের বিষয়গুলো রিভিশন দেওয়ার সেরা কৌশল কী?',
          },
          {
            icon: Calculator,
            title: 'অংক সমাধান',
            color: 'text-indigo-800 bg-indigo-50 border-indigo-200/60',
            prompt: 'উচ্চতর গণিত ১ম পত্রের অন্তরীকরণ (Differentiation) থেকে একটি গুরুত্বপূর্ণ বোর্ড প্রশ্ন ধাপে ধাপে সমাধান করো।',
          },
          {
            icon: Clock,
            title: 'সময় পরিকল্পনা',
            color: 'text-rose-800 bg-rose-50 border-rose-200/60',
            action: () => setIsPlannerOpen(true),
          },
          {
            icon: Lightbulb,
            title: 'পরীক্ষার টিপস',
            color: 'text-emerald-800 bg-emerald-50 border-emerald-200/60',
            prompt: 'HSC পদার্থবিজ্ঞান ও রসায়ন পরীক্ষার হলে সময় ব্যবস্থাপনা ও CQ লেখার জরুরি টিপস দাও।',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.prompt) {
                  handleSend(item.prompt);
                }
              }}
              className={`p-2.5 rounded-2xl border flex items-center gap-2 text-left transition active:scale-97 hover:shadow-2xs ${item.color}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold leading-tight">{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 space-y-3.5 overflow-y-auto mb-3 pr-0.5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              <div
                className={`max-w-[88%] rounded-3xl p-4 text-xs leading-relaxed transition ${
                  isUser
                    ? 'bg-slate-950 text-white rounded-br-xs shadow-xs'
                    : 'bg-white border border-stone-200/80 text-slate-900 rounded-bl-xs shadow-2xs'
                }`}
              >
                {/* Uploaded image thumbnail if any */}
                {msg.imageBase64 && (
                  <div className="mb-2.5 overflow-hidden rounded-xl border border-white/20 max-h-52">
                    <img
                      src={msg.imageBase64}
                      alt="প্রশ্ন ছবি"
                      className="w-full h-auto object-contain bg-black/10"
                    />
                  </div>
                )}

                {/* Formatted Text & Math Equations Content */}
                {isUser ? (
                  <div className="whitespace-pre-wrap break-words font-medium">
                    {msg.text}
                  </div>
                ) : (
                  <MathRenderer content={msg.text} />
                )}

                {/* Footer time & copy */}
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    isUser ? 'text-slate-400' : 'text-stone-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-60 group-hover:opacity-100 hover:text-slate-900 transition flex items-center gap-1"
                      title="কপি করুন"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>কপি</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="rounded-2xl bg-white border border-stone-200/80 p-3.5 shadow-2xs flex items-center gap-2 text-xs text-stone-600">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              <span>Study Buddy উত্তর লিখছে...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Image Preview before sending */}
      {selectedImage && (
        <div className="mb-2 p-2 rounded-2xl bg-white border border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-12 h-12 object-cover rounded-xl border border-stone-200"
            />
            <span className="text-xs font-semibold text-slate-800">ছবি যুক্ত করা হয়েছে</span>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="p-1 rounded-full text-stone-400 hover:text-rose-600 hover:bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="sticky bottom-16 pt-1 pb-2 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa] to-transparent">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-white rounded-full p-1.5 pl-3 border border-stone-200/90 shadow-md focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent transition"
        >
          {/* File Upload for Image / Camera */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full text-stone-400 hover:text-slate-900 hover:bg-stone-100 transition active:scale-95"
            title="প্রশ্নের ছবি দিন"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder="তোমার প্রশ্ন লেখো..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm text-slate-900 bg-transparent focus:outline-none placeholder:text-stone-400"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 ${
              input.trim() || selectedImage
                ? 'bg-slate-950 text-white shadow-xs hover:bg-slate-900'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* AI Study Planner Modal */}
      <StudyPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
      />
    </div>
  );
};
