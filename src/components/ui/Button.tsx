import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-400',
      secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 disabled:bg-zinc-50 disabled:text-zinc-400',
      outline: 'border border-zinc-200 bg-transparent hover:bg-zinc-50 text-zinc-900',
      ghost: 'bg-transparent hover:bg-zinc-100 text-zinc-900',
      destructive: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base font-medium',
      lg: 'px-8 py-4 text-lg font-medium',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 active:scale-[0.98]',
          variants[variant],
          sizes[size],
          loading && 'opacity-70 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
