import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Download,
  Copy,
  ExternalLink,
  TrendingUp
} from 'lucide-react';

function VulnerabilityCard({ vulnerability }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const severityColors = {
    critical: 'bg-critical text-white',
    high: 'bg-warning text-white',
    medium: 'bg-info text-white',
    low: 'bg-success text-white'
  };

  const severityIcons = {
    critical: <XCircle className="w-5 h-5" />,
    high: <AlertTriangle className="w-5 h-5" />,
    medium: <Info className="w-5 h-5" />,
    low: <CheckCircle className="w-5 h-5" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover-lift"
    >
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {severityIcons[vulnerability.severity]}
            <span className="flex-1">{vulnerability.title}</span>
            <Badge variant={vulnerability.severity === 'critical' ? 'danger' : vulnerability.severity === 'high' ? 'warning' : vulnerability.severity === 'medium' ? 'info' : 'success'}>
              {vulnerability.severity}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">{vulnerability.description}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="text-text-muted">CVE:</span>
              <span className="font-mono">{vulnerability.cve}</span>
              <span className="text-text-muted">CVSS:</span>
              <Badge variant={vulnerability.cvss >= 9 ? 'danger' : vulnerability.cvss >= 7 ? 'warning' : 'info'}>
                {vulnerability.cvss}/10
              </Badge>
            </div>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                <div className="p-3 bg-surface rounded-lg">
                  <div className="text-sm font-medium mb-2">Vulnerable Code:</div>
                  <pre className="text-xs font-mono text-text-secondary whitespace-pre-wrap bg-bg p-2 rounded">
                    {vulnerability.vulnerableCode}
                  </pre>
                </div>
                
                <div className="p-3 bg-surface rounded-lg">
                  <div className="text-sm font-medium mb-2">Fix:</div>
                  <pre className="text-xs font-mono text-success whitespace-pre-wrap bg-bg p-2 rounded">
                    {vulnerability.fix}
                  </pre>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-muted">Exploitability:</span>
                  <Badge variant={vulnerability.exploitability === 'High' ? 'danger' : vulnerability.exploitability === 'Medium' ? 'warning' : 'success'}>
                    {vulnerability.exploitability}
                  </Badge>
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
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SecurityMetrics({ metrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card variant="elevated" className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-critical" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.criticalVulns}</div>
              <div className="text-sm text-text-secondary">Critical Vulnerabilities</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated" className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.highVulns}</div>
              <div className="text-sm text-text-secondary">High Risk Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated" className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.securityScore}%</div>
              <div className="text-sm text-text-secondary">Security Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated" className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.scansCompleted}</div>
              <div className="text-sm text-text-secondary">Scans Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SecurityTrends({ trends }) {
  return (
    <Card variant="elevated" className="hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Security Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trends.map((trend, index) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  trend.direction === 'up' ? 'bg-success' : 'bg-critical'
                }`} />
                <div>
                  <div className="font-medium">{trend.title}</div>
                  <div className="text-sm text-text-secondary">{trend.description}</div>
                </div>
              </div>
              <Badge variant={trend.direction === 'up' ? 'success' : 'danger'}>
                {trend.direction === 'up' ? '↗' : '↘'} {trend.change}
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function Security() {
  const { data: securityData, isLoading } = useQuery({
    queryKey: ['security-findings'],
    queryFn: mockApi.getSecurityFindings
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
        <h1 className="text-3xl font-bold gradient-text">Security Analysis</h1>
        <p className="text-text-secondary max-w-2xl">
          Comprehensive security scanning and vulnerability assessment with AI-powered threat detection and automated fix recommendations.
        </p>
      </motion.div>

      {/* Security Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SecurityMetrics metrics={securityData.metrics} />
      </motion.div>

      {/* Security Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <SecurityTrends trends={securityData.trends} />
      </motion.div>

      {/* Vulnerabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Vulnerabilities Found</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-1" />
              View in GitHub
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {securityData.vulnerabilities.map((vulnerability, index) => (
            <VulnerabilityCard key={vulnerability.id} vulnerability={vulnerability} />
          ))}
        </div>
      </motion.div>

      {/* Security Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <Card variant="elevated" className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Security Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityData.recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <div className="font-medium">{rec.title}</div>
                    <div className="text-sm text-text-secondary">{rec.description}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="success">Priority: {rec.priority}</Badge>
                      <span className="text-xs text-text-muted">Impact: {rec.impact}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent" />
              Security Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityData.bestPractices.map((practice, index) => (
                <motion.div
                  key={practice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    practice.status === 'implemented' ? 'bg-success' : 'bg-warning'
                  }`} />
                  <div>
                    <div className="font-medium">{practice.title}</div>
                    <div className="text-sm text-text-secondary">{practice.description}</div>
                    <Badge variant={practice.status === 'implemented' ? 'success' : 'warning'} className="mt-1">
                      {practice.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Button size="lg" className="glow-border">
          <Shield className="w-5 h-5 mr-2" />
          Run Security Scan
        </Button>
        <Button variant="outline" size="lg">
          <Download className="w-5 h-5 mr-2" />
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
