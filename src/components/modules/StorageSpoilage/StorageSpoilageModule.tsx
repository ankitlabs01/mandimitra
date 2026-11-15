'use client';

import React, { useState } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  Warehouse,
  ShieldCheck,
  Thermometer,
  Calendar,
  AlertTriangle,
  Phone,
  CheckCircle2,
} from 'lucide-react';

export const StorageSpoilageModule: React.FC = () => {
  const { storageFacilities, crops } = useMandiData();

  const [selectedCropId, setSelectedCropId] = useState('crop-soybean');
  const [holdingDays, setHoldingDays] = useState(45);
  const [quantityQuintals, setQuantityQuintals] = useState(100);
  const [selectedFacilityForBooking, setSelectedFacilityForBooking] = useState<any | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Warehouse className="w-6 h-6 text-emerald-700" />
          Storage Facilities & Spoilage Degradation Analyzer
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Compare Central Warehousing Corporation (CWC) depots, cold stores, and grain silos. Simulate physical weight loss before storing.
        </p>
      </div>

      {/* Simulator Inputs */}
      <Card className="p-5 bg-gray-50/70 border-gray-200">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Simulate Weight Loss & Holding Cost
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Crop to Store
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.perishabilityIndex} Perishability)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Storage Quantity</label>
              <span className="text-xs font-bold text-emerald-800">{quantityQuintals} Qtl</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={quantityQuintals}
              onChange={(e) => setQuantityQuintals(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Storage Duration</label>
              <span className="text-xs font-bold text-emerald-800">{holdingDays} Days</span>
            </div>
            <input
              type="range"
              min="10"
              max="180"
              step="5"
              value={holdingDays}
              onChange={(e) => setHoldingDays(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {storageFacilities.map((fac) => {
          const monthlyFee = fac.ratePerQuintalPerMonth;
          const totalRent = Math.round(quantityQuintals * monthlyFee * (holdingDays / 30));
          
          let lossRate = selectedCrop.dailyWeightLossRate;
          if (fac.climateControlled) lossRate = lossRate * 0.3;
          const weightLostQtl = Number((quantityQuintals * lossRate * holdingDays).toFixed(1));
          const remainingQtl = Number((quantityQuintals - weightLostQtl).toFixed(1));

          return (
            <Card key={fac.id} className="p-5 flex flex-col justify-between" hoverEffect>
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{fac.name}</h3>
                    <p className="text-xs text-gray-500">
                      {fac.type} • {fac.location} ({fac.distanceKm} km)
                    </p>
                  </div>
                  <Badge variant={fac.climateControlled ? 'blue' : 'gray'} size="sm">
                    {fac.climateControlled ? 'Climate Controlled' : 'Standard'}
                  </Badge>
                </div>

                <div className="my-3 p-3.5 bg-gray-50 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monthly Storage Fee</span>
                    <span className="font-bold text-gray-900">₹{fac.ratePerQuintalPerMonth} /qtl/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Total Rent ({holdingDays}d)</span>
                    <span className="font-bold text-emerald-800">₹{totalRent.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Weight Shrinkage</span>
                    <span className="font-semibold text-rose-700">
                      -{weightLostQtl} Qtl ({((weightLostQtl / quantityQuintals) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Net Weight Remaining</span>
                    <span className="font-extrabold text-gray-900">{remainingQtl} Quintals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Insurance & Bank Lien</span>
                    <span className="font-medium text-emerald-700">
                      {fac.insuranceCovered ? '✓ Covered (e-NWR Eligible)' : 'Farmer Risk'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <a
                  href={`tel:${fac.phone}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-200"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" /> Call Depot
                </a>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setSelectedFacilityForBooking(fac)}
                >
                  Reserve Space
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Booking Modal */}
      {selectedFacilityForBooking && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedFacilityForBooking(null)}
          title={`Reserve Storage at ${selectedFacilityForBooking.name}`}
          size="sm"
        >
          {bookingConfirmed ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-gray-900">Space Reservation Sent!</h4>
              <p className="text-xs text-gray-600">
                Depot manager will issue Gate Inward Slip. You can present this e-Slip at the weighbridge.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <p className="text-gray-600">
                Reserving space for <strong>{quantityQuintals} Quintals</strong> of{' '}
                <strong>{selectedCrop.name}</strong> for {holdingDays} days.
              </p>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span className="font-bold">₹{selectedFacilityForBooking.ratePerQuintalPerMonth}/qtl/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Space:</span>
                  <span className="font-bold text-emerald-700">
                    {selectedFacilityForBooking.availableCapacityQuintals} Quintals
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setSelectedFacilityForBooking(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setBookingConfirmed(true);
                    setTimeout(() => {
                      setBookingConfirmed(false);
                      setSelectedFacilityForBooking(null);
                    }, 1800);
                  }}
                >
                  Confirm Reservation
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
