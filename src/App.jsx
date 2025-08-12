import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BackgroundScene } from './components/three/BackgroundScene';
import { Hero } from './components/Hero';
import { PRSummary } from './components/PRSummary';
import { FindingsDiffViewer } from './components/FindingsDiffViewer';
import { DiffViewer } from './components/DiffViewer';
import { AgentTraceTimeline } from './components/AgentTraceTimeline';
import { useToast } from './providers/ToastProvider';

// Import existing business logic functions
import {
  parseGitHubPrUrl,
  analyzeCodeWithAI,
  analyzeSecurityWithAI,
  getAutoFixRecommendations,
  fetchPrFiles
} from './lib/bizBridge';

function App() {
  const [prUrl, setPrUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [chatAnywhereApiKey, setChatAnywhereApiKey] = useState('');
  const [prData, setPrData] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [analyzingFiles, setAnalyzingFiles] = useState({});
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDiffViewer, setShowDiffViewer] = useState(false);
  
  const toast = useToast();

  // Add step to analysis history
  const addAnalysisStep = useCallback((step) => {
    setAnalysisHistory(prev => [...prev, { ...step, id: Date.now() + Math.random() }]);
  }, []);

  // Update step status
  const updateStepStatus = useCallback((stepId, updates) => {
    setAnalysisHistory(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    );
  }, []);

  // Handle PR analysis
  const handleAnalyze = useCallback(async ({ prUrl, githubToken, chatAnywhereApiKey }) => {
    setPrUrl(prUrl);
    setGithubToken(githubToken);
    setChatAnywhereApiKey(chatAnywhereApiKey);
    
    // Reset state
    setPrData(null);
    setFileData(null);
    setAnalyzingFiles({});
    setAnalysisHistory([]);
    setCurrentStep(null);
    setIsAnalyzing(true);

    try {
      // Add initial step
      const initialStep = {
        type: 'pr_fetch',
        title: 'Fetching PR Details',
        description: 'Retrieving pull request information from GitHub',
        status: 'running',
        startTime: new Date().toISOString()
      };
      addAnalysisStep(initialStep);
      setCurrentStep(initialStep);

      // Parse PR URL
      const parsed = parseGitHubPrUrl(prUrl);
      const { owner, repo, prNumber } = parsed;

      // Fetch PR details and files
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
      const headers = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      };
      
      if (githubToken) {
        headers.Authorization = `Bearer ${githubToken}`;
      }

      const [prResponse, fileResponse] = await Promise.all([
        fetch(apiUrl, { headers }),
        fetchPrFiles(owner, repo, prNumber, githubToken)
      ]);

      if (!prResponse.ok) {
        throw new Error(`GitHub API error ${prResponse.status}`);
      }

      const prDetails = await prResponse.json();
      
      // Update step status
      updateStepStatus(initialStep.id, {
        status: 'completed',
        endTime: new Date().toISOString(),
        details: `Successfully fetched PR #${prNumber} from ${owner}/${repo}`
      });

      setPrData({ owner, repo, prNumber, details: prDetails });
      setFileData(fileResponse);
      setCurrentStep(null);
      setIsAnalyzing(false);

      toast.success('PR Loaded', `Successfully loaded PR #${prNumber} from ${owner}/${repo}`);

    } catch (error) {
      console.error('Analysis failed:', error);
      
      if (currentStep) {
        updateStepStatus(currentStep.id, {
          status: 'error',
          endTime: new Date().toISOString(),
          error: error.message
        });
      }
      
      setCurrentStep(null);
      setIsAnalyzing(false);
      toast.error('Analysis Failed', error.message);
    }
  }, [addAnalysisStep, updateStepStatus, currentStep, toast]);

  // Handle file analysis
  const handleAnalyzeFile = useCallback(async (fileIndex, analysisType) => {
    if (!chatAnywhereApiKey) {
      toast.error('API Key Required', 'Please enter your ChatAnywhere API key');
      return;
    }

    const file = fileData.files[fileIndex];
    if (!file.patch) {
      toast.error('No Patch Content', 'No patch content available for analysis');
      return;
    }

    setAnalyzingFiles(prev => ({ ...prev, [`${fileIndex}-${analysisType}`]: true }));

    const stepType = analysisType === 'bugs' ? 'bug_analysis' : 'vulnerability_scan';
    const stepTitle = analysisType === 'bugs' ? 'Bug Analysis' : 'Security Vulnerability Scan';
    
    const step = {
      type: stepType,
      title: stepTitle,
      description: `Analyzing ${file.filename} for ${analysisType === 'bugs' ? 'bugs and logic errors' : 'security vulnerabilities'}`,
      status: 'running',
      startTime: new Date().toISOString(),
      file: file.filename
    };

    addAnalysisStep(step);
    setCurrentStep(step);

    try {
      let analysis;
      if (analysisType === 'bugs') {
        analysis = await analyzeCodeWithAI(file.patch, chatAnywhereApiKey);
      } else if (analysisType === 'vulnerabilities') {
        analysis = await analyzeSecurityWithAI(file.patch, chatAnywhereApiKey);
      }

      // Update file data
      setFileData(prev => ({
        ...prev,
        files: prev.files.map((f, index) => 
          index === fileIndex 
            ? { 
                ...f, 
                [analysisType === 'bugs' ? 'bugAnalysis' : 'vulnerabilityAnalysis']: analysis 
              } 
            : f
        )
      }));

      // Update step status
      updateStepStatus(step.id, {
        status: 'completed',
        endTime: new Date().toISOString(),
        results: analysis.substring(0, 200) + '...'
      });

      setCurrentStep(null);
      setAnalyzingFiles(prev => ({ ...prev, [`${fileIndex}-${analysisType}`]: false }));

      toast.success(
        analysisType === 'bugs' ? 'Bug Analysis Complete' : 'Security Scan Complete',
        `Found issues in ${file.filename}`
      );

    } catch (error) {
      console.error(`${analysisType} analysis failed:`, error);
      
      updateStepStatus(step.id, {
        status: 'error',
        endTime: new Date().toISOString(),
        error: error.message
      });

      setCurrentStep(null);
      setAnalyzingFiles(prev => ({ ...prev, [`${fileIndex}-${analysisType}`]: false }));
      
      toast.error(
        analysisType === 'bugs' ? 'Bug Analysis Failed' : 'Security Scan Failed',
        error.message
      );
    }
  }, [fileData, chatAnywhereApiKey, addAnalysisStep, updateStepStatus, toast]);

  // Handle auto-fix generation
  const handleGetAutoFix = useCallback(async (fileIndex) => {
    if (!chatAnywhereApiKey) {
      toast.error('API Key Required', 'Please enter your ChatAnywhere API key');
      return;
    }

    const file = fileData.files[fileIndex];
    if (!file.patch) {
      toast.error('No Patch Content', 'No patch content available for auto-fix');
      return;
    }

    const findings = [];
    if (file.bugAnalysis) findings.push(`Bug Analysis:\n${file.bugAnalysis}`);
    if (file.vulnerabilityAnalysis) findings.push(`Vulnerability Analysis:\n${file.vulnerabilityAnalysis}`);
    
    if (findings.length === 0) {
      toast.error('No Analysis Results', 'Please run bug or vulnerability analysis first');
      return;
    }

    setAnalyzingFiles(prev => ({ ...prev, [`${fileIndex}-autoFix`]: true }));

    const step = {
      type: 'auto_fix',
      title: 'Auto-Fix Generation',
      description: `Generating fix recommendations for ${file.filename}`,
      status: 'running',
      startTime: new Date().toISOString(),
      file: file.filename
    };

    addAnalysisStep(step);
    setCurrentStep(step);

    try {
      const findingsText = findings.join('\n\n');
      const autoFixRecommendations = await getAutoFixRecommendations(file.patch, findingsText, chatAnywhereApiKey);

      // Update file data
      setFileData(prev => ({
        ...prev,
        files: prev.files.map((f, index) => 
          index === fileIndex 
            ? { ...f, autoFixRecommendations } 
            : f
        )
      }));

      // Update step status
      updateStepStatus(step.id, {
        status: 'completed',
        endTime: new Date().toISOString(),
        results: autoFixRecommendations.substring(0, 200) + '...'
      });

      setCurrentStep(null);
      setAnalyzingFiles(prev => ({ ...prev, [`${fileIndex}-autoFix`]: false }));

      toast.success('Auto-Fix Generated', `Generated fix recommendations for ${file.filename}`);

    } catch (error) {
      console.error('Auto-fix generation failed:', error);
      
      updateStepStatus(step.id, {
        status: 'error',
        endTime: new Date().toISOString(),
        error: error.message
      });

      setCurrentStep(null);
      setAnalyzingFiles(prev => ({ ...prev, [`${fileIndex}-autoFix`]: false }));
      
      toast.error('Auto-Fix Generation Failed', error.message);
    }
  }, [fileData, chatAnywhereApiKey, addAnalysisStep, updateStepStatus, toast]);

  // Handle viewing file changes
  const handleViewChanges = useCallback((fileIndex) => {
    setSelectedFileIndex(fileIndex);
    setShowDiffViewer(true);
  }, []);

  // Handle going back from diff viewer
  const handleBackFromDiff = useCallback(() => {
    setShowDiffViewer(false);
  }, []);

  // Handle export success
  const handleExportSuccess = useCallback(() => {
    toast.success('Export Successful', 'Analysis report has been downloaded');
  }, [toast]);

  // Handle copy success
  const handleCopySuccess = useCallback(() => {
    toast.success('Copied to Clipboard', 'Analysis report has been copied');
  }, [toast]);

  // Handle file selection in findings viewer
  const handleFileSelect = useCallback((fileIndex) => {
    setSelectedFileIndex(fileIndex);
  }, []);

  return (
    <BackgroundScene>
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {showDiffViewer ? (
            <DiffViewer
              key="diff-viewer"
              file={fileData?.files?.[selectedFileIndex]}
              onBack={handleBackFromDiff}
              onExport={handleExportSuccess}
              onCopy={handleCopySuccess}
            />
          ) : (
            <>
              <Hero 
                onAnalyze={handleAnalyze}
                isLoading={isAnalyzing}
              />
              
              {prData && (
                <PRSummary 
                  prData={prData}
                  fileData={fileData}
                  onAnalyzeFile={handleAnalyzeFile}
                  onGetAutoFix={handleGetAutoFix}
                  analyzingFiles={analyzingFiles}
                  onViewChanges={handleViewChanges}
                />
              )}
              
              {fileData && fileData.files && fileData.files.length > 0 && (
                <FindingsDiffViewer 
                  fileData={fileData}
                  selectedFileIndex={selectedFileIndex}
                  onFileSelect={handleFileSelect}
                  analyzingFiles={analyzingFiles}
                />
              )}
              
              {analysisHistory.length > 0 && (
                <AgentTraceTimeline 
                  steps={analysisHistory}
                  currentStep={currentStep}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </BackgroundScene>
  )
}

export default App;
