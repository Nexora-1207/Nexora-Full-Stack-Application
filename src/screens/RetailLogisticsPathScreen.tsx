import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, StatusBar,
  useColorScheme, SafeAreaView, Animated
} from 'react-native';
import TopNavBar from '../components/TopNavBar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const BLUE_DARK  = '#3300FF';
const BLUE_LIGHT = '#2200CC';

// ─── DATA (placeholder for Retail & Logistics) ─────────────────────────────────────

const WHY_OPTIONS = [
  { id: 'people',  text: 'I enjoy interacting with customers' },
  { id: 'logistics', text: 'I like coordinating supply chains' },
  { id: 'growth',   text: 'I want a fast‑growing career' },
];

const WHAT_CARDS = [
  { icon: 'truck-outline',            label: 'Transportation' },
  { icon: 'warehouse-outline',        label: 'Warehouse' },
  { icon: 'cash-multiple',            label: 'Retail Sales' },
  { icon: 'scale-outline',            label: 'Inventory' },
];

const CHECKLIST_Q = [
  'Do you enjoy problem‑solving logistics?',
  'Do you like working with people?',
  'Are you comfortable with fast‑paced environments?',
];

const PERSONALITY = [
  { skill: 'Organization', icon: 'format-list-bulleted', why: 'Keep supply chains running smoothly.' },
  { skill: 'Communication', icon: 'chat-outline', why: 'Coordinate with vendors and customers.' },
  { skill: 'Analytical', icon: 'chart-box-outline', why: 'Optimize routes and inventory.' },
];

const CHECKPOINTS = [
  { id: 1, label: 'Complete Class 10', icon: 'school-outline', detail: 'Finish high school with a focus on maths and commerce.' },
  { id: 2, label: 'Choose Class 11 & 12', icon: 'book-outline', detail: 'Science, Commerce or Arts – all streams accepted.', sub: ['Science', 'Commerce', 'Arts'] },
  { id: 3, label: 'Skill Development', icon: 'sparkles-outline', detail: 'Learn Excel, logistics software, and customer service.' },
];

const SKILLS = [
  { icon: 'truck-fast', skill: 'Supply Chain Management' },
  { icon: 'cash',      skill: 'Retail Operations' },
  { icon: 'account-star-outline', skill: 'Leadership' },
];

const CAREERS = [
  { role: 'Logistics Manager',        icon: 'truck',          what: 'Oversees transportation, warehousing and distribution.', skills: 'Planning, Coordination' },
  { role: 'Retail Store Manager',    icon: 'storefront',    what: 'Manages daily retail operations and staff.', skills: 'Customer Service, Sales' },
  { role: 'Supply Chain Analyst',    icon: 'chart-line',    what: 'Analyzes data to improve efficiency.', skills: 'Analytics, Excel' },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const RetailLogisticsPathScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const C = isDark ? BLUE_DARK : BLUE_LIGHT;

  useEffect(() => {
    const saveSector = async () => {
      try {
        await AsyncStorage.setItem('activeSector', 'RETAIL & LOGISTICS');
      } catch (_) {}
    };
    saveSector();
  }, []);

  const scrollRef = useRef<ScrollView>(null);
  const [whySelected, setWhySelected] = useState<string[]>([]);
  const [checkAnswers, setCheckAnswers] = useState<{ [k: number]: boolean | null }>({});
  const [expandedCP, setExpandedCP] = useState<number | null>(null);
  const [scrollPct, setScrollPct] = useState(0);

  const answered = Object.keys(checkAnswers).length;
  const yesCount = Object.values(checkAnswers).filter(v => v === true).length;

  const handleScroll = (e: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const total = contentSize.height - layoutMeasurement.height;
    if (total > 0) setScrollPct(Math.min(Math.max(contentOffset.y / total, 0), 1));
  };

  const restart = () => {
    setWhySelected([]);
    setCheckAnswers({});
    setExpandedCP(null);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const bg = isDark ? '#020209' : '#F5F8FC';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }] }>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={isDark ? ['#020205', '#0D0D1D'] : ['#F4F6F9', '#E6E9F0']} style={styles.background} />
      <TopNavBar title="Retail & Logistics" />
      {/* Placeholder UI – reuse components from Hospitality with new data */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Retail & Logistics Career Path</Text>
          <Text style={styles.heroSubtitle}>Explore opportunities from store floor to supply chain leadership.</Text>
        </View>
        {/* Why Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Retail & Logistics?</Text>
          <View style={styles.optionsContainer}>
            {WHY_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.optionButton, whySelected.includes(opt.id) && { backgroundColor: C }]}
                onPress={() => setWhySelected(prev => prev.includes(opt.id) ? prev.filter(i => i !== opt.id) : [...prev, opt.id])}
              >
                <Text style={styles.optionText}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* What You Can Do */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What can you do?</Text>
          <View style={styles.cardsContainer}>
            {WHAT_CARDS.map(card => (
              <View key={card.label} style={styles.card}>
                <MaterialCommunityIcons name={card.icon as any} size={32} color={C} />
                <Text style={styles.cardLabel}>{card.label}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Self‑Check</Text>
          {CHECKLIST_Q.map((q, idx) => (
            <View key={idx} style={styles.checkItem}>
              <Text style={styles.checkQuestion}>{q}</Text>
              <View style={styles.checkButtons}>
                <TouchableOpacity onPress={() => setCheckAnswers({ ...checkAnswers, [idx]: true })} style={styles.checkBtnYes}>
                  <Text style={styles.checkBtnText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCheckAnswers({ ...checkAnswers, [idx]: false })} style={styles.checkBtnNo}>
                  <Text style={styles.checkBtnText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        {/* Personality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Personality Fit</Text>
          <View style={styles.personalityContainer}>
            {PERSONALITY.map(p => (
              <View key={p.skill} style={styles.personalityItem}>
                <Ionicons name={p.icon as any} size={28} color={C} />
                <Text style={styles.personalitySkill}>{p.skill}</Text>
                <Text style={styles.personalityWhy}>{p.why}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Checkpoints */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Roadmap</Text>
          {CHECKPOINTS.map(cp => (
            <View key={cp.id} style={styles.checkpointItem}>
              <TouchableOpacity onPress={() => setExpandedCP(expandedCP === cp.id ? null : cp.id)}>
                <View style={styles.checkpointHeader}>
                  <MaterialCommunityIcons name={cp.icon as any} size={24} color={C} />
                  <Text style={styles.checkpointLabel}>{cp.label}</Text>
                </View>
                {expandedCP === cp.id && (
                  <Text style={styles.checkpointDetail}>{cp.detail}</Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Skills</Text>
          <View style={styles.skillsContainer}>
            {SKILLS.map(s => (
              <View key={s.skill} style={styles.skillItem}>
                <MaterialCommunityIcons name={s.icon as any} size={28} color={C} />
                <Text style={styles.skillText}>{s.skill}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Careers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Career Options</Text>
          {CAREERS.map(c => (
            <View key={c.role} style={styles.careerItem}>
              <MaterialCommunityIcons name={c.icon as any} size={28} color={C} />
              <View style={styles.careerInfo}>
                <Text style={styles.careerRole}>{c.role}</Text>
                <Text style={styles.careerWhat}>{c.what}</Text>
                <Text style={styles.careerSkills}>Key: {c.skills}</Text>
              </View>
            </View>
          ))}
        </View>
        {/* CTA */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity style={[styles.ctaButton, { backgroundColor: C }]} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.ctaText}>Start Your Journey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.restartBtn} onPress={restart}>
            <Text style={styles.restartText}>Restart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  scrollContent: { padding: 16, paddingBottom: 100 },
  hero: { marginTop: 60, marginBottom: 30 },
  heroTitle: { fontSize: 28, fontWeight: '700', color: '#fff' },
  heroSubtitle: { fontSize: 16, color: '#ddd', marginTop: 8 },
  section: { marginVertical: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '600', marginBottom: 12, color: '#fff' },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  optionButton: { padding: 10, borderRadius: 8, backgroundColor: '#333', margin: 4 },
  optionText: { color: '#fff' },
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: (width - 64) / 2, backgroundColor: '#222', borderRadius: 12, padding: 12, marginBottom: 12, alignItems: 'center' },
  cardLabel: { marginTop: 8, color: '#fff' },
  checkItem: { marginBottom: 12 },
  checkQuestion: { color: '#fff', marginBottom: 4 },
  checkButtons: { flexDirection: 'row' },
  checkBtnYes: { backgroundColor: '#006400', padding: 8, borderRadius: 4, marginRight: 8 },
  checkBtnNo: { backgroundColor: '#8B0000', padding: 8, borderRadius: 4 },
  checkBtnText: { color: '#fff' },
  personalityContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  personalityItem: { width: (width - 64) / 2, marginBottom: 12 },
  personalitySkill: { color: '#fff', marginTop: 4 },
  personalityWhy: { color: '#ccc', fontSize: 12 },
  checkpointItem: { marginBottom: 8 },
  checkpointHeader: { flexDirection: 'row', alignItems: 'center' },
  checkpointLabel: { marginLeft: 8, color: '#fff' },
  checkpointDetail: { color: '#ddd', marginLeft: 32, marginTop: 4 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  skillItem: { width: (width - 64) / 3, alignItems: 'center', marginBottom: 12 },
  skillText: { color: '#fff', marginTop: 4 },
  careerItem: { flexDirection: 'row', marginBottom: 12 },
  careerInfo: { marginLeft: 8 },
  careerRole: { color: '#fff', fontWeight: '600' },
  careerWhat: { color: '#ccc' },
  careerSkills: { color: '#aaa', fontSize: 12 },
  ctaContainer: { alignItems: 'center', marginTop: 30 },
  ctaButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  ctaText: { color: '#fff', fontWeight: '600' },
  restartBtn: { marginTop: 12 },
  restartText: { color: '#aaa' },
});

export default RetailLogisticsPathScreen;
