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
const ACCENT_DARK  = '#00FF88';
const ACCENT_LIGHT = '#007744';
const cardWidth = width * 0.75;

const CAREER_TREE: any = {
  root: {
    question: 'MEDIA DOMAIN',
    subtitle: 'Choose your creative sector',
    options: [
      { id: 'journalism', label: 'JOURNALISM & PRINT', sub: 'News, Writing & Reporting', next: 'journalism_path', brief: 'Cover news events, write feature articles, and report for newspapers, magazines, and online portals.' },
      { id: 'broadcast', label: 'BROADCAST MEDIA', sub: 'TV, Radio & Digital', next: 'broadcast_path', brief: 'Produce and present content for television, radio, YouTube, and streaming platforms.' },
      { id: 'film', label: 'FILM & CINEMA', sub: 'Production & Direction', next: 'film_path', brief: 'Write scripts, direct shoots, and produce short films, documentaries, and feature films.' },
      { id: 'digital', label: 'DIGITAL MEDIA & PR', sub: 'Social Media & Advertising', next: 'digital_note', brief: 'Manage brand communications, social media content, and digital advertising campaigns.' },
    ]
  },
  journalism_path: {
    question: 'JOURNALISM PATH',
    subtitle: 'Select your journalism program',
    options: [
      { id: 'ba_journ', label: 'BA JOURNALISM & MASS COMM', sub: 'Degree Program (3 Yrs)', next: 'success', brief: 'Covers reporting, editorial writing, media law, and press photography. Gateway to print and digital journalism.' },
      { id: 'diploma_journ', label: 'DIPLOMA IN JOURNALISM', sub: 'Technical Program (1 Yr)', next: 'success', brief: 'Short diploma covering news writing, reporting, and digital content production for quick entry.' },
    ]
  },
  broadcast_path: {
    question: 'BROADCAST PATH',
    subtitle: 'Select your media program',
    options: [
      { id: 'bsc_broadcast', label: 'B.SC ELECTRONIC MEDIA', sub: 'Broadcast Tech Degree (3 Yrs)', next: 'success', brief: 'Covers camera operations, editing, studio production, and news anchoring.' },
      { id: 'diploma_broadcast', label: 'DIPLOMA RADIO & TV', sub: 'Technical Diploma (1-2 Yrs)', next: 'success', brief: 'Practical training in studio equipment, voice modulation, and broadcast production workflows.' },
    ]
  },
  film_path: {
    question: 'FILM PATH',
    subtitle: 'Choose your cinema program',
    options: [
      { id: 'bfa_film', label: 'BFA FILM DIRECTION', sub: 'Fine Arts Degree (4 Yrs)', next: 'success', brief: 'Intensive cinema direction, screenwriting, and cinematography program at FTII or NSD.' },
      { id: 'diploma_film', label: 'DIPLOMA IN FILMMAKING', sub: 'Production Diploma (1-2 Yrs)', next: 'success', brief: 'Practical filmmaking covering pre-production, shooting, and post-production editing.' },
    ]
  },
  digital_note: {
    type: 'info',
    question: 'DIGITAL MEDIA PATHWAYS',
    text: 'DIGITAL MEDIA & PUBLIC RELATIONS:\nThe fastest growing sector in media today.\n\nKEY ROLES:\n- Social Media Manager\n- Content Creator & YouTuber\n- Digital Marketing Specialist\n- Brand PR Executive\n- SEO & SEM Analyst\n\nPROGRAMS:\n- BA Digital Media (3 Yrs)\n- Diploma in Advertising & PR (1-2 Yrs)\n- Certifications: Google Digital Marketing, HubSpot Content, Meta Blueprint\n\nSALARY:\n- Entry Digital Marketer: ₹2.5 – 5.0 LPA\n- Senior Brand Strategist: ₹8.0 – 15.0 LPA\n- Top YouTubers/Creators: Variable (₹10L+ possible)',
    next: 'success'
  },
  success: {
    question: 'MISSION STATUS',
    subtitle: 'Pathway Synchronized.',
    options: []
  }
};

const MediaPathScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const themeAccent = isDark ? ACCENT_DARK : ACCENT_LIGHT;

  useEffect(() => {
    const saveSector = async () => {
      try { await AsyncStorage.setItem('activeSector', 'MEDIA'); } catch (_) {}
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
              supabase.from('profiles').upsert({ id: user.id, sector: 'MEDIA', updated_at: new Date() })
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
        <Text style={styles.headerTag}>MEDIA & JOURNALISM</Text>
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
  floatingCard: { width: cardWidth, backgroundColor: isDark ? 'rgba(10,10,20,0.98)' : '#FFF', borderRadius: 25, borderWidth: 1, borderColor: isDark ? 'rgba(0,255,136,0.1)' : 'rgba(0,0,0,0.05)', padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: isDark ? 0.9 : 0.1, shadowRadius: 30, elevation: isDark ? 20 : 10 },
  cardHeader: { marginBottom: 25, alignItems: 'center' },
  nodeTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 4, marginBottom: 5 },
  nodeSubtitle: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  optionsArea: { width: '100%' },
  optionBox: { width: '100%', borderRadius: 15, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)', overflow: 'hidden' as any, backgroundColor: isDark ? 'transparent' : '#FDFDFD' },
  optionGrad: { ...StyleSheet.absoluteFillObject },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  optionLabel: { color: isDark ? 'rgba(255,255,255,0.7)' : '#333', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  optionSub: { color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)', fontSize: 9, fontWeight: 'bold' },
  briefingView: { marginTop: 15, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(0,255,136,0.1)' : 'rgba(0,0,0,0.05)', paddingTop: 10 },
  briefTxt: { color: isDark ? 'rgba(255,255,255,0.5)' : '#555', fontSize: 10, lineHeight: 15, fontWeight: '500' },
  infoScroll: { maxHeight: 350 },
  infoTxt: { color: isDark ? 'rgba(255,255,255,0.6)' : '#444', fontSize: 11, lineHeight: 18, fontWeight: '600', letterSpacing: 0.5 },
  proceedBtn: { marginTop: 25, padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  proceedTxt: { color: '#000', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginRight: 10 },
  successPulse: { alignItems: 'center', marginTop: 20 },
  successTxt: { fontSize: 10, fontWeight: '900', letterSpacing: 4, marginTop: 12 },
});

export default MediaPathScreen;
