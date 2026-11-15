'use client';

import React, { useState } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  Building2,
  Users,
  Wheat,
  TrendingUp,
  Truck,
  PlusCircle,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export const FPODashboardModule: React.FC = () => {
  const { fpoMembersCrops } = useMandiData();

  const totalMembers = 840;
  const activeLots = fpoMembersCrops.length;
  const totalPooledQuintals = fpoMembersCrops.reduce(
    (sum, m) => sum + m.expectedYieldQuintals,
    0
  );

  const [poolCreated, setPoolCreated] = useState(false);

  const handleCreatePool = () => {
    setPoolCreated(true);
    setTimeout(() => setPoolCreated(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-700" />
            Malwa Kisan Producer Company Ltd (FPO Center)
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            FPO Reg: FPO-MP-IND-2021-084 • Aggregating produce for collective buyer auctions and bulk haulage discounts.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreatePool}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Form Aggregated Bulk Pool
        </Button>
      </div>

      {poolCreated && (
        <div className="p-4 bg-emerald-100 rounded-2xl border border-emerald-300 text-xs text-emerald-950 flex items-center gap-2 animate-fade-in font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            Bulk Pool of {totalPooledQuintals} Quintals successfully created! Notified 5 institutional buyers for institutional tender bidding.
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-white border-l-4 border-l-purple-600">
          <span className="text-xs text-gray-500 block">Active Shareholder Farmers</span>
          <div className="text-2xl font-black text-gray-900 mt-1">
            {totalMembers} Members
          </div>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
            Across 14 Villages in Indore & Dewas
          </span>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-l-emerald-600">
          <span className="text-xs text-gray-500 block">Ready Pooled Supply</span>
          <div className="text-2xl font-black text-gray-900 mt-1">
            {totalPooledQuintals} Quintals
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Soybean, Sharbati Wheat, Chana & Garlic
          </span>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-l-amber-500">
          <span className="text-xs text-gray-500 block">Collective Volume Premium</span>
          <div className="text-2xl font-black text-gray-900 mt-1">
            +₹85 / Quintal
          </div>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
            Over individual farm-gate spot rates
          </span>
        </Card>
      </div>

      {/* Member Aggregation Pipeline Table */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">
            Current Member Harvest Lots in Aggregation Pipeline
          </h3>
          <span className="text-xs text-gray-500">
            5 verified member contributions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3 px-4">Member Farmer</th>
                <th className="py-3 px-4">Village</th>
                <th className="py-3 px-4">Crop & Acreage</th>
                <th className="py-3 px-4 text-right">Expected Yield</th>
                <th className="py-3 px-4 text-center">Harvest Window</th>
                <th className="py-3 px-4 text-center">Pooling Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fpoMembersCrops.map((m) => (
                <tr key={m.memberId} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-900">{m.memberName}</span>
                    <span className="text-[10px] text-gray-400 block">{m.phone}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{m.village}</td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{m.cropName}</span>
                    <span className="text-[10px] text-gray-500 block">{m.acreage} Acres</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-emerald-900">
                      {m.expectedYieldQuintals} Qtl
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">
                    {m.harvestWindowStart.slice(5)} to {m.harvestWindowEnd.slice(5)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="purple" size="sm">
                      Pooled for Auction
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
