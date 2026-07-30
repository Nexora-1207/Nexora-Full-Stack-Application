// src/components/ThemeToggle.tsx
import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../theme/ThemeContext';

/**
 * Clean inline toggle button. Switches between light and dark themes.
 */
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const iconName = isDark ? 'sunny-outline' : 'moon-outline';
  const iconColor = isDark ? '#FFAA00' : '#475569'; // Standard theme gold for dark, slate gray for light

  return (
    <TouchableOpacity 
      onPress={toggleTheme} 
      style={styles.toggle} 
      accessibilityLabel="Toggle theme"
      activeOpacity={0.7}
    >
      <Ionicons name={iconName} size={24} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    ...Platform.select({
      web: {
        outlineWidth: 0,
        outlineColor: 'transparent',
        outlineStyle: 'none',
      } as any,
    }),
  },
});
