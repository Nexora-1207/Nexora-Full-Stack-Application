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
const ACCENT_DARK  = '#00F0FF';
const ACCENT_LIGHT = '#008844';
const cardWidth = width * 0.75;

const CAREER_TREE: any = {
  root: {
    question: 'FOUNDATION',
    subtitle: 'Select your entry point',
    options: [
      { id: 'inter', label: 'INTERMEDIATE (10+2)', sub: 'Academic Route', next: 'inter_stream', brief: 'Complete 11th & 12th to unlock degree programs in B.Tech, BCA, or B.Sc Computer Science.' },
      { id: 'diploma', label: 'POLYTECHNIC DIPLOMA', sub: 'Technical Mastery (3 Yrs)', next: 'diploma_branch', brief: 'A 3-year computer engineering diploma enabling lateral entry to B.Tech or industry jobs.' },
      { id: 'iti', label: 'ITI – COPA TRADE', sub: 'Vocational IT (1 Yr)', next: 'iti_note', brief: 'Computer Operator & Programming Assistant – fastest ITI route into IT office roles.' },
      { id: 'cert', label: 'VOCATIONAL CERTIFICATE', sub: 'Short-term Coding (6-12 Mo)', next: 'cert_note', brief: 'Intensive coding bootcamps in web development, app building, or data entry skills.' },
    ]
  },
  inter_stream: {
    question: 'STREAM SELECT',
    subtitle: 'Choose your 10+2 subject combination',
    options: [
      { id: 'mpc_cs', label: 'SCIENCE + COMPUTER SCIENCE', sub: 'Maths, Physics, CS', next: 'degree_path', brief: 'Strongest path for B.Tech CSE, AI/ML, or software engineering degree admissions.' },
      { id: 'commerce_cs', label: 'COMMERCE + COMPUTER SCIENCE', sub: 'Commerce, Accounts, CS', next: 'degree_path', brief: 'Suitable for BCA or business information systems degrees.' },
    ]
  },
  degree_path: {
    question: 'DEGREE PATH',
    subtitle: 'Select your target university program',
    options: [
      { id: 'btech', label: 'B.TECH CSE / AI', sub: 'Engineering Degree (4 Yrs)', next: 'success', brief: 'Premier software engineering degree preparing you for top-tier IT companies and research roles.' },
      { id: 'bca', label: 'BCA', sub: 'Computer Applications (3 Yrs)', next: 'success', brief: 'Focus on software development, database management, and application design.' },
      { id: 'bsc_cs', label: 'B.SC COMPUTER SCIENCE', sub: 'Science Degree (3 Yrs)', next: 'success', brief: 'Covers programming, algorithms, networks, and OS with a strong theory foundation.' },
    ]
  },
  diploma_branch: {
    question: 'DIPLOMA BRANCH',
    subtitle: 'Select your technical specialization',
    options: [
      { id: 'comp_eng', label: 'COMPUTER ENGINEERING', sub: 'Hardware + Software', next: 'success', brief: 'Covers OS, networking, databases, and hardware integration for industry roles.' },
      { id: 'it', label: 'INFORMATION TECHNOLOGY', sub: 'Software & IT Services', next: 'success', brief: 'Focuses on application development, cloud computing, and enterprise IT systems.' },
      { id: 'ai_ml', label: 'AI & MACHINE LEARNING', sub: 'Emerging Tech Specialization', next: 'success', brief: 'Cutting-edge diploma covering neural networks, Python AI, and data science pipelines.' },
    ]
  },
  iti_note: {
    type: 'info',
    question: 'ITI COPA PATHWAY',
    text: 'COMPUTER OPERATOR & PROGRAMMING ASSISTANT:\nThe fastest entry to IT support and office roles after 10th.\n\nTRAINING COVERS:\n- MS Office & ERP tools\n- HTML, CSS, and JavaScript basics\n- Database management (MS Access, MySQL)\n- Networking fundamentals and cyber hygiene\n\nCAREER GROWTH:\n- Data Entry Operator → Office IT Assistant\n- IT Support Technician → Network Admin\n- Stipend during apprenticeship: ₹7,700 – ₹10,000/month\n\nSALARY RANGE:\n- Entry: ₹1.8 – 3.0 LPA\n- Mid-Level: ₹3.5 – 6.0 LPA',
    next: 'success'
  },
  cert_note: {
    type: 'info',
    question: 'CERTIFICATE PATHWAY',
    text: 'CODING BOOTCAMPS & CERTIFICATION COURSES:\nShort-term intensive programs that build job-ready skills in 6-12 months.\n\nPOPULAR CERTIFICATIONS:\n- Full Stack Web Development (React, Node.js)\n- Python for Data Science & AI\n- Certified Ethical Hacker (CEH)\n- AWS Cloud Practitioner\n- Google Digital Marketing\n\nPROGRAMS OFFERED BY:\n- NIELIT (DOEACC) Government Centers\n- NIIT, Aptech, Arena Animation\n- Online: Coursera, NPTEL, Udemy\n\nSALARY RANGE:\n- Freelancer: ₹1.5 – 5.0 LPA (variable)\n- Junior Developer: ₹3.0 – 6.0 LPA',
    next: 'success'
  },
  success: {
    question: 'MISSION STATUS',
    subtitle: 'Pathway Synchronized.',
    options: []
  }
};

const ComputersPathScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const themeAccent = isDark ? ACCENT_DARK : ACCENT_LIGHT;

  useEffect(() => {
    const saveSector = async () => {
      try { await AsyncStorage.setItem('activeSector', 'COMPUTERS'); } catch (_) {}
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
              supabase.from('profiles').upsert({ id: user.id, sector: 'COMPUTERS', updated_at: new Date() })
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
        <Text style={styles.headerTag}>COMPUTERS & IT</Text>
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
                  <Ionicons name="arrow-forward" size={18} color={isDark ? '#000' : '#FFF'} />
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
  floatingCard: { width: cardWidth, backgroundColor: isDark ? 'rgba(10,10,20,0.98)' : '#FFF', borderRadius: 25, borderWidth: 1, borderColor: isDark ? 'rgba(0,240,255,0.1)' : 'rgba(0,0,0,0.05)', padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: isDark ? 0.9 : 0.1, shadowRadius: 30, elevation: isDark ? 20 : 10 },
  cardHeader: { marginBottom: 25, alignItems: 'center' },
  nodeTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 4, marginBottom: 5 },
  nodeSubtitle: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  optionsArea: { width: '100%' },
  optionBox: { width: '100%', borderRadius: 15, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)', overflow: 'hidden' as any, backgroundColor: isDark ? 'transparent' : '#FDFDFD' },
  optionGrad: { ...StyleSheet.absoluteFillObject },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  optionLabel: { color: isDark ? 'rgba(255,255,255,0.7)' : '#333', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  optionSub: { color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)', fontSize: 9, fontWeight: 'bold' },
  briefingView: { marginTop: 15, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(0,240,255,0.1)' : 'rgba(0,0,0,0.05)', paddingTop: 10 },
  briefTxt: { color: isDark ? 'rgba(255,255,255,0.5)' : '#555', fontSize: 10, lineHeight: 15, fontWeight: '500' },
  infoScroll: { maxHeight: 350 },
  infoTxt: { color: isDark ? 'rgba(255,255,255,0.6)' : '#444', fontSize: 11, lineHeight: 18, fontWeight: '600', letterSpacing: 0.5 },
  proceedBtn: { marginTop: 25, padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  proceedTxt: { color: isDark ? '#000' : '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginRight: 10 },
  successPulse: { alignItems: 'center', marginTop: 20 },
  successTxt: { fontSize: 10, fontWeight: '900', letterSpacing: 4, marginTop: 12 },
});

export default ComputersPathScreen;
