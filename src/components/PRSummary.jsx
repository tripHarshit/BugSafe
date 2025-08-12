import React from 'react';
import { motion } from 'framer-motion';
import { Github, User, GitBranch, Calendar, FileText, Plus, Minus, Code, Eye, Bug, Shield, Wrench } from 'lucide-react';
import { Badge } from './ui/Badge';

export const PRSummary = ({ prData, fileData, onAnalyzeFile, onGetAutoFix, analyzingFiles, onViewChanges }) => {
  if (!prData) return null;

  const { owner, repo, prNumber, details } = prData;
  const isMerged = Boolean(details.merged_at);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'merged':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
    >
      {/* PR Header */}
      <div className="glass-panel rounded-2xl p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* PR Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getStatusColor(isMerged ? 'merged' : details.state)}>
                {isMerged ? 'merged' : details.state}
              </Badge>
              <span className="text-muted-foreground">#{prNumber}</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-balance">
              {details.title}
            </h2>
            
            <div className="flex items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{details.user?.login || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(details.created_at)}</span>
              </div>
            </div>

            {/* Repository Info */}
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Github className="h-5 w-5" />
              <span className="font-mono">{owner}/{repo}</span>
            </div>

            {/* Branch Info */}
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <GitBranch className="h-4 w-4" />
              <span>
                {details.head?.label || `${details.head?.repo?.full_name}:${details.head?.ref}`} 
                → {details.base?.label || `${details.base?.repo?.full_name}:${details.base?.ref}`}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 lg:flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="metric-card text-center"
            >
              <div className="text-2xl font-bold text-green-400 mb-1">
                +{details.additions || 0}
              </div>
              <div className="text-sm text-muted-foreground">Additions</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="metric-card text-center"
            >
              <div className="text-2xl font-bold text-red-400 mb-1">
                -{details.deletions || 0}
              </div>
              <div className="text-sm text-muted-foreground">Deletions</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="metric-card text-center"
            >
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {details.changed_files || 0}
              </div>
              <div className="text-sm text-muted-foreground">Files</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Files Section */}
      {fileData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">
              Changed Files ({fileData.totalFiles} total, showing first {fileData.filesShown})
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-5 w-5" />
              <span>Code Analysis Ready</span>
            </div>
          </div>

          <div className="grid gap-6">
            {fileData.files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-panel rounded-xl p-6"
              >
                {/* File Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Code className="h-5 w-5 text-muted-foreground" />
                      <h4 className="text-lg font-semibold font-mono">{file.filename}</h4>
                      <Badge 
                        className={
                          file.status === 'added' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          file.status === 'removed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }
                      >
                        {file.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Plus className="h-4 w-4 text-green-400" />
                        <span>{file.additions}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Minus className="h-4 w-4 text-red-400" />
                        <span>{file.deletions}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-blue-400" />
                        <span>{file.changes} changes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Actions - 4 buttons per file */}
                {file.patch && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    {/* See Changes Button */}
                    <motion.button
                      onClick={() => onViewChanges(index)}
                      className="action-button shiny-button bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 hover:shadow-glow"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      See Changes
                    </motion.button>

                    {/* Find Bugs Button */}
                    <motion.button
                      onClick={() => onAnalyzeFile(index, 'bugs')}
                      disabled={analyzingFiles[`${index}-bugs`]}
                      className="action-button shiny-button bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30 hover:shadow-glow"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {analyzingFiles[`${index}-bugs`] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          Finding...
                        </>
                      ) : (
                        <>
                          <Bug className="h-4 w-4 mr-2" />
                          Find Bugs
                        </>
                      )}
                    </motion.button>

                    {/* Security Vulnerabilities Button */}
                    <motion.button
                      onClick={() => onAnalyzeFile(index, 'vulnerabilities')}
                      disabled={analyzingFiles[`${index}-vulnerabilities`]}
                      className="action-button shiny-button bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 hover:shadow-glow"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {analyzingFiles[`${index}-vulnerabilities`] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Security Scan
                        </>
                      )}
                    </motion.button>

                    {/* Get Fix Recommendations Button */}
                    <motion.button
                      onClick={() => onGetAutoFix(index)}
                      disabled={analyzingFiles[`${index}-autoFix`] || (!file.bugAnalysis && !file.vulnerabilityAnalysis)}
                      className="action-button shiny-button bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {analyzingFiles[`${index}-autoFix`] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wrench className="h-4 w-4 mr-2" />
                          Get Fixes
                        </>
                      )}
                    </motion.button>
                  </div>
                )}

                {/* Analysis Results Preview */}
                {(file.bugAnalysis || file.vulnerabilityAnalysis || file.autoFixRecommendations) && (
                  <div className="space-y-4">
                    {file.bugAnalysis && (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <h5 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                          <Bug className="h-4 w-4" />
                          Bug Analysis
                        </h5>
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm text-muted-foreground flex-1">
                            {file.bugAnalysis.split('\n')[0]?.replace(/^##\s*/, '') || 'Bugs found in code'}
                            {file.bugAnalysis.split('\n').length > 1 && '...'}
                          </p>
                          <motion.button
                            onClick={() => onViewChanges(index)}
                            className="text-xs text-yellow-400 hover:text-yellow-300 underline hover:no-underline transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                          >
                            View Details →
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {file.vulnerabilityAnalysis && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <h5 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Security Vulnerabilities
                        </h5>
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm text-muted-foreground flex-1">
                            {file.vulnerabilityAnalysis.split('\n')[0]?.replace(/^##\s*/, '') || 'Security issues detected'}
                            {file.vulnerabilityAnalysis.split('\n').length > 1 && '...'}
                          </p>
                          <motion.button
                            onClick={() => onViewChanges(index)}
                            className="text-xs text-red-400 hover:text-red-300 underline hover:no-underline transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                          >
                            View Details →
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {file.autoFixRecommendations && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h5 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                          <Wrench className="h-4 w-4" />
                          Auto-Fix Recommendations
                        </h5>
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm text-muted-foreground flex-1">
                            {file.autoFixRecommendations.split('\n')[0]?.replace(/^##\s*/, '') || 'Fix suggestions available'}
                            {file.autoFixRecommendations.split('\n').length > 1 && '...'}
                          </p>
                          <motion.button
                            onClick={() => onViewChanges(index)}
                            className="text-xs text-green-400 hover:text-green-300 underline hover:no-underline transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                          >
                            View Details →
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* Summary Call-to-Action */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                      <p className="text-sm text-primary/80 mb-2">
                        📋 Complete analysis report available
                      </p>
                      <motion.button
                        onClick={() => onViewChanges(index)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-all duration-200 text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Eye className="h-4 w-4" />
                        View Full Report & Changes
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
