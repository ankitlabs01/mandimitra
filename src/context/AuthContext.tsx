'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/lib/types';
import { INITIAL_USER } from '@/lib/mockData';
import { getStorageItem, setStorageItem } from '@/lib/storage';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  login: (phone: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isFarmer: boolean;
  isBuyer: boolean;
  isFPO: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    return getStorageItem<UserProfile>('active_user', INITIAL_USER);
  });

  useEffect(() => {
    if (user) {
      setStorageItem('active_user', user);
    }
  }, [user]);

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    let updatedProfile = { ...user, role: newRole };
    
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
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  const login = (phone: string, role: UserRole) => {
    const newUser: UserProfile = {
      ...INITIAL_USER,
      phone,
      role,
      verified: true,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
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
        logout,
        isAuthenticated,
        isAdmin,
        isFarmer,
        isBuyer,
        isFPO,
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
