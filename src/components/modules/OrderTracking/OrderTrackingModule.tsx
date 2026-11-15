'use client';

import React, { useState } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import {
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  Scale,
  CreditCard,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface OrderTrackingModuleProps {
  onNavigateToDisputes?: () => void;
}

export const OrderTrackingModule: React.FC<OrderTrackingModuleProps> = ({ onNavigateToDisputes }) => {
  const { orders, updateOrderStatus } = useMandiData();

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const stages = [
    { step: 1, label: 'Deal Confirmed' },
    { step: 2, label: 'Vehicle Dispatched' },
    { step: 3, label: 'In Transit' },
    { step: 4, label: 'Weighbridge & Inspected' },
    { step: 5, label: 'Settled & Paid' },
  ];

  const handleAdvanceStep = (orderId: string, currentMilestone: number) => {
    if (currentMilestone === 1) {
      updateOrderStatus(orderId, 'dispatched', 2);
    } else if (currentMilestone === 2) {
      updateOrderStatus(orderId, 'in_transit', 3);
    } else if (currentMilestone === 3) {
      updateOrderStatus(orderId, 'weighed_and_inspected', 4);
    } else if (currentMilestone === 4) {
      updateOrderStatus(orderId, 'completed', 5);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-700" />
            Live Order Tracking & Escrow Milestone Fulfillment
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Real-time status tracking from farm pickup, vehicle transit, weighbridge inspection, to instant bank release.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`py-2 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'active'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Active Deliveries ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-2 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'completed'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Completed Contracts ({completedOrders.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-5">
        {(activeTab === 'active' ? activeOrders : completedOrders).map((order) => {
          return (
            <Card key={order.id} className="p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-400">#{order.id}</span>
                    <h3 className="text-base font-bold text-gray-900">
                      {order.quantityQuintals} Qtl {order.cropName}
                    </h3>
                    <Badge variant={order.status === 'completed' ? 'green' : 'blue'} size="sm">
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Buyer: <strong className="text-gray-800">{order.buyerName}</strong> • Agreed Rate: ₹{order.agreedPricePerQuintal}/qtl
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-gray-400 block">Total Contract Value</span>
                  <span className="text-lg font-black text-emerald-950">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* 5-Stage Stepper Bar */}
              <div className="my-6">
                <div className="flex items-center justify-between relative">
                  {/* Background Track Line */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0" />
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 transition-all duration-300 z-0"
                    style={{
                      width: `${((order.currentMilestone - 1) / (stages.length - 1)) * 100}%`,
                    }}
                  />

                  {stages.map((st) => {
                    const isCompleted = order.currentMilestone >= st.step;
                    const isCurrent = order.currentMilestone === st.step;

                    return (
                      <div key={st.step} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isCompleted
                              ? 'bg-emerald-700 text-white shadow-md'
                              : 'bg-white border-2 border-gray-300 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-emerald-200' : ''}`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : st.step}
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs font-semibold mt-2 text-center max-w-[80px] hidden sm:block ${
                            isCompleted ? 'text-emerald-900' : 'text-gray-400'
                          }`}
                        >
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transport and Driver Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-2xl text-xs mb-4">
                <div>
                  <span className="text-gray-500 block">Haulage Vehicle</span>
                  <span className="font-semibold text-gray-900">
                    {order.transportVehicleNumber || 'MP-09-GH-8219 (Tractor Trolley)'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Driver Contact</span>
                  <span className="font-semibold text-gray-900">
                    {order.driverPhone || '+91 97552 19280 (Mohan)'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Escrow Payment Security</span>
                  <span className="font-bold text-emerald-800">
                    {order.paymentStatus === 'paid_to_farmer'
                      ? '✓ Released to Bank'
                      : '✓ 100% Locked in Escrow'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  {order.driverPhone && (
                    <a
                      href={`tel:${order.driverPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-700" /> Call Driver
                    </a>
                  )}
                  {onNavigateToDisputes && (
                    <button
                      onClick={onNavigateToDisputes}
                      className="text-xs text-rose-700 hover:text-rose-800 font-semibold px-2 py-1"
                    >
                      Report Issue / Dispute
                    </button>
                  )}
                </div>

                {order.status !== 'completed' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleAdvanceStep(order.id, order.currentMilestone)}
                  >
                    Simulate Next Stage (Step {order.currentMilestone + 1})
                  </Button>
                )}
              </div>
            </Card>
          );
        })}

        {(activeTab === 'active' ? activeOrders : completedOrders).length === 0 && (
          <EmptyState
            icon={<MapPin className="w-8 h-8" />}
            title="No orders found"
            description="You do not have any orders in this category currently."
          />
        )}
      </div>
    </div>
  );
};
