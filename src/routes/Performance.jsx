import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  Cpu,
  Database,
  HardDrive,
  Network,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

function PerformanceChart({ data, title, color = 'accent' }) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <Card variant="elevated" className="hover-lift">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.label}</span>
                  <span className="font-mono">{item.value}ms</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / maxValue) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BottleneckRadar({ bottlenecks }) {
  return (
    <Card variant="elevated" className="hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Performance Bottlenecks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bottlenecks.map((bottleneck, index) => (
            <motion.div
              key={bottleneck.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors"
            >
              <div className={`w-3 h-3 rounded-full mt-2 ${
                bottleneck.severity === 'critical' ? 'bg-critical' :
                bottleneck.severity === 'high' ? 'bg-warning' :
                'bg-info'
              }`} />
              <div className="flex-1">
                <div className="font-medium">{bottleneck.title}</div>
                <div className="text-sm text-text-secondary">{bottleneck.description}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={bottleneck.severity === 'critical' ? 'danger' : bottleneck.severity === 'high' ? 'warning' : 'info'}>
                    {bottleneck.severity}
                  </Badge>
                  <span className="text-xs text-text-muted">Impact: {bottleneck.impact}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationCard({ recommendation }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover-lift"
    >
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle className="w-5 h-5 text-success" />
            {recommendation.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">{recommendation.description}</p>
            
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                <div className="p-3 bg-surface rounded-lg">
                  <div className="text-sm font-medium mb-2">Implementation:</div>
                  <pre className="text-xs font-mono text-text-secondary whitespace-pre-wrap">
                    {recommendation.implementation}
                  </pre>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-success">Expected improvement:</span>
                  <Badge variant="success">{recommendation.improvement}</Badge>
                </div>
              </motion.div>
            )}
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show Less' : 'Show Details'}
              </Button>
              <Button size="sm">
                Apply Fix
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Performance() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: mockApi.getPerformanceMetrics
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-surface rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-3xl font-bold gradient-text">Performance Analysis</h1>
        <p className="text-text-secondary max-w-2xl">
          Monitor and optimize your application's performance with AI-powered insights and automated recommendations.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card variant="elevated" className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
                <div className="text-sm text-text-secondary">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics.throughput}</div>
                <div className="text-sm text-text-secondary">Requests/sec</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics.cpuUsage}%</div>
                <div className="text-sm text-text-secondary">CPU Usage</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-info" />
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics.memoryUsage}%</div>
                <div className="text-sm text-text-secondary">Memory Usage</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <PerformanceChart
          title="Response Time by Endpoint"
          data={metrics.responseTimeByEndpoint}
          color="accent"
        />
        <PerformanceChart
          title="Memory Usage Over Time"
          data={metrics.memoryUsageOverTime}
          color="info"
        />
      </motion.div>

      {/* Bottlenecks and Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <BottleneckRadar bottlenecks={metrics.bottlenecks} />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Optimization Recommendations</h3>
          {metrics.recommendations.map((recommendation, index) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Button size="lg" className="glow-border">
          <Zap className="w-5 h-5 mr-2" />
          Run Performance Test
        </Button>
        <Button variant="outline" size="lg">
          <TrendingUp className="w-5 h-5 mr-2" />
          Generate Report
        </Button>
        <Button variant="outline" size="lg">
          <Info className="w-5 h-5 mr-2" />
          View History
        </Button>
      </motion.div>
    </div>
  );
}
