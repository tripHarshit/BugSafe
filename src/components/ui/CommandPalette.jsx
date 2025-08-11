import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X } from 'lucide-react';
import { useCommandPalette } from '../../hooks/useCommandPalette';

export function CommandPalette() {
  const {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    selectedIndex,
    filteredCommands,
    executeCommand
  } = useCommandPalette();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 command-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="glass rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border/50">
              <Search className="w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none text-lg"
                autoFocus
              />
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Command className="w-4 h-4" />
                <span>K</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-surface-hover rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-text-muted">
                  <p>No commands found</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              ) : (
                <div className="py-2">
                  {filteredCommands.map((command, index) => (
                    <motion.button
                      key={command.id}
                      className={`w-full px-4 py-3 text-left hover:bg-surface-hover transition-colors flex items-center gap-3 ${
                        index === selectedIndex ? 'bg-surface-hover' : ''
                      }`}
                      onClick={() => executeCommand(command)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span className="text-lg">{command.icon}</span>
                      <div className="flex-1">
                        <div className="text-text-primary font-medium">
                          {command.title}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {command.description}
                        </div>
                      </div>
                      <div className="text-xs text-text-muted bg-surface px-2 py-1 rounded">
                        {command.shortcut}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 text-xs text-text-muted">
              <div className="flex items-center justify-between">
                <span>Use ↑↓ to navigate, Enter to select</span>
                <span>{filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
