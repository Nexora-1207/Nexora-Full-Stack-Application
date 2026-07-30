import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

type ThemeContextProps = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Load saved theme or system preference
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem('appTheme');
        if (stored === 'light' || stored === 'dark') {
          setTheme(stored);
        } else {
          const sys = Appearance.getColorScheme();
          setTheme(sys === 'dark' ? 'dark' : 'light');
        }
      } catch (_) {}
    };
    load();
  }, []);

  const toggleTheme = async () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      await AsyncStorage.setItem('appTheme', next);
    } catch (_) {}
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
