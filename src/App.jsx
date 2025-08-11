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

function App() {
  const [prUrl, setPrUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [prData, setPrData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setPrData(null);

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
      const res = await fetch(apiUrl, {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      });

      if (!res.ok) {
        let details = '';
        try {
          const body = await res.json();
          details = body && body.message ? `: ${body.message}` : '';
        } catch {
          // ignore
        }
        throw new Error(`GitHub API error ${res.status}${details}`);
      }

      const data = await res.json();
      setPrData({ owner, repo, prNumber, details: data });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch PR');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (isLoading) return <div>Loading…</div>;
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
        {d.body ? (
          <div style={{ whiteSpace: 'pre-wrap', borderTop: '1px solid #eee', paddingTop: 8 }}>
            {d.body}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          placeholder="Enter GitHub PR URL"
          value={prUrl}
          onChange={(e) => setPrUrl(e.target.value)}
          className="pr-input"
        />
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Fetching…' : 'Submit'}
        </button>
      </form>
      <div className="result-area">
        {renderResult()}
      </div>
    </div>
  );
}

export default App;