'use client';

import React, { useState } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PlusCircle, CheckCircle2, Sparkles, Upload, Scale } from 'lucide-react';

interface ListProduceModuleProps {
  onListingCreated?: () => void;
}

export const ListProduceModule: React.FC<ListProduceModuleProps> = ({ onListingCreated }) => {
  const { crops, addListing } = useMandiData();
  const { user } = useAuth();

  const [selectedCropId, setSelectedCropId] = useState(crops[0]?.id || 'crop-soybean');
  const [variety, setVariety] = useState('Certified Machine Cleaned Line');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(60);
  const [expectedPrice, setExpectedPrice] = useState<number>(5150);
  const [harvestDate, setHarvestDate] = useState('2026-11-10');
  const [availableFromDate, setAvailableFromDate] = useState('2026-11-16');
  const [grade, setGrade] = useState<'A' | 'B' | 'C'>('A');
  const [moisturePercent, setMoisturePercent] = useState<number>(9.8);
  const [location, setLocation] = useState(user?.village ? `${user.village}, ${user.district}` : 'Datoda, Indore (MP)');
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addListing({
      farmerId: user?.id || 'farmer-ramesh-01',
      farmerName: user?.name || 'Rameshwar Patidar',
      farmerPhone: user?.phone || '+91 98261 44520',
      location,
      cropId: selectedCrop.id,
      cropName: selectedCrop.name,
      variety,
      quantityQuintals,
      expectedPricePerQuintal: expectedPrice,
      harvestDate,
      availableFromDate,
      expiryOrStorageLimitDays: selectedCrop.shelfLifeDays || 180,
      grade,
      moisturePercent,
      photos: ['/images/produce-sample.jpg'],
      status: 'active',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      if (onListingCreated) onListingCreated();
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-emerald-700" />
          List Harvested Produce for Buyer Bidding
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Broadcast your harvest directly to 300+ verified Central India processors, mills, and traders.
        </p>
      </div>

      {isSuccess ? (
        <Card className="p-8 text-center space-y-3 bg-emerald-50/60 border-emerald-300">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-black text-gray-900">Produce Lot Listed Successfully!</h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            Your {quantityQuintals} Quintal lot of {selectedCrop.name} is now live on the marketplace. Verified buyers will review and submit counter-offers directly to your inbox.
          </p>
        </Card>
      ) : (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Crop & Variety */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Crop / Commodity
                </label>
                <select
                  value={selectedCropId}
                  onChange={(e) => setSelectedCropId(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.hindiName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Specific Variety / Seed Spec
                </label>
                <input
                  type="text"
                  required
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Machine Cleaned, Sharbati C-306"
                  className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Row 2: Quantity & Expected Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Total Available Quantity (Quintals)
                </label>
                <input
                  type="number"
                  required
                  min="5"
                  max="10000"
                  value={quantityQuintals}
                  onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                  className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Expected Base Price (₹/quintal)
                </label>
                <input
                  type="number"
                  required
                  min="500"
                  max="100000"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(Number(e.target.value))}
                  className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Row 3: Quality Grade & Moisture */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Estimated Quality Grade
                </label>
                <div className="flex gap-2">
                  {(['A', 'B', 'C'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        grade === g
                          ? 'bg-mandi-dark text-white border-mandi-dark shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Grade {g} {g === 'A' ? '(Premium)' : g === 'B' ? '(Standard)' : '(Fair)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Measured Moisture Level (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="4"
                  max="35"
                  value={moisturePercent}
                  onChange={(e) => setMoisturePercent(Number(e.target.value))}
                  className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Standard benchmark: under {selectedCrop.standardMoisturePercent}% moisture for {selectedCrop.name}
                </span>
              </div>
            </div>

            {/* Row 4: Dates & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Harvest Completion Date
                </label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Available for Pickup From
                </label>
                <input
                  type="date"
                  value={availableFromDate}
                  onChange={(e) => setAvailableFromDate(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Farm Pickup Location / Village
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Expected Gross Value Calculation */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600 font-medium">Estimated Gross Lot Value:</span>
              <span className="text-base sm:text-lg font-black text-emerald-950">
                ₹{(quantityQuintals * expectedPrice).toLocaleString('en-IN')}
              </span>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Publish Produce Lot to Marketplace
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};
