import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { VoiceProvider } from '@/context/VoiceContext';
import { MandiDataProvider } from '@/context/MandiDataContext';

export const metadata: Metadata = {
  title: 'MANDI MITRA AI — Smart Decisions. Better Farming.',
  description:
    'Full-stack agricultural market intelligence & advisory platform helping Indian farmers decide WHEN, WHERE and HOW to sell agricultural produce for realistic maximum net returns.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 selection:bg-emerald-200 selection:text-emerald-950">
        <AuthProvider>
          <LanguageProvider>
            <VoiceProvider>
              <MandiDataProvider>
                {children}
              </MandiDataProvider>
            </VoiceProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
