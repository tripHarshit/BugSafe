import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, Loader2, FileText, Bug, Shield, Wrench } from 'lucide-react';

export const AgentTraceTimeline = ({ analysisHistory, currentStep }) => {
  const [expandedSteps, setExpandedSteps] = useState({});

  const toggleStep = (stepId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const getStepIcon = (step) => {
    switch (step.type) {
      case 'pr_fetch':
        return <FileText className="h-4 w-4" />;
      case 'bug_analysis':
        return <Bug className="h-4 w-4" />;
      case 'vulnerability_scan':
        return <Shield className="h-4 w-4" />;
      case 'auto_fix':
        return <Wrench className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStepColor = (step) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'error':
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'running':
        return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      default:
        return 'text-muted-foreground border-muted-foreground/30 bg-muted/10';
    }
  };

  const getStepStatusIcon = (step) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStepDuration = (step) => {
    if (!step.startTime || !step.endTime) return '';
    const duration = new Date(step.endTime) - new Date(step.startTime);
    return `${Math.round(duration / 1000)}s`;
  };

  if (!analysisHistory || analysisHistory.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="glass-panel rounded-2xl p-8 text-center">
          <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Analysis History</h3>
          <p className="text-muted-foreground">
            Analysis steps will appear here as you run different types of analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="glass-panel rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Agent Trace Timeline</h3>
        </div>

        <div className="space-y-4">
          {analysisHistory.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`border rounded-lg p-4 ${getStepColor(step)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/20">
                    {getStepIcon(step)}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">{step.title}</h4>
                    <p className="text-sm opacity-80">{step.description}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span>Started: {formatTimestamp(step.startTime)}</span>
                      {step.endTime && (
                        <span>Duration: {getStepDuration(step)}</span>
                      )}
                      {step.file && (
                        <span className="font-mono">{step.file}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStepStatusIcon(step)}
                  
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expandedSteps[step.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Step Details */}
              <AnimatePresence>
                {expandedSteps[step.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="bg-muted/20 rounded-lg p-4">
                      {step.details && (
                        <div className="mb-3">
                          <h5 className="font-medium mb-2">Details:</h5>
                          <p className="text-sm">{step.details}</p>
                        </div>
                      )}
                      
                      {step.error && (
                        <div className="mb-3">
                          <h5 className="font-medium text-red-400 mb-2">Error:</h5>
                          <p className="text-sm text-red-300">{step.error}</p>
                        </div>
                      )}
                      
                      {step.results && (
                        <div>
                          <h5 className="font-medium mb-2">Results:</h5>
                          <pre className="text-sm whitespace-pre-wrap font-sans bg-muted/30 p-3 rounded">
                            {step.results}
                          </pre>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Current Step Indicator */}
        {currentStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <div>
                <h4 className="font-semibold text-primary">Currently Running</h4>
                <p className="text-sm text-primary/80">{currentStep.title}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Missing import
const ChevronRight = ({ className }) => <div className={className}>▶</div>;
const ChevronDown = ({ className }) => <div className={className}>▼</div>;
