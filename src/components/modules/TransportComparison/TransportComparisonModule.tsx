'use client';

import React, { useState } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  Truck,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

export const TransportComparisonModule: React.FC = () => {
  const { transportOptions, mandis } = useMandiData();

  const [distanceKm, setDistanceKm] = useState(35);
  const [quantityQuintals, setQuantityQuintals] = useState(60);
  const [selectedTransportForBooking, setSelectedTransportForBooking] = useState<any | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Truck className="w-6 h-6 text-emerald-700" />
          Rural Freight & Mandi Transport Comparison
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Compare verified local tractor trolleys, pickup trucks, and APMC carrier fleets with transparent mileage and handling tariffs.
        </p>
      </div>

      {/* Simulator Sliders */}
      <Card className="p-5 bg-gray-50/70 border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Trip Distance</label>
              <span className="text-xs font-bold text-emerald-800">{distanceKm} Kilometers</span>
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

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Payload Weight</label>
              <span className="text-xs font-bold text-emerald-800">{quantityQuintals} Quintals</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={quantityQuintals}
              onChange={(e) => setQuantityQuintals(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Vehicle Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {transportOptions.map((opt) => {
          // Trips required if payload exceeds vehicle capacity
          const tripsRequired = Math.ceil(quantityQuintals / opt.capacityQuintals);
          const mileageCost = distanceKm * opt.ratePerKm * tripsRequired;
          const loadingCost = quantityQuintals * opt.handlingChargePerQuintal;
          const baseCost = opt.baseCharge * tripsRequired;
          const totalFare = baseCost + mileageCost + loadingCost;
          const costPerQuintal = Math.round(totalFare / quantityQuintals);

          return (
            <Card key={opt.id} className="p-5 flex flex-col justify-between" hoverEffect>
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{opt.providerName}</h3>
                    <p className="text-xs text-gray-500">{opt.vehicleType}</p>
                  </div>
                  <Badge variant={tripsRequired === 1 ? 'green' : 'amber'} size="sm">
                    {tripsRequired === 1 ? 'Single Trip' : `${tripsRequired} Trips Req.`}
                  </Badge>
                </div>

                <div className="my-3 p-3.5 bg-gray-50 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payload Capacity</span>
                    <span className="font-semibold text-gray-900">{opt.capacityQuintals} Qtl / Trip</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Base Tariff + Mileage Rate</span>
                    <span className="text-gray-700">₹{opt.baseCharge} + ₹{opt.ratePerKm}/km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Labour Loading/Unloading</span>
                    <span className="text-gray-700">₹{opt.handlingChargePerQuintal} /qtl</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pickup Dispatch ETA</span>
                    <span className="font-semibold text-emerald-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Within {opt.availableInHours} Hours
                    </span>
                  </div>
                </div>

                {/* Total Fare Box */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-500 block">Total Estimated Fare:</span>
                    <span className="text-base font-black text-emerald-950">
                      ₹{totalFare.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 block">Unit Cost:</span>
                    <span className="text-xs font-bold text-emerald-800">
                      ₹{costPerQuintal}/quintal
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-3">
                <a
                  href={`tel:${opt.contactNumber}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-200"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" /> Call Transporter
                </a>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setSelectedTransportForBooking(opt)}
                >
                  Book Haulage
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Booking Modal */}
      {selectedTransportForBooking && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTransportForBooking(null)}
          title={`Book Freight with ${selectedTransportForBooking.providerName}`}
          size="sm"
        >
          {bookingSuccess ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-gray-900">Vehicle Dispatched!</h4>
              <p className="text-xs text-gray-600">
                Driver assigned: <span className="font-semibold">Mohan Gurjar (MP-09-GH-8219)</span>. They are en route to your farm coordinates.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <p className="text-gray-600">
                Booking <strong>{selectedTransportForBooking.vehicleType}</strong> for {quantityQuintals} Quintals across {distanceKm} km.
              </p>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span className="font-bold">{selectedTransportForBooking.contactNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Arrival ETA:</span>
                  <span className="font-bold text-emerald-700">Under {selectedTransportForBooking.availableInHours} Hours</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setSelectedTransportForBooking(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setBookingSuccess(true);
                    setTimeout(() => {
                      setBookingSuccess(false);
                      setSelectedTransportForBooking(null);
                    }, 1800);
                  }}
                >
                  Confirm Vehicle Booking
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
