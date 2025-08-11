import React, { useState } from 'react';
import './App.css';

function parseGitHubPrUrl(input) {
  if (typeof input !== 'string' || !input.trim()) {
    throw new Error('URL must be a non-empty string');
  }

  let normalized = input.trim();
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(normalized)) {
    normalized = 'https://' + normalized.replace(/^\/+/, '');
  }

  let url;
  try {
    url = new URL(normalized);
  } catch {
    throw new Error('Invalid URL');
  }

  const match = url.pathname.match(/^\/([^/]+)\/([^/]+)\/pull\/([0-9]+)(?:\/|$)/);
  if (!match) {
    throw new Error('Not a valid Pull Request URL');
  }

  const [, owner, repo, prNumberStr] = match;
  const prNumber = Number(prNumberStr);
  if (!Number.isSafeInteger(prNumber) || prNumber <= 0) {
    throw new Error('Invalid PR number');
  }

  return { owner, repo, prNumber };
}

async function analyzeCodeWithAI(codeSnippet, apiKey) {
  try {
    if (!codeSnippet || !codeSnippet.trim()) {
      throw new Error('Code snippet is required');
    }

    if (!apiKey || !apiKey.trim()) {
      throw new Error('API key is required');
    }

    const response = await fetch('https://api.chatanywhere.tech/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'user',
            content: `Analyze the following code snippet for bugs, logic errors, or bad practices. Explain each issue simply:\n\n${codeSnippet}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      let errorMessage = `API error ${response.status}`;
      try {
        const errorBody = await response.json();
        if (errorBody.error && errorBody.error.message) {
          errorMessage += `: ${errorBody.error.message}`;
        }
      } catch {
        // Ignore JSON parsing errors for error responses
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from API');
    }

    return data.choices[0].message.content;

  } catch (error) {
    throw new Error(`Code analysis failed: ${error.message}`);
  }
}

async function analyzeSecurityWithAI(codeSnippet, apiKey) {
  try {
    if (!codeSnippet || !codeSnippet.trim()) {
      throw new Error('Code snippet is required');
    }

    if (!apiKey || !apiKey.trim()) {
      throw new Error('API key is required');
    }

    const response = await fetch('https://api.chatanywhere.tech/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'user',
            content: `Review this code snippet for common security vulnerabilities or risks (like injection flaws, hardcoded secrets, XSS, CSRF, authentication issues, authorization problems, data exposure, etc.). Explain each security issue simply and suggest fixes:\n\n${codeSnippet}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      let errorMessage = `API error ${response.status}`;
      try {
        const errorBody = await response.json();
        if (errorBody.error && errorBody.error.message) {
          errorMessage += `: ${errorBody.error.message}`;
        }
      } catch {
        // Ignore JSON parsing errors for error responses
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from API');
    }

    return data.choices[0].message.content;

  } catch (error) {
    throw new Error(`Security analysis failed: ${error.message}`);
  }
}

async function fetchPrFiles(owner, repo, prNumber, token = '') {
  try {
    if (!owner || !repo || !prNumber) {
      throw new Error('Owner, repo, and PR number are required');
    }
    
    if (!Number.isInteger(Number(prNumber)) || Number(prNumber) <= 0) {
      throw new Error('PR number must be a positive integer');
    }

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`;
    
    const headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    
    if (token && token.trim()) {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    }

    const response = await fetch(apiUrl, { headers });
    
    if (!response.ok) {
      let errorMessage = `GitHub API error ${response.status}`;
      try {
        const errorBody = await response.json();
        if (errorBody.message) {
          errorMessage += `: ${errorBody.message}`;
        }
      } catch {
        // Ignore JSON parsing errors for error responses
      }
      throw new Error(errorMessage);
    }

    const files = await response.json();
    
    const limitedFiles = files.slice(0, 3).map(file => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch || null,
      raw_url: file.raw_url,
      blob_url: file.blob_url
    }));

    return {
      totalFiles: files.length,
      filesShown: limitedFiles.length,
      files: limitedFiles
    };

  } catch (error) {
    throw new Error(`Failed to fetch PR files: ${error.message}`);
  }
}

function App() {
  const [prUrl, setPrUrl] = useState('');
  const [token, setToken] = useState('');
  const [aiApiKey, setAiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [prData, setPrData] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState({});

  const generateReportText = () => {
    if (!prData || !fileData) return '';

    let report = `GitHub PR Analysis Report\n`;
    report += `================================\n\n`;
    report += `Repository: ${prData.owner}/${prData.repo}\n`;
    report += `PR #${prData.prNumber}: ${prData.details.title}\n`;
    report += `Author: ${prData.details.user?.login || 'Unknown'}\n`;
    report += `Status: ${prData.details.merged_at ? 'merged' : prData.details.state}\n`;
    report += `Created: ${prData.details.created_at ? new Date(prData.details.created_at).toLocaleString() : 'N/A'}\n`;
    report += `Files Analyzed: ${fileData.filesShown} of ${fileData.totalFiles}\n\n`;

    fileData.files.forEach((file, index) => {
      report += `File ${index + 1}: ${file.filename}\n`;
      report += `Status: ${file.status}\n`;
      report += `Changes: +${file.additions} -${file.deletions} (${file.changes} total)\n\n`;

      if (file.analysis) {
        report += `BUGS & CODE QUALITY ISSUES:\n`;
        report += `-------------------------\n`;
        report += `${file.analysis}\n\n`;
      }

      if (file.securityAnalysis) {
        report += `SECURITY VULNERABILITIES:\n`;
        report += `-------------------------\n`;
        report += `${file.securityAnalysis}\n\n`;
      }

      report += `DIFF:\n`;
      report += `-----\n`;
      report += `${file.patch || 'No diff available'}\n\n`;
      report += `================================\n\n`;
    });

    return report;
  };

  const copyToClipboard = async () => {
    try {
      const reportText = generateReportText();
      await navigator.clipboard.writeText(reportText);
      alert('Report copied to clipboard!');
    } catch (error) {
      alert('Failed to copy to clipboard: ' + error.message);
    }
  };

  const downloadReport = () => {
    try {
      const reportText = generateReportText();
      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pr-analysis-${prData.owner}-${prData.repo}-${prData.prNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download report: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setPrData(null);
    setFileData(null);
    setAnalysisProgress({});

    let parsed;
    try {
      parsed = parseGitHubPrUrl(prUrl);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid URL');
      return;
    }

    const { owner, repo, prNumber } = parsed;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;

    setIsLoading(true);
    try {
      const headers = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      };
      const trimmedToken = token.trim();
      if (trimmedToken) {
        headers.Authorization = `Bearer ${trimmedToken}`;
      }

      // Fetch PR details and files in parallel
      const [prResponse, fileResponse] = await Promise.all([
        fetch(apiUrl, { headers }),
        fetchPrFiles(owner, repo, prNumber, trimmedToken)
      ]);

      if (!prResponse.ok) {
        let details = '';
        try {
          const body = await prResponse.json();
          details = body && body.message ? `: ${body.message}` : '';
        } catch {
          // ignore
        }
        throw new Error(`GitHub API error ${prResponse.status}${details}`);
      }

      const data = await prResponse.json();
      setPrData({ owner, repo, prNumber, details: data });
      setFileData(fileResponse);

      // Auto-run AI analysis if API key is provided
      if (aiApiKey.trim()) {
        await runAllAnalyses(fileResponse.files, aiApiKey);
      }

    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch PR');
    } finally {
      setIsLoading(false);
    }
  };

  const runAllAnalyses = async (files, apiKey) => {
    setIsAnalyzing(true);
    setAnalysisProgress({});

    try {
      const updatedFiles = [...files];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.patch) continue;

        setAnalysisProgress(prev => ({ 
          ...prev, 
          [i]: { codeQuality: 'running', security: 'running' } 
        }));

        // Run both analyses in parallel for each file
        const [codeAnalysis, securityAnalysis] = await Promise.allSettled([
          analyzeCodeWithAI(file.patch, apiKey),
          analyzeSecurityWithAI(file.patch, apiKey)
        ]);

        // Update file with results
        updatedFiles[i] = {
          ...file,
          analysis: codeAnalysis.status === 'fulfilled' ? codeAnalysis.value : `Analysis failed: ${codeAnalysis.reason?.message || 'Unknown error'}`,
          securityAnalysis: securityAnalysis.status === 'fulfilled' ? securityAnalysis.value : `Security analysis failed: ${securityAnalysis.reason?.message || 'Unknown error'}`
        };

        setAnalysisProgress(prev => ({ 
          ...prev, 
          [i]: { 
            codeQuality: codeAnalysis.status === 'fulfilled' ? 'completed' : 'failed',
            security: securityAnalysis.status === 'fulfilled' ? 'completed' : 'failed'
          } 
        }));

        // Update fileData with the new analysis results
        setFileData(prev => ({
          ...prev,
          files: updatedFiles
        }));
      }
    } catch (error) {
      setErrorMessage(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderFileChanges = (files) => {
    if (!files || files.length === 0) {
      return <div>No file changes found.</div>;
    }

    return (
      <div>
        <div style={{ marginBottom: 12, fontWeight: 'bold' }}>
          Changed Files ({fileData.totalFiles} total, showing first {fileData.filesShown}):
        </div>
        {files.map((file, index) => (
          <div key={index} style={{ 
            border: '1px solid #e1e4e8', 
            borderRadius: 6, 
            marginBottom: 12, 
            padding: 12,
            backgroundColor: '#f6f8fa'
          }}>
            <div style={{ marginBottom: 8 }}>
              <strong>{file.filename}</strong>
              <span style={{ 
                marginLeft: 8, 
                padding: '2px 6px', 
                borderRadius: 3, 
                fontSize: '12px',
                backgroundColor: file.status === 'added' ? '#28a745' : 
                               file.status === 'removed' ? '#d73a49' : '#0366d6',
                color: 'white'
              }}>
                {file.status}
              </span>
            </div>
            <div style={{ marginBottom: 8, fontSize: '14px', color: '#586069' }}>
              +{file.additions} -{file.deletions} ({file.changes} changes)
            </div>
            
            {/* Analysis Status */}
            {isAnalyzing && analysisProgress[index] && (
              <div style={{ marginBottom: 8, fontSize: '12px' }}>
                <div>Code Quality: {analysisProgress[index].codeQuality === 'running' ? '🔄 Analyzing...' : 
                                   analysisProgress[index].codeQuality === 'completed' ? '✅ Complete' : 
                                   analysisProgress[index].codeQuality === 'failed' ? '❌ Failed' : '⏳ Pending'}</div>
                <div>Security: {analysisProgress[index].security === 'running' ? '🔄 Analyzing...' : 
                               analysisProgress[index].security === 'completed' ? '✅ Complete' : 
                               analysisProgress[index].security === 'failed' ? '❌ Failed' : '⏳ Pending'}</div>
              </div>
            )}
            
            {file.analysis && (
              <div style={{ 
                marginBottom: 8, 
                padding: 8, 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7',
                borderRadius: 4
              }}>
                <strong>Bugs & Code Quality Issues:</strong>
                <div style={{ marginTop: 4, whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                  {file.analysis}
                </div>
              </div>
            )}
            
            {file.securityAnalysis && (
              <div style={{ 
                marginBottom: 8, 
                padding: 8, 
                backgroundColor: '#f8d7da', 
                border: '1px solid #f5c6cb',
                borderRadius: 4
              }}>
                <strong>Security Issues:</strong>
                <div style={{ marginTop: 4, whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                  {file.securityAnalysis}
                </div>
              </div>
            )}
            
            {file.patch && (
              <details style={{ marginTop: 8 }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  View Diff
                </summary>
                <pre style={{ 
                  marginTop: 8, 
                  padding: 8, 
                  backgroundColor: '#f1f3f4', 
                  borderRadius: 4, 
                  fontSize: '12px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace'
                }}>
                  {file.patch}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderResult = () => {
    if (isLoading) return <div>Loading PR data…</div>;
    if (isAnalyzing) return <div>🔄 Running AI analysis on all files…</div>;
    if (errorMessage) return <div style={{ color: '#b00020' }}>{errorMessage}</div>;
    if (!prData) return <div>Enter a GitHub PR URL above and press Submit.</div>;

    const d = prData.details;
    const isMerged = Boolean(d.merged_at);

    return (
      <div>
        <div style={{ marginBottom: 8 }}>
          <strong>Repository:</strong> {prData.owner}/{prData.repo}
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>PR:</strong> #{prData.prNumber} — <a href={d.html_url} target="_blank" rel="noreferrer">{d.title}</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          {d.user?.avatar_url ? (
            <img src={d.user.avatar_url} alt={`${d.user?.login || 'author'} avatar`} width={24} height={24} style={{ borderRadius: 12 }} />
          ) : null}
          <span><strong>Author:</strong> {d.user?.login || 'Unknown'}</span>
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Status:</strong> {isMerged ? 'merged' : d.state}
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Branches:</strong> {d.head?.label || `${d.head?.repo?.full_name}:${d.head?.ref}`} → {d.base?.label || `${d.base?.repo?.full_name}:${d.base?.ref}`}
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Stats:</strong> +{d.additions} / -{d.deletions} in {d.changed_files} files
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Created:</strong> {d.created_at ? new Date(d.created_at).toLocaleString() : 'N/A'}
          {d.updated_at ? ` • Updated: ${new Date(d.updated_at).toLocaleString()}` : ''}
        </div>
        
        {/* File Changes Section */}
        {fileData && (
          <div style={{ marginTop: 16, borderTop: '2px solid #e1e4e8', paddingTop: 16 }}>
            {renderFileChanges(fileData.files)}
          </div>
        )}
        
        {/* Export Buttons */}
        {fileData && (fileData.files.some(f => f.analysis || f.securityAnalysis)) && (
          <div style={{ 
            marginTop: 16, 
            borderTop: '2px solid #e1e4e8', 
            paddingTop: 16,
            display: 'flex',
            gap: 10
          }}>
            <button
              onClick={copyToClipboard}
              style={{
                padding: '8px 16px',
                backgroundColor: '#0366d6',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📋 Copy Report
            </button>
            <button
              onClick={downloadReport}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              💾 Download Report
            </button>
          </div>
        )}
        
        {d.body ? (
          <div style={{ whiteSpace: 'pre-wrap', borderTop: '1px solid #eee', paddingTop: 8, marginTop: 16 }}>
            {d.body}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit} className="input-form" style={{ flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <input
            type="text"
            placeholder="Enter GitHub PR URL"
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            className="pr-input"
          />
          <button type="submit" className="submit-btn" disabled={isLoading || isAnalyzing}>
            {isLoading ? 'Fetching…' : isAnalyzing ? 'Analyzing…' : 'Submit'}
          </button>
        </div>
        <input
          type="password"
          placeholder="Optional: GitHub token (for private repos or higher limits)"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="pr-input"
          style={{ marginTop: 10 }}
        />
        <input
          type="password"
          placeholder="ChatAnywhere API Key (for AI code analysis)"
          value={aiApiKey}
          onChange={(e) => setAiApiKey(e.target.value)}
          className="pr-input"
          style={{ marginTop: 10 }}
        />
      </form>
      <div className="result-area">
        {renderResult()}
      </div>
    </div>
  );
}

export default App;