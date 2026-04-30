'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, X, MessageCircle, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am AgnI, your AI Farming Assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [isMuted, setIsMuted] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (typeof window !== 'undefined' && SpeechRecognition) {
      try {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleSendMessage(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } catch (err) {
        console.error('Failed to initialize speech recognition:', err);
      }
    }
  }, [language]);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (SpeechRecognition) {
        if (!recognitionRef.current) {
          recognitionRef.current = new SpeechRecognition();
        }
        recognitionRef.current.lang = language === 'english' ? 'en-US' : 'hi-IN';
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          console.error('Speech start error:', err);
          setIsListening(false);
        }
      } else {
        alert('Voice input is not supported in this browser. Please use Google Chrome or type your message below.');
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await fetch('http://localhost:5002/api/voice/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, language }),
      });

      const data = await response.json();
      
      if (data.response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        
        if (!isMuted) {
          speak(data.response);
        }
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'english' ? 'en-US' : 'hi-IN';
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-96 glass rounded-3xl shadow-2xl overflow-hidden border border-primary/20 flex flex-col max-h-[500px]"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">AgnI AI Assistant</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="px-4 py-2 bg-muted/30 border-b border-primary/10 flex gap-2">
              <button 
                onClick={() => setLanguage('english')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'english' ? 'bg-primary text-white' : 'bg-white/50 text-muted-foreground'}`}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage('hindi')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'hindi' ? 'bg-primary text-white' : 'bg-white/50 text-muted-foreground'}`}
              >
                हिन्दी
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white/80 dark:bg-black/20 backdrop-blur-sm border border-primary/10 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isSpeaking && (
                <div className="flex justify-start">
                  <div className="flex gap-1 items-center bg-white/50 p-2 rounded-full">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-primary/10 bg-white/30">
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleListening}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder={language === 'english' ? "Ask about your farm..." : "अपने खेत के बारे में पूछें..."}
                  className="flex-1 bg-white/50 border border-primary/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button 
                  onClick={() => handleSendMessage(inputValue)}
                  className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all active:scale-95 group relative"
      >
        <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20 group-hover:opacity-40" />
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>
    </div>
  );
};
