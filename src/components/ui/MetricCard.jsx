import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './Card';

export function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  trend,
  className,
  ...props
}) {
  const changeColors = {
    positive: 'text-success',
    negative: 'text-critical',
    neutral: 'text-text-muted'
  };

  const changeIcons = {
    positive: '↗',
    negative: '↘',
    neutral: '→'
  };

  return (
    <Card
      className={`hover-lift ${className}`}
      {...props}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <motion.div
                className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <span className="text-xl">{icon}</span>
              </motion.div>
            )}
            <div>
              <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
            </div>
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-medium ${changeColors[changeType]}`}>
              <span>{changeIcons[changeType]}</span>
              <span>{change}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <motion.div
            className="text-3xl font-bold text-text-primary"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            {value}
          </motion.div>

          {trend && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-surface-hover rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent to-accent-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${trend}%` }}
                  transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs text-text-muted">{trend}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricGrid({ children, className, ...props }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
