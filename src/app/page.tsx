'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { VoiceAssistantModal } from '@/components/modules/VoiceAssistant/VoiceAssistantModal';
import { AuthModals } from '@/components/auth/AuthModals';

// Modules
import { FarmerDashboard } from '@/components/modules/Dashboard/FarmerDashboard';
import { MarketPriceModule } from '@/components/modules/MarketPrices/MarketPriceModule';
import { PricePredictionModule } from '@/components/modules/PricePrediction/PricePredictionModule';
import { SellNowVsWaitModule } from '@/components/modules/SellNowVsWait/SellNowVsWaitModule';
import { MyCropsModule } from '@/components/modules/MyCrops/MyCropsModule';
import { FindBuyersModule } from '@/components/modules/FindBuyers/FindBuyersModule';
import { ListProduceModule } from '@/components/modules/ListProduce/ListProduceModule';
import { BuyerOffersModule } from '@/components/modules/BuyerOffers/BuyerOffersModule';
import { BuyerVerificationModule } from '@/components/modules/BuyerVerification/BuyerVerificationModule';
import { OfferComparisonModule } from '@/components/modules/OfferComparison/OfferComparisonModule';
import { StorageSpoilageModule } from '@/components/modules/StorageSpoilage/StorageSpoilageModule';
import { TransportComparisonModule } from '@/components/modules/TransportComparison/TransportComparisonModule';
import { OrderTrackingModule } from '@/components/modules/OrderTracking/OrderTrackingModule';
import { PaymentStatusModule } from '@/components/modules/PaymentStatus/PaymentStatusModule';
import { CropQualityModule } from '@/components/modules/CropQuality/CropQualityModule';
import { RatingsDisputesModule } from '@/components/modules/RatingsDisputes/RatingsDisputesModule';
import { FPODashboardModule } from '@/components/modules/FPODashboard/FPODashboardModule';
import { AIAssistantModule } from '@/components/modules/AIAssistant/AIAssistantModule';
import { WeatherAlertsModule } from '@/components/modules/WeatherAlerts/WeatherAlertsModule';
import { InsightsHistoryModule } from '@/components/modules/InsightsHistory/InsightsHistoryModule';
import { SettingsProfileModule } from '@/components/modules/SettingsProfile/SettingsProfileModule';
import { AdminDashboardModule } from '@/components/modules/AdminDashboard/AdminDashboardModule';

export default function Home() {
  const [currentModule, setCurrentModule] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <FarmerDashboard onNavigate={(mod) => setCurrentModule(mod)} />;
      case 'marketPrices':
        return <MarketPriceModule />;
      case 'pricePrediction':
        return <PricePredictionModule />;
      case 'sellNowVsWait':
        return <SellNowVsWaitModule />;
      case 'myCrops':
        return (
          <MyCropsModule
            onNavigateToListProduce={() => setCurrentModule('listProduce')}
            onNavigateToSellWait={() => setCurrentModule('sellNowVsWait')}
          />
        );
      case 'findBuyers':
        return <FindBuyersModule />;
      case 'listProduce':
        return (
          <ListProduceModule
            onListingCreated={() => setCurrentModule('myCrops')}
          />
        );
      case 'buyerOffers':
        return (
          <BuyerOffersModule
            onNavigateToComparison={() => setCurrentModule('offerComparison')}
            onNavigateToOrders={() => setCurrentModule('orderTracking')}
          />
        );
      case 'buyerVerification':
        return <BuyerVerificationModule />;
      case 'offerComparison':
        return (
          <OfferComparisonModule
            onNavigateToOffers={() => setCurrentModule('buyerOffers')}
          />
        );
      case 'storageSpoilage':
        return <StorageSpoilageModule />;
      case 'transportComparison':
        return <TransportComparisonModule />;
      case 'orderTracking':
        return (
          <OrderTrackingModule
            onNavigateToDisputes={() => setCurrentModule('ratingsDisputes')}
          />
        );
      case 'paymentStatus':
        return <PaymentStatusModule />;
      case 'cropQuality':
        return <CropQualityModule />;
      case 'ratingsDisputes':
        return <RatingsDisputesModule />;
      case 'fpoDashboard':
        return <FPODashboardModule />;
      case 'aiAssistant':
        return <AIAssistantModule />;
      case 'voiceAssistant':
        return (
          <div className="p-8 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Voice Assistant Active</h3>
            <p className="text-xs text-gray-500 mb-4">
              Tap the button below to initiate interactive speech dialog across 12 Indian languages.
            </p>
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="px-6 py-3 bg-mandi-dark text-white rounded-2xl font-bold text-sm shadow-md"
            >
              Open Voice Dialogue
            </button>
          </div>
        );
      case 'weatherAlerts':
        return <WeatherAlertsModule />;
      case 'insightsHistory':
        return <InsightsHistoryModule />;
      case 'settingsProfile':
        return <SettingsProfileModule />;
      case 'adminDashboard':
        return <AdminDashboardModule />;
      default:
        return <FarmerDashboard onNavigate={(mod) => setCurrentModule(mod)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          currentModule={currentModule}
          onSelectModule={(mod) => setCurrentModule(mod)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 max-w-5xl overflow-y-auto">
          {renderModule()}
        </main>
      </div>

      {/* Bottom Navigation for Mobile Devices */}
      <MobileNav
        currentModule={currentModule}
        onSelectModule={(mod) => setCurrentModule(mod)}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
      />

      {/* Interactive Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onNavigateToModule={(mod) => setCurrentModule(mod)}
      />

      <AuthModals
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
