import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

const variants = {
  primary: 'bg-gradient-to-r from-accent to-accent-purple text-white hover:shadow-glow-strong hover:scale-[1.02] active:scale-[0.99] transition-transform duration-200',
  secondary: 'bg-surface border border-border text-text-primary hover:bg-surface-hover hover:shadow-glow transition-colors duration-200',
  ghost: 'text-text-primary hover:bg-surface-hover transition-colors duration-200',
  outline: 'border border-accent text-accent hover:bg-accent/10 transition-colors duration-200'
};

const sizeVariants = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  ...props
}) {
  const baseClasses = classNames(
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed',
    variants[variant],
    sizeVariants[size],
    className
  );

  const content = (
    <>
      {loading && (
        <motion.div
          className="mr-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </motion.div>
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  return (
    <motion.button
      className={baseClasses}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {content}
    </motion.button>
  );
}
