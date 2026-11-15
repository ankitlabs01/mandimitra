'use client';

import React, { useState } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  PlusCircle,
  FileText,
  Building2,
} from 'lucide-react';

export const RatingsDisputesModule: React.FC = () => {
  const { disputes, createDispute, resolveDispute, orders } = useMandiData();

  const [isFilingModalOpen, setIsFilingModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || 'ord-8801');
  const [reason, setReason] = useState<'weight_shortage' | 'quality_mismatch' | 'payment_delay' | 'vehicle_breakdown' | 'breach_of_terms'>('payment_delay');
  const [description, setDescription] = useState('');

  const handleFileDispute = (e: React.FormEvent) => {
    e.preventDefault();
    createDispute({
      orderId: selectedOrderId,
      raisedBy: 'farmer',
      partyName: 'Rameshwar Patidar',
      reason,
      description,
      evidenceUrls: ['/evidence/dispute-slip.pdf'],
    });
    setIsFilingModalOpen(false);
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-emerald-700" />
            Dispute Arbitration & Grievance Resolution
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Formal mediation for weight discrepancies, unapproved deductions, and payment delays backed by FPO legal assistance.
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setIsFilingModalOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          File New Grievance / Dispute
        </Button>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {disputes.map((disp) => (
          <Card key={disp.id} className="p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-400">#{disp.id}</span>
                  <h3 className="text-base font-bold text-gray-900 capitalize">
                    {disp.reason.replace('_', ' ')}
                  </h3>
                  <Badge
                    variant={
                      disp.status === 'resolved'
                        ? 'green'
                        : disp.status === 'open'
                        ? 'red'
                        : 'amber'
                    }
                    size="sm"
                  >
                    {disp.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Associated Order: <strong className="text-gray-800">#{disp.orderId}</strong> • Raised by {disp.partyName}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                Logged on {disp.createdAt.slice(0, 10)}
              </span>
            </div>

            <p className="text-xs text-gray-700 my-4 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              "{disp.description}"
            </p>

            {disp.resolutionNotes && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 mb-4">
                <strong>Arbitration Status:</strong> {disp.resolutionNotes}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-gray-500 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                Assigned Mediator: Mandi Mitra Central Desk + Malwa FPO Coordinator
              </span>

              {disp.status !== 'resolved' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                  onClick={() =>
                    resolveDispute(
                      disp.id,
                      'Settled via mutual agreement. Buyer released full balance with RTGS confirmation reference.'
                    )
                  }
                >
                  Mark as Mutually Resolved
                </Button>
              )}
            </div>
          </Card>
        ))}

        {disputes.length === 0 && (
          <Card className="p-12 text-center text-gray-500 text-xs">
            No active disputes found. All trade transactions are settled smoothly.
          </Card>
        )}
      </div>

      {/* File Dispute Modal */}
      {isFilingModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsFilingModalOpen(false)}
          title="File Official Trade Grievance"
          size="md"
        >
          <form onSubmit={handleFileDispute} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Select Impacted Order Contract
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-xl text-xs font-medium"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    Order #{o.id} - {o.cropName} ({o.buyerName}) - ₹{o.totalAmount.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Grievance Category
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full py-2 px-3 border border-gray-300 rounded-xl text-xs font-medium"
              >
                <option value="payment_delay">Payment Delay Beyond Contracted Term</option>
                <option value="weight_shortage">Unauthorized Weighbridge Weight Deduction</option>
                <option value="quality_mismatch">Arbitrary Quality Downgrade at Gate</option>
                <option value="vehicle_breakdown">Transporter Vehicle Breakdown / Delay</option>
                <option value="breach_of_terms">Breach of Agreed Commercial Terms</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Detailed Statement & Facts
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurred, dates, weighbridge ticket numbers, and communications..."
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
              Filing a grievance freezes the buyer's escrow funds from unilateral withdrawal until mediation concludes.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFilingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="danger">
                Submit Formal Grievance
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
