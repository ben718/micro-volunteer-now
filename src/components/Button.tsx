import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variants = {
    primary: 'bg-vs-blue-primary text-white hover:bg-vs-blue-dark focus:ring-vs-blue-primary',
    secondary: 'bg-vs-gray-100 text-vs-gray-900 hover:bg-vs-gray-200 focus:ring-vs-gray-500',
    outline: 'border border-vs-gray-300 text-vs-gray-700 hover:bg-vs-gray-50 focus:ring-vs-blue-primary',
    success: 'bg-vs-green-secondary text-white hover:bg-vs-green-dark focus:ring-vs-green-secondary',
    error: 'bg-vs-error text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const width = fullWidth ? 'w-full' : '';
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
} 