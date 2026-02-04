import { forwardRef, ButtonHTMLAttributes, ElementType, ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  as?: ElementType;
}

export type ButtonProps<T extends ElementType = 'button'> = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonBaseProps>;

const getButtonClasses = (variant: ButtonVariant, size: ButtonSize) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-dark focus:ring-accent',
    secondary: 'bg-navy-800 text-gray-200 border border-navy-600 hover:bg-navy-700 focus:ring-navy-600',
    ghost: 'text-gray-300 hover:bg-navy-800 hover:text-white focus:ring-navy-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  return cn(baseStyles, variants[variant], sizes[size]);
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, as, ...props }, ref) => {
    const Component = as || 'button';
    const classes = cn(getButtonClasses(variant, size), className);

    if (as) {
      return (
        <Component className={classes} {...props}>
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {children}
        </Component>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
