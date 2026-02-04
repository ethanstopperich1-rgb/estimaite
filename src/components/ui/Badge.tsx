import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-navy-700 text-gray-300',
      secondary: 'bg-navy-800 text-gray-400 border border-navy-600',
      success: 'bg-emerald/20 text-emerald-light border border-emerald/30',
      warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
      info: 'bg-accent/20 text-accent-light border border-accent/30',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
