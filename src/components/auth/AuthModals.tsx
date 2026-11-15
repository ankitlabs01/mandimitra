'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';
import { User, Shield, CheckCircle2, Building, Wheat, Briefcase } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModals: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, login, logout, switchRole, role } = useAuth();
  const [tab, setTab] = useState<'profile' | 'switch' | 'login'>('profile');
  const [phone, setPhone] = useState(user?.phone || '9826144520');
  const [selectedRole, setSelectedRole] = useState<UserRole>(role);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(phone, selectedRole);
    onClose();
  };

  const handleRoleQuickSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-700" />
          <span>User Authentication & Persona Switcher</span>
        </div>
      }
      size="md"
    >
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl mb-6 text-xs font-semibold">
        <button
          onClick={() => setTab('profile')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            tab === 'profile' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Active Profile
        </button>
        <button
          onClick={() => setTab('switch')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            tab === 'switch' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Switch Persona
        </button>
        <button
          onClick={() => setTab('login')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            tab === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Login / Register
        </button>
      </div>

      {tab === 'profile' && user && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white text-xl font-black flex items-center justify-center shadow-md">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-gray-900">{user.name}</h4>
                {user.verified && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <p className="text-xs text-gray-600">{user.phone} • {user.email || 'Mobile Verified'}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 capitalize">
                  {user.role}
                </span>
                <span className="text-xs text-emerald-700 font-medium">
                  Trust Score: {user.trustScore ?? 94}/100
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-gray-500 block">Village / Base</span>
              <span className="font-semibold text-gray-900">{user.village || 'Indore Hub'}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-gray-500 block">District & State</span>
              <span className="font-semibold text-gray-900">{user.district}, {user.state}</span>
            </div>
            {user.landSizeAcres && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-500 block">Cultivated Land</span>
                <span className="font-semibold text-gray-900">{user.landSizeAcres} Acres</span>
              </div>
            )}
            {user.businessName && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-500 block">Registered Entity</span>
                <span className="font-semibold text-gray-900 truncate block">{user.businessName}</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setTab('switch')}>
              Switch Role
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                logout();
                onClose();
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {tab === 'switch' && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500 mb-2">
            Click any persona below to instantaneously simulate that user experience:
          </p>

          <button
            onClick={() => handleRoleQuickSwitch('farmer')}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              role === 'farmer'
                ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20'
                : 'hover:bg-gray-50 border-gray-200'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Wheat className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-bold text-gray-900">1. Farmer (Rameshwar Patidar)</h5>
                {role === 'farmer' && <span className="text-xs font-bold text-emerald-700">Active</span>}
              </div>
              <p className="text-xs text-gray-500">12.5 Acres, Soybean & Wheat farmer from Datoda, Indore</p>
            </div>
          </button>

          <button
            onClick={() => handleRoleQuickSwitch('buyer')}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              role === 'buyer'
                ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-500/20'
                : 'hover:bg-gray-50 border-gray-200'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-800">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-bold text-gray-900">2. Buyer / Trader (Malwa Agro Oils)</h5>
                {role === 'buyer' && <span className="text-xs font-bold text-sky-700">Active</span>}
              </div>
              <p className="text-xs text-gray-500">Commercial Solvent Extraction Plant & Grain Wholesaler</p>
            </div>
          </button>

          <button
            onClick={() => handleRoleQuickSwitch('fpo')}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              role === 'fpo'
                ? 'bg-purple-50/80 border-purple-400 ring-2 ring-purple-500/20'
                : 'hover:bg-gray-50 border-gray-200'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
              <Building className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-bold text-gray-900">3. FPO Coordinator (Malwa Kisan Producer Co.)</h5>
                {role === 'fpo' && <span className="text-xs font-bold text-purple-700">Active</span>}
              </div>
              <p className="text-xs text-gray-500">840+ Member Farmers, Collective Bargaining & Transport</p>
            </div>
          </button>

          <button
            onClick={() => handleRoleQuickSwitch('admin')}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              role === 'admin'
                ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20'
                : 'hover:bg-gray-50 border-gray-200'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-bold text-gray-900">4. Administrator (Platform Ops)</h5>
                {role === 'admin' && <span className="text-xs font-bold text-amber-700">Active</span>}
              </div>
              <p className="text-xs text-gray-500">APMC Rate Feed Manager, Dispute Arbitration & Escrow Release</p>
            </div>
          </button>
        </div>
      )}

      {tab === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mobile Number (10 Digits)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9826144520"
                className="flex-1 rounded-r-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Desired Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="farmer">Farmer (किसान)</option>
              <option value="buyer">Buyer / Trader / Processor</option>
              <option value="fpo">FPO Coordinator</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
            Instant Demo Auth: SMS OTP verification is simulated automatically.
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Sign In with OTP
          </Button>
        </form>
      )}
    </Modal>
  );
};
