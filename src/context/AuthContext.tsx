'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole } from '@/lib/types';
import { INITIAL_USER } from '@/lib/mockData';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/lib/storage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mapProfileFromDb, mapProfileToDb } from '@/lib/supabaseDb';

export interface RegisterInput {
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: UserRole;
  village?: string;
  district?: string;
  state?: string;
  landSizeAcres?: number;
  businessName?: string;
  buyerCategory?: UserProfile['buyerCategory'];
  fpoRegistrationNumber?: string;
  fpoMemberCount?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  login: (phoneOrEmail: string, role?: UserRole, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isFarmer: boolean;
  isBuyer: boolean;
  isFPO: boolean;
  isSupabaseReady: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with consistent default user to avoid server/client hydration mismatch
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  // Restore saved session only AFTER mounting on client
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = getStorageItem<UserProfile | null>('active_user', null);
      if (saved && (saved.id !== INITIAL_USER.id || saved.role !== INITIAL_USER.role)) {
        setUser(saved);
      }
    } catch (e) {
      console.warn('Error restoring user session:', e);
    }
  }, []);

  // Sync to local storage for instant offline resilience only after mounting
  useEffect(() => {
    if (isMounted && user) {
      setStorageItem('active_user', user);
    }
  }, [user, isMounted]);

  // Fetch or create profile in Supabase profiles table
  const fetchSupabaseProfile = useCallback(async (userId: string, defaultEmail?: string) => {
    if (!supabase || !isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Supabase profile fetch error:', error);
      }

      if (data) {
        return mapProfileFromDb(data);
      }

      // If user exists in Auth but has no profile row yet, create one
      const newProfile: UserProfile = {
        ...INITIAL_USER,
        id: userId,
        email: defaultEmail || INITIAL_USER.email,
        createdAt: new Date().toISOString(),
      };

      await supabase.from('profiles').upsert(mapProfileToDb(newProfile, userId));
      return newProfile;
    } catch (err) {
      console.warn('Error fetching Supabase profile:', err);
      return null;
    }
  }, []);

  // Supabase Auth Session Persistence & Listener
  useEffect(() => {
    let mounted = true;

    if (!supabase || !isSupabaseConfigured) {
      return;
    }

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const profile = await fetchSupabaseProfile(session.user.id, session.user.email);
          if (profile && mounted) {
            setUser(profile);
          }
        }
      } catch (err) {
        console.warn('Supabase session initialization warning:', err);
      }
    };

    initSession();

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchSupabaseProfile(session.user.id, session.user.email);
          if (profile && mounted) {
            setUser(profile);
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            // preserve mock persona or clean state
            setUser(null);
            removeStorageItem('active_user');
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchSupabaseProfile]);

  // ---------------------------------------------------------------------------
  // User Registration through Supabase Auth + profiles table
  // ---------------------------------------------------------------------------
  const register = async (data: RegisterInput): Promise<{ success: boolean; error?: string }> => {
    setIsAuthLoading(true);
    setAuthError(null);

    const email = data.email.trim().toLowerCase();
    const password = data.password || 'MandiMitra@2026';

    try {
      if (supabase && isSupabaseConfigured) {
        // 1. Sign up with Supabase Auth
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: data.name,
              phone: data.phone,
              role: data.role,
              village: data.village || '',
              district: data.district || 'Indore',
              state: data.state || 'Madhya Pradesh',
              land_size_acres: data.landSizeAcres,
              business_name: data.businessName,
              buyer_category: data.buyerCategory,
              fpo_registration_number: data.fpoRegistrationNumber,
              fpo_member_count: data.fpoMemberCount,
            },
          },
        });

        if (signUpError) {
          setAuthError(signUpError.message);
          setIsAuthLoading(false);
          return { success: false, error: signUpError.message };
        }

        const userId = authData.user?.id || `user-${Date.now()}`;

        // 2. Insert profile record into public.profiles
        const newProfile: UserProfile = {
          id: userId,
          name: data.name,
          email,
          phone: data.phone,
          role: data.role,
          language: 'hi',
          village: data.village || 'Datoda',
          district: data.district || 'Indore',
          state: data.state || 'Madhya Pradesh',
          landSizeAcres: data.landSizeAcres || (data.role === 'farmer' ? 10 : undefined),
          businessName: data.businessName,
          buyerCategory: data.buyerCategory,
          fpoRegistrationNumber: data.fpoRegistrationNumber,
          fpoMemberCount: data.fpoMemberCount,
          verified: true,
          trustScore: 92,
          createdAt: new Date().toISOString(),
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(mapProfileToDb(newProfile, userId));

        if (profileError) {
          console.warn('Profile record insert warning:', profileError);
        }

        setUser(newProfile);
        setIsAuthLoading(false);
        return { success: true };
      } else {
        // Local fallback mode
        const localProfile: UserProfile = {
          id: `local-${Date.now()}`,
          name: data.name,
          email,
          phone: data.phone,
          role: data.role,
          language: 'hi',
          village: data.village || 'Datoda',
          district: data.district || 'Indore',
          state: data.state || 'Madhya Pradesh',
          landSizeAcres: data.landSizeAcres,
          businessName: data.businessName,
          buyerCategory: data.buyerCategory,
          fpoRegistrationNumber: data.fpoRegistrationNumber,
          fpoMemberCount: data.fpoMemberCount,
          verified: true,
          trustScore: 90,
          createdAt: new Date().toISOString(),
        };
        setUser(localProfile);
        setIsAuthLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      const msg = err.message || 'Registration failed';
      setAuthError(msg);
      setIsAuthLoading(false);
      return { success: false, error: msg };
    }
  };

  // ---------------------------------------------------------------------------
  // User Login (Email+Password or Phone / Persona)
  // ---------------------------------------------------------------------------
  const login = async (
    phoneOrEmail: string,
    roleOverride?: UserRole,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsAuthLoading(true);
    setAuthError(null);

    const input = phoneOrEmail.trim();
    const isEmail = input.includes('@');

    try {
      if (supabase && isSupabaseConfigured && isEmail && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: input,
          password,
        });

        if (error) {
          setAuthError(error.message);
          setIsAuthLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const profile = await fetchSupabaseProfile(data.user.id, data.user.email);
          if (profile) {
            setUser(profile);
          }
        }
        setIsAuthLoading(false);
        return { success: true };
      }

      // Fast Persona or Phone Login
      const targetRole = roleOverride || 'farmer';
      let targetProfile: UserProfile = {
        ...INITIAL_USER,
        phone: input.startsWith('+91') ? input : `+91 ${input}`,
        role: targetRole,
        verified: true,
      };

      if (targetRole === 'buyer') {
        targetProfile = {
          ...targetProfile,
          name: 'Vijay Singhania',
          businessName: 'Malwa Agro Oils & Solvent Ltd',
          buyerCategory: 'processor',
          gstin: '23AABCM9102L1Z9',
        };
      } else if (targetRole === 'fpo') {
        targetProfile = {
          ...targetProfile,
          name: 'Harinarayan Sharma',
          businessName: 'Malwa Kisan Producer Company Ltd',
          fpoRegistrationNumber: 'FPO-MP-IND-2021-084',
          fpoMemberCount: 840,
        };
      } else if (targetRole === 'admin') {
        targetProfile = {
          ...targetProfile,
          name: 'System Administrator (Mandi Mitra Ops)',
        };
      }

      if (supabase && isSupabaseConfigured) {
        // Upsert into Supabase profiles
        try {
          await supabase
            .from('profiles')
            .upsert(mapProfileToDb(targetProfile));
        } catch (err) {
          console.warn('Supabase profile sync warning:', err);
        }
      }

      setUser(targetProfile);
      setIsAuthLoading(false);
      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Login failed';
      setAuthError(msg);
      setIsAuthLoading(false);
      return { success: false, error: msg };
    }
  };

  // ---------------------------------------------------------------------------
  // Sign Out
  // ---------------------------------------------------------------------------
  const logout = async () => {
    setIsAuthLoading(true);
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out error:', e);
      }
    }
    setUser(null);
    removeStorageItem('active_user');
    setIsAuthLoading(false);
  };

  // ---------------------------------------------------------------------------
  // Profile Update (Syncs to Supabase profiles table)
  // ---------------------------------------------------------------------------
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase
          .from('profiles')
          .upsert(mapProfileToDb(updated, user.id));
      } catch (err) {
        console.warn('Error syncing profile update to Supabase:', err);
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Fast Persona Switching
  // ---------------------------------------------------------------------------
  const switchRole = async (newRole: UserRole) => {
    if (!user) return;
    let updatedProfile: UserProfile = { ...user, role: newRole };

    if (newRole === 'buyer') {
      updatedProfile = {
        ...updatedProfile,
        name: 'Vijay Singhania',
        businessName: 'Malwa Agro Oils & Solvent Ltd',
        buyerCategory: 'processor',
        gstin: '23AABCM9102L1Z9',
        verified: true,
      };
    } else if (newRole === 'fpo') {
      updatedProfile = {
        ...updatedProfile,
        name: 'Harinarayan Sharma',
        businessName: 'Malwa Kisan Producer Company Ltd',
        fpoRegistrationNumber: 'FPO-MP-IND-2021-084',
        fpoMemberCount: 840,
        verified: true,
      };
    } else if (newRole === 'admin') {
      updatedProfile = {
        ...updatedProfile,
        name: 'System Administrator (Mandi Mitra Ops)',
        verified: true,
      };
    } else {
      updatedProfile = {
        ...INITIAL_USER,
        role: 'farmer',
      };
    }

    setUser(updatedProfile);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase
          .from('profiles')
          .upsert(mapProfileToDb(updatedProfile));
      } catch (e) {}
    }
  };

  const role = user?.role || 'farmer';
  const isAuthenticated = !!user;
  const isAdmin = role === 'admin';
  const isFarmer = role === 'farmer';
  const isBuyer = role === 'buyer';
  const isFPO = role === 'fpo';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        switchRole,
        updateProfile,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isFarmer,
        isBuyer,
        isFPO,
        isSupabaseReady: isSupabaseConfigured,
        isAuthLoading,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
