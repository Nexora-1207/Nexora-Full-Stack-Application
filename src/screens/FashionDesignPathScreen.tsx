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
const ACCENT_DARK  = '#FF00FF';
const ACCENT_LIGHT = '#AA00AA';
const cardWidth = width * 0.75;

const CAREER_TREE: any = {
  root: {
    question: 'FOUNDATION',
    subtitle: 'Select your starting qualification',
    options: [
      { id: 'inter', label: 'INTERMEDIATE (10+2)', sub: 'Academic Route', next: 'degree_path', brief: 'Complete 11th & 12th to unlock fashion design degree programs at top design institutions.' },
      { id: 'diploma', label: 'FASHION DIPLOMA', sub: 'Design Institute (2-3 Yrs)', next: 'diploma_branch', brief: 'Diploma programs in garment construction, fashion illustration, and textile design.' },
      { id: 'cert', label: 'VOCATIONAL CERTIFICATE', sub: 'Short Skill Program (6-12 Mo)', next: 'cert_note', brief: 'Practical skill certifications in tailoring, embroidery, or pattern making for quick jobs.' },
    ]
  },
  degree_path: {
    question: 'DESIGN DEGREE',
    subtitle: 'Choose your creative program',
    options: [
      { id: 'bdes', label: 'B.DES FASHION DESIGN', sub: 'Design Degree (4 Yrs)', next: 'success', brief: 'Premier 4-year design program offered by NIFT, NID, and Symbiosis. Covers draping, CAD, and brand design.' },
      { id: 'bsc_fashion', label: 'B.SC FASHION TECHNOLOGY', sub: 'Technology Degree (3 Yrs)', next: 'success', brief: 'Combines garment technology, textile engineering, and supply chain management.' },
      { id: 'ba_fashion', label: 'BA FASHION DESIGN', sub: 'Arts Degree (3 Yrs)', next: 'success', brief: 'Covers fashion history, styling, photography, and creative direction for media & branding.' },
    ]
  },
  diploma_branch: {
    question: 'DIPLOMA BRANCH',
    subtitle: 'Select your design specialization',
    options: [
      { id: 'garment', label: 'GARMENT CONSTRUCTION', sub: 'Pattern Making & Stitching', next: 'success', brief: 'Learn pattern drafting, sewing machine operations, and industrial garment production methods.' },
      { id: 'fashion_illus', label: 'FASHION ILLUSTRATION', sub: 'Design Drawing & Sketching', next: 'success', brief: 'Master figure drawing, fabric rendering, and digital fashion illustration using tools like Adobe Illustrator.' },
      { id: 'textile', label: 'TEXTILE DESIGN', sub: 'Fabric & Surface Design', next: 'success', brief: 'Create woven, printed, and embroidered textile patterns for fashion and home furnishing industries.' },
      { id: 'accessory', label: 'ACCESSORIES DESIGN', sub: 'Bags, Jewelry & Footwear', next: 'success', brief: 'Specialize in designing leather goods, jewelry, footwear, and accessories for fashion brands.' },
    ]
  },
  cert_note: {
    type: 'info',
    question: 'CERTIFICATE PATHWAYS',
    text: 'FASHION & DESIGN CERTIFICATE COURSES:\nQuick practical programs for entry into garment and textile industries.\n\nPOPULAR OPTIONS:\n- Tailoring & Stitching (3-6 Mo)\n- Embroidery & Hand Work (3 Mo)\n- Boutique Management (6 Mo)\n- Fashion Photography (3-6 Mo)\n- Digital Fashion Illustration (3 Mo)\n\nOFFERED BY:\n- NSDC Skill Centers\n- State Handloom Board Training\n- Private Fashion Institutes\n- Craftsmen Training Scheme (CTS)\n\nSALARY:\n- Boutique Tailor: ₹1.5 – 3.5 LPA\n- Fashion Assistant: ₹2.5 – 5.0 LPA\n- Freelance Designer: Variable, higher earnings',
    next: 'success'
  },
  success: {
    question: 'MISSION STATUS',
    subtitle: 'Pathway Synchronized.',
    options: []
  }
};

const FashionDesignPathScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const themeAccent = isDark ? ACCENT_DARK : ACCENT_LIGHT;

  useEffect(() => {
    const saveSector = async () => {
      try { await AsyncStorage.setItem('activeSector', 'FASHION & DESIGN'); } catch (_) {}
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
              supabase.from('profiles').upsert({ id: user.id, sector: 'FASHION & DESIGN', updated_at: new Date() })
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
        <Text style={styles.headerTag}>FASHION & DESIGN</Text>
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
                  <Ionicons name="arrow-forward" size={18} color={'#FFF'} />
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
  floatingCard: { width: cardWidth, backgroundColor: isDark ? 'rgba(10,10,20,0.98)' : '#FFF', borderRadius: 25, borderWidth: 1, borderColor: isDark ? 'rgba(255,0,255,0.1)' : 'rgba(0,0,0,0.05)', padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: isDark ? 0.9 : 0.1, shadowRadius: 30, elevation: isDark ? 20 : 10 },
  cardHeader: { marginBottom: 25, alignItems: 'center' },
  nodeTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 4, marginBottom: 5 },
  nodeSubtitle: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  optionsArea: { width: '100%' },
  optionBox: { width: '100%', borderRadius: 15, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)', overflow: 'hidden' as any, backgroundColor: isDark ? 'transparent' : '#FDFDFD' },
  optionGrad: { ...StyleSheet.absoluteFillObject },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  optionLabel: { color: isDark ? 'rgba(255,255,255,0.7)' : '#333', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  optionSub: { color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)', fontSize: 9, fontWeight: 'bold' },
  briefingView: { marginTop: 15, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,0,255,0.1)' : 'rgba(0,0,0,0.05)', paddingTop: 10 },
  briefTxt: { color: isDark ? 'rgba(255,255,255,0.5)' : '#555', fontSize: 10, lineHeight: 15, fontWeight: '500' },
  infoScroll: { maxHeight: 350 },
  infoTxt: { color: isDark ? 'rgba(255,255,255,0.6)' : '#444', fontSize: 11, lineHeight: 18, fontWeight: '600', letterSpacing: 0.5 },
  proceedBtn: { marginTop: 25, padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  proceedTxt: { color: '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginRight: 10 },
  successPulse: { alignItems: 'center', marginTop: 20 },
  successTxt: { fontSize: 10, fontWeight: '900', letterSpacing: 4, marginTop: 12 },
});

export default FashionDesignPathScreen;
