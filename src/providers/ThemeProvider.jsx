import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('primary');

  const accentColors = {
    primary: {
      primary: 'from-[#6d5efc] to-[#8a5cf6]',
      secondary: 'from-[#8a5cf6] to-[#b18cff]',
      accent: 'from-[#36cfc9] to-[#6d5efc]',
      glow: 'rgba(109, 94, 252, 0.3)'
    },
    cyan: {
      primary: 'from-[#36cfc9] to-[#6d5efc]',
      secondary: 'from-[#6d5efc] to-[#36cfc9]',
      accent: 'from-[#b18cff] to-[#36cfc9]',
      glow: 'rgba(54, 207, 201, 0.3)'
    },
    purple: {
      primary: 'from-[#b18cff] to-[#8a5cf6]',
      secondary: 'from-[#8a5cf6] to-[#6d5efc]',
      accent: 'from-[#36cfc9] to-[#b18cff]',
      glow: 'rgba(177, 140, 255, 0.3)'
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const cycleAccentColor = () => {
    const colors = Object.keys(accentColors);
    setAccentColor(prev => {
      const currentIndex = colors.indexOf(prev);
      return colors[(currentIndex + 1) % colors.length];
    });
  };

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply accent color CSS variables
    const root = document.documentElement;
    const colors = accentColors[accentColor];
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--accent-${key}`, value);
    });
  }, [theme, accentColor]);

  const value = {
    theme,
    accentColor,
    accentColors: accentColors[accentColor],
    toggleTheme,
    cycleAccentColor
  };

  return (
    <ThemeContext.Provider value={value}>
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`theme-${theme} accent-${accentColor}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ThemeContext.Provider>
  );
};
