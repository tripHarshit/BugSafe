import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

const badgeVariants = {
  default: 'bg-surface border border-border text-text-primary',
  primary: 'bg-accent/10 text-accent border-accent/20',
  secondary: 'bg-text-muted/10 text-text-muted border-text-muted/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-critical/10 text-critical border-critical/20',
  info: 'bg-info/10 text-info border-info/20'
};

const sizeVariants = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base'
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  icon,
  pulse = false,
  ...props
}) {
  const baseClasses = classNames(
    'inline-flex items-center gap-1.5 rounded-full font-medium border transition-colors',
    badgeVariants[variant],
    sizeVariants[size],
    {
      'animate-pulse': pulse
    },
    className
  );

  return (
    <motion.span
      className={baseClasses}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {children}
    </motion.span>
  );
}

// Specialized badge components
export function SeverityBadge({ severity, ...props }) {
  const severityMap = {
    critical: { variant: 'danger', icon: '🔴' },
    high: { variant: 'danger', icon: '🟠' },
    medium: { variant: 'warning', icon: '🟡' },
    low: { variant: 'success', icon: '🟢' }
  };

  const config = severityMap[severity] || { variant: 'default', icon: '⚪' };

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      {...props}
    >
      {severity}
    </Badge>
  );
}

export function TypeBadge({ type, ...props }) {
  const typeMap = {
    bug: { variant: 'danger', icon: '🐛' },
    security: { variant: 'danger', icon: '🔒' },
    performance: { variant: 'warning', icon: '⚡' },
    feature: { variant: 'success', icon: '✨' },
    refactor: { variant: 'info', icon: '🔧' }
  };

  const config = typeMap[type] || { variant: 'default', icon: '📝' };

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      {...props}
    >
      {type}
    </Badge>
  );
}

export function StatusBadge({ status, ...props }) {
  const statusMap = {
    open: { variant: 'success', icon: '🟢' },
    closed: { variant: 'secondary', icon: '🔴' },
    merged: { variant: 'primary', icon: '🔗' },
    draft: { variant: 'warning', icon: '📝' }
  };

  const config = statusMap[status] || { variant: 'default', icon: '⚪' };

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      {...props}
    >
      {status}
    </Badge>
  );
}
