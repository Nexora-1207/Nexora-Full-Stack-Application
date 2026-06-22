import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, useColorScheme, StatusBar } from 'react-native';

const neonCyan = '#00F0FF';
const darkCyan = '#008B8B';

const IntroScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Graceful fade in and scale up animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Navigate to Selection screen after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Selection');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, scaleAnim, opacityAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Animated.Image 
        source={require('../../assets/nexora_n_transparent.png')}
        style={[styles.logo, {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim
        }]}
        resizeMode="contain"
      />
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#020205' : '#F4F6F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    shadowColor: isDark ? neonCyan : darkCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  }
});

export default IntroScreen;
