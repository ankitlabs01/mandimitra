'use client';

import React, { useState } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  Inbox,
  ShieldCheck,
  Check,
  X,
  RefreshCw,
  Clock,
  Truck,
  ArrowRight,
  GitCompare,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BuyerOffersModuleProps {
  onNavigateToComparison?: () => void;
  onNavigateToOrders?: () => void;
}

export const BuyerOffersModule: React.FC<BuyerOffersModuleProps> = ({
  onNavigateToComparison,
  onNavigateToOrders,
}) => {
  const { offers, acceptOffer, rejectOffer, counterOffer } = useMandiData();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOfferForCounter, setSelectedOfferForCounter] = useState<any | null>(null);
  const [counterPriceInput, setCounterPriceInput] = useState<number>(5180);
  const [confirmAcceptOfferId, setConfirmAcceptOfferId] = useState<string | null>(null);

  const filteredOffers = offers.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const handleAcceptConfirm = (offerId: string) => {
    acceptOffer(offerId);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  const handleCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferForCounter) return;
    counterOffer(selectedOfferForCounter.id, counterPriceInput);
    setSelectedOfferForCounter(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Inbox className="w-6 h-6 text-emerald-700" />
            Incoming Buyer Offers & Negotiations
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Accept deals to generate binding contracts and lock payment in safe escrow.
          </p>
        </div>
        {onNavigateToComparison && (
          <Button
            variant="outline"
            onClick={onNavigateToComparison}
            leftIcon={<GitCompare className="w-4 h-4" />}
          >
            Compare All Offers Side-by-Side
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        {['all', 'pending', 'accepted', 'countered', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`py-2 px-3 text-xs sm:text-sm font-bold border-b-2 capitalize transition-colors ${
              filterStatus === s
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {s} ({s === 'all' ? offers.length : offers.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {/* Offers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOffers.map((offer) => {
          const totalVal = offer.quantityQuintals * offer.offeredPricePerQuintal;

          return (
            <Card
              key={offer.id}
              className={`p-5 flex flex-col justify-between border-2 transition-all ${
                offer.status === 'accepted'
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : offer.status === 'pending'
                  ? 'border-emerald-100 hover:border-emerald-300'
                  : 'border-gray-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-gray-900 truncate">
                        {offer.buyerBusinessName}
                      </h3>
                      {offer.buyerVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {offer.buyerName} • {offer.buyerCategory}
                    </p>
                  </div>
                  <Badge
                    variant={
                      offer.status === 'accepted'
                        ? 'green'
                        : offer.status === 'pending'
                        ? 'amber'
                        : 'gray'
                    }
                    size="sm"
                  >
                    {offer.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="my-3 p-3.5 bg-gray-50 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-500">Offered Rate</span>
                    <div>
                      <span className="text-lg font-black text-gray-900">
                        ₹{offer.offeredPricePerQuintal.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-gray-500"> /quintal</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Produce Lot</span>
                    <span className="font-semibold text-gray-800">
                      {offer.quantityQuintals} Qtl {offer.cropName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Lot Value</span>
                    <span className="font-extrabold text-emerald-950">
                      ₹{totalVal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Logistics & Pickup</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-700" />
                      {offer.transportProvidedByBuyer
                        ? 'Buyer Provides Farm Pickup'
                        : `Farmer Deliver (+₹${offer.transportAllowancePerQuintal}/qtl allow.)`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Settlement Method</span>
                    <span className="font-bold text-emerald-800 capitalize">
                      {offer.paymentTerms.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {offer.notes && (
                  <p className="text-xs text-gray-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 mb-4 leading-relaxed">
                    "{offer.notes}"
                  </p>
                )}

                {offer.counterPrice && (
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 mb-4">
                    Your Counter Bid: <strong>₹{offer.counterPrice}/qtl</strong> (Awaiting buyer response)
                  </div>
                )}
              </div>

              {offer.status === 'pending' ? (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      setSelectedOfferForCounter(offer);
                      setCounterPriceInput(offer.offeredPricePerQuintal + 80);
                    }}
                  >
                    Counter Bid
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="px-3"
                    onClick={() => rejectOffer(offer.id)}
                    title="Reject offer"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setConfirmAcceptOfferId(offer.id)}
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    Accept Deal
                  </Button>
                </div>
              ) : offer.status === 'accepted' ? (
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-600" /> Order Contract Created
                  </span>
                  {onNavigateToOrders && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onNavigateToOrders}
                      className="text-xs"
                    >
                      Track Order
                    </Button>
                  )}
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-100 text-xs text-gray-400 font-medium text-center">
                  Offer closed ({offer.status})
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Counter Bid Modal */}
      {selectedOfferForCounter && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedOfferForCounter(null)}
          title={`Counter Bid to ${selectedOfferForCounter.buyerBusinessName}`}
          size="sm"
        >
          <form onSubmit={handleCounterSubmit} className="space-y-4 text-xs">
            <p className="text-gray-600">
              Current Buyer Offer:{' '}
              <strong>₹{selectedOfferForCounter.offeredPricePerQuintal}/qtl</strong>
            </p>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Your Counter Price (₹/quintal)
              </label>
              <input
                type="number"
                required
                value={counterPriceInput}
                onChange={(e) => setCounterPriceInput(Number(e.target.value))}
                className="w-full py-2 px-3 border border-gray-300 rounded-xl text-sm font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-gray-600 leading-relaxed">
              New Proposed Total Value: ₹
              {(selectedOfferForCounter.quantityQuintals * counterPriceInput).toLocaleString('en-IN')}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedOfferForCounter(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Counter Offer
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Accept Modal */}
      {confirmAcceptOfferId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setConfirmAcceptOfferId(null)}
          onConfirm={() => {
            handleAcceptConfirm(confirmAcceptOfferId);
            setConfirmAcceptOfferId(null);
          }}
          title="Accept Official Buyer Deal"
          message="Are you sure you want to accept this offer? An official digital order contract will be generated, the produce lot will be marked as sold, and the buyer will be notified to deposit escrow."
          confirmText="Yes, Accept Deal"
          type="success"
        />
      )}
    </div>
  );
};
