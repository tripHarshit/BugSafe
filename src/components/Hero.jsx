import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Key, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '../providers/ToastProvider';

export const Hero = ({ onAnalyze, isLoading }) => {
  const [prUrl, setPrUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [chatAnywhereApiKey, setChatAnywhereApiKey] = useState('');
  const [showTokens, setShowTokens] = useState(false);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!prUrl.trim()) {
      toast.error('Input Required', 'Please enter a GitHub PR URL');
      return;
    }

    if (!chatAnywhereApiKey.trim()) {
      toast.error('API Key Required', 'Please enter your ChatAnywhere API key');
      return;
    }

    onAnalyze({
      prUrl: prUrl.trim(),
      githubToken: githubToken.trim(),
      chatAnywhereApiKey: chatAnywhereApiKey.trim()
    });
  };

  const toggleTokens = () => {
    setShowTokens(!showTokens);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative z-10 py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-7xl md:text-8xl font-bold mb-8">
            <span className="gradient-text">🐛 BugSafe</span>
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            AI-Powered GitHub PR Analysis & Auto-Fix Recommendations
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-8 max-w-3xl mx-auto"
        >
          {/* PR URL Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Github className="h-6 w-6 text-muted-foreground" />
            </div>
            <input
              type="url"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              placeholder="https://github.com/owner/repo/pull/123"
              className="input-field w-full pl-16 pr-6 text-xl py-5"
              required
            />
          </div>

          {/* Token Toggle */}
          <motion.button
            type="button"
            onClick={toggleTokens}
            className="flex items-center justify-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Key className="h-5 w-5" />
            <span>{showTokens ? 'Hide' : 'Show'} API Keys</span>
            <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${showTokens ? 'rotate-90' : ''}`} />
          </motion.button>

          {/* API Keys Section */}
          <motion.div
            initial={false}
            animate={{ height: showTokens ? 'auto' : 0, opacity: showTokens ? 1 : 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden space-y-6"
          >
            {/* GitHub Token */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="GitHub Personal Access Token (optional)"
                className="input-field w-full pl-16 pr-6 py-4 text-lg"
              />
            </div>

            {/* ChatAnywhere API Key */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Zap className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="password"
                value={chatAnywhereApiKey}
                onChange={(e) => setChatAnywhereApiKey(e.target.value)}
                placeholder="ChatAnywhere API Key (required)"
                className="input-field w-full pl-16 pr-6 py-4 text-lg"
                required
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="group relative w-full py-5 px-10 bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold text-xl rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6" />
                  Analyze Pull Request
                </>
              )}
            </div>
          </motion.button>
        </motion.form>

        {/* Feature Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-panel rounded-xl p-6 text-center"
          >
            <div className="text-4xl mb-3">🐛</div>
            <h3 className="text-lg font-semibold mb-2">Bug Detection</h3>
            <p className="text-muted-foreground text-sm">
              AI-powered analysis to find logic errors and bad practices
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-panel rounded-xl p-6 text-center"
          >
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold mb-2">Security Scan</h3>
            <p className="text-muted-foreground text-sm">
              Identify vulnerabilities like SQL injection, XSS, and more
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-panel rounded-xl p-6 text-center"
          >
            <div className="text-4xl mb-3">🔧</div>
            <h3 className="text-lg font-semibold mb-2">Auto-Fix</h3>
            <p className="text-muted-foreground text-sm">
              Get intelligent suggestions to resolve issues automatically
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
