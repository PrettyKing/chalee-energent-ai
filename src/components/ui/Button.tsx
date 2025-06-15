import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      // Base styles
      'inline-flex items-center justify-center',
      'font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'gpu-accelerated',
    ];

    const variantClasses = {
      primary: [
        'bg-primary-600 text-white shadow-sm',
        'hover:bg-primary-700 hover:shadow-md',
        'focus:ring-primary-500',
        'active:bg-primary-800',
      ],
      secondary: [
        'bg-secondary-100 text-secondary-900 shadow-sm',
        'hover:bg-secondary-200 hover:shadow-md',
        'focus:ring-secondary-500',
        'active:bg-secondary-300',
        'dark:bg-secondary-800 dark:text-secondary-100',
        'dark:hover:bg-secondary-700',
      ],
      outline: [
        'border border-secondary-300 bg-transparent text-secondary-700',
        'hover:bg-secondary-50 hover:border-secondary-400',
        'focus:ring-secondary-500',
        'active:bg-secondary-100',
        'dark:border-secondary-600 dark:text-secondary-300',
        'dark:hover:bg-secondary-800 dark:hover:border-secondary-500',
      ],
      ghost: [
        'bg-transparent text-secondary-700',
        'hover:bg-secondary-100 hover:text-secondary-900',
        'focus:ring-secondary-500',
        'active:bg-secondary-200',
        'dark:text-secondary-300 dark:hover:bg-secondary-800 dark:hover:text-secondary-100',
      ],
      destructive: [
        'bg-error-600 text-white shadow-sm',
        'hover:bg-error-700 hover:shadow-md',
        'focus:ring-error-500',
        'active:bg-error-800',
      ],
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
      md: 'h-10 px-4 text-sm rounded-md gap-2',
      lg: 'h-11 px-6 text-base rounded-lg gap-2',
      xl: 'h-12 px-8 text-base rounded-lg gap-3',
    };

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          isLoading && 'cursor-wait',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
