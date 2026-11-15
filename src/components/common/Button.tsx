'use client';

import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 shadow-sm',
    md: 'text-sm px-4 py-2.5 gap-2 shadow',
    lg: 'text-base px-6 py-3.5 gap-2.5 shadow-md font-semibold',
  };

  const variantClasses = {
    primary:
      'bg-mandi-dark text-white hover:bg-mandi-medium focus:ring-mandi-dark border border-transparent shadow-mandi-dark/20',
    secondary:
      'bg-mandi-leaf text-white hover:bg-emerald-600 focus:ring-emerald-500 border border-transparent',
    accent:
      'bg-mandi-accent text-emerald-950 hover:bg-amber-400 focus:ring-amber-500 font-bold border border-amber-300',
    outline:
      'bg-white text-gray-700 hover:bg-emerald-50 hover:text-mandi-dark border border-gray-300 focus:ring-mandi-medium',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 border border-transparent',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300 border border-transparent',
  };

  return (
    <button
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
