import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Bug, Shield, Wrench, ChevronRight, ChevronDown } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';

export const FindingsDiffViewer = ({ fileData, selectedFileIndex, onFileSelect }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const { theme } = useTheme();

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const formatCode = (code) => {
    if (!code) return '';
    
    // Basic code formatting for display
    return code
      .split('\n')
      .map((line, index) => {
        const lineNumber = index + 1;
        const isAddition = line.startsWith('+');
        const isDeletion = line.startsWith('-');
        
        let className = 'font-mono text-sm';
        if (isAddition) className += ' bg-green-500/10 text-green-400';
        else if (isDeletion) className += ' bg-red-500/10 text-red-400';
        else className += ' text-muted-foreground';
        
        return (
          <div key={index} className={`flex ${className}`}>
            <span className="w-12 text-right pr-3 text-xs text-muted-foreground select-none">
              {lineNumber}
            </span>
            <span className="flex-1">{line}</span>
          </div>
        );
      });
  };

  const getFindingsSummary = (file) => {
    const findings = [];
    
    if (file.bugAnalysis) {
      findings.push({
        type: 'bug',
        icon: '🐛',
        title: 'Bug Analysis',
        count: file.bugAnalysis.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•')).length,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20'
      });
    }
    
    if (file.vulnerabilityAnalysis) {
      findings.push({
        type: 'vulnerability',
        icon: '🔒',
        title: 'Security Vulnerabilities',
        count: file.vulnerabilityAnalysis.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•')).length,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20'
      });
    }
    
    if (file.autoFixRecommendations) {
      findings.push({
        type: 'fix',
        icon: '🔧',
        title: 'Auto-Fix Recommendations',
        count: file.autoFixRecommendations.split('\n').filter(line => line.trim().startsWith('1.') || line.trim().startsWith('2.')).length,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20'
      });
    }
    
    return findings;
  };

  if (!fileData || fileData.files.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="glass-panel rounded-2xl p-8 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Analysis Results</h3>
          <p className="text-muted-foreground">
            Run bug detection, security scan, or auto-fix analysis to see results here.
          </p>
        </div>
      </div>
    );
  }

  const selectedFile = fileData.files[selectedFileIndex] || fileData.files[0];
  const findings = getFindingsSummary(selectedFile);

  return (
    <div data-findings-viewer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      {/* File Selector */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-4">Analysis Results</h3>
        <div className="flex flex-wrap gap-2">
          {fileData.files.map((file, index) => (
            <motion.button
              key={index}
              onClick={() => onFileSelect(index)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 ${
                selectedFileIndex === index
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted/70'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {file.filename}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Findings Panel */}
        <div className="space-y-6">
          <h4 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Findings Summary
          </h4>
          
          <div className="space-y-4">
            {findings.map((finding, index) => (
              <motion.div
                key={finding.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-panel rounded-xl p-4 border ${finding.borderColor}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{finding.icon}</span>
                    <div>
                      <h5 className={`font-semibold ${finding.color}`}>
                        {finding.title}
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {finding.count} {finding.count === 1 ? 'issue' : 'issues'} found
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleSection(`${selectedFileIndex}-${finding.type}`)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expandedSections[`${selectedFileIndex}-${finding.type}`] ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <AnimatePresence>
                  {expandedSections[`${selectedFileIndex}-${finding.type}`] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`${finding.bgColor} rounded-lg p-3 mt-3`}>
                        <pre className="text-sm whitespace-pre-wrap font-sans">
                          {finding.type === 'bug' && selectedFile.bugAnalysis}
                          {finding.type === 'vulnerability' && selectedFile.vulnerabilityAnalysis}
                          {finding.type === 'fix' && selectedFile.autoFixRecommendations}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Code Diff Panel */}
        <div className="space-y-6">
          <h4 className="text-xl font-semibold flex items-center gap-2">
            <Code className="h-5 w-5" />
            Code Changes
          </h4>
          
          <div className="glass-panel rounded-xl p-6">
            {selectedFile.patch ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {selectedFile.filename}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-green-400" />
                      {selectedFile.additions}
                    </span>
                    <span className="flex items-center gap-1">
                      <Minus className="h-3 w-3 text-red-400" />
                      {selectedFile.deletions}
                    </span>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div className="font-mono text-xs">
                    {formatCode(selectedFile.patch)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No patch content available for this file.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Missing imports
const Code = ({ className }) => <div className={className}>📄</div>;
const Plus = ({ className }) => <div className={className}>+</div>;
const Minus = ({ className }) => <div className={className}>-</div>;
