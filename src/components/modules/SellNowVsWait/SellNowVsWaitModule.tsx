'use client';

import React, { useState, useMemo } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { calculateSellNowVsWait, DecisionCalculationInput } from '@/lib/calculations';
import {
  Scale,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Warehouse,
  Truck,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const SellNowVsWaitModule: React.FC = () => {
  const { crops, mandis, mandiPrices } = useMandiData();

  // Inputs
  const [selectedCropId, setSelectedCropId] = useState<string>('crop-soybean');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(85);
  const [holdingDays, setHoldingDays] = useState<number>(30);
  const [storageType, setStorageType] = useState<'dry_warehouse' | 'cold_storage' | 'on_farm'>('dry_warehouse');
  const [distanceKm, setDistanceKm] = useState<number>(24);

  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  // Default spot price from mandi record
  const matchingPrice = mandiPrices.find((p) => p.cropId === selectedCropId);
  const defaultCurrentPrice = matchingPrice ? matchingPrice.modalPrice : 5000;

  const [currentPrice, setCurrentPrice] = useState<number>(defaultCurrentPrice);
  const [forecastPrice, setForecastPrice] = useState<number>(Math.round(defaultCurrentPrice * 1.08));

  // Sync prices when crop changes
  const handleCropChange = (cropId: string) => {
    setSelectedCropId(cropId);
    const crop = crops.find((c) => c.id === cropId);
    const priceRec = mandiPrices.find((p) => p.cropId === cropId);
    const spot = priceRec ? priceRec.modalPrice : 5000;
    setCurrentPrice(spot);

    if (crop?.perishabilityIndex === 'High') {
      setStorageType('cold_storage');
      setHoldingDays(10);
      setForecastPrice(Math.round(spot * 1.04));
    } else {
      setStorageType('dry_warehouse');
      setHoldingDays(30);
      setForecastPrice(Math.round(spot * 1.08));
    }
  };

  // Calculation result
  const calculationResult = useMemo(() => {
    const input: DecisionCalculationInput = {
      crop: selectedCrop,
      quantityQuintals,
      currentMandiPrice: currentPrice,
      forecastPriceAfterDays: forecastPrice,
      holdingDays,
      distanceKm,
      storageType,
    };
    return calculateSellNowVsWait(input);
  }, [selectedCrop, quantityQuintals, currentPrice, forecastPrice, holdingDays, distanceKm, storageType]);

  const { sellNow, waitAndStore, netBenefitOfWaiting, percentageGain, recommendation, headline, reasons, riskFactor } = calculationResult;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Scale className="w-6 h-6 text-emerald-700" />
            Sell Now vs. Wait AI Decision Engine
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Mathematical comparison of immediate spot sale vs. warehouse holding factoring storage fees, daily shrinkage, transport, and price lift.
          </p>
        </div>
        <Badge variant={riskFactor === 'High' ? 'red' : riskFactor === 'Medium' ? 'amber' : 'green'} size="md">
          {riskFactor} Storage Risk Factor
        </Badge>
      </div>

      {/* Decision Verdict Banner */}
      <div
        className={`p-6 rounded-3xl text-white shadow-xl transition-all duration-300 relative overflow-hidden ${
          recommendation === 'HOLD_AND_STORE'
            ? 'bg-gradient-to-r from-emerald-800 via-mandi-dark to-teal-900 border-2 border-emerald-400'
            : recommendation === 'SELL_NOW'
            ? 'bg-gradient-to-r from-amber-800 via-orange-900 to-rose-950 border-2 border-amber-400'
            : 'bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-400'
        }`}
      >
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-white animate-ping" />
            <span className="text-xs font-black tracking-widest uppercase bg-white/20 px-3 py-0.5 rounded-full">
              OPTIMAL VERDICT: {recommendation === 'HOLD_AND_STORE' ? 'HOLD & STORE IN WAREHOUSE' : recommendation === 'SELL_NOW' ? 'SELL IMMEDIATELY AT SPOT' : 'NEUTRAL CHOICE'}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black leading-tight">
            {headline}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold pt-1">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20">
              Net Gain / Loss Difference:{' '}
              <span className={`text-base font-extrabold ${netBenefitOfWaiting >= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                {netBenefitOfWaiting >= 0 ? '+' : ''}₹{netBenefitOfWaiting.toLocaleString('en-IN')} ({percentageGain}%)
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20">
              Holding Duration: <span className="text-white font-bold">{holdingDays} Days</span>
            </div>
          </div>

          <ul className="space-y-1.5 pt-2 text-xs sm:text-sm text-emerald-100/90">
            {reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Side-by-Side Comparison on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <Card className="lg:col-span-5 p-5 space-y-4 bg-gray-50/50">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            Configure Your Harvest & Market Scenario
          </h4>

          {/* Commodity Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Commodity
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => handleCropChange(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-gray-900"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.hindiName}) - {c.category}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Slider & Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Quantity (Quintals)</label>
              <span className="text-xs font-bold text-emerald-800">{quantityQuintals} Qtl</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={quantityQuintals}
              onChange={(e) => setQuantityQuintals(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          {/* Spot Price vs Forecast Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Spot Mandi Rate (₹/qtl)
              </label>
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Forecast Rate (₹/qtl)
              </label>
              <input
                type="number"
                value={forecastPrice}
                onChange={(e) => setForecastPrice(Number(e.target.value))}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Holding Days */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Holding Period (Days)</label>
              <span className="text-xs font-bold text-emerald-800">{holdingDays} Days</span>
            </div>
            <div className="flex gap-2 mb-2">
              {[7, 15, 30, 45, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setHoldingDays(d)}
                  className={`flex-1 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    holdingDays === d
                      ? 'bg-mandi-dark text-white border-mandi-dark'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
            <input
              type="range"
              min="5"
              max="120"
              value={holdingDays}
              onChange={(e) => setHoldingDays(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          {/* Storage Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Storage Facility Mode
            </label>
            <select
              value={storageType}
              onChange={(e) => setStorageType(e.target.value as any)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="dry_warehouse">Dry Warehouse (CWC / Private Silo ~₹20/qtl/mo)</option>
              <option value="cold_storage">Cold Storage & Chiller (~₹70-95/qtl/mo)</option>
              <option value="on_farm">On-Farm Traditional Shed (~₹15/qtl/mo)</option>
            </select>
          </div>

          {/* Mandi Distance */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Distance to Target Mandi</label>
              <span className="text-xs font-bold text-gray-900">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="250"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>
        </Card>

        {/* Side-by-Side Comparison (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* OPTION A: SELL NOW */}
          <Card
            className={`p-5 flex flex-col justify-between ${
              recommendation === 'SELL_NOW' ? 'ring-2 ring-emerald-500 shadow-md' : 'opacity-90'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-gray-500 tracking-wider">
                  STRATEGY A
                </span>
                {recommendation === 'SELL_NOW' && (
                  <Badge variant="green" size="sm">
                    Recommended
                  </Badge>
                )}
              </div>

              <h4 className="text-lg font-black text-gray-900 mb-1">SELL NOW (SPOT)</h4>
              <p className="text-xs text-gray-500 mb-4">
                Immediate liquidation at today's rate ₹{currentPrice}/qtl with zero storage risk.
              </p>

              <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                <div className="flex justify-between text-gray-700">
                  <span>Gross Produce Value ({quantityQuintals} Qtl)</span>
                  <span className="font-semibold">₹{sellNow.grossRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Transport ({distanceKm} km)</span>
                  <span>-₹{sellNow.transportCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Loading & Handling</span>
                  <span>-₹{sellNow.loadingUnloadingCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Mandi Mandi Cess (1.5%)</span>
                  <span>-₹{sellNow.mandiCommission.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Storage Costs</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Spoilage / Shrinkage</span>
                  <span>₹0</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50/80 -mx-5 -mb-5 p-5 rounded-b-2xl">
              <span className="text-xs text-gray-500 block">Total Net Cash Realization:</span>
              <div className="text-2xl font-black text-gray-900 mt-0.5">
                ₹{sellNow.netReturn.toLocaleString('en-IN')}
              </div>
              <span className="text-xs font-semibold text-emerald-800 block mt-0.5">
                Effective: ₹{sellNow.netPricePerQuintal}/quintal
              </span>
            </div>
          </Card>

          {/* OPTION B: WAIT & STORE */}
          <Card
            className={`p-5 flex flex-col justify-between ${
              recommendation === 'HOLD_AND_STORE' ? 'ring-2 ring-emerald-500 shadow-md' : 'opacity-90'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-gray-500 tracking-wider">
                  STRATEGY B
                </span>
                {recommendation === 'HOLD_AND_STORE' && (
                  <Badge variant="green" size="sm">
                    Recommended
                  </Badge>
                )}
              </div>

              <h4 className="text-lg font-black text-gray-900 mb-1">HOLD & STORE</h4>
              <p className="text-xs text-gray-500 mb-4">
                Store for {holdingDays} days targeting forecast ₹{forecastPrice}/qtl.
              </p>

              <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                <div className="flex justify-between text-gray-700">
                  <span>Net Weight After Shrinkage</span>
                  <span className="font-semibold text-amber-800">
                    {waitAndStore.effectiveQuantityRemaining} Qtl (-{waitAndStore.weightLossQuintals} Qtl)
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Gross Future Value</span>
                  <span className="font-semibold">₹{waitAndStore.grossRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Storage Cost ({holdingDays}d)</span>
                  <span>-₹{waitAndStore.storageCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Future Transport</span>
                  <span>-₹{waitAndStore.transportCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Handling & Commission</span>
                  <span>-₹{(waitAndStore.loadingUnloadingCost + waitAndStore.mandiCommission).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Weight Deterioration Loss</span>
                  <span>-₹{waitAndStore.spoilageLossValue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50/80 -mx-5 -mb-5 p-5 rounded-b-2xl">
              <span className="text-xs text-gray-500 block">Total Net Cash Realization:</span>
              <div className="text-2xl font-black text-gray-900 mt-0.5">
                ₹{waitAndStore.netReturn.toLocaleString('en-IN')}
              </div>
              <span className="text-xs font-semibold text-emerald-800 block mt-0.5">
                Effective: ₹{waitAndStore.netPricePerQuintal}/quintal (orig. basis)
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
