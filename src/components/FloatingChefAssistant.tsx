import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, RefreshCw, MessageSquare, Flame } from 'lucide-react';
import { ChatMessage } from '../types';

interface FloatingChefAssistantProps {
  language: 'en' | 'hi';
}

export const FloatingChefAssistant: React.FC<FloatingChefAssistantProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content:
        language === 'hi'
          ? 'नमस्ते! मैं शेफ जूनियर हूँ। आज रसोई में क्या मदद चाहिए?'
          : 'Bonjour! I am Chef Jr., your AI kitchen assistant. Need recipe help, quick swaps, or fixing a dish?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser version.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const speakText = (text: string) => {
    if (!voiceOutputEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiHistory = newMessages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/ai/chef-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiHistory, language }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get chef advice');

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(data.reply);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: 'Ouch! My oven timer just beeped. Could you please ask that again?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts =
    language === 'hi'
      ? ['नमक ज़्यादा हो गया, क्या करूँ?', 'अंडे का विकल्प क्या है?', '१० मिनट में आसान स्नैक', 'आलू पराठा टिप']
      : ['Fix overly salty soup', 'Quick egg substitute', '10-min healthy snack', 'Secret to crispy fries'];

  return (
    <>
      {/* Floating Animated Chef Avatar Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-2 px-3 py-1.5 rounded-xl glass-panel text-xs font-bold text-stone-800 dark:text-stone-100 border border-orange-500/30 shadow-lg flex items-center gap-1.5 bg-white/90 dark:bg-stone-900/90 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Chef Jr. is ready!</span>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 rounded-3xl btn-skeuo flex items-center justify-center shadow-2xl cursor-pointer group border-2 border-white/40"
          title="Open Chef Jr. Voice Assistant"
        >
          <div className="absolute inset-0 rounded-3xl bg-amber-400/20 animate-ping opacity-75" />
          <ChefHat className="w-9 h-9 text-white group-hover:scale-110 transition-transform relative z-10" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-stone-900 z-20" />
        </motion.button>
      </div>

      {/* Slide-out Chat Interface Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[520px] rounded-3xl glass-panel border border-orange-500/30 shadow-2xl bg-white/95 dark:bg-stone-900/95 flex flex-col overflow-hidden text-stone-800 dark:text-stone-100"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                    <span>Chef Jr. AI Assistant</span>
                    <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  </h3>
                  <p className="text-[10px] text-amber-100 font-medium">Real-time Kitchen Guidance ({language.toUpperCase()})</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Speech audio toggle */}
                <button
                  onClick={() => setVoiceOutputEnabled(!voiceOutputEnabled)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                  title={voiceOutputEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
                >
                  {voiceOutputEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Bar */}
            <div className="p-2.5 bg-stone-100/80 dark:bg-stone-800/80 border-b border-stone-200/50 dark:border-stone-700/50 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-[11px] font-semibold text-stone-600 dark:text-stone-300 whitespace-nowrap hover:border-orange-500 transition cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <ChefHat className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-none shadow-md font-medium'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-bl-none border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        msg.role === 'user' ? 'text-amber-100' : 'text-stone-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 items-center text-stone-400 text-xs italic">
                  <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <ChefHat className="w-4 h-4 animate-spin" />
                  </div>
                  <span>Chef Jr. is tasting your dish...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200/50 dark:border-stone-700/50 flex items-center gap-2">
              <button
                onClick={toggleListening}
                className={`p-2.5 rounded-xl transition cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-200 hover:bg-stone-300'
                }`}
                title={isListening ? 'Stop Listening' : 'Voice Input (EN/HI)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={
                  isListening
                    ? 'Listening...'
                    : language === 'hi'
                    ? 'शेफ से कुछ भी पूछें...'
                    : 'Ask Chef Jr. anything...'
                }
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:border-orange-500"
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl btn-skeuo text-white disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
