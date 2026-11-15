'use client';

import React, { useState } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  Wheat,
  Calendar,
  Layers,
  PlusCircle,
  Scale,
  Sparkles,
  Droplets,
  ArrowRight,
} from 'lucide-react';

interface MyCropsModuleProps {
  onNavigateToListProduce?: () => void;
  onNavigateToSellWait?: () => void;
}

export const MyCropsModule: React.FC<MyCropsModuleProps> = ({
  onNavigateToListProduce,
  onNavigateToSellWait,
}) => {
  const { crops, listings } = useMandiData();

  const [activeTab, setActiveTab] = useState<'harvested' | 'standing'>('harvested');

  // Standing crop records
  const standingCrops = [
    {
      id: 'sc-1',
      cropName: 'Sharbati Wheat (C-306)',
      acreage: 7.5,
      sowingDate: '2026-11-05',
      expectedHarvestDate: '2027-03-25',
      growthStage: 'Germination & Crown Root (10 Days)',
      healthStatus: 'Excellent',
      expectedYieldQuintals: 115,
    },
    {
      id: 'sc-2',
      cropName: 'Desi Chana (Gram)',
      acreage: 5.0,
      sowingDate: '2026-10-28',
      expectedHarvestDate: '2027-03-10',
      growthStage: 'Vegetative Branching (18 Days)',
      healthStatus: 'Good',
      expectedYieldQuintals: 42,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Wheat className="w-6 h-6 text-emerald-700" />
            My Crops & Harvest Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Track standing acreage, harvested lots in storage, and create instant marketplace sales listings.
          </p>
        </div>
        {onNavigateToListProduce && (
          <Button
            variant="primary"
            onClick={onNavigateToListProduce}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create New Produce Listing
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('harvested')}
          className={`py-2 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'harvested'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Harvested Lots Ready for Sale ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('standing')}
          className={`py-2 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'standing'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Standing Crops in Field ({standingCrops.length})
        </button>
      </div>

      {activeTab === 'harvested' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((lot) => (
            <Card key={lot.id} className="p-5 flex flex-col justify-between" hoverEffect>
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{lot.cropName}</h3>
                    <p className="text-xs text-gray-500">{lot.variety}</p>
                  </div>
                  <Badge variant={lot.status === 'active' ? 'green' : 'gray'} size="sm">
                    {lot.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="my-4 p-3.5 bg-gray-50 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lot Quantity</span>
                    <span className="font-extrabold text-gray-900 text-sm">
                      {lot.quantityQuintals} Quintals
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expected Base Rate</span>
                    <span className="font-bold text-emerald-800">
                      ₹{lot.expectedPricePerQuintal.toLocaleString('en-IN')}/qtl
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quality Grade & Moisture</span>
                    <span className="font-medium text-gray-700">
                      Grade {lot.grade} • {lot.moisturePercent}% Moisture
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Harvest Date</span>
                    <span className="font-medium text-gray-700">{lot.harvestDate}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Buyer Inquiries:</span>
                  <span className="font-bold text-emerald-700">{lot.offersCount} Bids</span>
                </div>
                {onNavigateToSellWait && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={onNavigateToSellWait}
                    leftIcon={<Scale className="w-3.5 h-3.5" />}
                  >
                    Analyze Sell vs. Wait
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {standingCrops.map((crop) => (
            <Card key={crop.id} className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{crop.cropName}</h3>
                  <span className="text-xs text-emerald-800 font-semibold">
                    {crop.acreage} Acres Cultivated
                  </span>
                </div>
                <Badge variant="green" size="sm">
                  {crop.healthStatus}
                </Badge>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Crop Stage</span>
                  <span className="font-semibold text-gray-800">{crop.growthStage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sowing Date</span>
                  <span className="text-gray-700">{crop.sowingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Harvest Window</span>
                  <span className="font-bold text-emerald-800">{crop.expectedHarvestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Projected Yield</span>
                  <span className="font-bold text-gray-900">{crop.expectedYieldQuintals} Quintals</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                Soil moisture optimal. Next recommended advisory: first nitrogen top-dressing at 21 days with light irrigation.
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
