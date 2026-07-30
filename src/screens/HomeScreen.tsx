import React, { useRef, useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, Animated, Dimensions,
  Platform, useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { ThemeToggle } from '../components/ThemeToggle';
import { CareerSwitcher } from '../components/CareerSwitcher';
import { SECTOR_THEMES } from '../theme/sectorThemes';

const { width } = Dimensions.get('window');

// SUB-COMPONENTS
const FeatureCard = ({ title, sub, color, icon, isDark }: any) => (
  <TouchableOpacity style={[
    styles.featureCard, 
    { 
      borderColor: isDark ? color + '30' : color + '50',
      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
      shadowColor: color
    }
  ]}>
      <View style={[styles.featureIcon, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={[styles.featureTitle, { color: isDark ? '#FFF' : '#111' }]} numberOfLines={1}>{title}</Text>
      <Text style={[styles.featureSub, { color: isDark ? 'rgba(255,255,255,0.4)' : '#666' }]}>{sub}</Text>
  </TouchableOpacity>
);

const ModuleBox = ({ title, icon, color, desc, isDark }: any) => (
  <TouchableOpacity style={[
    styles.moduleBox,
    { 
      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' 
    }
  ]}>
    <View style={styles.moduleRow}>
        <Ionicons name={icon as any} size={20} color={color} />
        <Text style={[styles.moduleText, { color: isDark ? '#FFF' : '#111' }]}>{title}</Text>
    </View>
    <View style={[styles.moduleDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]} />
    <Text style={[styles.moduleDesc, { color: isDark ? 'rgba(255,255,255,0.5)' : '#555' }]}>{desc}</Text>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const isFocused = useIsFocused();
  const [activeSector, setActiveSector] = useState('ENGINEERING');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Retrieve selected sector from storage on mount & focus
  useEffect(() => {
    if (isFocused) {
      const loadSector = async () => {
        try {
          const stored = await AsyncStorage.getItem('activeSector');
          if (stored && SECTOR_THEMES[stored]) {
            setActiveSector(stored);
          }
        } catch (_) {}
      };
      loadSector();
    }
  }, [isFocused]);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 2000, useNativeDriver: false })
      ])
    ).start();
  }, []);

  const currentTheme = SECTOR_THEMES[activeSector] || SECTOR_THEMES.ENGINEERING;
  const primaryColor = currentTheme.primary;
  const secondaryColor = currentTheme.secondary;

  const hudGlow = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: isDark 
      ? [`${primaryColor}15`, `${primaryColor}60`] 
      : [`${primaryColor}30`, `${primaryColor}80`]
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const textTheme = { color: isDark ? '#FFF' : '#0F172A' };
  const subTextTheme = { color: isDark ? 'rgba(255,255,255,0.5)' : '#475569' };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={isDark ? currentTheme.gradientDark : currentTheme.gradientLight} 
        style={StyleSheet.absoluteFillObject} 
      />
      <ThemeToggle />
      
      <View style={styles.header}>
        <View>
          <Text style={[styles.brandText, { 
            color: isDark ? '#FFF' : '#111',
            textShadowColor: primaryColor,
            textShadowRadius: isDark ? 12 : 4 
          }]}>NEXORA</Text>
          <Text style={[styles.welcomeMsg, subTextTheme]}>{currentTheme.welcomeSub}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.profileBtn, { 
            borderColor: isDark ? `${primaryColor}40` : `${primaryColor}60`,
            backgroundColor: isDark ? `${primaryColor}0d` : '#FFF'
          }]} 
          onPress={handleLogout}
        >
          <Ionicons name="exit-outline" size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        contentContainerStyle={styles.scrollArea}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {/* HUD Pulse Card */}
        <Animated.View style={[
          styles.hudCard, 
          { 
            backgroundColor: isDark ? 'rgba(5, 12, 30, 0.4)' : '#FFF',
            borderColor: hudGlow, 
            shadowColor: primaryColor, 
            shadowOpacity: pulseAnim,
            elevation: isDark ? 10 : 3
          }
        ]}>
            <View style={styles.hudRow}>
                <View style={[styles.hudCircle, { 
                  borderColor: primaryColor,
                  shadowColor: primaryColor,
                  backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#F8FAFC'
                }]}>
                    <Text style={[styles.hudPerc, textTheme]}>{currentTheme.matchedPerc}</Text>
                    <Text style={[styles.hudLabel, { color: primaryColor }]}>{currentTheme.statusText}</Text>
                </View>
                <View style={styles.hudInfo}>
                    <Text style={[styles.hudTitle, textTheme]}>{currentTheme.welcomeTitle}</Text>
                    <Text style={[styles.hudSub, subTextTheme]}>Active Academic Synchronizer</Text>
                    <View style={[styles.miniBar, { backgroundColor: isDark ? '#000' : '#E2E8F0' }]}>
                        <View style={[styles.miniFill, { width: currentTheme.matchedPerc as any, backgroundColor: primaryColor }]} />
                    </View>
                    <Text style={[styles.hudTip, subTextTheme]}>
                      Profile parameters are optimized for high placement matching.
                    </Text>
                </View>
            </View>
        </Animated.View>

        {/* Featured Sector Applications */}
        <Text style={[styles.sectionHeader, textTheme]}>Featured Applications</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {currentTheme.features.map((feat, i) => (
              <FeatureCard 
                key={i} 
                title={feat.title} 
                sub={feat.sub} 
                color={feat.color} 
                icon={feat.icon} 
                isDark={isDark} 
              />
            ))}
        </ScrollView>

        {/* Sector Specific Modules */}
        <Text style={[styles.sectionHeader, textTheme]}>Your Sector Hub</Text>
        <View style={styles.grid}>
          {currentTheme.modules.map((mod, i) => (
            <ModuleBox 
              key={i} 
              title={mod.title} 
              icon={mod.icon} 
              color={mod.color} 
              desc={mod.desc} 
              isDark={isDark} 
            />
          ))}
        </View>

        {/* Sector Specific Events */}
        {currentTheme.events.length > 0 && (
          <>
            <Text style={[styles.sectionHeader, textTheme]}>Student Events</Text>
            {currentTheme.events.map((evt, i) => (
              <TouchableOpacity key={i} style={[
                styles.eventRow,
                { 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                }
              ]}>
                  <View style={[styles.dateBox, { borderRightColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]}>
                      <Text style={[styles.dateNum, { color: primaryColor }]}>{evt.dateNum}</Text>
                      <Text style={[styles.dateMon, textTheme]}>{evt.dateMon}</Text>
                  </View>
                  <View style={styles.eventInfo}>
                      <Text style={[styles.eventTitle, textTheme]}>{evt.title}</Text>
                      <Text style={[styles.eventSub, subTextTheme]}>{evt.sub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={isDark ? "rgba(255,255,255,0.2)" : "#AAA"} />
              </TouchableOpacity>
            ))}
          </>
        )}
        <CareerSwitcher />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 25, paddingTop: 60, paddingBottom: 25
  },
  brandText: { fontSize: 28, fontWeight: '900', letterSpacing: 5 },
  welcomeMsg: { fontSize: 13, fontWeight: 'bold', marginTop: 4 },
  profileBtn: { width: 50, height: 50, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  scrollArea: { paddingHorizontal: 20, paddingBottom: 150 },
  hudCard: { padding: 25, borderRadius: 30, borderWidth: 1, marginTop: 10, shadowRadius: 15, shadowOffset: { width: 0, height: 4 } },
  hudRow: { flexDirection: 'row', alignItems: 'center' },
  hudCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 3.5, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 0 }, shadowRadius: 10, shadowOpacity: 0.3 },
  hudPerc: { fontSize: 20, fontWeight: '900' },
  hudLabel: { fontSize: 7, fontWeight: '900', marginTop: 2, textAlign: 'center', letterSpacing: 0.5 },
  hudInfo: { marginLeft: 25, flex: 1 },
  hudTitle: { fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  hudSub: { fontSize: 12, marginTop: 4, fontWeight: 'bold' },
  miniBar: { height: 7, borderRadius: 4, marginTop: 15, overflow: 'hidden' },
  miniFill: { height: '100%', borderRadius: 4 },
  hudTip: { fontSize: 10, marginTop: 10, fontStyle: 'italic' },
  sectionHeader: { fontSize: 18, fontWeight: '900', marginTop: 40, marginBottom: 20, marginLeft: 5, letterSpacing: 1 },
  horizontalScroll: { paddingBottom: 15 },
  featureCard: { width: 220, padding: 20, borderRadius: 28, marginRight: 15, borderWidth: 1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, shadowOpacity: 0.05, elevation: 1 },
  featureIcon: { width: 52, height: 52, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  featureTitle: { fontSize: 15, fontWeight: '900' },
  featureSub: { fontSize: 11, marginTop: 5, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  moduleBox: { width: (width - 55) / 2, padding: 22, borderRadius: 28, marginBottom: 15, borderWidth: 1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, shadowOpacity: 0.03, elevation: 1 },
  moduleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  moduleText: { fontSize: 13, fontWeight: '900', marginLeft: 10 },
  moduleDivider: { height: 1, width: 30, marginBottom: 12 },
  moduleDesc: { fontSize: 11, lineHeight: 16, fontWeight: '500' },
  eventRow: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 25, borderWidth: 1, marginBottom: 12, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, shadowOpacity: 0.03, elevation: 1 },
  dateBox: { width: 55, alignItems: 'center', borderRightWidth: 1, marginRight: 18 },
  dateNum: { fontSize: 20, fontWeight: '900' },
  dateMon: { fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 14, fontWeight: '800' },
  eventSub: { fontSize: 11.5, marginTop: 4 }
});

export default HomeScreen;
