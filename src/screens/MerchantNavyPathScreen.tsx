import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Animated, Dimensions, Platform, 
  StatusBar, ScrollView, useColorScheme 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const navyBlue = '#0077FF';
const seafoamGreen = '#38EF7D';
const cardWidth = width * 0.75; 

// DATASET: MERCHANT NAVY ENTRY INTELLIGENCE
const CAREER_TREE: any = {
  root: {
    question: "DEPARTMENTS",
    subtitle: "Select your desired maritime role",
    options: [
      { id: 'deck', label: "DECK DEPARTMENT", sub: "Navigation & Cargo Ops", next: 'deck_check', brief: "Responsible for steering, vessel safety, cargo handling, and communication. Leads to Ship Captain." },
      { id: 'engine', label: "ENGINE DEPARTMENT", sub: "Propulsion & Systems", next: 'engine_check', brief: "Responsible for operating and maintaining main engines, boilers, generators, and refrigeration. Leads to Chief Engineer." },
      { id: 'catering', label: "CATERING & SALOON", sub: "Hospitality & Stewarding", next: 'catering_check', brief: "Manages accommodation, culinary preparation, sanitation, and catering. Leads to Chief Cook." }
    ]
  },
  deck_check: {
    type: 'info',
    question: "DECK FITNESS CHECK",
    text: "Joining the Deck department requires the highest levels of visual acuity and physical stamina:\n\nPHYSICAL STANDARDS:\n- Vision: 6/6 in each eye without glasses (unaided). No color blindness allowed.\n- Height & Weight: Healthy BMI, physically fit with normal hearing.\n- Medical: Must secure a fitness certificate from a DG Shipping approved doctor.\n\nAre you ready to proceed?",
    next: 'course_selection'
  },
  engine_check: {
    type: 'info',
    question: "ENGINE FITNESS CHECK",
    text: "Engineers operate deep inside the ship, managing massive power networks and thermal plants:\n\nPHYSICAL STANDARDS:\n- Vision: Up to 6/12 in each eye (glasses allowed). No color blindness allowed.\n- Medical: Approved fitness certificate from a DG Shipping doctor.\n- Physical: Resilience to high temperatures and noise levels in engine compartments.\n\nAre you ready to proceed?",
    next: 'course_selection'
  },
  catering_check: {
    type: 'info',
    question: "CATERING FITNESS CHECK",
    text: "The Saloon crew ensures the health, hospitality, and daily comfort of all seafarers onboard:\n\nPHYSICAL STANDARDS:\n- Vision: Normal functional vision (glasses/aided allowed).\n- Medical: Standard DG Shipping medical certification.\n- Personal Hygiene: High standards of hygiene, culinary grooming, and physical fitness.\n\nAre you ready to proceed?",
    next: 'course_selection'
  },
  course_selection: {
    question: "POST-10th COURSE",
    subtitle: "Select your maritime training program",
    options: [
      { id: 'gp_rating', label: "GP RATING", sub: "General Purpose (6 Months)", next: 'gp_awareness', brief: "Direct deck & engine rating pre-sea training. Fast entry into shipping. Age 17.5 - 25 years. 40%+ marks in 10th." },
      { id: 'saloon_rating', label: "SALOON RATING", sub: "Catering & Cookery (6 Months)", next: 'saloon_awareness', brief: "Pre-sea training in maritime food production & hospitality. Age 17.5 - 25 years. 40%+ marks in 10th." },
      { id: 'dme', label: "TECHNICAL DIPLOMA", sub: "Polytechnic + 2-Yr DME", next: 'dme_awareness', brief: "3-year Diploma in Mechanical/Electrical, then 2-year DME. Pathway to join directly as Junior Marine Engineer." },
      { id: 'hsc_science', label: "10+2 SCIENCE (PCM)", sub: "Academic Route to Officer", next: 'hsc_awareness', brief: "Complete 11th & 12th with 60%+ in PCM. Qualify for IMU-CET, DNS (1 Yr) or B.Sc Nautical Science (3 Yrs)." }
    ]
  },
  gp_awareness: {
    type: 'info',
    question: "GP RATING PATHWAY",
    text: "COURSES AFTER 10th:\nGP Rating is the most direct entry to the merchant navy after Class 10.\n\nTRAINING INVOLVES:\nBasic seamanship, rope work, vessel maintenance, watchkeeping, engine diagnostics, welding, and safety drills (STCW).\n\nCAREER GROWTH:\n- Start as: Trainee Ordinary Seaman / Wiper (₹25k - ₹35k/mo stipend).\n- Next: Able Seaman -> Bosun -> Officer (by clearing MMD exams).\n\nCHALLENGES:\n- Heavy physical labor at sea.\n- Away from family for 6 to 9 months consecutively.",
    next: 'success'
  },
  saloon_awareness: {
    type: 'info',
    question: "SALOON PATHWAY",
    text: "COURSES AFTER 10th:\nSaloon Rating specializes in catering and hospitality on ships.\n\nTRAINING INVOLVES:\nMaritime culinary sciences, dietetics, housekeeping, hygiene, safety, and survival procedures.\n\nCAREER GROWTH:\n- Start as: Trainee Cook / Assistant Steward (₹18k - ₹30k/mo stipend).\n- Next: Chief Cook (₹1.5L - ₹3L/mo tax-free) -> Catering Officer.\n\nCHALLENGES:\n- Preparing food for diverse, multicultural crews during heavy weather.\n- 6-9 months contracts at sea.",
    next: 'success'
  },
  dme_awareness: {
    type: 'info',
    question: "DIPLOMA PATHWAY",
    text: "COURSES AFTER 10th:\nIf you want to become a Marine Engineer but finished 10th, do a 3-year Mechanical/Electrical Diploma first, then a 2-year Diploma in Marine Engineering (DME).\n\nTRAINING INVOLVES:\nAuxiliary engines, boilers, fluid dynamics, high-voltage grids, and electrical automations.\n\nCAREER GROWTH:\n- Start as: Junior Marine Engineer (₹60k - ₹1.2L/mo).\n- Next: 4th Engineer -> 3rd Engineer -> 2nd Engineer -> Chief Engineer (up to ₹8L - ₹12L/mo).\n\nCHALLENGES:\n- Requires 5 years of education before joining.\n- Engine room heat and technical breakdowns.",
    next: 'success'
  },
  hsc_awareness: {
    type: 'info',
    question: "10+2 PCM PATHWAY",
    text: "COURSES AFTER 10th:\nTo become a Deck Officer, complete Class 11 & 12 in Science (PCM) with 60%+, then clear the national IMU-CET exam.\n\nTRAINING INVOLVES:\nB.Sc Nautical Science (3 years) or B.Tech Marine Engineering (4 years) or DNS (1 year).\n\nCAREER GROWTH:\n- Start as: Deck Cadet / Trainee Engineer.\n- Next: 3rd Mate -> 2nd Mate -> Chief Officer -> Captain (up to ₹8L - ₹15L/mo).\n\nCHALLENGES:\n- High academic standards and study pressure.\n- Cost of education is higher.",
    next: 'success'
  },
  success: {
    question: "ROADMAP STAGED",
    subtitle: "Merchant Navy Pathway Synchronized.",
    options: []
  }
};

const MerchantNavyPathScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const themeBlue = isDark ? navyBlue : '#0055CC';

  useEffect(() => {
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
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const node = CAREER_TREE[currentNodeKey];

  const handleOptionSelect = (nextKey: string) => {
    Animated.parallel([
        Animated.timing(slideAnim, { toValue: -width, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true })
    ]).start(async () => {
        setHistory([...history, currentNodeKey]);
        setHoveredId(null);
        setCurrentNodeKey(nextKey);
        slideAnim.setValue(width);
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
        ]).start(async () => {
            if (nextKey === 'success') {
                try {
                  await AsyncStorage.setItem('activeSector', 'MERCHANT NAVY');
                } catch (_) {}
                setTimeout(() => navigation.replace('Home'), 2000);
            }
        });
    });
  };

  const goBack = () => {
    if (history.length > 0) {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: width, duration: 300, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true })
        ]).start(() => {
            const newHistory = [...history];
            const prevKey = newHistory.pop();
            setHistory(newHistory);
            setCurrentNodeKey(prevKey!);
            slideAnim.setValue(-width);
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
            ]).start();
        });
    } else {
        navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <LinearGradient colors={isDark ? ['#020A1A', '#01030B'] : ['#EBF4FA', '#D9E8F3']} style={styles.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={themeBlue} />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressPulse, { width: `${(history.length + 1) * 20}%` }]} />
        </View>
        <Text style={styles.headerTag}>MARITIME SCHOLAR</Text>
      </View>

      <View style={styles.centerStage}>
          <Animated.View style={[
              styles.floatingCard, 
              { 
                  opacity: fadeAnim, 
                  transform: [{ translateX: slideAnim }] 
              }
          ]}>
            <View style={styles.cardHeader}>
                <Text style={styles.nodeTitle}>{node.question}</Text>
                {node.subtitle && <Text style={styles.nodeSubtitle}>{node.subtitle}</Text>}
            </View>

            <View style={styles.optionsArea}>
                {node.type === 'info' ? (
                  <ScrollView style={styles.infoScroll} showsVerticalScrollIndicator={false}>
                      <Text style={styles.infoTxt}>{node.text}</Text>
                      <TouchableOpacity 
                        style={styles.proceedBtn}
                        onPress={() => handleOptionSelect(node.next)}
                      >
                          <Text style={styles.proceedTxt}>PROCEED TO OPTIONS</Text>
                          <Ionicons name="arrow-forward" size={18} color={isDark ? "#000" : "#FFF"} />
                      </TouchableOpacity>
                  </ScrollView>
                ) : (
                  node.options.map((option: any) => {
                    const isHovered = hoveredId === option.id;
                    const TouchableAction: any = TouchableOpacity;
                    return (
                        <TouchableAction 
                            key={option.id}
                            style={[
                                styles.optionBox, 
                                isHovered && styles.optionBoxHovered
                            ]}
                            onPress={() => handleOptionSelect(option.next)}
                            onMouseEnter={() => setHoveredId(option.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            activeOpacity={0.8}
                        >
                            <LinearGradient 
                                colors={isHovered ? 
                                    (isDark ? ['rgba(0, 119, 255, 0.15)', 'rgba(0, 119, 255, 0.05)'] : ['rgba(0, 85, 204, 0.1)', 'transparent']) : 
                                    (isDark ? ['rgba(255, 255, 255, 0.02)', 'transparent'] : ['rgba(0, 0, 0, 0.02)', 'transparent'])
                                } 
                                style={styles.optionGrad}
                            />
                            <View style={styles.optionHeader}>
                                <Text style={[styles.optionLabel, isHovered && {color: themeBlue}]}>{option.label}</Text>
                                <Ionicons name="compass-outline" size={18} color={isHovered ? themeBlue : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)')} />
                            </View>
                            <Text style={styles.optionSub}>{option.sub}</Text>
                            
                            {/* EXPANDING BRIEF AREA */}
                            {isHovered && (
                              <View style={styles.briefingView}>
                                  <Text style={styles.briefTxt}>{option.brief}</Text>
                              </View>
                            )}
                        </TouchableAction>
                    );
                  })
                )}

                {currentNodeKey === 'success' && (
                  <View style={styles.successPulse}>
                      <MaterialCommunityIcons name={"shield-anchor" as any} size={60} color={themeBlue} />
                      <Text style={styles.successTxt}>MAPPER STAGED</Text>
                  </View>
                )}
            </View>
          </Animated.View>
      </View>
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDark ? '#020A1A' : '#EBF4FA' },
  background: { ...StyleSheet.absoluteFillObject },

  header: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    justifyContent: 'space-between'
  },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', shadowColor: '#000', shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 5, elevation: 2 },
  progressTrack: { flex: 1, height: 2, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)', marginHorizontal: 20, borderRadius: 2, overflow: 'hidden' },
  progressPulse: { height: '100%', backgroundColor: isDark ? seafoamGreen : navyBlue, shadowColor: isDark ? seafoamGreen : navyBlue, shadowRadius: 10, shadowOpacity: 1 },
  headerTag: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)', fontSize: 9, fontWeight: '900', letterSpacing: 2 },

  centerStage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingCard: {
    width: cardWidth,
    backgroundColor: isDark ? 'rgba(5, 12, 30, 0.98)' : '#FFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(0, 119, 255, 0.15)' : 'rgba(0,0,0,0.05)',
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: isDark ? 0.9 : 0.1,
    shadowRadius: 30,
    elevation: isDark ? 20 : 10
  },
  cardHeader: { marginBottom: 25, alignItems: 'center' },
  nodeTitle: { color: isDark ? '#FFF' : '#111', fontSize: 20, fontWeight: '900', letterSpacing: 4, marginBottom: 5 },
  nodeSubtitle: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },

  optionsArea: { width: '100%' },
  optionBox: {
    width: '100%',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0,0,0,0.05)',
    overflow: 'hidden' as any,
    backgroundColor: isDark ? 'transparent' : '#FDFDFD'
  },
  optionBoxHovered: {
    borderColor: isDark ? 'rgba(0, 119, 255, 0.4)' : 'rgba(0, 85, 204, 0.3)',
    shadowColor: isDark ? seafoamGreen : navyBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: isDark ? 0.4 : 0.1,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: isDark ? 'transparent' : '#FFF'
  },
  optionGrad: { ...StyleSheet.absoluteFillObject },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  optionLabel: { color: isDark ? 'rgba(255,255,255,0.7)' : '#333', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  optionSub: { color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)', fontSize: 9, fontWeight: 'bold' },

  briefingView: { marginTop: 15, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(0,119,255,0.1)' : 'rgba(0,0,0,0.05)', paddingTop: 10 },
  briefTxt: { color: isDark ? 'rgba(255,255,255,0.5)' : '#555', fontSize: 10, lineHeight: 15, fontWeight: '500' },

  infoScroll: { maxHeight: 350 },
  infoTxt: { color: isDark ? 'rgba(255,255,255,0.6)' : '#444', fontSize: 11, lineHeight: 18, fontWeight: '600', letterSpacing: 0.5 },
  proceedBtn: { marginTop: 25, backgroundColor: isDark ? seafoamGreen : navyBlue, padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: isDark ? seafoamGreen : navyBlue, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  proceedTxt: { color: isDark ? '#000' : '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginRight: 10 },

  successPulse: { alignItems: 'center', marginTop: 20 },
  successTxt: { color: isDark ? seafoamGreen : navyBlue, fontSize: 10, fontWeight: '900', letterSpacing: 4, marginTop: 12 }
});

export default MerchantNavyPathScreen;
