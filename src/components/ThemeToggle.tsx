// src/components/ThemeToggle.tsx
import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../theme/ThemeContext';

/**
 * Simple toggle button displayed in the top‑right corner of the Home screen.
 * It switches between the light and dark themes defined in ThemeContext.
 */
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const iconName = isDark ? 'sunny' : 'moon';
  const iconColor = isDark ? '#FFD700' : '#FFF';

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.toggle} accessibilityLabel="Toggle theme">
      <Ionicons name={iconName} size={28} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggle: {
    position: 'absolute',
    top: 45,
    right: 20,
    zIndex: 10,
  },
});
