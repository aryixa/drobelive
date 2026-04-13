import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-zinc-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
