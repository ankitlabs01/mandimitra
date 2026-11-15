'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  TrendingUp,
  LineChart,
  Scale,
  Wheat,
  Users,
  PlusCircle,
  Inbox,
  ShieldCheck,
  GitCompare,
  Warehouse,
  Truck,
  MapPin,
  CreditCard,
  Award,
  AlertCircle,
  Building2,
  Bot,
  Mic,
  CloudSun,
  FileSpreadsheet,
  Settings,
  ShieldAlert,
  X,
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  currentModule: string;
  onSelectModule: (module: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  labelKey: string;
  defaultLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  highlight?: boolean;
  isNew?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { t } = useLanguage();
  const { role, isFarmer, isBuyer, isFPO, isAdmin } = useAuth();

  const navSections: NavSection[] = [
    {
      title: 'CORE INTELLIGENCE',
      items: [
        { id: 'dashboard', labelKey: 'dashboard', defaultLabel: 'Dashboard', icon: LayoutDashboard },
        { id: 'marketPrices', labelKey: 'marketPrices', defaultLabel: 'Market Prices', icon: TrendingUp },
        { id: 'pricePrediction', labelKey: 'pricePrediction', defaultLabel: 'Price Prediction', icon: LineChart },
        { id: 'sellNowVsWait', labelKey: 'sellNowVsWait', defaultLabel: 'Sell Now vs Wait', icon: Scale, highlight: true },
      ],
    },
    {
      title: 'MARKETPLACE & COMMERCE',
      items: [
        { id: 'myCrops', labelKey: 'myCrops', defaultLabel: 'My Crops & Harvest', icon: Wheat },
        { id: 'findBuyers', labelKey: 'findBuyers', defaultLabel: 'Find Buyers', icon: Users },
        { id: 'listProduce', labelKey: 'listProduce', defaultLabel: 'List Produce', icon: PlusCircle },
        { id: 'buyerOffers', labelKey: 'buyerOffers', defaultLabel: 'Buyer Offers', icon: Inbox, badge: 3 },
        { id: 'buyerVerification', labelKey: 'buyerVerification', defaultLabel: 'Buyer Verification', icon: ShieldCheck },
        { id: 'offerComparison', labelKey: 'offerComparison', defaultLabel: 'Offer Comparison', icon: GitCompare },
      ],
    },
    {
      title: 'LOGISTICS & DECISION SUPPORT',
      items: [
        { id: 'storageSpoilage', labelKey: 'storageSpoilage', defaultLabel: 'Storage & Spoilage', icon: Warehouse },
        { id: 'transportComparison', labelKey: 'transportComparison', defaultLabel: 'Transport Comparison', icon: Truck },
        { id: 'orderTracking', labelKey: 'orderTracking', defaultLabel: 'Order Tracking', icon: MapPin },
        { id: 'paymentStatus', labelKey: 'paymentStatus', defaultLabel: 'Payment Status', icon: CreditCard },
      ],
    },
    {
      title: 'QUALITY & TRUST',
      items: [
        { id: 'cropQuality', labelKey: 'cropQuality', defaultLabel: 'Crop Quality & Grading', icon: Award },
        { id: 'ratingsDisputes', labelKey: 'ratingsDisputes', defaultLabel: 'Ratings & Disputes', icon: AlertCircle, badge: '!' },
        { id: 'fpoDashboard', labelKey: 'fpoDashboard', defaultLabel: 'FPO Dashboard', icon: Building2 },
      ],
    },
    {
      title: 'AI & ADVISORY',
      items: [
        { id: 'aiAssistant', labelKey: 'aiAssistant', defaultLabel: 'AI Assistant', icon: Bot, isNew: true },
        { id: 'voiceAssistant', labelKey: 'voiceAssistant', defaultLabel: 'Voice Assistant', icon: Mic },
        { id: 'weatherAlerts', labelKey: 'weatherAlerts', defaultLabel: 'Weather & Harvest Alerts', icon: CloudSun },
        { id: 'insightsHistory', labelKey: 'insightsHistory', defaultLabel: 'Insights & History', icon: FileSpreadsheet },
        { id: 'settingsProfile', labelKey: 'settingsProfile', defaultLabel: 'Settings & Profile', icon: Settings },
      ],
    },
  ];

  if (isAdmin) {
    navSections.unshift({
      title: 'ADMIN CONTROL',
      items: [
        { id: 'adminDashboard', labelKey: 'adminDashboard', defaultLabel: 'Admin Control Center', icon: ShieldAlert, highlight: true },
      ],
    });
  }

  const handleSelect = (id: string) => {
    onSelectModule(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Mobile Header in Drawer */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
        <span className="font-bold text-gray-900 text-sm">Navigation Modules</span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              {section.title}
            </h4>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={clsx(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group text-left',
                      isActive
                        ? 'bg-mandi-dark text-white shadow-sm font-semibold'
                        : item.highlight
                        ? 'bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100/70'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconComponent
                        className={clsx(
                          'w-4 h-4 shrink-0 transition-colors',
                          isActive
                            ? 'text-white'
                            : item.highlight
                            ? 'text-mandi-dark'
                            : 'text-gray-400 group-hover:text-emerald-700'
                        )}
                      />
                      <span className="truncate">{t(item.labelKey) || item.defaultLabel}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.isNew && (
                        <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                          AI
                        </span>
                      )}
                      {item.badge && (
                        <span
                          className={clsx(
                            'text-[10px] font-bold px-1.5 py-0.2 rounded-full',
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/60 text-[11px] text-gray-500">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-gray-700">Mandi Network</span>
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Sync
          </span>
        </div>
        <p className="text-[10px] text-gray-400">8 APMC Mandis Connected</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-gray-100 bg-white h-[calc(100vh-61px)] sticky top-[61px] overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl z-10 flex flex-col animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
