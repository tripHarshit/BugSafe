import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { queryClient } from './lib/queryClient';
import { Dashboard } from './routes/Dashboard';
import PullRequest from './routes/PullRequest';
import { Performance } from './routes/Performance';
import { Security } from './routes/Security';
import SettingsPage from './routes/Settings';
import { CommandPalette } from './components/ui/CommandPalette';
import { useCommandPalette } from './hooks/useCommandPalette';
import { useReducedMotion } from './hooks/useReducedMotion';
import {
  Command,
  GitPullRequest,
  Shield,
  Zap,
  Settings as SettingsIcon,
  Menu,
  X
} from 'lucide-react';
import './styles/index.css';

function AppShell({ children }) {
  const { setIsOpen } = useCommandPalette();
  const prefersReducedMotion = useReducedMotion();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: <GitPullRequest />, action: () => navigate('/') },
    { name: 'Pull Requests', href: '/pr', icon: <GitPullRequest />, action: () => navigate('/pr') },
    { name: 'Security', href: '/security', icon: <Shield />, action: () => navigate('/security') },
    { name: 'Performance', href: '/performance', icon: <Zap />, action: () => navigate('/performance') },
    { name: 'Settings', href: '/settings', icon: <SettingsIcon />, action: () => navigate('/settings') },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-40 w-64 glass transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}
        initial={prefersReducedMotion ? false : { x: -256 }}
        animate={prefersReducedMotion ? false : { x: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-accent-purple rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">BugSafe</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {navigation.map((item) => (
              <motion.button
                key={item.name}
                onClick={item.action}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors w-full text-left"
                whileHover={prefersReducedMotion ? {} : { x: 4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {item.icon}
                {item.name}
              </motion.button>
            ))}
          </div>
        </nav>
      </motion.aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-surface-hover rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-text-muted" />
              </button>
              <h1 className="text-lg font-semibold text-text-primary">BugSafe</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
              >
                <Command className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs bg-surface border border-border rounded">
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pr" element={<PullRequest />} />
            <Route path="/pr/:id" element={<PullRequest />} />
            <Route path="/security" element={<Security />} />
            <Route path="/performance" element={<Performance />} />
                         <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppShell>
      </Router>
    </QueryClientProvider>
  );
}

export default App;