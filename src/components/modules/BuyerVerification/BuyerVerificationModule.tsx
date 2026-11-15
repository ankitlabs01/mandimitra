'use client';

import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  ShieldCheck,
  Search,
  CheckCircle,
  Building,
  FileText,
  AlertCircle,
  Clock,
  Star,
} from 'lucide-react';

export const BuyerVerificationModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('Malwa Agro');

  const verifiedEntities = [
    {
      id: 'v-1',
      businessName: 'Malwa Agro Oils & Solvent Ltd',
      gstin: '23AABCM9102L1Z9',
      apmcLicense: 'MP-IND-APMC-TR-2018-884',
      panNumber: 'AABCM9102L',
      entityType: 'Public Limited Company (Active)',
      trustScore: 98,
      rating: 4.8,
      successfulTrades: 142,
      totalVolumeTraded: '48,500 Quintals',
      avgPaymentTimeHours: '2.5 Hours post weighment',
      disputeCount: 0,
      bankVerificationStatus: 'Verified (State Bank of India Corporate Account)',
      mandiBoardEndorsed: true,
      lastAudited: '2026-10-15',
    },
    {
      id: 'v-2',
      businessName: 'Gujarat Agro Exporters Surat',
      gstin: '24AAFCG8810K1ZP',
      apmcLicense: 'GUJ-SRT-EXP-2020-410',
      panNumber: 'AAFCG8810K',
      entityType: 'Partnership Firm (Export Unit)',
      trustScore: 96,
      rating: 4.9,
      successfulTrades: 64,
      totalVolumeTraded: '18,200 Quintals',
      avgPaymentTimeHours: 'Immediate Escrow Pre-deposit',
      disputeCount: 1,
      bankVerificationStatus: 'Verified (HDFC Bank Forex & Escrow)',
      mandiBoardEndorsed: true,
      lastAudited: '2026-09-30',
    },
    {
      id: 'v-3',
      businessName: 'Kailash Traders APMC Indore',
      gstin: '23BRPPK4419M1ZZ',
      apmcLicense: 'MP-IND-COMM-1998-044',
      panNumber: 'BRPPK4419M',
      entityType: 'Proprietorship (Commission Yard)',
      trustScore: 91,
      rating: 4.5,
      successfulTrades: 310,
      totalVolumeTraded: '92,000 Quintals',
      avgPaymentTimeHours: 'Spot Cash or UPI at Mandi Yard',
      disputeCount: 2,
      bankVerificationStatus: 'Verified (Punjab National Bank)',
      mandiBoardEndorsed: true,
      lastAudited: '2026-11-01',
    },
  ];

  const matched = verifiedEntities.find((e) =>
    e.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || verifiedEntities[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-700" />
          Buyer Credential & Risk Verification Directory
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Verify GSTIN authenticity, APMC trade licenses, dispute history, and historical payment release speed.
        </p>
      </div>

      {/* Search Input */}
      <Card className="p-4 bg-gray-50/70 border-gray-200">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Type buyer or business name to verify (e.g. Malwa Agro, Gujarat Agro, Kailash Traders)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </Card>

      {/* Verification Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Credentials */}
        <Card className="lg:col-span-2 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-gray-900">{matched.businessName}</h3>
                <Badge variant="green" size="sm">
                  100% VERIFIED
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{matched.entityType}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 block">Trust Index</span>
              <span className="text-2xl font-black text-emerald-800">{matched.trustScore}/100</span>
            </div>
          </div>

          {/* Grid of Verified Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>GSTIN Certificate</span>
              </div>
              <span className="font-mono font-bold text-gray-900">{matched.gstin}</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                ✓ Validated against GST Portal
              </span>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Building className="w-3.5 h-3.5 text-emerald-700" />
                <span>APMC Mandi License</span>
              </div>
              <span className="font-mono font-bold text-gray-900">{matched.apmcLicense}</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                ✓ Current & in Good Standing
              </span>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Avg Payment Release Time</span>
              </div>
              <span className="font-bold text-emerald-900 text-sm">{matched.avgPaymentTimeHours}</span>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>Dispute / Default Record</span>
              </div>
              <span className="font-bold text-gray-900">
                {matched.disputeCount === 0 ? 'Zero Defaults' : `${matched.disputeCount} Settled Disputes`}
              </span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-gray-700 space-y-1">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Mandi Mitra Safe Escrow Certified Buyer
            </div>
            <p className="text-gray-600 leading-relaxed">
              This entity maintains an active financial reserve with Mandi Mitra partner banks. Transactions are contractually backed by automated weighbridge digital receipts.
            </p>
          </div>
        </Card>

        {/* Right 1 Col: Platform Reputation Summary */}
        <Card className="p-6 bg-gradient-to-b from-white to-gray-50/80 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">Trading Track Record</h4>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-gray-500 block">Farmer Rating</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="text-base font-bold text-gray-900">{matched.rating} / 5.0</span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 block">Successful Contracts Closed</span>
                <span className="text-base font-bold text-gray-900">{matched.successfulTrades} Deals</span>
              </div>

              <div>
                <span className="text-gray-500 block">Total Volume Procured</span>
                <span className="text-base font-bold text-gray-900">{matched.totalVolumeTraded}</span>
              </div>

              <div>
                <span className="text-gray-500 block">Banking Partner</span>
                <span className="font-medium text-gray-800">{matched.bankVerificationStatus}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <span className="text-[10px] text-gray-400 block mb-2">
              Last Field Audit: {matched.lastAudited}
            </span>
            <Button variant="primary" size="sm" className="w-full text-xs">
              Download Verification PDF Dossier
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
