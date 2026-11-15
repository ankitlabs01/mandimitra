'use client';

import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'gray' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'green',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    red: 'bg-rose-50 text-rose-800 border-rose-200',
    blue: 'bg-sky-50 text-sky-800 border-sky-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium rounded-full border',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-full border',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 leading-none select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
