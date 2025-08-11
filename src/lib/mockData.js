// Mock data for BugSafe application

export const pullRequests = [
  {
    id: 'pr-1',
    repo: 'bugsafe/core',
    branch: 'feature/auth-system',
    number: 42,
    title: 'Implement OAuth2 authentication system',
    author: 'alice-dev',
    updatedAt: '2024-01-15T10:30:00Z',
    status: 'open',
    stats: {
      additions: 1250,
      deletions: 340,
      changedFiles: 15,
      findings: {
        bugs: 3,
        performance: 2,
        security: 1
      }
    }
  },
  {
    id: 'pr-2',
    repo: 'bugsafe/api',
    branch: 'fix/memory-leak',
    number: 89,
    title: 'Fix memory leak in user session management',
    author: 'bob-senior',
    updatedAt: '2024-01-14T16:45:00Z',
    status: 'merged',
    stats: {
      additions: 89,
      deletions: 156,
      changedFiles: 3,
      findings: {
        bugs: 1,
        performance: 0,
        security: 0
      }
    }
  },
  {
    id: 'pr-3',
    repo: 'bugsafe/frontend',
    branch: 'feature/dashboard',
    number: 156,
    title: 'Add real-time performance monitoring dashboard',
    author: 'charlie-ui',
    updatedAt: '2024-01-13T09:15:00Z',
    status: 'open',
    stats: {
      additions: 2340,
      deletions: 890,
      changedFiles: 28,
      findings: {
        bugs: 5,
        performance: 3,
        security: 2
      }
    }
  }
];

export const findings = [
  {
    id: 'f-1',
    prId: 'pr-1',
    type: 'security',
    severity: 'critical',
    file: 'src/auth/oauth2.js',
    line: 45,
    summary: 'Potential OAuth2 redirect URI validation bypass',
    confidence: 95,
    impact: 'High',
    status: 'open',
    details: 'The redirect URI validation can be bypassed by manipulating the state parameter, potentially allowing unauthorized access to user accounts.',
    recommendation: 'Implement strict redirect URI validation and use cryptographically secure state tokens.'
  },
  {
    id: 'f-2',
    prId: 'pr-1',
    type: 'bug',
    severity: 'high',
    file: 'src/auth/session.js',
    line: 78,
    summary: 'Race condition in session token generation',
    confidence: 88,
    impact: 'Medium',
    status: 'open',
    details: 'Multiple concurrent requests can generate duplicate session tokens, leading to session conflicts.',
    recommendation: 'Use atomic operations or distributed locks for token generation.'
  },
  {
    id: 'f-3',
    prId: 'pr-1',
    type: 'performance',
    severity: 'medium',
    file: 'src/auth/database.js',
    line: 123,
    summary: 'N+1 query problem in user permissions lookup',
    confidence: 92,
    impact: 'Medium',
    status: 'open',
    details: 'User permissions are fetched individually for each request, causing performance degradation.',
    recommendation: 'Implement batch loading or caching for user permissions.'
  },
  {
    id: 'f-4',
    prId: 'pr-2',
    type: 'bug',
    severity: 'high',
    file: 'src/session/manager.js',
    line: 34,
    summary: 'Memory leak in session cleanup',
    confidence: 96,
    impact: 'High',
    status: 'resolved',
    details: 'Sessions are not properly cleaned up when users log out, causing memory accumulation over time.',
    recommendation: 'Implement proper session cleanup and garbage collection.'
  },
  {
    id: 'f-5',
    prId: 'pr-3',
    type: 'security',
    severity: 'medium',
    file: 'src/components/Dashboard.jsx',
    line: 156,
    summary: 'XSS vulnerability in user input rendering',
    confidence: 85,
    impact: 'Medium',
    status: 'open',
    details: 'User-provided data is rendered without proper sanitization, potentially allowing XSS attacks.',
    recommendation: 'Use React\'s built-in XSS protection and sanitize all user inputs.'
  },
  {
    id: 'f-6',
    prId: 'pr-3',
    type: 'performance',
    severity: 'low',
    file: 'src/hooks/useMetrics.js',
    line: 89,
    summary: 'Inefficient re-renders in metrics hook',
    confidence: 78,
    impact: 'Low',
    status: 'open',
    details: 'The useMetrics hook causes unnecessary re-renders due to missing dependency optimization.',
    recommendation: 'Optimize dependencies and implement proper memoization.'
  }
];

export const diffs = [
  {
    prId: 'pr-1',
    file: 'src/auth/oauth2.js',
    chunks: [
      {
        oldStart: 40,
        newStart: 40,
        lines: [
          { type: 'context', content: '  // OAuth2 redirect URI validation', lineNo: 40 },
          { type: 'context', content: '  validateRedirectUri(uri, clientId) {', lineNo: 41 },
          { type: 'context', content: '    const client = this.getClient(clientId);', lineNo: 42 },
          { type: 'context', content: '    if (!client) {', lineNo: 43 },
          { type: 'context', content: '      throw new Error(\'Invalid client\');', lineNo: 44 },
          { type: 'del', content: '    return client.redirectUris.includes(uri);', lineNo: 45 },
          { type: 'add', content: '    // Validate redirect URI with proper state checking', lineNo: 45 },
          { type: 'add', content: '    const isValidUri = client.redirectUris.includes(uri);', lineNo: 46 },
          { type: 'add', content: '    if (!isValidUri) {', lineNo: 47 },
          { type: 'add', content: '      throw new Error(\'Invalid redirect URI\');', lineNo: 48 },
          { type: 'add', content: '    }', lineNo: 49 },
          { type: 'add', content: '    return true;', lineNo: 50 },
          { type: 'context', content: '  }', lineNo: 51 }
        ]
      }
    ]
  },
  {
    prId: 'pr-2',
    file: 'src/session/manager.js',
    chunks: [
      {
        oldStart: 30,
        newStart: 30,
        lines: [
          { type: 'context', content: '  cleanupSession(sessionId) {', lineNo: 30 },
          { type: 'context', content: '    const session = this.sessions.get(sessionId);', lineNo: 31 },
          { type: 'context', content: '    if (session) {', lineNo: 32 },
          { type: 'del', content: '      this.sessions.delete(sessionId);', lineNo: 33 },
          { type: 'add', content: '      // Properly cleanup session and remove from memory', lineNo: 33 },
          { type: 'add', content: '      session.destroy();', lineNo: 34 },
          { type: 'add', content: '      this.sessions.delete(sessionId);', lineNo: 35 },
          { type: 'add', content: '      this.emit(\'session:cleaned\', sessionId);', lineNo: 36 },
          { type: 'context', content: '    }', lineNo: 37 }
        ]
      }
    ]
  }
];

export const performanceMetrics = [
  {
    prId: 'pr-1',
    function: 'validateRedirectUri',
    cpu: 85,
    memory: 12,
    io: 5,
    db: 0,
    network: 0,
    trend: [75, 78, 82, 85, 83, 87, 85]
  },
  {
    prId: 'pr-2',
    function: 'cleanupSession',
    cpu: 15,
    memory: 45,
    io: 25,
    db: 15,
    network: 0,
    trend: [20, 18, 16, 15, 14, 15, 15]
  },
  {
    prId: 'pr-3',
    function: 'useMetrics',
    cpu: 60,
    memory: 30,
    io: 10,
    db: 0,
    network: 0,
    trend: [65, 62, 58, 60, 61, 59, 60]
  }
];

export const securityFindings = [
  {
    prId: 'pr-1',
    cwe: 'CWE-601',
    ruleId: 'oauth2-redirect-bypass',
    severity: 'critical',
    evidence: 'Redirect URI validation can be bypassed using state parameter manipulation',
    file: 'src/auth/oauth2.js',
    line: 45,
    guidance: 'Implement strict redirect URI validation and use cryptographically secure state tokens with proper expiration.'
  },
  {
    prId: 'pr-3',
    cwe: 'CWE-79',
    ruleId: 'xss-user-input',
    severity: 'medium',
    evidence: 'User input rendered without sanitization in React component',
    file: 'src/components/Dashboard.jsx',
    line: 156,
    guidance: 'Use React\'s built-in XSS protection, sanitize all user inputs, and consider using DOMPurify for additional protection.'
  }
];

export const agentTrace = [
  {
    prId: 'pr-1',
    step: 1,
    agent: 'security-scanner',
    summary: 'Analyzing OAuth2 implementation for common vulnerabilities',
    details: 'Performed static analysis on OAuth2 redirect URI validation logic',
    durationMs: 1200
  },
  {
    prId: 'pr-1',
    step: 2,
    agent: 'bug-detector',
    summary: 'Identifying potential race conditions in session management',
    details: 'Detected race condition in session token generation due to lack of atomic operations',
    durationMs: 800
  },
  {
    prId: 'pr-1',
    step: 3,
    agent: 'performance-analyzer',
    summary: 'Analyzing database query patterns',
    details: 'Found N+1 query problem in user permissions lookup that could be optimized',
    durationMs: 950
  },
  {
    prId: 'pr-1',
    step: 4,
    agent: 'fix-generator',
    summary: 'Generating fix suggestions for identified issues',
    details: 'Created specific code recommendations for each finding with implementation details',
    durationMs: 1500
  }
];

export const dashboardMetrics = {
  openPRs: 12,
  issuesFound: 28,
  performanceAlerts: 5,
  securityRisks: 3,
  avgAnalysisTime: '2.3s',
  successRate: 94.2
};

export const activityTimeline = [
  {
    id: 'act-1',
    type: 'security',
    message: 'Critical OAuth2 vulnerability detected in PR #42',
    timestamp: '2024-01-15T10:35:00Z',
    severity: 'critical'
  },
  {
    id: 'act-2',
    type: 'bug',
    message: 'Race condition found in session management',
    timestamp: '2024-01-15T10:32:00Z',
    severity: 'high'
  },
  {
    id: 'act-3',
    type: 'performance',
    message: 'N+1 query issue identified in auth system',
    timestamp: '2024-01-15T10:30:00Z',
    severity: 'medium'
  },
  {
    id: 'act-4',
    type: 'security',
    message: 'XSS vulnerability detected in dashboard component',
    timestamp: '2024-01-14T16:50:00Z',
    severity: 'medium'
  },
  {
    id: 'act-5',
    type: 'bug',
    message: 'Memory leak fixed in session cleanup',
    timestamp: '2024-01-14T16:45:00Z',
    severity: 'high'
  }
];

// Mock API functions with artificial latency
export const mockApi = {
  async getPullRequests() {
    await new Promise(resolve => setTimeout(resolve, 800));
    return pullRequests;
  },

  async getPullRequest(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return pullRequests.find(pr => pr.id === id);
  },

  async getFindings(prId) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return findings.filter(f => f.prId === prId);
  },

  async getDiff(prId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return diffs.filter(d => d.prId === prId);
  },

  async getPerformanceMetrics(prId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return performanceMetrics.filter(p => p.prId === prId);
  },

  async getSecurityFindings(prId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return securityFindings.filter(s => s.prId === prId);
  },

  async getAgentTrace(prId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return agentTrace.filter(a => a.prId === prId);
  },

  async getDashboardMetrics() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return dashboardMetrics;
  },

  async getActivityTimeline() {
    await new Promise(resolve => setTimeout(resolve, 700));
    return activityTimeline;
  }
};
