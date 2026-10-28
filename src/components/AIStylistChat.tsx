import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  BrainCircuit,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  modelUsed?: string;
  isThinking?: boolean;
}

export const AIStylistChat: React.FC = () => {
  const {
    isAiModalOpen,
    setIsAiModalOpen,
    language,
    t,
    products,
    setSelectedProductId,
    setCurrentView,
  } = useStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        language === 'ur'
          ? 'السلام علیکم! میں زویا ہوں، جی اے کلوتھ کی چیف فیشن کنسلٹنٹ۔ آپ مجھ سے شادی کے ملبوسات، لان کے ان سلے سوٹ کی سلائی کے لیے کپڑے کی درست پیمائش، یا فیسٹیو کلیکشن کے بارے میں کچھ بھی پوچھ سکتے ہیں۔'
          : 'Assalam-o-Alaikum! I am Zoya, GA Cloth’s chief fashion stylist and tailoring consultant. Powered by advanced high-thinking AI, I can help you select festive ensembles, calculate tailor fabric yardage for flared frocks/maxis, or advise on seasonal Pakistani textiles.',
      modelUsed: 'gemini-4-argon',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiModalOpen) {
      scrollToBottom();
    }
  }, [messages, isAiModalOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          currentLanguage: language,
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        content:
          data.reply ||
          (language === 'ur'
            ? 'معذرت، اس وقت جواب تیار نہیں ہو سکا۔ براہ کرم دوبارہ کوشش فرمائیں۔'
            : 'Apologies, I encountered an issue generating style advice. Please try again.'),
        modelUsed: data.modelUsed || 'gemini-4-argon',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            language === 'ur'
              ? 'معذرت، رابطہ قائم نہیں ہو سکا۔ براہ کرم اپنا انٹرنیٹ چیک کریں یا بعد میں کوشش کریں۔'
              : 'Our styling server is momentarily busy. Please try asking again in a moment!',
          modelUsed: 'gemini-3.8-flash',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAiModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0e111a] w-full max-w-2xl h-[620px] max-h-[90vh] rounded-2xl shadow-2xl border border-[#262c40] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* 1. Header with Argon Thinking badge */}
        <div className="bg-gradient-to-r from-[#0c0e14] via-[#131622] to-[#1e1910] text-white p-4 flex items-center justify-between border-b border-[#24293c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-yellow-400/10 backdrop-blur-md border border-yellow-400/30 flex items-center justify-center text-yellow-400 shadow-lg shadow-yellow-500/10 relative flex-shrink-0">
              <img
                src="https://kommodo.ai/i/S9dbA9lA5JDHR6G2bTCt"
                alt={language === 'ur' ? 'زویا AI اسٹائلسٹ' : 'Zoya AI Stylist'}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Sparkles className="w-5 h-5 animate-pulse -z-10 absolute" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
                  {language === 'ur' ? 'زویا - فیشن و درزی مشیر' : 'Zoya - AI Fashion Stylist'}
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow">
                  <BrainCircuit className="w-3 h-3" />
                  Gemini 4 Argon
                </span>
              </div>
              <p className="text-[11px] text-yellow-400/80">
                {language === 'ur'
                  ? 'ہائی تھنکنگ موڈ فعال • بارات، فیسٹیو اور ٹیلرنگ مشاورت'
                  : 'High-Thinking Mode • Wedding wardrobe & tailor fabric yardage'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#181d2c] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Messages conversation viewport */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b0c10]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 text-xs shadow-md relative ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold'
                    : 'bg-[#181d2c] text-yellow-400 border border-yellow-400/30'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <>
                    <img
                      src="https://kommodo.ai/i/S9dbA9lA5JDHR6G2bTCt"
                      alt={language === 'ur' ? 'زویا' : 'Zoya'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Bot className="w-4 h-4 -z-10 absolute" />
                  </>
                )}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-tr-xs'
                    : 'bg-[#131622] text-white border border-[#24293c] rounded-tl-xs'
                }`}
              >
                {/* Message body with linebreaks */}
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Model badge */}
                {msg.role === 'assistant' && msg.modelUsed && (
                  <div className="mt-2.5 pt-2 border-t border-[#22273a] flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-yellow-400">
                      <BrainCircuit className="w-3 h-3 text-yellow-400" />
                      Reasoned with {msg.modelUsed}
                    </span>
                    <span className="text-[9px] bg-[#181d2c] border border-[#2b3145] px-2 py-0.5 rounded text-yellow-300 font-semibold">
                      ThinkingLevel: HIGH
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#181d2c] text-yellow-400 flex items-center justify-center flex-shrink-0 border border-yellow-400/30 relative">
                <img
                  src="https://kommodo.ai/i/S9dbA9lA5JDHR6G2bTCt"
                  alt={language === 'ur' ? 'زویا' : 'Zoya'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <Bot className="w-4 h-4 animate-spin -z-10 absolute" />
              </div>
              <div className="bg-[#131622] border border-[#24293c] rounded-2xl rounded-tl-xs p-3.5 shadow-lg">
                <div className="flex items-center gap-2 text-xs text-yellow-400 font-bold">
                  <BrainCircuit className="w-4 h-4 animate-bounce" />
                  <span>
                    {language === 'ur'
                      ? 'زویا گہری سوچ بچار (High Thinking) کے ساتھ جائزہ لے رہی ہیں...'
                      : 'Zoya is reasoning with Gemini 4 Argon thinking mode...'}
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping delay-100" />
                  <span className="w-2 h-2 rounded-full bg-yellow-200 animate-ping delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. Prompt chips */}
        <div className="p-2.5 bg-[#0e111a] border-t border-[#24293c] overflow-x-auto flex gap-1.5 scrollbar-none">
          {t.suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium text-yellow-300 bg-[#181d2c] hover:bg-yellow-400/20 hover:text-yellow-400 border border-[#2b3145] rounded-full px-3 py-1 whitespace-nowrap transition cursor-pointer flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* 4. Input bar */}
        <div className="p-3 bg-[#0e111a] border-t border-[#24293c]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.askStylist}
              disabled={loading}
              className="flex-1 bg-[#181d2c] border border-[#2b3145] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 disabled:bg-[#1f2438] disabled:text-slate-600 text-black font-black rounded-xl transition shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
