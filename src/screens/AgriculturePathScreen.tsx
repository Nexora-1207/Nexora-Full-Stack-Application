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
const ACCENT_DARK  = '#88FF00';
const ACCENT_LIGHT = '#559900';
const cardWidth = width * 0.75;

const CAREER_TREE: any = {
  root: {
    question: 'FOUNDATION',
    subtitle: 'Select your starting qualification',
    options: [
      { id: 'inter', label: 'INTERMEDIATE (10+2)', sub: 'Academic Route', next: 'inter_stream', brief: 'Complete 11th & 12th in Agriculture or Science to unlock B.Sc, B.Tech Agri, and research programs.' },
      { id: 'diploma', label: 'DIPLOMA IN AGRICULTURE', sub: 'Technical Mastery (2-3 Yrs)', next: 'diploma_branch', brief: 'Focused diploma programs in crop science, horticulture, and farm management.' },
      { id: 'iti', label: 'ITI HORTICULTURE', sub: 'Vocational Skills (1 Yr)', next: 'iti_note', brief: 'Hands-on training in plant nursery, greenhouse management, and irrigation systems.' },
      { id: 'cert', label: 'VOCATIONAL CERTIFICATE', sub: 'Short Skill Program (6-12 Mo)', next: 'cert_note', brief: 'Certificate courses in organic farming, hydroponics, or agri-drone operation.' },
    ]
  },
  inter_stream: {
    question: 'STREAM HUB',
    subtitle: 'Choose your 10+2 stream',
    options: [
      { id: 'agri_sci', label: 'AGRICULTURE SCIENCE', sub: 'Biology, Agri, Chemistry', next: 'degree_path', brief: 'Dedicated agriculture stream opening doors to B.Sc Agriculture and animal husbandry degrees.' },
      { id: 'mbipc', label: 'SCIENCE (PCB / MBiPC)', sub: 'Biology & Chemistry', next: 'degree_path', brief: 'General science stream also qualifying for agriculture, veterinary, and food science programs.' },
    ]
  },
  degree_path: {
    question: 'DEGREE PATH',
    subtitle: 'Select your university program',
    options: [
      { id: 'bsc_agri', label: 'B.SC AGRICULTURE', sub: 'Agri Science Degree (4 Yrs)', next: 'success', brief: 'Premier agriculture degree covering crop science, plant pathology, and soil chemistry for agri-research.' },
      { id: 'btech_agrotech', label: 'B.TECH AGRICULTURAL ENGINEERING', sub: 'Engineering Degree (4 Yrs)', next: 'success', brief: 'Combines mechanical engineering with agriculture for farm machinery, irrigation design, and precision farming.' },
      { id: 'bsc_hort', label: 'B.SC HORTICULTURE', sub: 'Plant Science Degree (4 Yrs)', next: 'success', brief: 'Focused on fruit, vegetable, and flower cultivation for agribusiness and export markets.' },
    ]
  },
  diploma_branch: {
    question: 'DIPLOMA BRANCH',
    subtitle: 'Select your specialization',
    options: [
      { id: 'crop_sci', label: 'CROP SCIENCE & AGRONOMY', sub: 'Soil & Crop Management', next: 'success', brief: 'Learn integrated crop management, fertilizer application, pest control, and farm economics.' },
      { id: 'horticulture', label: 'HORTICULTURE & FLORICULTURE', sub: 'Plant Cultivation', next: 'success', brief: 'Cultivate high-value fruits, vegetables, flowers, and ornamental plants for domestic and export markets.' },
      { id: 'agri_biz', label: 'AGRI-BUSINESS MANAGEMENT', sub: 'Farm Commerce & Trade', next: 'success', brief: 'Covers agricultural marketing, cooperative management, and rural entrepreneurship skills.' },
    ]
  },
  iti_note: {
    type: 'info',
    question: 'ITI HORTICULTURE',
    text: 'ITI HORTICULTURE TRADE:\nThe fastest vocational entry into plant science and nursery operations.\n\nTRAINING COVERS:\n- Seed bed preparation and nursery management\n- Grafting, budding, and layering techniques\n- Greenhouse construction and hydroponic systems\n- Landscape design and lawn maintenance\n- Pest and disease management (IPM)\n\nCAREER PATHS:\n- Nursery Technician\n- Greenhouse Operator\n- Landscape Maintenance Worker\n- Horticulture Department (State Agriculture Boards)\n\nSALARY:\n- Entry Level: ₹1.5 – 2.8 LPA\n- Specialized Horticulturist: ₹3.0 – 5.0 LPA',
    next: 'success'
  },
  cert_note: {
    type: 'info',
    question: 'CERTIFICATE PATHWAYS',
    text: 'AGRICULTURE CERTIFICATE COURSES:\nShort programs for modern farming skills and agri-tech roles.\n\nPOPULAR OPTIONS:\n- Organic Farming Certification (3-6 Mo)\n- Hydroponic & Aeroponic Systems (3 Mo)\n- Agri-Drone Pilot Training (1 Mo)\n- Cold Chain & Post-Harvest Technology (3 Mo)\n- NABARD Certified Rural Development (6 Mo)\n\nOFFERED BY:\n- State Agriculture Universities\n- IARI, ICAR, KVK (Krishi Vigyan Kendra)\n- NSDC Agriculture Skill Councils\n\nSALARY:\n- Agri-Field Technician: ₹1.8 – 3.5 LPA\n- Drone Pilot (Agriculture): ₹3.0 – 6.0 LPA',
    next: 'success'
  },
  success: {
    question: 'MISSION STATUS',
    subtitle: 'Pathway Synchronized.',
    options: []
  }
};

const AgriculturePathScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const themeAccent = isDark ? ACCENT_DARK : ACCENT_LIGHT;

  useEffect(() => {
    const saveSector = async () => {
      try { await AsyncStorage.setItem('activeSector', 'AGRICULTURE'); } catch (_) {}
    };
    saveSector();
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
              supabase.from('profiles').upsert({ id: user.id, sector: 'AGRICULTURE', updated_at: new Date() })
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
          <Animated.View style={[styles.progressPulse, { width: `${(history.length + 1) * 15}%`, backgroundColor: themeAccent }]} />
        </View>
        <Text style={styles.headerTag}>AGRICULTURE</Text>
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
  floatingCard: { width: cardWidth, backgroundColor: isDark ? 'rgba(10,10,20,0.98)' : '#FFF', borderRadius: 25, borderWidth: 1, borderColor: isDark ? 'rgba(136,255,0,0.1)' : 'rgba(0,0,0,0.05)', padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: isDark ? 0.9 : 0.1, shadowRadius: 30, elevation: isDark ? 20 : 10 },
  cardHeader: { marginBottom: 25, alignItems: 'center' },
  nodeTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 4, marginBottom: 5 },
  nodeSubtitle: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  optionsArea: { width: '100%' },
  optionBox: { width: '100%', borderRadius: 15, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)', overflow: 'hidden' as any, backgroundColor: isDark ? 'transparent' : '#FDFDFD' },
  optionGrad: { ...StyleSheet.absoluteFillObject },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  optionLabel: { color: isDark ? 'rgba(255,255,255,0.7)' : '#333', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  optionSub: { color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)', fontSize: 9, fontWeight: 'bold' },
  briefingView: { marginTop: 15, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(136,255,0,0.1)' : 'rgba(0,0,0,0.05)', paddingTop: 10 },
  briefTxt: { color: isDark ? 'rgba(255,255,255,0.5)' : '#555', fontSize: 10, lineHeight: 15, fontWeight: '500' },
  infoScroll: { maxHeight: 350 },
  infoTxt: { color: isDark ? 'rgba(255,255,255,0.6)' : '#444', fontSize: 11, lineHeight: 18, fontWeight: '600', letterSpacing: 0.5 },
  proceedBtn: { marginTop: 25, padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  proceedTxt: { color: '#000', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginRight: 10 },
  successPulse: { alignItems: 'center', marginTop: 20 },
  successTxt: { fontSize: 10, fontWeight: '900', letterSpacing: 4, marginTop: 12 },
});

export default AgriculturePathScreen;
