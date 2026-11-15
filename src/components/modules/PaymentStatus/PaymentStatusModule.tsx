'use client';

import React from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Download,
  Clock,
  ArrowUpRight,
  Landmark,
  Building2,
} from 'lucide-react';

export const PaymentStatusModule: React.FC = () => {
  const { orders } = useMandiData();
  const { user } = useAuth();

  const totalEarnings = orders
    .filter((o) => o.paymentStatus === 'paid_to_farmer')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const inEscrow = orders
    .filter((o) => o.paymentStatus === 'in_escrow')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-emerald-700" />
          Safe Escrow & Bank Settlement Status
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Guaranteed zero-default payment mechanism. Buyers deposit funds into ICICI/HDFC Escrow before dispatch.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-white border-l-4 border-l-emerald-600">
          <span className="text-xs text-gray-500 block">Funds Settled to Bank</span>
          <div className="text-2xl font-black text-gray-900 mt-1">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            ✓ Transferred via RTGS / IMPS
          </span>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-l-amber-500">
          <span className="text-xs text-gray-500 block">Locked in Safe Escrow</span>
          <div className="text-2xl font-black text-gray-900 mt-1">
            ₹{inEscrow.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
            Releasing upon digital weighment pass
          </span>
        </Card>

        <Card className="p-5 bg-white border-l-4 border-l-sky-600">
          <span className="text-xs text-gray-500 block">Registered Bank Account</span>
          <div className="text-sm font-black text-gray-900 mt-1">
            State Bank of India
          </div>
          <span className="text-[11px] text-gray-500 block mt-0.5">
            A/C: ••••••••4819 • IFSC: SBIN0001242
          </span>
        </Card>
      </div>

      {/* Escrow Guarantee Explainer */}
      <Card className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white border-emerald-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">
              How Mandi Mitra Escrow Protects Your Money
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Unlike traditional trade credit where farmers wait weeks for payments, Mandi Mitra requires the buyer to deposit 100% of the funds into a licensed third-party escrow account before your produce leaves the farm gate. Once the digital weighbridge pass is scanned, funds release automatically to your account within 4 hours.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-emerald-800">
              <span>✓ Zero Default Risk</span>
              <span>✓ No Commission Deductions</span>
              <span>✓ Bank SMS & GST Invoice</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction History Ledger */}
      <Card className="p-5">
        <h4 className="text-sm font-bold text-gray-900 mb-4">
          Payment Transactions & Digital Settlement Slips
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Buyer Entity</th>
                <th className="py-3 px-4">Lot Spec</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Escrow Status</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-gray-900">#{ord.id}</span>
                    <span className="text-[10px] text-gray-400 block">{ord.createdAt.slice(0, 10)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{ord.buyerName}</span>
                    <span className="text-[10px] text-gray-400 block">{ord.paymentTerms}</span>
                  </td>
                  <td className="py-3 px-4">
                    {ord.quantityQuintals} Qtl {ord.cropName}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-extrabold text-emerald-950">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                      variant={ord.paymentStatus === 'paid_to_farmer' ? 'green' : 'amber'}
                      size="sm"
                    >
                      {ord.paymentStatus === 'paid_to_farmer' ? 'Settled to Bank' : 'In Escrow'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => alert(`Downloading Digital Settlement Voucher for Order ${ord.id}`)}
                      className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Download receipt"
                    >
                      <Download className="w-4 h-4" />
                    </button>
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
