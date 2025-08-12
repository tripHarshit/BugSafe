// GitHub PR URL parsing
export function parseGitHubPrUrl(url) {
  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/;
    const match = url.match(regex);
    
    if (!match) {
      throw new Error('Invalid GitHub PR URL format');
    }
    
    return {
      owner: match[1],
      repo: match[2],
      prNumber: parseInt(match[3])
    };
  } catch (error) {
    throw new Error('Failed to parse GitHub PR URL: ' + error.message);
  }
}

// Fetch PR files from GitHub API
export async function fetchPrFiles(owner, repo, prNumber, token = null) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error ${response.status}: ${response.statusText}`);
    }
    
    const files = await response.json();
    
    // Limit to 3 files and return file names with patch diffs
    return files.slice(0, 3).map(file => ({
      filename: file.filename,
      patch: file.patch || ''
    }));
  } catch (error) {
    throw new Error('Failed to fetch PR files: ' + error.message);
  }
}

// AI Code Analysis with ChatAnywhere
export async function analyzeCodeWithAI(codeSnippet, aiApiKey) {
  try {
    const response = await fetch('https://api.chatanywhere.tech/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'user',
            content: `Analyze this code snippet for bugs, logic errors, or bad practices:\n\n${codeSnippet}`
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw new Error('Failed to analyze code with AI: ' + error.message);
  }
}

// AI Security Analysis with ChatAnywhere
export async function analyzeSecurityWithAI(codeSnippet, aiApiKey) {
  try {
    const response = await fetch('https://api.chatanywhere.tech/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'user',
            content: `Analyze this code snippet for common security vulnerabilities or risks:\n\n${codeSnippet}`
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw new Error('Failed to analyze security with AI: ' + error.message);
  }
}

// Auto Fix Suggestions with ChatAnywhere
export async function autoFixSuggestions(codeSnippet, findingsText, aiApiKey) {
  try {
    const response = await fetch('https://api.chatanywhere.tech/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'user',
            content: `Given the following code snippet and its findings, provide concise code fix suggestions and tips to avoid these vulnerabilities in the future:\n\nCode:\n${codeSnippet}\n\nFindings:\n${findingsText}`
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw new Error('Failed to generate fix suggestions: ' + error.message);
  }
}

// Generate Report Text
export function generateReportText(prData, fileData, aiResults) {
  let report = `# BugSafe Analysis Report\n\n`;
  report += `## Pull Request: ${prData.title}\n`;
  report += `Repository: ${prData.repo}\n`;
  report += `PR Number: #${prData.number}\n`;
  report += `Author: ${prData.author}\n`;
  report += `Status: ${prData.status}\n\n`;

  report += `## Analysis Results\n\n`;

  Object.keys(aiResults).forEach(fileName => {
    report += `### File: ${fileName}\n\n`;
    
    if (aiResults[fileName].bugAnalysis) {
      report += `#### Bug Analysis:\n${aiResults[fileName].bugAnalysis}\n\n`;
    }
    
    if (aiResults[fileName].securityAnalysis) {
      report += `#### Security Analysis:\n${aiResults[fileName].securityAnalysis}\n\n`;
    }
    
    if (aiResults[fileName].fixSuggestions) {
      report += `#### Fix Suggestions:\n${aiResults[fileName].fixSuggestions}\n\n`;
    }
    
    report += `---\n\n`;
  });

  return report;
}

// Copy to Clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// Download Report
export function downloadReport(reportText, filename = 'bugsafe-report.txt') {
  const blob = new Blob([reportText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
