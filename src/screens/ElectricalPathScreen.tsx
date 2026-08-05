import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, Platform,
  StatusBar, ScrollView, useColorScheme
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');
const ACCENT_DARK  = '#FFEE00';
const ACCENT_LIGHT = '#BB9900';
const cardWidth = width * 0.75;

const CAREER_TREE: any = {
  root: {
    question: 'ENTRY ROUTE',
    subtitle: 'Select your starting qualification',
    options: [
      { id: 'iti', label: 'ITI TRADE', sub: 'Vocational Skills (1-2 Yrs)', next: 'iti_trade', brief: 'Hands-on electrical trade training for fast entry into industrial and domestic wiring careers.' },
      { id: 'diploma', label: 'DIPLOMA IN ELECTRICAL ENGINEERING', sub: 'Technical Degree (3 Yrs)', next: 'diploma_branch', brief: 'A 3-year diploma in power systems, electrical machines, and control engineering.' },
      { id: 'degree', label: 'B.TECH ELECTRICAL ENGINEERING', sub: '10+2 Science Route (4 Yrs)', next: 'degree_note', brief: 'Engineering degree for power sector, smart grids, and GATE/PSU positions.' },
    ]
  },
  iti_trade: {
    question: 'ITI TRADE',
    subtitle: 'Choose your electrical specialization',
    options: [
      { id: 'electrician', label: 'ELECTRICIAN TRADE', sub: 'Domestic & Industrial Wiring', next: 'success', brief: 'Install, test, and repair electrical wiring, switchboards, and control panels in homes and factories.' },
      { id: 'wireman', label: 'WIREMAN TRADE', sub: 'Wiring & Panel Fitting', next: 'success', brief: 'Specialize in overhead line erection, underground cabling, and LT/HT panel installations.' },
      { id: 'electronics', label: 'ELECTRONIC MECHANIC', sub: 'Circuit Repair & Assembly', next: 'success', brief: 'Repair and maintain consumer electronics, industrial controllers, PCBs, and audio-visual systems.' },
    ]
  },
  diploma_branch: {
    question: 'DIPLOMA BRANCH',
    subtitle: 'Select your technical specialization',
    options: [
      { id: 'power_sys', label: 'POWER SYSTEMS & MACHINES', sub: 'Generators & Transformers', next: 'success', brief: 'Study power generation, transmission lines, transformer design, and electrical machine maintenance.' },
      { id: 'control_inst', label: 'CONTROL & INSTRUMENTATION', sub: 'Automation & PLCs', next: 'success', brief: 'Covers PLC programming, SCADA, sensors, process control, and industrial automation systems.' },
      { id: 'renewable', label: 'RENEWABLE ENERGY SYSTEMS', sub: 'Solar & Wind Power', next: 'renewable_note', brief: 'Specialize in solar PV installation, wind turbine maintenance, and smart energy grids.' },
    ]
  },
  renewable_note: {
    type: 'info',
    question: 'RENEWABLE ENERGY INTEL',
    text: 'RENEWABLE ENERGY SYSTEMS – A Green Career:\nIndia targets 500 GW renewable energy by 2030. This sector is booming.\n\nKEY SUBJECTS:\n- Solar PV Cell Design & Installation\n- Wind Turbine O&M (Operation & Maintenance)\n- Energy Storage Systems (Lithium Batteries)\n- Smart Grid & Net Metering\n- MNRE Certification Requirements\n\nCAREER ROLES:\n- Solar PV Technician: ₹2.5 – 5.0 LPA\n- Wind Turbine O&M Engineer: ₹4.0 – 8.0 LPA\n- Renewable Energy Project Manager: ₹8.0 – 15.0 LPA\n\nTOP EMPLOYERS:\n- NTPC Green Energy, Adani Solar, Tata Power Solar, ReNew Power',
    next: 'success'
  },
  degree_note: {
    type: 'info',
    question: 'B.TECH ELECTRICAL PATHWAY',
    text: 'B.TECH ELECTRICAL ENGINEERING:\nThe gateway to power utilities, PSUs, and research roles.\n\nELIGIBILITY:\n- 10+2 PCM with 60%+ marks\n- JEE Mains / State CET Entrance Exam\n\nKEY SUBJECTS:\n- Electrical Machines & Power Electronics\n- High Voltage Engineering\n- Smart Grid & FACTS Devices\n- Power System Protection & Relaying\n- Digital Signal Processing\n\nCAREER PATHS:\n- Electrical Site Engineer: ₹4.0 – 8.0 LPA\n- Power Plant Engineer: ₹5.0 – 12.0 LPA\n- PSU Engineer (GATE qualified): ₹8.0 – 18.0 LPA\n- Research & Development Engineer: ₹10.0+ LPA',
    next: 'success'
  },
  success: {
    question: 'MISSION STATUS',
    subtitle: 'Pathway Synchronized.',
    options: []
  }
};

const ElectricalPathScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const themeAccent = isDark ? ACCENT_DARK : ACCENT_LIGHT;

  useEffect(() => {
    const saveSector = async () => {
      try { await AsyncStorage.setItem('activeSector', 'ELECTRICAL'); } catch (_) {}
    };
    saveSector();

    // Initial entry animation for the card
    slideAnim.setValue(width);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true })
    ]).start();
  }, []);

  const [currentNodeKey, setCurrentNodeKey] = useState('root');
  const [history, setHistory] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(1)).current;

  const node = CAREER_TREE[currentNodeKey];

  const handleOptionSelect = (nextKey: string) => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -width, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 0,      duration: 250, useNativeDriver: true }),
    ]).start(() => {
      setHistory([...history, currentNodeKey]);
      setHoveredId(null);
      setCurrentNodeKey(nextKey);
      slideAnim.setValue(width);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        if (nextKey === 'success') {
          supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
              supabase.from('profiles').upsert({ id: user.id, sector: 'ELECTRICAL', updated_at: new Date() })
                .then(({ error }) => { if (error) console.log('Error saving sector:', error.message); });
            }
          });
          setTimeout(() => navigation.replace('Home'), 2000);
        }
      });
    });
  };

  const goBack = () => {
    if (history.length > 0) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: width,  duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0,      duration: 250, useNativeDriver: true }),
      ]).start(() => {
        const newHistory = [...history];
        const prevKey = newHistory.pop();
        setHistory(newHistory);
        setCurrentNodeKey(prevKey!);
        slideAnim.setValue(-width);
        Animated.parallel([
          Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(fadeAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={isDark ? ['#020205', '#080815'] : ['#F4F6F9', '#E6E9F0']} style={styles.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={themeAccent} />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressPulse, { width: `${(history.length + 1) * 20}%`, backgroundColor: themeAccent }]} />
        </View>
        <Text style={styles.headerTag}>ELECTRICAL</Text>
      </View>

      <View style={styles.centerStage}>
        <Animated.View style={[styles.floatingCard, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.nodeTitle, { color: themeAccent }]}>{node.question}</Text>
            {node.subtitle && <Text style={styles.nodeSubtitle}>{node.subtitle}</Text>}
          </View>

          <View style={styles.optionsArea}>
            {node.type === 'info' ? (
              <ScrollView style={styles.infoScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.infoTxt}>{node.text}</Text>
                <TouchableOpacity style={[styles.proceedBtn, { backgroundColor: themeAccent }]} onPress={() => handleOptionSelect(node.next)}>
                  <Text style={styles.proceedTxt}>PROCEED</Text>
                  <Ionicons name="arrow-forward" size={18} color={'#000'} />
                </TouchableOpacity>
              </ScrollView>
            ) : (
              node.options.map((option: any) => {
                const isHovered = hoveredId === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.optionBox, isHovered && { borderColor: themeAccent + '66' }]}
                    onPress={() => handleOptionSelect(option.next)}
                    onMouseEnter={() => setHoveredId(option.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={isHovered ? [themeAccent + '22', 'transparent'] : ['rgba(255,255,255,0.02)', 'transparent']}
                      style={styles.optionGrad}
                    />
                    <View style={styles.optionHeader}>
                      <Text style={[styles.optionLabel, isHovered && { color: themeAccent }]}>{option.label}</Text>
                      <Ionicons name="cube-outline" size={18} color={isHovered ? themeAccent : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)')} />
                    </View>
                    <Text style={styles.optionSub}>{option.sub}</Text>
                    {isHovered && (
                      <View style={styles.briefingView}>
                        <Text style={styles.briefTxt}>{option.brief}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}

            {currentNodeKey === 'success' && (
              <View style={styles.successPulse}>
                <MaterialCommunityIcons name="check-decagram" size={60} color={themeAccent} />
                <Text style={[styles.successTxt, { color: themeAccent }]}>MAPPER FINALIZED</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDark ? '#020205' : '#F4F6F9' },
  background: { ...StyleSheet.absoluteFillObject },
  header: { height: 120, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingTop: Platform.OS === 'ios' ? 50 : 30, justifyContent: 'space-between' },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', shadowColor: '#000', shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 5, elevation: 2 },
  progressTrack: { flex: 1, height: 2, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)', marginHorizontal: 20, borderRadius: 2, overflow: 'hidden' },
  progressPulse: { height: '100%' },
  headerTag: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  centerStage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingCard: { width: cardWidth, backgroundColor: isDark ? 'rgba(10,10,20,0.98)' : '#FFF', borderRadius: 25, borderWidth: 1, borderColor: isDark ? 'rgba(255,238,0,0.1)' : 'rgba(0,0,0,0.05)', padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: isDark ? 0.9 : 0.1, shadowRadius: 30, elevation: isDark ? 20 : 10 },
  cardHeader: { marginBottom: 25, alignItems: 'center' },
  nodeTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 4, marginBottom: 5 },
  nodeSubtitle: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  optionsArea: { width: '100%' },
  optionBox: { width: '100%', borderRadius: 15, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)', overflow: 'hidden' as any, backgroundColor: isDark ? 'transparent' : '#FDFDFD' },
  optionGrad: { ...StyleSheet.absoluteFillObject },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  optionLabel: { color: isDark ? 'rgba(255,255,255,0.7)' : '#333', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  optionSub: { color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)', fontSize: 9, fontWeight: 'bold' },
  briefingView: { marginTop: 15, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,238,0,0.1)' : 'rgba(0,0,0,0.05)', paddingTop: 10 },
  briefTxt: { color: isDark ? 'rgba(255,255,255,0.5)' : '#555', fontSize: 10, lineHeight: 15, fontWeight: '500' },
  infoScroll: { maxHeight: 350 },
  infoTxt: { color: isDark ? 'rgba(255,255,255,0.6)' : '#444', fontSize: 11, lineHeight: 18, fontWeight: '600', letterSpacing: 0.5 },
  proceedBtn: { marginTop: 25, padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  proceedTxt: { color: '#000', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginRight: 10 },
  successPulse: { alignItems: 'center', marginTop: 20 },
  successTxt: { fontSize: 10, fontWeight: '900', letterSpacing: 4, marginTop: 12 },
});

export default ElectricalPathScreen;
