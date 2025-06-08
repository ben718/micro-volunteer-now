import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, icon, className = '', ...props }, ref) => {
    const baseStyles = 'appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-vs-gray-500 text-vs-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors sm:text-sm';
    const errorStyles = error ? 'border-vs-error focus:border-vs-error focus:ring-vs-error' : 'border-vs-gray-300 focus:border-vs-blue-primary focus:ring-vs-blue-primary';
    const width = fullWidth ? 'w-full' : '';

    return (
      <div className={`${width} space-y-1`}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-vs-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`${baseStyles} ${errorStyles} ${icon ? 'pl-10' : ''} ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-vs-error" id={`${props.id}-error`}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-vs-gray-500" id={`${props.id}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 