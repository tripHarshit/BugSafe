import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MetricCard, MetricGrid } from '../components/ui/MetricCard';
import { BackgroundScene } from '../components/three/BackgroundScene';
import { motion } from 'framer-motion';
import {
  GitPullRequest,
  Shield,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';

export function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: mockApi.getDashboardMetrics
  });

  const { data: timeline, isLoading: timelineLoading } = useQuery({
    queryKey: ['activity-timeline'],
    queryFn: mockApi.getActivityTimeline
  });

  const navigate = useNavigate();

  const handleAnalyzeLatest = () => {
    // Navigate to the first PR in the list
    navigate('/pr/1');
  };

  const handleViewAllPRs = () => {
    navigate('/pr');
  };

  const handleSecurityAudit = () => {
    navigate('/security');
  };

  const handlePerformanceReview = () => {
    navigate('/performance');
  };

  if (metricsLoading || timelineLoading) {
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
    <div className="relative min-h-screen">
      <BackgroundScene />
      
      <div className="relative z-10 p-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold gradient-text">
            AI-Powered Code Review & Security Analysis
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Automate code review, performance optimization, and security auditing for GitHub pull requests
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MetricGrid>
            <MetricCard
              title="Active PRs"
              value={metrics.activePRs}
              change="+12%"
              changeType="positive"
              icon={<GitPullRequest className="w-5 h-5" />}
              trend={75}
            />
            <MetricCard
              title="Issues Found"
              value={metrics.issuesFound}
              change="-8%"
              changeType="negative"
              icon={<AlertTriangle className="w-5 h-5" />}
              trend={45}
            />
            <MetricCard
              title="Security Score"
              value={`${metrics.securityScore}%`}
              change="+5%"
              changeType="positive"
              icon={<Shield className="w-5 h-5" />}
              trend={92}
            />
            <MetricCard
              title="Performance"
              value={`${metrics.performanceScore}%`}
              change="+3%"
              changeType="positive"
              icon={<Zap className="w-5 h-5" />}
              trend={88}
            />
          </MetricGrid>
        </motion.div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card variant="elevated" className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metrics.passedChecks}</div>
                  <div className="text-sm text-text-secondary">Passed Checks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metrics.avgReviewTime}</div>
                  <div className="text-sm text-text-secondary">Avg Review Time</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metrics.aiAgents}</div>
                  <div className="text-sm text-text-secondary">AI Agents Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      item.type === 'security' ? 'bg-critical' :
                      item.type === 'performance' ? 'bg-warning' :
                      'bg-success'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-text-secondary">{item.timestamp}</div>
                    </div>
                    <Badge variant={item.type === 'security' ? 'danger' : item.type === 'performance' ? 'warning' : 'success'}>
                      {item.type}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Engine Status */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI Engine Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Code Analysis Agent</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Scanner</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Performance Optimizer</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Vulnerability Detector</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-text-secondary">
                    All systems operational • Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ready to get started?</h2>
            <p className="text-text-secondary max-w-md mx-auto">
              Analyze your latest pull requests or explore our comprehensive security and performance tools.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={handleAnalyzeLatest}
              className="glow-border"
            >
              <GitPullRequest className="w-5 h-5 mr-2" />
              Analyze Latest PR
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleViewAllPRs}
            >
              View All PRs
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleSecurityAudit}
            >
              <Shield className="w-5 h-5 mr-2" />
              Security Audit
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handlePerformanceReview}
            >
              <Zap className="w-5 h-5 mr-2" />
              Performance Review
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
