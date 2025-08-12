import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { mockApi } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/themes/prism-tomorrow.css';
import {
  parseGitHubPrUrl,
  fetchPrFiles,
  analyzeCodeWithAI,
  analyzeSecurityWithAI,
  autoFixSuggestions,
  generateReportText,
  copyToClipboard,
  downloadReport
} from '../lib/api';

const RECENT_PRS_KEY = 'bugsafe_recent_prs';

function useRecentPRs() {
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_PRS_KEY)) || [];
    } catch {
      return [];
    }
  });
  const addRecent = (pr) => {
    setRecent(prev => {
      const filtered = prev.filter(item => item.id !== pr.id);
      const updated = [pr, ...filtered].slice(0, 5);
      localStorage.setItem(RECENT_PRS_KEY, JSON.stringify(updated));
      return updated;
    });
  };
  return [recent, addRecent];
}

function PRList({ prs }) {
  const [recent] = useRecentPRs();
  const [prUrl, setPrUrl] = useState('');
  const [token, setToken] = useState('');
  const [aiApiKey, setAiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [prData, setPrData] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [analyzingFiles, setAnalyzingFiles] = useState({});
  const [aiResults, setAiResults] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setPrData(null);
    setFileData([]);
    setAiResults({});

    try {
      // Parse GitHub PR URL
      const { owner, repo, prNumber } = parseGitHubPrUrl(prUrl);
      
      // Fetch PR files
      const files = await fetchPrFiles(owner, repo, prNumber, token);
      setFileData(files);

      // Create mock PR data for display
      setPrData({
        title: `PR #${prNumber} from ${owner}/${repo}`,
        repo: `${owner}/${repo}`,
        number: prNumber,
        author: 'Unknown',
        status: 'open',
        branch: 'main',
        updatedAt: new Date().toISOString(),
        stats: { additions: 0, deletions: 0, changedFiles: files.length }
      });

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeFile = async (fileName, analysisType) => {
    if (!aiApiKey) {
      setErrorMessage('Please enter your ChatAnywhere API key');
      return;
    }

    setAnalyzingFiles(prev => ({ ...prev, [`${fileName}-${analysisType}`]: true }));
    setErrorMessage('');

    try {
      const file = fileData.find(f => f.filename === fileName);
      if (!file) return;

      let result;
      if (analysisType === 'bug') {
        result = await analyzeCodeWithAI(file.patch, aiApiKey);
        setAiResults(prev => ({
          ...prev,
          [fileName]: { ...prev[fileName], bugAnalysis: result }
        }));
      } else if (analysisType === 'security') {
        result = await analyzeSecurityWithAI(file.patch, aiApiKey);
        setAiResults(prev => ({
          ...prev,
          [fileName]: { ...prev[fileName], securityAnalysis: result }
        }));
      } else if (analysisType === 'fix') {
        const findings = [];
        if (aiResults[fileName]?.bugAnalysis) findings.push(aiResults[fileName].bugAnalysis);
        if (aiResults[fileName]?.securityAnalysis) findings.push(aiResults[fileName].securityAnalysis);
        
        if (findings.length === 0) {
          setErrorMessage('Please run bug or security analysis first');
          return;
        }
        
        result = await autoFixSuggestions(file.patch, findings.join('\n\n'), aiApiKey);
        setAiResults(prev => ({
          ...prev,
          [fileName]: { ...prev[fileName], fixSuggestions: result }
        }));
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setAnalyzingFiles(prev => ({ ...prev, [`${fileName}-${analysisType}`]: false }));
    }
  };

  const handleCopyReport = async () => {
    if (!prData || Object.keys(aiResults).length === 0) {
      setErrorMessage('No analysis results to copy');
      return;
    }
    
    const reportText = generateReportText(prData, fileData, aiResults);
    const success = await copyToClipboard(reportText);
    if (success) {
      setErrorMessage('Report copied to clipboard!');
    } else {
      setErrorMessage('Failed to copy report');
    }
  };

  const handleDownloadReport = () => {
    if (!prData || Object.keys(aiResults).length === 0) {
      setErrorMessage('No analysis results to download');
      return;
    }
    
    const reportText = generateReportText(prData, fileData, aiResults);
    downloadReport(reportText, `bugsafe-report-${prData.number}.txt`);
  };

  return (
    <div className="p-8 space-y-8">
      {/* PR Analysis Form */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Analyze GitHub Pull Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">GitHub PR URL</label>
              <input
                type="url"
                value={prUrl}
                onChange={(e) => setPrUrl(e.target.value)}
                placeholder="https://github.com/owner/repo/pull/123"
                className="w-full p-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">GitHub Token (Optional)</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="github_pat_..."
                className="w-full p-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ChatAnywhere API Key</label>
              <input
                type="password"
                value={aiApiKey}
                onChange={(e) => setAiApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full p-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Analyzing...' : 'Analyze PR'}
            </Button>
          </form>

          {errorMessage && (
            <div className="mt-4 p-3 bg-critical/10 border border-critical/20 rounded-lg text-critical">
              {errorMessage}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {prData && fileData.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {fileData.map((file, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <h3 className="font-mono text-sm mb-3">{file.filename}</h3>
                  
                  <div className="flex gap-2 mb-4">
                    <Button
                      size="sm"
                      onClick={() => handleAnalyzeFile(file.filename, 'bug')}
                      disabled={analyzingFiles[`${file.filename}-bug`]}
                    >
                      {analyzingFiles[`${file.filename}-bug`] ? 'Analyzing...' : 'Bug Analysis'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAnalyzeFile(file.filename, 'security')}
                      disabled={analyzingFiles[`${file.filename}-security`]}
                    >
                      {analyzingFiles[`${file.filename}-security`] ? 'Analyzing...' : 'Security Analysis'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAnalyzeFile(file.filename, 'fix')}
                      disabled={analyzingFiles[`${file.filename}-fix`]}
                    >
                      {analyzingFiles[`${file.filename}-fix`] ? 'Generating...' : 'Auto Fix'}
                    </Button>
                  </div>

                  {aiResults[file.filename] && (
                    <div className="space-y-4">
                      {aiResults[file.filename].bugAnalysis && (
                        <div>
                          <h4 className="font-medium text-success mb-2">Bug Analysis:</h4>
                          <div className="bg-surface p-3 rounded text-sm whitespace-pre-wrap">
                            {aiResults[file.filename].bugAnalysis}
                          </div>
                        </div>
                      )}
                      
                      {aiResults[file.filename].securityAnalysis && (
                        <div>
                          <h4 className="font-medium text-critical mb-2">Security Analysis:</h4>
                          <div className="bg-surface p-3 rounded text-sm whitespace-pre-wrap">
                            {aiResults[file.filename].securityAnalysis}
                          </div>
                        </div>
                      )}
                      
                      {aiResults[file.filename].fixSuggestions && (
                        <div>
                          <h4 className="font-medium text-accent mb-2">Fix Suggestions:</h4>
                          <div className="bg-surface p-3 rounded text-sm whitespace-pre-wrap">
                            {aiResults[file.filename].fixSuggestions}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {Object.keys(aiResults).length > 0 && (
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button onClick={handleCopyReport}>
                    Copy Report
                  </Button>
                  <Button variant="outline" onClick={handleDownloadReport}>
                    Download Report
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mock PR List */}
      <div className="flex gap-8">
        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-bold">Recent Pull Requests</h2>
          {prs.map(pr => (
            <Card key={pr.id} className="hover-lift">
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <Link to={`/pr/${pr.id}`} className="text-lg font-bold text-accent hover:underline">
                    #{pr.number} {pr.title}
                  </Link>
                  <div className="text-sm text-text-secondary mt-1">
                    {pr.repo} • {pr.branch} • by {pr.author}
                  </div>
                </div>
                <StatusBadge status={pr.status} />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="w-64 hidden lg:block">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Recent PRs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recent.length === 0 && <div className="text-xs text-text-muted">No recent PRs</div>}
                {recent.map(pr => (
                  <Link key={pr.id} to={`/pr/${pr.id}`} className="block text-accent hover:underline text-sm truncate">
                    #{pr.number} {pr.title}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PRDetail({ prId }) {
  const { data: pr, isLoading } = useQuery({
    queryKey: ['pullRequest', prId],
    queryFn: () => mockApi.getPullRequest(prId)
  });
  const { data: findings } = useQuery({
    queryKey: ['findings', prId],
    queryFn: () => mockApi.getFindings(prId)
  });
  const { data: diffs } = useQuery({
    queryKey: ['diffs', prId],
    queryFn: () => mockApi.getDiff(prId)
  });
  const { data: agentTrace } = useQuery({
    queryKey: ['agentTrace', prId],
    queryFn: () => mockApi.getAgentTrace(prId)
  });
  const [tab, setTab] = useState('overview');
  const [recent, addRecent] = useRecentPRs();
  const navigate = useNavigate();

  useEffect(() => {
    if (pr) addRecent(pr);
  }, [pr]);

  if (isLoading || !pr) return <div className="p-8">Loading PR...</div>;

  return (
    <div className="flex gap-8">
      <div className="flex-1 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/pr')} className="mb-2">
          ← Back to PR List
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-accent font-mono">#{pr.number}</span>
              <span>{pr.title}</span>
              <StatusBadge status={pr.status} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              <span>Repo: {pr.repo}</span>
              <span>Branch: {pr.branch}</span>
              <span>Author: {pr.author}</span>
              <span>Updated: {new Date(pr.updatedAt).toLocaleString()}</span>
              <span>Additions: <span className="text-success font-bold">+{pr.stats.additions}</span></span>
              <span>Deletions: <span className="text-critical font-bold">-{pr.stats.deletions}</span></span>
              <span>Files: {pr.stats.changedFiles}</span>
            </div>
          </CardContent>
        </Card>
        <Tabs.Root value={tab} onValueChange={setTab} className="w-full">
          <Tabs.List className="flex gap-2 border-b border-border mb-4">
            <Tabs.Trigger value="overview" className="px-4 py-2 font-medium">Overview</Tabs.Trigger>
            <Tabs.Trigger value="diffs" className="px-4 py-2 font-medium">Diffs</Tabs.Trigger>
            <Tabs.Trigger value="findings" className="px-4 py-2 font-medium">Findings</Tabs.Trigger>
            <Tabs.Trigger value="trace" className="px-4 py-2 font-medium">Agent Trace</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="overview">
            <div className="p-4">
              <div className="mb-2 text-lg font-semibold">Summary</div>
              <div className="text-text-secondary">{pr.title}</div>
              <div className="mt-4 text-sm text-text-muted">This is a mock PR. All data is simulated for demo purposes.</div>
            </div>
          </Tabs.Content>
          <Tabs.Content value="diffs">
            <div className="p-4 space-y-6">
              {diffs && diffs.length > 0 ? diffs.map(diff => (
                <Card key={diff.file}>
                  <CardHeader>
                    <CardTitle className="text-base font-mono">{diff.file}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {diff.chunks.map((chunk, i) => (
                      <pre key={i} className="code-block overflow-x-auto">
                        {chunk.lines.map((line, idx) => (
                          <div key={idx} className={`code-line ${line.type}`}>{line.content}</div>
                        ))}
                      </pre>
                    ))}
                  </CardContent>
                </Card>
              )) : <div>No diffs found.</div>}
            </div>
          </Tabs.Content>
          <Tabs.Content value="findings">
            <div className="p-4 space-y-4">
              {findings && findings.length > 0 ? findings.map(finding => (
                <Card key={finding.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant={finding.type === 'bug' ? 'danger' : finding.type === 'security' ? 'danger' : 'warning'}>
                        {finding.type}
                      </Badge>
                      <span className="font-mono text-xs">{finding.file}:{finding.line}</span>
                      <span className="capitalize">{finding.severity}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-semibold mb-1">{finding.summary}</div>
                    <div className="text-sm text-text-secondary mb-2">{finding.details}</div>
                    <div className="text-xs text-success">Recommendation: {finding.recommendation}</div>
                  </CardContent>
                </Card>
              )) : <div>No findings for this PR.</div>}
            </div>
          </Tabs.Content>
          <Tabs.Content value="trace">
            <div className="p-4 space-y-4">
              {agentTrace && agentTrace.length > 0 ? agentTrace.map(trace => (
                <Card key={trace.step}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="font-mono text-xs">Step {trace.step}</span>
                      <span className="capitalize">{trace.agent}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-semibold mb-1">{trace.summary}</div>
                    <div className="text-sm text-text-secondary mb-2">{trace.details}</div>
                    <div className="text-xs text-muted">Duration: {trace.durationMs}ms</div>
                  </CardContent>
                </Card>
              )) : <div>No agent trace for this PR.</div>}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
      <div className="w-64 hidden lg:block">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-base">Recent PRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recent.length === 0 && <div className="text-xs text-text-muted">No recent PRs</div>}
              {recent.map(pr => (
                <div key={pr.id} className="truncate">
                  <Button variant="ghost" size="sm" className="w-full text-left px-2 py-1" onClick={() => navigate(`/pr/${pr.id}`)}>
                    #{pr.number} {pr.title}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PullRequest() {
  const { id } = useParams();
  const { data: prs, isLoading } = useQuery({
    queryKey: ['pullRequests'],
    queryFn: mockApi.getPullRequests
  });

  if (isLoading) return <div className="p-8">Loading PRs...</div>;

  if (id) {
    return <PRDetail prId={id} />;
  }

  return <PRList prs={prs} />;
}
