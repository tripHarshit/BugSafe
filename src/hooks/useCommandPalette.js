import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const commands = [
  {
    id: 'analyze-latest',
    title: 'Analyze Latest PR',
    description: 'Run analysis on the most recent pull request',
    action: 'analyze',
    icon: '🔍',
    shortcut: 'A'
  },
  {
    id: 'go-to-pr',
    title: 'Go to Pull Request',
    description: 'Navigate to a specific pull request',
    action: 'navigate',
    icon: '📋',
    shortcut: 'G P'
  },
  {
    id: 'go-to-dashboard',
    title: 'Go to Dashboard',
    description: 'Navigate to the main dashboard',
    action: 'navigate',
    icon: '📊',
    shortcut: 'G D'
  },
  {
    id: 'go-to-security',
    title: 'Go to Security Panel',
    description: 'Navigate to security analysis panel',
    action: 'navigate',
    icon: '🔒',
    shortcut: 'G S'
  },
  {
    id: 'go-to-performance',
    title: 'Go to Performance Panel',
    description: 'Navigate to performance analysis panel',
    action: 'navigate',
    icon: '⚡',
    shortcut: 'G P'
  },
  {
    id: 'toggle-bloom',
    title: 'Toggle Bloom Effect',
    description: 'Enable/disable visual bloom effects',
    action: 'toggle',
    icon: '✨',
    shortcut: 'B'
  },
  {
    id: 'refresh-data',
    title: 'Refresh Data',
    description: 'Reload all data from the server',
    action: 'refresh',
    icon: '🔄',
    shortcut: 'F5'
  },
  {
    id: 'show-help',
    title: 'Show Help',
    description: 'Display keyboard shortcuts and help',
    action: 'help',
    icon: '❓',
    shortcut: 'F1'
  }
];

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase())
  );

  const executeCommand = useCallback((command) => {
    switch (command.action) {
      case 'navigate':
        switch (command.id) {
          case 'go-to-pr':
            navigate('/pr');
            break;
          case 'go-to-dashboard':
            navigate('/');
            break;
          case 'go-to-security':
            navigate('/security');
            break;
          case 'go-to-performance':
            navigate('/performance');
            break;
        }
        break;
      case 'analyze':
        // Mock analyze action
        console.log('Analyzing latest PR...');
        break;
      case 'toggle':
        // Mock toggle action
        console.log('Toggling bloom effect...');
        break;
      case 'refresh':
        // Mock refresh action
        console.log('Refreshing data...');
        break;
      case 'help':
        // Mock help action
        console.log('Showing help...');
        break;
    }
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, [navigate]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(0);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
        break;
    }
  }, [isOpen, selectedIndex, filteredCommands, executeCommand]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
    filteredCommands,
    executeCommand
  };
}
