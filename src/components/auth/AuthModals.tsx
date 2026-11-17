'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useAuth, RegisterInput } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';
import { isSupabaseConfigured, getSupabaseConfig, setRuntimeSupabaseConfig } from '@/lib/supabase';
import {
  User,
  Shield,
  CheckCircle2,
  Building,
  Wheat,
  Briefcase,
  Lock,
  Mail,
  Phone,
  Database,
  AlertCircle,
  Key,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModals: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    login,
    register,
    logout,
    switchRole,
    role,
    isAuthLoading,
    authError,
    clearAuthError,
  } = useAuth();

  const [tab, setTab] = useState<'profile' | 'switch' | 'login' | 'register' | 'supabase'>('profile');

  // Login Form State
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState(user?.email || 'farmer.ramesh@mandimitra.ai');
  const [loginPassword, setLoginPassword] = useState('MandiMitra@2026');
  const [selectedRole, setSelectedRole] = useState<UserRole>(role);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('farmer');
  const [regVillage, setRegVillage] = useState('Datoda');
  const [regDistrict, setRegDistrict] = useState('Indore');
  const [regState, setRegState] = useState('Madhya Pradesh');
  const [regLandAcres, setRegLandAcres] = useState<number>(10);
  const [regBusinessName, setRegBusinessName] = useState('');

  // Runtime Supabase Config State
  const config = getSupabaseConfig();
  const [customUrl, setCustomUrl] = useState(config.url || '');
  const [customKey, setCustomKey] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    const result = await login(loginEmailOrPhone, selectedRole, loginPassword);
    if (result.success) {
      onClose();
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    const input: RegisterInput = {
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      phone: regPhone.trim(),
      role: regRole,
      village: regVillage.trim(),
      district: regDistrict.trim(),
      state: regState.trim(),
      landSizeAcres: regRole === 'farmer' ? regLandAcres : undefined,
      businessName: regBusinessName.trim() || undefined,
    };
    const result = await register(input);
    if (result.success) {
      onClose();
    }
  };

  const handleRoleQuickSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    onClose();
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setRuntimeSupabaseConfig(customUrl, customKey);
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
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl mb-5 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => { clearAuthError(); setTab('profile'); }}
          className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg transition-all text-center ${
            tab === 'profile' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Active Profile
        </button>
        <button
          onClick={() => { clearAuthError(); setTab('switch'); }}
          className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-lg transition-all text-center ${
            tab === 'switch' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Switch Persona
        </button>
        <button
          onClick={() => { clearAuthError(); setTab('login'); }}
          className={`flex-1 min-w-[60px] py-1.5 px-2 rounded-lg transition-all text-center ${
            tab === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => { clearAuthError(); setTab('register'); }}
          className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg transition-all text-center ${
            tab === 'register' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Register
        </button>
        <button
          onClick={() => { clearAuthError(); setTab('supabase'); }}
          className={`flex-1 min-w-[75px] py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
            tab === 'supabase' ? 'bg-white shadow text-emerald-900 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Database className="w-3 h-3 text-emerald-700" />
          <span>Database</span>
        </button>
      </div>

      {/* Auth Error Banner */}
      {authError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Authentication Notice:</span> {authError}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          TAB 1: ACTIVE PROFILE
      ---------------------------------------------------------------------- */}
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

          <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              Supabase Status:
            </span>
            <span className="font-bold">
              {isSupabaseConfigured ? '✓ Connected to Cloud DB' : 'Offline / Local Persistence'}
            </span>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setTab('switch')}>
              Switch Role
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                await logout();
                onClose();
              }}
              isLoading={isAuthLoading}
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          TAB 2: PERSONA SWITCHER
      ---------------------------------------------------------------------- */}
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

      {/* ---------------------------------------------------------------------
          TAB 3: LOGIN (Supabase Auth Email + Password / Mobile Phone)
      ---------------------------------------------------------------------- */}
      {tab === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Email or Mobile Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={loginEmailOrPhone}
                onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                placeholder="kisan@mandimitra.ai or 9826144520"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Select Desired Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="farmer">Farmer (किसान)</option>
              <option value="buyer">Buyer / Trader / Processor</option>
              <option value="fpo">FPO Coordinator</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-900">
            {isSupabaseConfigured
              ? '✓ Supabase Authentication active with session persistence.'
              : '⚡ Local & Demo Auth Mode active.'}
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={isAuthLoading}>
            Sign In with Supabase
          </Button>

          <p className="text-center text-gray-500 text-[11px]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setTab('register')}
              className="text-emerald-700 font-bold hover:underline"
            >
              Create Account
            </button>
          </p>
        </form>
      )}

      {/* ---------------------------------------------------------------------
          TAB 4: REGISTER (Supabase Auth User + profiles table)
      ---------------------------------------------------------------------- */}
      {tab === 'register' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="e.g. Rameshwar Patidar"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="kisan@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="+91 98261 44520"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Account Password (min. 6 chars)</label>
            <input
              type="password"
              required
              minLength={6}
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="Create secure password"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Platform Role</label>
            <select
              value={regRole}
              onChange={(e) => setRegRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              <option value="farmer">Farmer (किसान)</option>
              <option value="buyer">Buyer / Trader / Processor</option>
              <option value="fpo">FPO Coordinator</option>
              <option value="admin">Platform Administrator</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Village / Town</label>
              <input
                type="text"
                value={regVillage}
                onChange={(e) => setRegVillage(e.target.value)}
                className="w-full px-2.5 py-2 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">District</label>
              <input
                type="text"
                value={regDistrict}
                onChange={(e) => setRegDistrict(e.target.value)}
                className="w-full px-2.5 py-2 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={regState}
                onChange={(e) => setRegState(e.target.value)}
                className="w-full px-2.5 py-2 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          {regRole === 'farmer' && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Land Size (Acres)</label>
              <input
                type="number"
                step="0.5"
                value={regLandAcres}
                onChange={(e) => setRegLandAcres(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl"
              />
            </div>
          )}

          {(regRole === 'buyer' || regRole === 'fpo') && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Business / FPO Legal Name</label>
              <input
                type="text"
                value={regBusinessName}
                onChange={(e) => setRegBusinessName(e.target.value)}
                placeholder="e.g. Malwa Agro Oils Ltd"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl"
              />
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isAuthLoading}>
            Register in Supabase Authentication
          </Button>
        </form>
      )}

      {/* ---------------------------------------------------------------------
          TAB 5: SUPABASE DATABASE CONFIGURATION & STATUS
      ---------------------------------------------------------------------- */}
      {tab === 'supabase' && (
        <form onSubmit={handleSaveSupabaseConfig} className="space-y-4 text-xs">
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800">Connection Status:</span>
              <span className={`px-2 py-0.5 rounded-full font-bold ${
                isSupabaseConfigured
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {isSupabaseConfigured ? '✓ Connected' : 'Waiting for Credentials'}
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Mandi Mitra AI connects directly to your Supabase PostgreSQL database using the official client library.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              NEXT_PUBLIC_SUPABASE_URL
            </label>
            <input
              type="url"
              required
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or Anon Key)
            </label>
            <input
              type="password"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
            />
            <span className="text-[10px] text-gray-400 block mt-1">
              Found in your Supabase Dashboard: Project Settings &rarr; API &rarr; Project API keys (anon / publishable).
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" variant="primary" className="flex-1">
              Save & Reconnect
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRuntimeSupabaseConfig('', '');
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
