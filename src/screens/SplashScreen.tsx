import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, useColorScheme, Image, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

const SplashScreen = ({ navigation }: any) => {
  const isDarkMode = useColorScheme() === 'dark' || true;
  const containerFadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnims = useRef("NEXORA".split('').map(() => ({ opacity: new Animated.Value(0), translateY: new Animated.Value(30) }))).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // START ALL LOGO & TEXT ANIMATIONS (NO ROTATION)
    Animated.timing(containerFadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]).start();

    // STAGGERED TITLE ANIMATION
    Animated.stagger(100, titleAnims.map(a => Animated.parallel([
        Animated.timing(a.opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(a.translateY, { toValue: 0, duration: 400, useNativeDriver: true })
    ]))).start();

  }, []);

  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.innerContainer, { opacity: containerFadeAnim }]}>
        
        {/* STABLE LOGO (NO ROTATION) */}
        <Animated.View style={[
            styles.logoWrapper, 
            { 
                opacity: logoOpacity, 
                transform: [
                    { scale: logoScale }
                ] 
            }
        ]}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
        </Animated.View>

        {/* COMPLETING THE INTRO TITLE */}
        <View style={styles.titleContainer}>
          {"NEXORA".split('').map((char, index) => (
            <Animated.Text key={index} style={[styles.title, { opacity: titleAnims[index].opacity, transform: [{ translateY: titleAnims[index].translateY }] }]}>
                {char}
            </Animated.Text>
          ))}
        </View>

        {/* DYNAMIC HUB INDICATOR (MAKES IT FEEL COMPLETE) */}
        <View style={styles.syncBox}>
            <ActivityIndicator size="small" color="#00F0FF80" />
            <Text style={styles.syncText}>SYNCING IDENTITY HUB...</Text>
        </View>
        
      </Animated.View>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020205', justifyContent: 'center', alignItems: 'center' },
  innerContainer: { alignItems: 'center' },
  logoWrapper: { 
    width: 150, height: 150, borderRadius: 30, backgroundColor: '#000', 
    marginBottom: 40, shadowColor: '#00F0FF', shadowOpacity: 0.8, 
    shadowRadius: 25, elevation: 20, borderWidth: 1, borderColor: '#00F0FF40' 
  },
  logoImage: { width: 150, height: 150, borderRadius: 30 },
  titleContainer: { flexDirection: 'row', marginBottom: 20 },
  title: { fontSize: 60, fontWeight: '900', color: '#FFF', textTransform: 'uppercase', letterSpacing: 8, textShadowColor: '#00F0FF', textShadowRadius: 15 },
  syncBox: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  syncText: { color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: 2, marginLeft: 15, fontWeight: 'bold' }
});

export default SplashScreen;
