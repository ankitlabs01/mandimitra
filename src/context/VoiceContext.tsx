'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';

interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  isSpeaking: boolean;
  startListening: () => void;
  stopListening: () => void;
  speakText: (text: string) => void;
  cancelSpeech: () => void;
  isSupported: boolean;
  lastIntent: string | null;
  clearTranscript: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLanguageMeta } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [lastIntent, setLastIntent] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = currentLanguageMeta.speechCode || 'hi-IN';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          if (event.results[0].isFinal) {
            analyzeIntent(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
      }
    }
  }, [currentLanguageMeta]);

  const analyzeIntent = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('bhaav') || lower.includes('price') || lower.includes('rate') || lower.includes('daam') || lower.includes('भाव')) {
      setLastIntent('marketPrices');
    } else if (lower.includes('sell') || lower.includes('beche') || lower.includes('ruke') || lower.includes('wait') || lower.includes('बेचें')) {
      setLastIntent('sellNowVsWait');
    } else if (lower.includes('buyer') || lower.includes('vyapari') || lower.includes('kharidar') || lower.includes('व्यापारी')) {
      setLastIntent('findBuyers');
    } else if (lower.includes('mausam') || lower.includes('weather') || lower.includes('barish') || lower.includes('मौसम')) {
      setLastIntent('weatherAlerts');
    } else if (lower.includes('transport') || lower.includes('kiraya') || lower.includes('trolley') || lower.includes('परिवहन')) {
      setLastIntent('transportComparison');
    } else {
      setLastIntent('aiAssistant');
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = currentLanguageMeta.speechCode || 'hi-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Recognition already started or error:', e);
      }
    } else {
      // Simulate speech input for environments without Web Speech mic access
      setIsListening(true);
      setTimeout(() => {
        const sampleQuery = currentLanguageMeta.code === 'hi'
          ? 'आज इंदौर मंडी में सोयाबीन का क्या भाव है और मुझे बेचना चाहिए या रुकना चाहिए?'
          : 'What is today\'s soybean rate in Indore Mandi and should I sell now or wait?';
        setTranscript(sampleQuery);
        setIsListening(false);
        analyzeIntent(sampleQuery);
      }, 2000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguageMeta.speechCode || 'hi-IN';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const cancelSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setLastIntent(null);
  };

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        transcript,
        isSpeaking,
        startListening,
        stopListening,
        speakText,
        cancelSpeech,
        isSupported,
        lastIntent,
        clearTranscript,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
