import React, { useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, Animated, Dimensions,
  Platform, useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');
const neonCyan = '#00F0FF';
const darkCyan = '#008B8B';

// SUB-COMPONENTS
const FeatureCard = ({ title, sub, color, icon, styles, isDark }: any) => (
  <TouchableOpacity style={[styles.featureCard, { borderColor: isDark ? color + '20' : color + '40' }]}>
      <View style={[styles.featureIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <Text style={styles.featureTitle} numberOfLines={1}>{title}</Text>
      <Text style={styles.featureSub}>{sub}</Text>
  </TouchableOpacity>
);

const ModuleBox = ({ title, icon, color, desc, styles, isDark }: any) => (
  <TouchableOpacity style={styles.moduleBox}>
    <View style={styles.moduleRow}>
        <Ionicons name={icon} size={22} color={color} />
        <Text style={styles.moduleText}>{title}</Text>
    </View>
    <View style={styles.moduleDivider} />
    <Text style={styles.moduleDesc}>{desc}</Text>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const themeCyan = isDark ? neonCyan : darkCyan;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 2000, useNativeDriver: false })
      ])
    ).start();
  }, []);

  const hudGlow = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: isDark ? ['rgba(0, 240, 255, 0.05)', 'rgba(0, 240, 255, 0.4)'] : ['rgba(0, 139, 139, 0.1)', 'rgba(0, 139, 139, 0.4)']
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brandText}>NEXORA</Text>
          <Text style={styles.welcomeMsg}>Welcome to Hub, Nexora Student!</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={handleLogout}>
          <Ionicons name="exit-outline" size={24} color={themeCyan} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        contentContainerStyle={styles.scrollArea}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        <Animated.View style={[styles.hudCard, { borderColor: hudGlow, shadowColor: hudGlow, shadowOpacity: pulseAnim }]}>
            <View style={styles.hudRow}>
                <View style={styles.hudCircle}>
                    <Text style={styles.hudPerc}>84%</Text>
                    <Text style={styles.hudLabel}>MATCHED</Text>
                </View>
                <View style={styles.hudInfo}>
                    <Text style={styles.hudTitle}>Career Launchpad</Text>
                    <Text style={styles.hudSub}>Scholarship Matches Active</Text>
                    <View style={styles.miniBar}>
                        <View style={[styles.miniFill, { width: '84%' }]} />
                    </View>
                    <Text style={styles.hudTip}>You are 16% away from Elite status.</Text>
                </View>
            </View>
        </Animated.View>

        <Text style={styles.sectionHeader}>Featured Applications</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <FeatureCard title="Global STEM 2026" sub="Open for Juniors" color="#FF008A" icon="star" styles={styles} isDark={isDark} />
            <FeatureCard title="Google Career Pro" sub="New Opportunity" color={themeCyan} icon="logo-google" styles={styles} isDark={isDark} />
            <FeatureCard title="Nexora Resume Bot" sub="Analyze Instantly" color="#AF52DE" icon="flash" styles={styles} isDark={isDark} />
            <FeatureCard title="Internship Match" sub="12 New Matches" color="#FFD700" icon="briefcase" styles={styles} isDark={isDark} />
        </ScrollView>

        <Text style={styles.sectionHeader}>Your Student Hub</Text>
        <View style={styles.grid}>
          <ModuleBox title="Scholarships" icon="trophy" color="#FFD700" desc="34 Active Fundings" styles={styles} isDark={isDark} />
          <ModuleBox title="Resume Lab" icon="document-text" color={themeCyan} desc="Build with Nexora AI" styles={styles} isDark={isDark} />
          <ModuleBox title="Community" icon="people" color="#AF52DE" desc="Join the live chat" styles={styles} isDark={isDark} />
          <ModuleBox title="Career Quiz" icon="help-buoy" color="#FF8A00" desc="Discover your path" styles={styles} isDark={isDark} />
        </View>

        <Text style={styles.sectionHeader}>Student Events</Text>
        <TouchableOpacity style={styles.eventRow}>
            <View style={styles.dateBox}>
                <Text style={styles.dateNum}>28</Text>
                <Text style={styles.dateMon}>MAR</Text>
            </View>
            <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Nexora Scholarship Fair (Online)</Text>
                <Text style={styles.eventSub}>Join 1.2k Students this Friday</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? "#333" : "#AAA"} />
        </TouchableOpacity>
      </Animated.ScrollView>
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDark ? '#020205' : '#F4F6F9' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 25, paddingTop: 60, paddingBottom: 25
  },
  brandText: { fontSize: 28, fontWeight: '900', color: isDark ? '#FFF' : '#111', letterSpacing: 5, textShadowColor: isDark ? neonCyan : darkCyan, textShadowRadius: 10 },
  welcomeMsg: { fontSize: 13, color: isDark ? '#666' : '#888', fontWeight: 'bold', marginTop: 4 },
  profileBtn: { width: 50, height: 50, borderRadius: 18, backgroundColor: isDark ? 'rgba(0, 240, 255, 0.05)' : 'rgba(0, 139, 139, 0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: isDark ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0, 139, 139, 0.2)' },
  scrollArea: { paddingHorizontal: 20, paddingBottom: 150 },
  hudCard: { padding: 25, backgroundColor: isDark ? '#0A0A1F' : '#FFF', borderRadius: 30, borderWidth: 1, marginTop: 10, shadowRadius: 20, elevation: isDark ? 0 : 5 },
  hudRow: { flexDirection: 'row', alignItems: 'center' },
  hudCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 3.5, borderColor: isDark ? neonCyan : darkCyan, justifyContent: 'center', alignItems: 'center', shadowColor: isDark ? neonCyan : darkCyan, shadowOpacity: 0.5, shadowRadius: 15 },
  hudPerc: { color: isDark ? '#FFF' : '#111', fontSize: 20, fontWeight: '900' },
  hudLabel: { color: isDark ? neonCyan : darkCyan, fontSize: 8, fontWeight: '900', marginTop: 2 },
  hudInfo: { marginLeft: 25, flex: 1 },
  hudTitle: { color: isDark ? '#FFF' : '#111', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  hudSub: { color: isDark ? '#888' : '#555', fontSize: 12, marginTop: 4, fontWeight: 'bold' },
  miniBar: { height: 7, backgroundColor: isDark ? '#000' : '#E0E0E0', borderRadius: 4, marginTop: 15, overflow: 'hidden', borderWidth: 1, borderColor: isDark ? '#111' : '#D0D0D0' },
  miniFill: { height: '100%', backgroundColor: isDark ? neonCyan : darkCyan },
  hudTip: { color: isDark ? '#444' : '#888', fontSize: 10, marginTop: 10, fontStyle: 'italic' },
  sectionHeader: { fontSize: 18, fontWeight: '900', color: isDark ? '#FFF' : '#111', marginTop: 40, marginBottom: 20, marginLeft: 5, letterSpacing: 1 },
  horizontalScroll: { paddingBottom: 15 },
  featureCard: { width: 220, backgroundColor: isDark ? '#0D0D1D' : '#FFF', padding: 20, borderRadius: 28, marginRight: 15, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)', shadowColor: '#000', shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 10, elevation: 2 },
  featureIcon: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  featureTitle: { color: isDark ? '#FFF' : '#111', fontSize: 16, fontWeight: '900' },
  featureSub: { color: isDark ? '#444' : '#666', fontSize: 12, marginTop: 5, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  moduleBox: { width: (width - 55) / 2, backgroundColor: isDark ? '#0D0D1D' : '#FFF', padding: 22, borderRadius: 28, marginBottom: 15, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.05)', shadowColor: '#000', shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 10, elevation: 2 },
  moduleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  moduleText: { color: isDark ? '#FFF' : '#111', fontSize: 14, fontWeight: '900', marginLeft: 13 },
  moduleDivider: { height: 1, width: 30, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)', marginBottom: 12 },
  moduleDesc: { color: isDark ? '#555' : '#777', fontSize: 12, lineHeight: 18 },
  eventRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#0D0D1D' : '#FFF', padding: 20, borderRadius: 25, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.05)', shadowColor: '#000', shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 10, elevation: 2 },
  dateBox: { width: 55, alignItems: 'center', borderRightWidth: 1, borderRightColor: isDark ? '#222' : '#EEE', marginRight: 18 },
  dateNum: { color: isDark ? neonCyan : darkCyan, fontSize: 20, fontWeight: '900' },
  dateMon: { color: isDark ? '#FFF' : '#111', fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  eventInfo: { flex: 1 },
  eventTitle: { color: isDark ? '#FFF' : '#111', fontSize: 15, fontWeight: '800' },
  eventSub: { color: isDark ? '#555' : '#777', fontSize: 12, marginTop: 4 }
});

export default HomeScreen;
