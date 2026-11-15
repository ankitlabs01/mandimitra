'use client';

import React, { useState } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { FileSpreadsheet, Download, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import jsPDF from 'jspdf';

export const InsightsHistoryModule: React.FC = () => {
  const { orders } = useMandiData();

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Buyer Name', 'Crop', 'Quantity (Qtl)', 'Price/Qtl', 'Total Amount', 'Status'];
    const rows = orders.map((o) => [
      o.id,
      o.createdAt.slice(0, 10),
      `"${o.buyerName}"`,
      `"${o.cropName}"`,
      o.quantityQuintals,
      o.agreedPricePerQuintal,
      o.totalAmount,
      o.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mandi_Mitra_Trade_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('CSV Export downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('MANDI MITRA AI - Farm Trade History Dossier', 14, 22);

      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 30);
      doc.text('Farmer: Rameshwar Patidar | Location: Datoda, Indore (MP)', 14, 36);

      doc.setLineWidth(0.5);
      doc.line(14, 40, 196, 40);

      let yPos = 50;
      doc.setFontSize(12);
      doc.text('Completed Transactions & Escrow Records:', 14, yPos);
      yPos += 10;

      orders.forEach((ord, index) => {
        doc.setFontSize(10);
        doc.text(
          `${index + 1}. Order #${ord.id} - ${ord.cropName} (${ord.quantityQuintals} Qtl) | Rate: Rs.${ord.agreedPricePerQuintal}/qtl`,
          14,
          yPos
        );
        yPos += 6;
        doc.text(
          `   Buyer: ${ord.buyerName} | Total: Rs.${ord.totalAmount.toLocaleString('en-IN')} | Status: ${ord.status.toUpperCase()}`,
          14,
          yPos
        );
        yPos += 8;
      });

      doc.save(`Mandi_Mitra_Summary_${new Date().toISOString().slice(0, 10)}.pdf`);
      setDownloadSuccess('PDF Report generated and saved!');
      setTimeout(() => setDownloadSuccess(null), 2500);
    } catch (e) {
      console.warn('PDF generation fallback:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
            Insights, Seasonal Trends & Ledger Export
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Generate verifiable transaction records and audit reports for bank crop loans, KCC renewals, and tax records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportPDF}
            leftIcon={<FileText className="w-4 h-4" />}
          >
            Export PDF Dossier
          </Button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 bg-emerald-100 rounded-xl border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2 font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Historical Records Table */}
      <Card className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          All-Time Trade History & Net Realization
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3 px-4">Order Contract</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">Procuring Entity</th>
                <th className="py-3 px-4 text-right">Agreed Rate</th>
                <th className="py-3 px-4 text-right">Total Net Payout</th>
                <th className="py-3 px-4 text-center">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono font-bold text-gray-900">
                    #{ord.id}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {ord.createdAt.slice(0, 10)}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {ord.quantityQuintals} Qtl {ord.cropName}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {ord.buyerName}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    ₹{ord.agreedPricePerQuintal}/qtl
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-emerald-950">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                      variant={ord.status === 'completed' ? 'green' : 'blue'}
                      size="sm"
                    >
                      {ord.status.toUpperCase()}
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
