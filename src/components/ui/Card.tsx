import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', size = 'md', hover = false, clickable = false, children, ...props }, ref) => {
    const baseClasses = [
      'bg-white dark:bg-secondary-800',
      'transition-all duration-200',
      'gpu-accelerated',
    ];

    const variantClasses = {
      default: [
        'border border-secondary-200 dark:border-secondary-700',
        'shadow-sm',
      ],
      outlined: [
        'border-2 border-secondary-300 dark:border-secondary-600',
      ],
      elevated: [
        'border border-secondary-200 dark:border-secondary-700',
        'shadow-lg',
      ],
      filled: [
        'bg-secondary-50 dark:bg-secondary-900',
        'border border-secondary-200 dark:border-secondary-700',
      ],
    };

    const sizeClasses = {
      sm: 'rounded-md',
      md: 'rounded-lg',
      lg: 'rounded-xl',
    };

    const interactionClasses = {
      hover: hover && [
        'hover:shadow-md hover:-translate-y-0.5',
        'hover:border-secondary-300 dark:hover:border-secondary-600',
      ],
      clickable: clickable && [
        'cursor-pointer',
        'active:translate-y-0 active:shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      ],
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          hover && interactionClasses.hover,
          clickable && interactionClasses.clickable,
          className
        )}
        tabIndex={clickable ? 0 : undefined}
        role={clickable ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between',
          'p-6 pb-0',
          className
        )}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {action && (
          <div className="flex-shrink-0 ml-4">
            {action}
          </div>
        )}
      </div>
    );
  }
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'p-6',
          'text-secondary-700 dark:text-secondary-300',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-6 py-4',
          'border-t border-secondary-200 dark:border-secondary-700',
          'bg-secondary-50 dark:bg-secondary-900/50',
          'rounded-b-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
export default Card;
