'use client';

import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextType {
  theme: 'dark';
  resolvedTheme: 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  resolvedTheme: 'dark'
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Permanently ensure dark theme on root
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', resolvedTheme: 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
