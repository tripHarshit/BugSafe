import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Copy, FileText, Plus, Minus } from 'lucide-react';

export const DiffViewer = ({ file, onBack, onExport, onCopy }) => {
  if (!file) return null;

  const formatDiff = (patch) => {
    if (!patch) return [];
    
    return patch.split('\n').map((line, index) => {
      const lineNumber = index + 1;
      const isAddition = line.startsWith('+');
      const isDeletion = line.startsWith('-');
      const isContext = !isAddition && !isDeletion;
      
      let className = 'font-mono text-sm py-1 px-3';
      if (isAddition) {
        className += ' bg-green-500/10 text-green-400 border-l-4 border-green-500/50';
      } else if (isDeletion) {
        className += ' bg-red-500/10 text-red-400 border-l-4 border-red-500/50';
      } else {
        className += ' text-muted-foreground border-l-4 border-transparent';
      }
      
      return (
        <div key={index} className={`flex ${className}`}>
          <span className="w-16 text-right pr-4 text-xs text-muted-foreground select-none font-mono">
            {lineNumber}
          </span>
          <span className="flex-1 font-mono">
            {isAddition && <Plus className="inline h-3 w-3 text-green-400 mr-2" />}
            {isDeletion && <Minus className="inline h-3 w-3 text-red-400 mr-2" />}
            {line}
          </span>
        </div>
      );
    });
  };

  const generateReport = () => {
    let report = `File: ${file.filename}\n`;
    report += `Status: ${file.status}\n`;
    report += `Changes: +${file.additions} -${file.deletions}\n\n`;
    
    if (file.bugAnalysis) {
      report += `=== BUG ANALYSIS ===\n${file.bugAnalysis}\n\n`;
    }
    
    if (file.vulnerabilityAnalysis) {
      report += `=== SECURITY VULNERABILITIES ===\n${file.vulnerabilityAnalysis}\n\n`;
    }
    
    if (file.autoFixRecommendations) {
      report += `=== AUTO-FIX RECOMMENDATIONS ===\n${file.autoFixRecommendations}\n\n`;
    }
    
    report += `=== CODE CHANGES ===\n${file.patch || 'No patch content available'}`;
    
    return report;
  };

  const handleExport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.filename.replace(/[^a-zA-Z0-9.-]/g, '_')}_analysis.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onExport && onExport();
  };

  const handleCopy = async () => {
    try {
      const report = generateReport();
      await navigator.clipboard.writeText(report);
      onCopy && onCopy();
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
    >
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Analysis
              </motion.button>
              
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-xl font-semibold">{file.filename}</h1>
                  <p className="text-sm text-muted-foreground">
                    {file.status} • +{file.additions} -{file.deletions} changes
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Copy className="h-4 w-4" />
                Copy Report
              </motion.button>
              
              <motion.button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="h-4 w-4" />
                Download TXT
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analysis Results */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            
            {file.bugAnalysis && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel rounded-xl p-6 border border-yellow-500/20"
              >
                <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                  🐛 Bug Analysis
                </h3>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {file.bugAnalysis}
                  </pre>
                </div>
              </motion.div>
            )}
            
            {file.vulnerabilityAnalysis && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel rounded-xl p-6 border border-red-500/20"
              >
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                  🔒 Security Vulnerabilities
                </h3>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {file.vulnerabilityAnalysis}
                  </pre>
                </div>
              </motion.div>
            )}
            
            {file.autoFixRecommendations && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel rounded-xl p-6 border border-green-500/20"
              >
                <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                  🔧 Auto-Fix Recommendations
                </h3>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {file.autoFixRecommendations}
                  </pre>
                </div>
              </motion.div>
            )}
          </div>

          {/* Code Diff */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Code Changes</h2>
            
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {file.filename}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-green-400" />
                      {file.additions}
                    </span>
                    <span className="flex items-center gap-1">
                      <Minus className="h-3 w-3 text-red-400" />
                      {file.deletions}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {file.patch ? (
                  <div className="font-mono text-sm">
                    {formatDiff(file.patch)}
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
      </div>
    </motion.div>
  );
};
