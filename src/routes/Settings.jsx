import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Bell,
  Zap,
  Shield,
  Palette,
  Github,
  Slack,
  Mail,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react';

function Toggle({ label, description, checked, onChange, icon }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-surface-hover transition-colors">
      <div className="flex items-center gap-3">
        {icon && <div className="text-accent">{icon}</div>}
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-sm text-text-secondary">{description}</div>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-accent' : 'bg-surface'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function Slider({ label, value, onChange, min = 0, max = 100, step = 1, unit = '' }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-medium">{label}</label>
        <span className="text-sm text-text-secondary">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );
}

function IntegrationCard({ integration }) {
  const [isConnected, setIsConnected] = useState(integration.connected);
  
  return (
    <Card variant="elevated" className="hover-lift">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
              {integration.icon}
            </div>
            <div>
              <div className="font-medium">{integration.name}</div>
              <div className="text-sm text-text-secondary">{integration.description}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'success' : 'warning'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            <Button
              size="sm"
              variant={isConnected ? 'outline' : 'default'}
              onClick={() => setIsConnected(!isConnected)}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // AI Settings
    autoAnalysis: true,
    securityScanning: true,
    performanceMonitoring: true,
    codeQualityChecks: true,
    aiConfidence: 85,
    maxAnalysisTime: 30,
    
    // Notifications
    emailNotifications: true,
    slackNotifications: false,
    securityAlerts: true,
    performanceAlerts: true,
    weeklyReports: false,
    
    // Appearance
    darkMode: true,
    reducedMotion: false,
    compactMode: false,
    showAnimations: true,
    
    // Integrations
    githubIntegration: true,
    slackIntegration: false,
    emailIntegration: true
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const integrations = [
    {
      name: 'GitHub',
      description: 'Connect your repositories for automated analysis',
      icon: <Github className="w-5 h-5" />,
      connected: settings.githubIntegration
    },
    {
      name: 'Slack',
      description: 'Receive notifications and alerts in Slack',
      icon: <Slack className="w-5 h-5" />,
      connected: settings.slackIntegration
    },
    {
      name: 'Email',
      description: 'Get detailed reports and alerts via email',
      icon: <Mail className="w-5 h-5" />,
      connected: settings.emailIntegration
    }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-text-secondary max-w-2xl">
          Configure BugSafe to match your workflow and preferences. All settings are automatically saved.
        </p>
      </motion.div>

      {/* AI Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-accent" />
              AI Analysis Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Toggle
                label="Automatic Analysis"
                description="Automatically analyze new pull requests"
                checked={settings.autoAnalysis}
                onChange={() => updateSetting('autoAnalysis', !settings.autoAnalysis)}
                icon={<Zap className="w-4 h-4" />}
              />
              <Toggle
                label="Security Scanning"
                description="Enable security vulnerability detection"
                checked={settings.securityScanning}
                onChange={() => updateSetting('securityScanning', !settings.securityScanning)}
                icon={<Shield className="w-4 h-4" />}
              />
              <Toggle
                label="Performance Monitoring"
                description="Monitor and analyze performance metrics"
                checked={settings.performanceMonitoring}
                onChange={() => updateSetting('performanceMonitoring', !settings.performanceMonitoring)}
                icon={<Zap className="w-4 h-4" />}
              />
              <Toggle
                label="Code Quality Checks"
                description="Run automated code quality analysis"
                checked={settings.codeQualityChecks}
                onChange={() => updateSetting('codeQualityChecks', !settings.codeQualityChecks)}
                icon={<SettingsIcon className="w-4 h-4" />}
              />
            </div>
            
            <div className="space-y-4">
              <Slider
                label="AI Confidence Threshold"
                value={settings.aiConfidence}
                onChange={(value) => updateSetting('aiConfidence', value)}
                min={50}
                max={100}
                unit="%"
              />
              <Slider
                label="Maximum Analysis Time"
                value={settings.maxAnalysisTime}
                onChange={(value) => updateSetting('maxAnalysisTime', value)}
                min={10}
                max={60}
                unit=" minutes"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Toggle
                label="Email Notifications"
                description="Receive notifications via email"
                checked={settings.emailNotifications}
                onChange={() => updateSetting('emailNotifications', !settings.emailNotifications)}
                icon={<Mail className="w-4 h-4" />}
              />
              <Toggle
                label="Slack Notifications"
                description="Send alerts to Slack channels"
                checked={settings.slackNotifications}
                onChange={() => updateSetting('slackNotifications', !settings.slackNotifications)}
                icon={<Slack className="w-4 h-4" />}
              />
              <Toggle
                label="Security Alerts"
                description="Get notified about security issues"
                checked={settings.securityAlerts}
                onChange={() => updateSetting('securityAlerts', !settings.securityAlerts)}
                icon={<Shield className="w-4 h-4" />}
              />
              <Toggle
                label="Performance Alerts"
                description="Receive performance degradation alerts"
                checked={settings.performanceAlerts}
                onChange={() => updateSetting('performanceAlerts', !settings.performanceAlerts)}
                icon={<Zap className="w-4 h-4" />}
              />
              <Toggle
                label="Weekly Reports"
                description="Get weekly summary reports"
                checked={settings.weeklyReports}
                onChange={() => updateSetting('weeklyReports', !settings.weeklyReports)}
                icon={<Download className="w-4 h-4" />}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent" />
              Appearance & Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Toggle
                label="Dark Mode"
                description="Use dark theme (recommended)"
                checked={settings.darkMode}
                onChange={() => updateSetting('darkMode', !settings.darkMode)}
                icon={<Palette className="w-4 h-4" />}
              />
              <Toggle
                label="Reduced Motion"
                description="Disable animations for accessibility"
                checked={settings.reducedMotion}
                onChange={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                icon={<Eye className="w-4 h-4" />}
              />
              <Toggle
                label="Compact Mode"
                description="Use more compact layout"
                checked={settings.compactMode}
                onChange={() => updateSetting('compactMode', !settings.compactMode)}
                icon={<SettingsIcon className="w-4 h-4" />}
              />
              <Toggle
                label="Show Animations"
                description="Enable micro-interactions and transitions"
                checked={settings.showAnimations}
                onChange={() => updateSetting('showAnimations', !settings.showAnimations)}
                icon={<Zap className="w-4 h-4" />}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-accent" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrations.map((integration, index) => (
              <IntegrationCard key={integration.name} integration={integration} />
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-accent" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Settings
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Settings
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </Button>
            </div>
            <div className="text-sm text-text-secondary">
              Export your settings to backup or share with your team. Import settings from a previously exported file.
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex justify-center"
      >
        <Button size="lg" className="glow-border">
          <Save className="w-5 h-5 mr-2" />
          Save All Settings
        </Button>
      </motion.div>
    </div>
  );
}
