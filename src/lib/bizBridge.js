// Business Logic Bridge - Connects existing functions to UI components
// This file acts as an adapter between the existing business logic and the new UI

// Import the existing functions from the original App.jsx
// These are the actual working functions that we're preserving

function approxTokenCount(text) {
  if (!text) return 0;
  // Roughly 1 token ≈ 4 chars for English
  return Math.ceil(text.length / 4);
}

function trimToTokenBudget(text, maxTokens) {
  if (!text) return text;
  const estimated = approxTokenCount(text);
  if (estimated <= maxTokens) return text;
  // Keep head and tail to preserve context
  const ratio = maxTokens / estimated;
  const keepChars = Math.max(200, Math.floor(text.length * ratio));
  const head = text.slice(0, Math.floor(keepChars * 0.7));
  const tail = text.slice(-Math.floor(keepChars * 0.25));
  return `${head}\n\n...\n\n${tail}`;
}

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

    // ChatAnywhere free tier ~4096 token total limit. Reserve for system+response; cap input ~2500 tokens.
    const trimmed = trimToTokenBudget(codeSnippet, 2500);

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
            content: `Analyze this code snippet for bugs, logic errors, or bad practices. Provide a structured response in this exact format:

## Bug Analysis Report

### Issues Found:
- [Issue 1]: Brief description
- [Issue 2]: Brief description

### Detailed Analysis:
**Issue 1: [Title]**
- **Problem**: Clear explanation of the issue
- **Impact**: What could go wrong
- **Location**: Where in the code

**Issue 2: [Title]**
- **Problem**: Clear explanation of the issue
- **Impact**: What could go wrong
- **Location**: Where in the code

### Summary:
Brief overview of the main concerns found.

Code to analyze:
${trimmed}`
          }
        ],
        temperature: 0.3,
        max_tokens: 800
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

    const trimmed = trimToTokenBudget(codeSnippet, 2500);

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
            content: `Review this code for security vulnerabilities. Provide a structured response in this exact format:

## Security Vulnerability Report

### Vulnerabilities Found:
- [Vulnerability 1]: Brief description
- [Vulnerability 2]: Brief description

### Detailed Analysis:
**Vulnerability 1: [Title]**
- **Type**: SQL Injection, XSS, CSRF, etc.
- **Risk Level**: High/Medium/Low
- **Description**: Clear explanation of the vulnerability
- **Impact**: What could happen if exploited
- **Location**: Where in the code

**Vulnerability 2: [Title]**
- **Type**: SQL Injection, XSS, CSRF, etc.
- **Risk Level**: High/Medium/Low
- **Description**: Clear explanation of the vulnerability
- **Impact**: What could happen if exploited
- **Location**: Where in the code

### Security Score: [X/10]
Brief explanation of the overall security posture.

Code to analyze:
${trimmed}`
          }
        ],
        temperature: 0.3,
        max_tokens: 800
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

async function getAutoFixRecommendations(codeSnippet, findingsText, apiKey) {
  try {
    if (!codeSnippet || !codeSnippet.trim()) {
      throw new Error('Code snippet is required');
    }

    if (!findingsText || !findingsText.trim()) {
      throw new Error('Findings text is required');
    }

    if (!apiKey || !apiKey.trim()) {
      throw new Error('API key is required');
    }

    // Fit both code and findings by splitting budget
    const codeTrimmed = trimToTokenBudget(codeSnippet, 1600);
    const findingsTrimmed = trimToTokenBudget(findingsText, 700);

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
            content: `Based on the code snippet and findings below, provide auto-fix recommendations. Use this exact format:

## Auto-Fix Recommendations

### Fix 1: [Issue Title]
**Before (Problematic Code):**
\`\`\`
[Show the problematic code]
\`\`\`

**After (Fixed Code):**
\`\`\`
[Show the corrected code]
\`\`\`

**Explanation:**
Why this fix resolves the issue

### Fix 2: [Issue Title]
**Before (Problematic Code):**
\`\`\`
[Show the problematic code]
\`\`\`

**After (Fixed Code):**
\`\`\`
[Show the corrected code]
\`\`\`

**Explanation:**
Why this fix resolves the issue

### Implementation Tips:
- [Tip 1]
- [Tip 2]

Code Snippet:
${codeTrimmed}

Findings:
${findingsTrimmed}`
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
    throw new Error(`Auto-fix recommendations failed: ${error.message}`);
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

// Export the bridge for use in UI components
export {
  parseGitHubPrUrl,
  analyzeCodeWithAI,
  analyzeSecurityWithAI,
  getAutoFixRecommendations,
  fetchPrFiles
};
