'use client';

import React from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { GitCompare, CheckCircle2, ShieldCheck, Truck, ArrowRight, DollarSign } from 'lucide-react';

interface OfferComparisonModuleProps {
  onNavigateToOffers?: () => void;
}

export const OfferComparisonModule: React.FC<OfferComparisonModuleProps> = ({ onNavigateToOffers }) => {
  const { offers } = useMandiData();

  // Filter pending or active offers for comparison
  const compOffers = offers.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-emerald-700" />
            Comprehensive Multi-Offer Comparison Matrix
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Compare offered prices, transport deduction liabilities, payment terms, and calculated net returns across active bids.
          </p>
        </div>
        {onNavigateToOffers && (
          <Button variant="outline" onClick={onNavigateToOffers} size="sm">
            Manage Individual Offers
          </Button>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {compOffers.map((offer, idx) => {
          const isTopPick = idx === 0;
          const gross = offer.quantityQuintals * offer.offeredPricePerQuintal;
          const transportCost = offer.transportProvidedByBuyer
            ? 0
            : offer.distanceKm * 2.2 * offer.quantityQuintals;
          const net = gross - transportCost + (offer.transportAllowancePerQuintal * offer.quantityQuintals);
          const effectiveNetPerQtl = Math.round(net / offer.quantityQuintals);

          return (
            <Card
              key={offer.id}
              className={`p-5 flex flex-col justify-between relative ${
                isTopPick
                  ? 'border-2 border-emerald-500 shadow-lg bg-emerald-50/10'
                  : 'border border-gray-200'
              }`}
            >
              {isTopPick && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                  ★ HIGHEST NET RETURN
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-2 mb-3 mt-1">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{offer.buyerBusinessName}</h3>
                    <p className="text-xs text-gray-500">{offer.buyerCategory}</p>
                  </div>
                  <Badge variant={offer.buyerVerified ? 'green' : 'gray'} size="sm">
                    {offer.buyerRating} ★
                  </Badge>
                </div>

                <div className="my-4 p-4 bg-gray-50 rounded-2xl space-y-2.5 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-500">Offered Rate</span>
                    <span className="text-lg font-black text-gray-900">
                      ₹{offer.offeredPricePerQuintal}/qtl
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Lot & Quantity</span>
                    <span className="font-semibold text-gray-800">
                      {offer.quantityQuintals} Qtl {offer.cropName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Gross Value</span>
                    <span className="font-medium text-gray-700">₹{gross.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Logistics Arrangement</span>
                    <span className="font-semibold text-gray-800">
                      {offer.transportProvidedByBuyer ? (
                        <span className="text-emerald-700">Free Buyer Pickup</span>
                      ) : (
                        <span className="text-rose-700">-₹{Math.round(transportCost).toLocaleString('en-IN')}</span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Term</span>
                    <span className="font-bold text-emerald-800 capitalize">
                      {offer.paymentTerms.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Final Net Calculation Box */}
                <div className="p-3.5 bg-emerald-100/50 rounded-xl border border-emerald-200 text-xs">
                  <span className="text-emerald-900 font-medium block">Calculated Net Realization:</span>
                  <div className="text-xl font-black text-emerald-950 mt-0.5">
                    ₹{Math.round(net).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-emerald-800 font-bold block mt-0.5">
                    Effective Rate: ₹{effectiveNetPerQtl}/quintal
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-4">
                <Button
                  variant={isTopPick ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full text-xs"
                  onClick={onNavigateToOffers}
                >
                  {isTopPick ? 'Proceed with this Deal' : 'Review Details'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
