'use client';

import React, { useState } from 'react';
import { useMandiData } from '@/context/MandiDataContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  Award,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Upload,
} from 'lucide-react';

export const CropQualityModule: React.FC = () => {
  const { crops } = useMandiData();

  const [selectedCropId, setSelectedCropId] = useState('crop-soybean');
  const [moisture, setMoisture] = useState<number>(9.5);
  const [foreignMatter, setForeignMatter] = useState<number>(0.8);
  const [brokenGrains, setBrokenGrains] = useState<number>(1.2);
  const [damagePercent, setDamagePercent] = useState<number>(0.5);
  const [cameraAnalyzing, setCameraAnalyzing] = useState(false);
  const [cameraAnalysisDone, setCameraAnalysisDone] = useState(false);

  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  // Dynamic Grade Calculation
  let grade: 'Grade A (FAQ Premium)' | 'Grade B (Standard Commercial)' | 'Grade C (Under-spec)' = 'Grade A (FAQ Premium)';
  let priceImpactPercent = 0;

  if (moisture <= 10 && foreignMatter <= 1.0 && brokenGrains <= 2.0 && damagePercent <= 1.0) {
    grade = 'Grade A (FAQ Premium)';
    priceImpactPercent = +3.5;
  } else if (moisture <= 12 && foreignMatter <= 2.0 && brokenGrains <= 4.0 && damagePercent <= 2.5) {
    grade = 'Grade B (Standard Commercial)';
    priceImpactPercent = 0;
  } else {
    grade = 'Grade C (Under-spec)';
    priceImpactPercent = -6.0;
  }

  const handleSimulateCamera = () => {
    setCameraAnalyzing(true);
    setCameraAnalysisDone(false);
    setTimeout(() => {
      setCameraAnalyzing(false);
      setCameraAnalysisDone(true);
      setMoisture(9.8);
      setForeignMatter(0.6);
      setBrokenGrains(1.1);
      setDamagePercent(0.4);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-emerald-700" />
          Crop Quality Grading & Fair Average Quality (FAQ) Assessor
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Verify AGMARK and APMC quality parameters to command top premiums and prevent arbitrary dockage deductions at the mandi gate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Sliders & Camera Trigger (7 cols) */}
        <Card className="lg:col-span-7 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900">Configure Physical Assay Values</h3>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="py-1 px-3 bg-white border border-gray-300 rounded-xl text-xs font-semibold"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* AI Camera Assessment Trigger */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">AI Smartphone Camera Scan</h4>
                <p className="text-[11px] text-gray-600">
                  Analyze grain color, luster, and shriveling via computer vision.
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSimulateCamera}
              isLoading={cameraAnalyzing}
              className="text-xs shrink-0"
            >
              {cameraAnalyzing ? 'Analyzing Sample...' : 'Capture Sample'}
            </Button>
          </div>

          {cameraAnalysisDone && (
            <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>AI scan completed: Grain uniformity 96%, Luster Score: High. Sliders updated.</span>
            </div>
          )}

          {/* Moisture Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-700">Moisture Content</label>
              <span className="font-bold text-emerald-800">{moisture}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="0.1"
              value={moisture}
              onChange={(e) => setMoisture(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <span className="text-[10px] text-gray-400 block">
              Optimal standard for storage: under {selectedCrop.standardMoisturePercent}%
            </span>
          </div>

          {/* Foreign Matter Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-700">Foreign Matter / Dirt / Stones</label>
              <span className="font-bold text-gray-900">{foreignMatter}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="6.0"
              step="0.1"
              value={foreignMatter}
              onChange={(e) => setForeignMatter(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          {/* Broken Grains Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-700">Broken / Immature Grain Fraction</label>
              <span className="font-bold text-gray-900">{brokenGrains}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              value={brokenGrains}
              onChange={(e) => setBrokenGrains(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          {/* Damage / Pest Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-700">Insect / Fungus Damaged Kernels</label>
              <span className="font-bold text-gray-900">{damagePercent}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="8.0"
              step="0.1"
              value={damagePercent}
              onChange={(e) => setDamagePercent(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>
        </Card>

        {/* Right Column: Grade Certificate & Mandi Impact (5 cols) */}
        <Card className="lg:col-span-5 p-6 flex flex-col justify-between bg-gradient-to-b from-white to-gray-50/70">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                QUALITY APPRAISAL RESULT
              </span>
              <Badge
                variant={priceImpactPercent >= 0 ? 'green' : 'red'}
                size="md"
              >
                {priceImpactPercent >= 0 ? `+${priceImpactPercent}% Premium` : `${priceImpactPercent}% Dockage`}
              </Badge>
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2">{grade}</h3>

            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              {grade.includes('Grade A')
                ? 'Your produce meets export and institutional processing standards. Do not accept spot mandi deductions; you qualify for factory-gate premium.'
                : grade.includes('Grade B')
                ? 'Standard commercial grade acceptable for general milling with zero price deductions.'
                : 'High moisture or foreign matter detected. Solar drying for 1–2 days recommended prior to dispatch.'}
            </p>

            <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Benchmark Spot Rate</span>
                <span className="font-semibold">₹5,000 /qtl</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quality Adjustment</span>
                <span className={`font-bold ${priceImpactPercent >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {priceImpactPercent >= 0 ? '+' : ''}₹{Math.round(5000 * (priceImpactPercent / 100))} /qtl
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="text-gray-700 font-bold">Recommended Realization</span>
                <span className="font-black text-emerald-950 text-sm">
                  ₹{Math.round(5000 * (1 + priceImpactPercent / 100))} /quintal
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => alert('Digital Quality Certificate generated and attached to active listings.')}
            >
              Generate Digital Quality Slip
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
