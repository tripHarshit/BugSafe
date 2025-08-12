import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

export function Card({
  children,
  className,
  variant = 'default',
  hover = false,
  glow = false,
  ...props
}) {
  const variants = {
    default: 'glass',
    elevated: 'bg-surface border border-border shadow-glass',
    ghost: 'bg-transparent'
  };

  const baseClasses = classNames(
    'rounded-xl p-6 transition-all duration-200',
    variants[variant],
    {
      'hover-lift': hover,
      'glow-border': glow
    },
    className
  );

  return (
    <motion.div
      className={baseClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={classNames('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={classNames('text-lg font-semibold text-text-primary', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={classNames('text-sm text-text-secondary', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={classNames('space-y-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={classNames('mt-6 pt-4 border-t border-border', className)} {...props}>
      {children}
    </div>
  );
}
