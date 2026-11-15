'use client';

import React, { useState } from 'react';
import { Bell, Check, TrendingUp, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = [
    {
      id: 1,
      title: 'New High Offer Received!',
      desc: 'Malwa Agro offered ₹5,120/qtl for your 85 Qtl Soybean lot with free farm pickup.',
      time: '12m ago',
      icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
      unread: true,
    },
    {
      id: 2,
      title: 'Mandi Price Spike Alert',
      desc: 'Garlic price surged +4.8% at Mandsaur Mandi reaching modal ₹16,200/qtl.',
      time: '1h ago',
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
      unread: true,
    },
    {
      id: 3,
      title: 'Weather Warning: Rain Predicted',
      desc: 'Light rain expected Wednesday. Shift sun-drying lots to covered shed.',
      time: '3h ago',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      unread: true,
    },
    {
      id: 4,
      title: 'Buyer Verification Complete',
      desc: 'Gujarat Agro Exporters Surat has been verified with GSTIN & Mandi License.',
      time: 'Yesterday',
      icon: <ShieldCheck className="w-4 h-4 text-sky-600" />,
      unread: false,
    },
  ];

  const markAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-mandi-dark hover:bg-emerald-50 rounded-xl transition-colors"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-900">Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="amber" size="sm">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 hover:bg-gray-50/80 transition-colors cursor-pointer flex gap-3 ${
                    n.unread ? 'bg-emerald-50/20' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 shrink-0 self-start">
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-gray-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {n.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 text-center border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-900 font-medium py-1"
              >
                Close notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
