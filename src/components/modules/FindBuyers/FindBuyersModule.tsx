'use client';

import React, { useState } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  Users,
  ShieldCheck,
  Phone,
  Building,
  CheckCircle2,
  Search,
  Star,
  MapPin,
  Send,
} from 'lucide-react';

export const FindBuyersModule: React.FC = () => {
  const { createBuyerOffer, listings } = useMandiData();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedBuyerForContact, setSelectedBuyerForContact] = useState<any | null>(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [targetPrice, setTargetPrice] = useState(5150);
  const [inquiryNotes, setInquiryNotes] = useState('Village Datoda, Indore. Lot is stored in dry covered bags. Computerized weighbridge accessible 1 km from farm.');

  const buyers = [
    {
      id: 'b-1',
      businessName: 'Malwa Agro Oils & Solvent Ltd',
      contactPerson: 'Vijay Singhania (Procurement Head)',
      phone: '+91 98260 88120',
      category: 'Oil Mill & Solvent Processor',
      location: 'Pithampur Sector-3, Indore',
      distanceKm: 28,
      verified: true,
      rating: 4.8,
      dealsCompleted: 142,
      commoditiesBought: ['Soybean', 'Mustard', 'Cotton Seed'],
      dailyCapacityQuintals: 3000,
      paymentTerms: 'Same-day RTGS on gate weighment',
      providesTransport: true,
    },
    {
      id: 'b-2',
      businessName: 'Shree Krishna Roller Flour Mills',
      contactPerson: 'Rajesh Agarwal',
      phone: '+91 94250 12890',
      category: 'Flour & Grain Processor',
      location: 'Sanwer Road, Indore',
      distanceKm: 22,
      verified: true,
      rating: 4.7,
      dealsCompleted: 98,
      commoditiesBought: ['Sharbati Wheat', 'Lokwan Wheat', 'Chana'],
      dailyCapacityQuintals: 1500,
      paymentTerms: 'Immediate digital UPI / NEFT',
      providesTransport: false,
    },
    {
      id: 'b-3',
      businessName: 'Gujarat Agro Exporters Surat',
      contactPerson: 'Harshvardhan Parekh',
      phone: '+91 98980 44102',
      category: 'Spice & Produce Exporter',
      location: 'Dewas Highway Export Yard',
      distanceKm: 42,
      verified: true,
      rating: 4.9,
      dealsCompleted: 64,
      commoditiesBought: ['Garlic', 'Onion', 'Chana Bold'],
      dailyCapacityQuintals: 800,
      paymentTerms: '100% Mandi Mitra Safe Escrow Deposit',
      providesTransport: true,
    },
    {
      id: 'b-4',
      businessName: 'Kailash Traders APMC Commission Agent',
      contactPerson: 'Kailash Chand Mittal',
      phone: '+91 731 2409811',
      category: 'Registered APMC Commission Trader',
      location: 'Indore APMC Yard Shop #44',
      distanceKm: 18,
      verified: true,
      rating: 4.5,
      dealsCompleted: 310,
      commoditiesBought: ['Soybean', 'Wheat', 'Chana', 'Garlic', 'Mustard'],
      dailyCapacityQuintals: 2000,
      paymentTerms: 'Spot cash or UPI at APMC yard',
      providesTransport: false,
    },
  ];

  const filteredBuyers = buyers.filter((b) => {
    if (categoryFilter !== 'all' && b.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = b.businessName.toLowerCase().includes(q);
      const matchCommodity = b.commoditiesBought.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchCommodity) return false;
    }
    return true;
  });

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBuyerForContact) {
      const activeListing = listings[0];
      await createBuyerOffer({
        listingId: activeListing?.id || 'list-001',
        cropName: activeListing?.cropName || 'Soybean (JS-9560)',
        quantityQuintals: activeListing?.quantityQuintals || 85,
        buyerId: selectedBuyerForContact.id,
        buyerName: selectedBuyerForContact.contactPerson,
        buyerBusinessName: selectedBuyerForContact.businessName,
        buyerCategory: selectedBuyerForContact.category,
        buyerRating: selectedBuyerForContact.rating,
        buyerVerified: selectedBuyerForContact.verified,
        offeredPricePerQuintal: targetPrice,
        paymentTerms: 'same_day_rtgs',
        transportProvidedByBuyer: selectedBuyerForContact.providesTransport,
        transportAllowancePerQuintal: 0,
        deliveryMandiOrLocation: selectedBuyerForContact.location,
        distanceKm: selectedBuyerForContact.distanceKm,
        notes: inquiryNotes,
        validUntil: new Date(Date.now() + 4 * 86400000).toISOString(),
      });
    }
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setSelectedBuyerForContact(null);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-700" />
            Find Verified Buyers & Processors
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Connect directly with solvent extractors, export houses, and registered APMC traders with verified credentials.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-gray-50/70 border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by buyer name or crop (e.g. Soybean, Wheat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">All Buyer Categories ({buyers.length})</option>
              <option value="Oil Mill & Solvent Processor">Oil Mill & Solvent Processors</option>
              <option value="Flour & Grain Processor">Flour & Grain Mills</option>
              <option value="Spice & Produce Exporter">Spice & Export Houses</option>
              <option value="Registered APMC Commission Trader">APMC Commission Traders</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBuyers.map((buyer) => (
          <Card key={buyer.id} className="p-5 flex flex-col justify-between" hoverEffect>
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-gray-900">{buyer.businessName}</h3>
                    {buyer.verified && (
                      <span title="Verified Trader">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{buyer.category}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {buyer.rating} ({buyer.dealsCompleted})
                </div>
              </div>

              <div className="my-3 p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Contact Executive</span>
                  <span className="font-semibold text-gray-900">{buyer.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location & Distance</span>
                  <span className="text-gray-700">{buyer.location} ({buyer.distanceKm} km)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Assurance</span>
                  <span className="font-bold text-emerald-800">{buyer.paymentTerms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Farm Gate Pickup</span>
                  <span className="font-semibold text-gray-800">
                    {buyer.providesTransport ? 'Yes (Buyer Truck Available)' : 'Farmer Self-Haul'}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-[11px] text-gray-400 block mb-1">Crops in Active Demand:</span>
                <div className="flex flex-wrap gap-1">
                  {buyer.commoditiesBought.map((crop, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-medium"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <a
                href={`tel:${buyer.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                Call Direct
              </a>
              <Button
                variant="primary"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setSelectedBuyerForContact(buyer)}
              >
                Request Bid / Inspection
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Request Bid Modal */}
      {selectedBuyerForContact && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBuyerForContact(null)}
          title={`Request Bid from ${selectedBuyerForContact.businessName}`}
          size="md"
        >
          {inquirySent ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-gray-900">Inquiry Dispatched Successfully!</h4>
              <p className="text-xs text-gray-600">
                The buyer has received your lot details. They typically call within 2 hours or place an in-app bid.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendInquiry} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Lot to Propose</label>
                <select className="w-full py-2 px-3 bg-white border border-gray-300 rounded-xl text-xs font-medium">
                  <option>85 Qtl - Soybean (JS-9560) [Grade A, 9.8% Moisture]</option>
                  <option>140 Qtl - Sharbati Wheat [Grade A]</option>
                  <option>35 Qtl - Garlic Amleta Special [Grade A]</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Target Price (₹/quintal)</label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value) || 0)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Message / Pickup Address</label>
                <textarea
                  rows={3}
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-600 leading-relaxed">
                Contact Person: {selectedBuyerForContact.contactPerson} ({selectedBuyerForContact.phone})
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedBuyerForContact(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" leftIcon={<Send className="w-3.5 h-3.5" />}>
                  Send Official Bid Request
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
