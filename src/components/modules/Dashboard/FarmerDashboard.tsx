'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  TrendingUp,
  Scale,
  Inbox,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  DollarSign,
  CloudSun,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface FarmerDashboardProps {
  onNavigate: (module: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { mandiPrices, listings, offers, weatherAlerts } = useMandiData();

  // Highlight top Central India commodities
  const soybeanPrice = mandiPrices.find((p) => p.cropId === 'crop-soybean') || mandiPrices[0];
  const wheatPrice = mandiPrices.find((p) => p.cropId === 'crop-wheat') || mandiPrices[3];
  const garlicPrice = mandiPrices.find((p) => p.cropId === 'crop-garlic') || mandiPrices[9];

  // Price trend 7-day sparkline data
  const trendData = [
    { day: 'Mon', soybean: 4820, wheat: 3180 },
    { day: 'Tue', soybean: 4850, wheat: 3200 },
    { day: 'Wed', soybean: 4900, wheat: 3240 },
    { day: 'Thu', soybean: 4920, wheat: 3220 },
    { day: 'Fri', soybean: 4950, wheat: 3250 },
    { day: 'Sat', soybean: 4980, wheat: 3280 },
    { day: 'Today', soybean: 5040, wheat: 3310 },
  ];

  const pendingOffers = offers.filter((o) => o.status === 'pending');
  const activeListings = listings.filter((l) => l.status === 'active');
  const criticalWeather = weatherAlerts.find((w) => w.alertLevel === 'severe' || w.alertLevel === 'moderate');

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-mandi-dark via-mandi-medium to-emerald-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Central India Mandi Intelligence Hub Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {t('welcomeBack')}, {user?.name || 'Rameshwar Patidar'}!
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Mandi rates are up <strong>+3.4%</strong> in Ujjain today. AI models indicate a strong sell window for high-moisture perishable crops, while Sharbati wheat can yield +₹180/qtl by warehouse holding.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="accent"
              size="md"
              onClick={() => onNavigate('sellNowVsWait')}
              leftIcon={<Scale className="w-4 h-4" />}
            >
              Run Sell vs Wait AI Engine
            </Button>
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
              onClick={() => onNavigate('marketPrices')}
            >
              View 8 Mandis Live Rates
            </Button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* Critical Weather or Harvest Alert Banner if any */}
      {criticalWeather && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-xl text-amber-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-amber-800">
                  {criticalWeather.condition} Warning ({criticalWeather.forecastDay})
                </span>
                <Badge variant="amber" size="sm">
                  {criticalWeather.alertLevel.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                {criticalWeather.advisoryNote}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('weatherAlerts')}
            className="hidden sm:inline-flex border-amber-300 hover:bg-amber-100 text-amber-900"
          >
            Advisory Details
          </Button>
        </div>
      )}

      {/* 4 Key KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Soybean Indore */}
        <Card className="p-4" hoverEffect onClick={() => onNavigate('marketPrices')}>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Soybean (Indore APMC)</span>
            <Badge variant="green" size="sm">
              +{soybeanPrice.priceChangePercent}%
            </Badge>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-gray-900">
              ₹{soybeanPrice.modalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-400 font-medium">/quintal</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Arrivals: {soybeanPrice.arrivalTons} Tons</p>
        </Card>

        {/* Metric 2: Sharbati Wheat */}
        <Card className="p-4" hoverEffect onClick={() => onNavigate('marketPrices')}>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Sharbati Wheat</span>
            <Badge variant="green" size="sm">
              +{wheatPrice.priceChangePercent}%
            </Badge>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-gray-900">
              ₹{wheatPrice.modalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-400 font-medium">/quintal</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">High Demand at Sehore & Indore</p>
        </Card>

        {/* Metric 3: Active Listings */}
        <Card className="p-4" hoverEffect onClick={() => onNavigate('listProduce')}>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>My Active Lots</span>
            <Badge variant="blue" size="sm">
              {activeListings.length} Active
            </Badge>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-gray-900">
              {activeListings.reduce((sum, l) => sum + l.quantityQuintals, 0)}
            </span>
            <span className="text-xs text-gray-400 font-medium">Quintals Listed</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            3 High-Grade Verified Lots
          </p>
        </Card>

        {/* Metric 4: Buyer Offers */}
        <Card className="p-4" hoverEffect onClick={() => onNavigate('buyerOffers')}>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Pending Offers</span>
            <Badge variant="amber" size="sm">
              Action Req.
            </Badge>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-gray-900">
              {pendingOffers.length}
            </span>
            <span className="text-xs text-gray-400 font-medium">Bids to review</span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            Top bid: ₹5,120/qtl (Malwa Agro)
          </p>
        </Card>
      </div>

      {/* Main Grid: Chart + Smart AI Recommendation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 7-Day Central India Mandi Trend */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-700" />
                7-Day Price Trajectory (₹/Quintal)
              </h3>
              <p className="text-xs text-gray-500">
                Tracking daily modal rates across Indore, Ujjain and Dewas APMC mandis.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-emerald-800">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                Soybean
              </span>
              <span className="flex items-center gap-1.5 font-medium text-amber-700">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                Wheat
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorSoybean" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1b4332" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1b4332" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e9c46a" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#e9c46a" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}/qtl`]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb' }}
                />
                <Area
                  type="monotone"
                  dataKey="soybean"
                  stroke="#1b4332"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSoybean)"
                  name="Soybean"
                />
                <Area
                  type="monotone"
                  dataKey="wheat"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorWheat)"
                  name="Wheat"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Updated from Agmarknet API & Mandi gate feeds</span>
            <button
              onClick={() => onNavigate('pricePrediction')}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
            >
              See 15-Day AI Forecast <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* Right 1 Col: Quick AI Decision Widget */}
        <Card className="p-5 flex flex-col justify-between bg-gradient-to-b from-white to-emerald-50/40">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                AI DECISION ENGINE
              </span>
              <Badge variant="green" size="sm">
                Confidence 92%
              </Badge>
            </div>

            <h4 className="text-base font-bold text-gray-900 leading-snug mb-2">
              Lot Recommendation for 85 Qtl Soybean
            </h4>

            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-xs font-black text-emerald-950 uppercase">
                  RECOMMENDATION: ACCEPT DEAL
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Malwa Agro offer of <strong>₹5,120/qtl</strong> with free farm gate pickup yields higher net return than driving to Ujjain Mandi (+₹3,400 net savings in transport & handling).
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Spot Offer Price</span>
                <span className="font-semibold text-gray-900">₹5,120 / qtl</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Farm Gate Pickup</span>
                <span className="font-semibold text-emerald-700">₹0 Transport Cost</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Net Total Receivable</span>
                <span className="font-bold text-emerald-900">₹4,35,200</span>
              </div>
            </div>
          </div>

          <div className="pt-5 space-y-2">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => onNavigate('buyerOffers')}
            >
              Review Offer (Malwa Agro)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onNavigate('sellNowVsWait')}
            >
              Custom Scenario Calculator
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Buyer Offers Snapshot */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Live Verified Buyer Offers (Recent 3)
            </h3>
            <p className="text-xs text-gray-500">
              Offers from verified solvent extractors, flour mills and APMC traders.
            </p>
          </div>
          <button
            onClick={() => onNavigate('buyerOffers')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View All ({offers.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offers.slice(0, 3).map((offer) => (
            <Card key={offer.id} className="p-4" hoverEffect>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {offer.buyerBusinessName}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[11px] text-gray-500">
                      {offer.buyerCategory}
                    </span>
                  </div>
                </div>
                <Badge variant={offer.status === 'accepted' ? 'green' : 'amber'} size="sm">
                  {offer.status}
                </Badge>
              </div>

              <div className="my-3 p-3 bg-gray-50 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Offered Rate</span>
                  <span className="font-extrabold text-emerald-900 text-sm">
                    ₹{offer.offeredPricePerQuintal.toLocaleString('en-IN')}/qtl
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Produce Lot</span>
                  <span className="font-medium text-gray-700">
                    {offer.quantityQuintals} Qtl {offer.cropName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Logistics</span>
                  <span className="font-medium text-gray-700">
                    {offer.transportProvidedByBuyer ? 'Buyer Arranges Truck' : 'Farmer Delivery'}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => onNavigate('buyerOffers')}
              >
                Inspect & Negotiate
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
