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
const ACCENT_DARK  = '#FF0055';
const ACCENT_LIGHT = '#CC0044';
const cardWidth = width * 0.75;

const CAREER_TREE: any = {
  root: {
    question: 'ENTRY ROUTE',
    subtitle: 'Select your starting qualification',
    options: [
      { id: 'inter', label: 'INTERMEDIATE (10+2)', sub: 'Science / Biology', next: 'inter_stream', brief: 'Complete 11th & 12th to unlock paramedical or allied health degree programs.' },
      { id: 'diploma', label: 'PARAMEDICAL DIPLOMA', sub: 'Technical Medical (2-3 Yrs)', next: 'diploma_branch', brief: 'Focused diploma programs for clinical technician roles in hospitals and labs.' },
      { id: 'cert', label: 'CERTIFICATE COURSE', sub: 'Short-term (6-12 Mo)', next: 'cert_note', brief: 'Quick certification programs for nursing aide, phlebotomy, or first aid skills.' },
    ]
  },
  inter_stream: {
    question: 'STREAM HUB',
    subtitle: 'Select your academic stream',
    options: [
      { id: 'mbipc', label: 'MBiPC / PCB', sub: 'Biology Core Stream', next: 'degree_path', brief: 'Mandatory for MBBS, Nursing, Pharmacy, and allied health sciences programs.' },
      { id: 'mpc', label: 'MPC / PCM', sub: 'Maths Science Stream', next: 'tech_degree', brief: 'Opens doors to biomedical engineering and hospital IT management degrees.' },
    ]
  },
  degree_path: {
    question: 'ALLIED HEALTH DEGREE',
    subtitle: 'Choose your medical support program',
    options: [
      { id: 'gnm', label: 'GNM NURSING', sub: 'General Nursing & Midwifery (3 Yrs)', next: 'success', brief: 'Most popular healthcare career path. Eligible for government hospital employment.' },
      { id: 'bsc_nursing', label: 'B.SC NURSING', sub: 'Degree Program (4 Yrs)', next: 'success', brief: 'Full nursing degree with clinical training for senior hospital roles and ICU management.' },
      { id: 'pharmacy', label: 'D.PHARM / B.PHARM', sub: 'Pharmacy (2-4 Yrs)', next: 'success', brief: 'Pharmaceutical sciences for drug dispensing, clinical pharmacy, and hospital operations.' },
    ]
  },
  tech_degree: {
    question: 'TECH MEDICAL',
    subtitle: 'Choose your biomedical path',
    options: [
      { id: 'bme', label: 'BIOMEDICAL ENGINEERING', sub: 'B.Tech (4 Yrs)', next: 'success', brief: 'Combines medicine and engineering to design medical devices and hospital equipment.' },
      { id: 'health_informatics', label: 'HEALTH INFORMATICS', sub: 'B.Sc / BCA (3 Yrs)', next: 'success', brief: 'Manages hospital information systems, patient records, and digital health software.' },
    ]
  },
  diploma_branch: {
    question: 'PARAMEDICAL DIPLOMA',
    subtitle: 'Select your clinical specialization',
    options: [
      { id: 'lab_tech', label: 'MEDICAL LAB TECHNOLOGY', sub: 'Clinical Testing (2 Yrs)', next: 'success', brief: 'Operate lab equipment to conduct blood, urine, and tissue diagnostic tests.' },
      { id: 'radio', label: 'RADIOLOGY TECHNOLOGY', sub: 'X-ray & Imaging (2 Yrs)', next: 'success', brief: 'Perform X-rays, CT scans, MRI, and sonography imaging for diagnostic departments.' },
      { id: 'ot', label: 'OPERATION THEATRE TECH', sub: 'Surgical Support (2 Yrs)', next: 'success', brief: 'Assist surgeons in OT setup, sterilization, anesthesia monitoring, and instrument handling.' },
      { id: 'ecg', label: 'ECG & CARDIOLOGY TECH', sub: 'Cardiac Diagnostics (1 Yr)', next: 'success', brief: 'Perform ECG, Holter monitoring, and stress tests in cardiology departments.' },
    ]
  },
  cert_note: {
    type: 'info',
    question: 'CERTIFICATE PATHWAYS',
    text: 'MEDICAL SUPPORT CERTIFICATE COURSES:\nShort-term programs for quick entry into the healthcare sector.\n\nPOPULAR OPTIONS:\n- Nursing Aide / Patient Care Attendant (6 Mo)\n- Phlebotomy Technician (3-6 Mo)\n- First Aid & Emergency Response (1-3 Mo)\n- Community Health Worker (6 Mo)\n- Dialysis Technician Assistant (6 Mo)\n\nELIGIBILITY:\n- 10th Pass minimum\n- Physical fitness certificate\n- Offered at: Government medical colleges, NSDC centers, Red Cross\n\nSALARY RANGE:\n- ₹1.2 – 2.5 LPA (entry level)\n- Growth with experience and certifications',
    next: 'success'
  },
  success: {
    question: 'MISSION STATUS',
    subtitle: 'Pathway Synchronized.',
    options: []
  }
};

const MedicalSupportPathScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const themeAccent = isDark ? ACCENT_DARK : ACCENT_LIGHT;

  useEffect(() => {
    const saveSector = async () => {
      try { await AsyncStorage.setItem('activeSector', 'MEDICAL SUPPORT'); } catch (_) {}
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
              supabase.from('profiles').upsert({ id: user.id, sector: 'MEDICAL SUPPORT', updated_at: new Date() })
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
        <Text style={styles.headerTag}>MEDICAL SUPPORT</Text>
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
  floatingCard: { width: cardWidth, backgroundColor: isDark ? 'rgba(10,10,20,0.98)' : '#FFF', borderRadius: 25, borderWidth: 1, borderColor: isDark ? 'rgba(255,0,85,0.1)' : 'rgba(0,0,0,0.05)', padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: isDark ? 0.9 : 0.1, shadowRadius: 30, elevation: isDark ? 20 : 10 },
  cardHeader: { marginBottom: 25, alignItems: 'center' },
  nodeTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 4, marginBottom: 5 },
  nodeSubtitle: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  optionsArea: { width: '100%' },
  optionBox: { width: '100%', borderRadius: 15, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)', overflow: 'hidden' as any, backgroundColor: isDark ? 'transparent' : '#FDFDFD' },
  optionGrad: { ...StyleSheet.absoluteFillObject },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  optionLabel: { color: isDark ? 'rgba(255,255,255,0.7)' : '#333', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  optionSub: { color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)', fontSize: 9, fontWeight: 'bold' },
  briefingView: { marginTop: 15, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,0,85,0.1)' : 'rgba(0,0,0,0.05)', paddingTop: 10 },
  briefTxt: { color: isDark ? 'rgba(255,255,255,0.5)' : '#555', fontSize: 10, lineHeight: 15, fontWeight: '500' },
  infoScroll: { maxHeight: 350 },
  infoTxt: { color: isDark ? 'rgba(255,255,255,0.6)' : '#444', fontSize: 11, lineHeight: 18, fontWeight: '600', letterSpacing: 0.5 },
  proceedBtn: { marginTop: 25, padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  proceedTxt: { color: '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginRight: 10 },
  successPulse: { alignItems: 'center', marginTop: 20 },
  successTxt: { fontSize: 10, fontWeight: '900', letterSpacing: 4, marginTop: 12 },
});

export default MedicalSupportPathScreen;
