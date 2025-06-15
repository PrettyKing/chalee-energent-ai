import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'flushed';
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      inputSize = 'md',
      disabled,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const baseClasses = [
      'w-full transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-secondary-400',
    ];

    const variantClasses = {
      default: [
        'border border-secondary-300 rounded-md bg-white',
        'focus:border-primary-500 focus:ring-primary-500',
        'dark:bg-secondary-900 dark:border-secondary-600',
        'dark:focus:border-primary-400 dark:focus:ring-primary-400',
        hasError && 'border-error-500 focus:border-error-500 focus:ring-error-500',
      ],
      filled: [
        'border-0 rounded-md bg-secondary-100',
        'focus:bg-white focus:ring-primary-500',
        'dark:bg-secondary-800 dark:focus:bg-secondary-900',
        hasError && 'bg-error-50 focus:bg-error-50 focus:ring-error-500',
      ],
      flushed: [
        'border-0 border-b-2 border-secondary-300 rounded-none bg-transparent',
        'focus:border-primary-500 focus:ring-0',
        'dark:border-secondary-600 dark:focus:border-primary-400',
        hasError && 'border-error-500 focus:border-error-500',
      ],
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-4 text-base',
    };

    const iconSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-2',
              'text-secondary-700 dark:text-secondary-300',
              hasError && 'text-error-600 dark:text-error-400',
              disabled && 'opacity-50'
            )}
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className={cn(
                'absolute inset-y-0 left-0 flex items-center pl-3',
                'text-secondary-400 dark:text-secondary-500',
                hasError && 'text-error-500'
              )}
            >
              <span className={iconSizeClasses[inputSize]}>{leftIcon}</span>
            </div>
          )}

          <input
            ref={ref}
            type={type}
            id={inputId}
            className={cn(
              baseClasses,
              variantClasses[variant],
              sizeClasses[inputSize],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              'text-secondary-900 dark:text-secondary-100',
              className
            )}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div
              className={cn(
                'absolute inset-y-0 right-0 flex items-center pr-3',
                'text-secondary-400 dark:text-secondary-500',
                hasError && 'text-error-500'
              )}
            >
              <span className={iconSizeClasses[inputSize]}>{rightIcon}</span>
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-error-600 dark:text-error-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-2 text-sm text-secondary-500 dark:text-secondary-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
