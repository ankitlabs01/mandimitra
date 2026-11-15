'use client';

import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  bordered = true,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-200',
        bordered && 'border border-gray-100',
        hoverEffect && 'hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
