'use client';

import React, { useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useVoice } from '@/context/VoiceContext';
import { useLanguage } from '@/context/LanguageContext';
import { Mic, MicOff, Volume2, Sparkles, ArrowRight } from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToModule: (module: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateToModule,
}) => {
  const {
    isListening,
    transcript,
    isSpeaking,
    startListening,
    stopListening,
    speakText,
    cancelSpeech,
    lastIntent,
    clearTranscript,
  } = useVoice();
  const { currentLanguageMeta, t } = useLanguage();

  useEffect(() => {
    if (isOpen && !isListening && !transcript) {
      startListening();
    }
  }, [isOpen]);

  const handleIntentAction = () => {
    if (lastIntent) {
      onNavigateToModule(lastIntent);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={true}>
      <div className="flex flex-col items-center text-center p-4 space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
            VOICE ASSISTANT ({currentLanguageMeta.nativeName})
          </span>
          <h3 className="text-xl font-black text-gray-900 mt-2">
            Speak in {currentLanguageMeta.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Ask for mandi rates, storage advisories, or when to sell your produce.
          </p>
        </div>

        {/* Big Animated Mic Ring */}
        <div className="relative my-4">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping scale-150" />
          )}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 ${
              isListening
                ? 'bg-rose-600 scale-105 shadow-rose-900/30'
                : 'bg-gradient-to-tr from-mandi-dark to-mandi-leaf hover:scale-105 shadow-emerald-950/30'
            }`}
            aria-label="Toggle voice input"
          >
            {isListening ? (
              <MicOff className="w-10 h-10 animate-pulse" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>
        </div>

        {/* Live Transcript / Response */}
        <div className="w-full min-h-[90px] p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center text-left">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
            {isListening ? 'Listening to speech...' : 'Recognized Speech:'}
          </span>
          <p className="text-sm font-semibold text-gray-800 italic leading-relaxed">
            {transcript || 'Tap the microphone and say: "What is today\'s soybean rate in Indore?"'}
          </p>
        </div>

        {/* Intent Detection Notification */}
        {lastIntent && (
          <div className="w-full p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-left space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 uppercase">
                Detected Intent: {lastIntent}
              </span>
              <button
                onClick={() =>
                  speakText(
                    `Opening ${lastIntent}. Your query has been routed to the intelligence engine.`
                  )
                }
                className="text-emerald-700 hover:text-emerald-900 p-1"
                title="Speak confirmation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-700">
              Mandi Mitra AI has matched your speech query to the <strong>{lastIntent}</strong> module.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs"
              onClick={handleIntentAction}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open {lastIntent} Page
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2 w-full pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={clearTranscript}
          >
            Clear Transcript
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1 text-xs"
            onClick={onClose}
          >
            Close Voice
          </Button>
        </div>
      </div>
    </Modal>
  );
};
