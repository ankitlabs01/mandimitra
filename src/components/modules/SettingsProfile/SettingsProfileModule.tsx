'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { SupportedLanguage } from '@/lib/types';
import {
  Settings,
  User,
  CheckCircle2,
  Bell,
  Globe,
  MapPin,
  Save,
} from 'lucide-react';

export const SettingsProfileModule: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { language, setLanguage, languages } = useLanguage();

  const [name, setName] = useState(user?.name || 'Rameshwar Patidar');
  const [phone, setPhone] = useState(user?.phone || '+91 98261 44520');
  const [village, setVillage] = useState(user?.village || 'Datoda');
  const [district, setDistrict] = useState(user?.district || 'Indore');
  const [state, setState] = useState(user?.state || 'Madhya Pradesh');
  const [landAcres, setLandAcres] = useState(user?.landSizeAcres || 12.5);

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [priceSpikeAlerts, setPriceSpikeAlerts] = useState(true);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      village,
      district,
      state,
      landSizeAcres: landAcres,
      language,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-700" />
          Settings, Farmer Profile & Language Preferences
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Manage your personal farm identity, village location coordinates, and notification preferences.
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 bg-emerald-100 rounded-xl border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2 font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Profile configuration saved successfully!</span>
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-700" /> Personal Identity Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number (OTP Verified)
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" /> Farm Land & Village Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Village
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  District
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cultivated Acres
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={landAcres}
                  onChange={(e) => setLandAcres(Number(e.target.value))}
                  className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-700" /> Primary App Language
            </h3>

            <div className="max-w-xs">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full py-2.5 px-3 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-700" /> Advisory & Notification Channels
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-gray-800 font-medium">
                  Instant SMS alerts for new buyer offers and payment releases
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-gray-800 font-medium">
                  WhatsApp daily mandi price summary (morning 9:00 AM)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={priceSpikeAlerts}
                  onChange={(e) => setPriceSpikeAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-gray-800 font-medium">
                  Price surge notifications (&gt;3% jump in adjacent APMCs)
                </span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Preferences
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
