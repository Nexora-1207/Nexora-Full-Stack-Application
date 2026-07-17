import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Animated, Dimensions, Platform, 
  StatusBar, ScrollView, useColorScheme 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const cardWidth = width * 0.75; 

// THEMATIC COLOR SCHEMES ACCORDING TO COURSE
const THEMES: any = {
  default: { primary: '#00F0FF', secondary: '#0077FF', textGlow: 'rgba(0, 240, 255, 0.4)' },
  gp_rating: { primary: '#00F0FF', secondary: '#0077FF', textGlow: 'rgba(0, 240, 255, 0.4)' }, // Deep-Sea / Navy
  ccmc_catering: { primary: '#FFAA00', secondary: '#FF4D00', textGlow: 'rgba(255, 170, 0, 0.4)' }, // Hospitality Gold/Orange
  ncv_coastal: { primary: '#00FF88', secondary: '#2ECC71', textGlow: 'rgba(0, 255, 136, 0.4)' }, // Coastal Green/Emerald
  officer_path: { primary: '#FF008A', secondary: '#AF52DE', textGlow: 'rgba(255, 0, 138, 0.4)' } // Engine Mech/Elec Purple
};

const MARITIME_TREE: any = {
  root: {
    question: "MARITIME ENTRY",
    subtitle: "Select your career path depth",
    themeKey: 'default',
    options: [
      { id: 'fast_track', label: "FAST-TRACK CREW (6M)", sub: "Ratings & Support Entry", next: 'ratings_root', brief: "Start working on ships in 6 months as ratings (crew) or culinary staff.", colorTheme: 'gp_rating' },
      { id: 'officer_path', label: "OFFICER PATH (3Y+2Y)", sub: "Polytechnic ➡️ DME Route", next: 'polytechnic_root', brief: "Complete a 3-Year Polytechnic Diploma followed by a 2-Year DME to become a Licensed Marine Engineer.", colorTheme: 'officer_path' }
    ]
  },
  // RATINGS BRANCHES
  ratings_root: {
    question: "RATINGS ENTRY",
    subtitle: "Select your rating course",
    themeKey: 'gp_rating',
    options: [
      { id: 'gp_rating', label: "GP RATING", sub: "General Purpose Rating", next: 'gp_departments', brief: "6-month pre-sea course. Qualifies you for both Deck (Navigation) and Engine departments.", colorTheme: 'gp_rating' },
      { id: 'ccmc_catering', label: "CCMC CATERING", sub: "Saloon Rating Course", next: 'catering_departments', brief: "6-month pre-sea course. Qualifies you for the Saloon (Food & Accommodation) department.", colorTheme: 'ccmc_catering' },
      { id: 'ncv_coastal', label: "NCV RATING", sub: "Near Coastal Voyage", next: 'ncv_departments', brief: "6-month pre-sea training focusing strictly on coastal cargo vessels.", colorTheme: 'ncv_coastal' }
    ]
  },
  // OFFICERS POLYTECHNIC BRANCHES
  polytechnic_root: {
    question: "POLYTECHNIC CORE",
    subtitle: "Select your diploma specialization",
    themeKey: 'officer_path',
    options: [
      { id: 'poly_mech', label: "MECHANICAL DIPLOMA", sub: "Assisted Engine Cadet", next: 'poly_dme_awareness', brief: "3-year Mechanical Engineering Diploma. Qualifies you for the 2-year lateral DME pre-sea course.", colorTheme: 'officer_path' },
      { id: 'poly_elec', label: "ELECTRICAL DIPLOMA", sub: "Assisted Electrical Cadet", next: 'poly_dme_awareness', brief: "3-year Electrical/Electronics Diploma. Qualifies you for the 2-year lateral DME pre-sea course.", colorTheme: 'officer_path' }
    ]
  },
  // GP RATING BRANCHES
  gp_departments: {
    question: "GP DEPARTMENT",
    subtitle: "Select your deck/engine preference",
    themeKey: 'gp_rating',
    options: [
      { id: 'gp_deck', label: "DECK RATING", sub: "Navigation & Cargo", next: 'gp_deck_awareness', brief: "Work on the ship's deck. Focuses on mooring, watchkeeping, helm steering, and cargo operations.", colorTheme: 'gp_rating' },
      { id: 'gp_engine', label: "ENGINE RATING", sub: "Machinery & Maintenance", next: 'gp_engine_awareness', brief: "Work in the ship's engine room. Focuses on assisting engineers, cleaning, oiling, and tool management.", colorTheme: 'gp_rating' }
    ]
  },
  // CCMC BRANCHES
  catering_departments: {
    question: "SALOON ROLE",
    subtitle: "Select your culinary/service path",
    themeKey: 'ccmc_catering',
    options: [
      { id: 'marine_cook', label: "MARINE CULINARY (COOK)", sub: "Food Production", next: 'cook_awareness', brief: "Responsible for preparing meals for the international crew and managing galley inventory.", colorTheme: 'ccmc_catering' },
      { id: 'marine_steward', label: "MARITIME STEWARD", sub: "Service & Housekeeping", next: 'steward_awareness', brief: "Responsible for managing officer cabins, mess rooms, dining services, and laundry.", colorTheme: 'ccmc_catering' }
    ]
  },
  // NCV BRANCHES
  ncv_departments: {
    question: "NCV DIVISION",
    subtitle: "Select your coastal vessel trade",
    themeKey: 'ncv_coastal',
    options: [
      { id: 'ncv_deck', label: "NCV DECK HAND", sub: "Coastal Navigation", next: 'ncv_deck_awareness', brief: "Join coastal vessels as deck crew. Simpler certifications with quick entry into small cargo ships.", colorTheme: 'ncv_coastal' },
      { id: 'ncv_engine', label: "NCV ENGINE HAND", sub: "Coastal Machinery", next: 'ncv_engine_awareness', brief: "Join coastal vessel engine rooms. Assisting in running smaller diesel engines.", colorTheme: 'ncv_coastal' }
    ]
  },
  // AWARENESS SLIDES
  gp_deck_awareness: {
    type: 'info',
    themeKey: 'gp_rating',
    question: "DECK RATING BRIEF",
    text: "DECK SEAMANSHIP: PHYSICAL & NAVIGATIONAL RUNNING\n\nBy selecting GP Rating (Deck), you will start your career as an Ordinary Seaman (OS) on cargo ships.\n\nDUTIES & RESPONSIBILITIES:\n- Helming and steering the ship during navigation under officer supervision.\n- Mooring and unmooring operations (handling steel wires and ropes).\n- Cargo hatch operations and cargo watchkeeping.\n- Chipping, painting, and general maintenance of deck areas.\n\nRANK PROGRESION:\nOrdinary Seaman (OS) ➡️ Able Seaman (AB) ➡️ Bosun (Crew Boss) ➡️ Clear examinations to become a Deck Officer.",
    next: 'success'
  },
  gp_engine_awareness: {
    type: 'info',
    themeKey: 'gp_rating',
    question: "ENGINE RATING BRIEF",
    text: "ENGINE ROOM OILER: MACHINERY SYSTEMS SUPPORT\n\nBy selecting GP Rating (Engine), you will start your career as a Wiper in the engine room.\n\nDUTIES & RESPONSIBILITIES:\n- Cleaning engine components and keeping workshops tidy.\n- Assisting Marine Engineers in overhauling auxiliary engines, pumps, and boilers.\n- Checking oil levels, pressure gauges, and executing general lubrication (Oiler duties).\n- Watchkeeping in the engine control room.\n\nRANK PROGRESION:\nWiper ➡️ Oiler/Motorman ➡️ Fitter (Machinery Repair Specialist) ➡️ Clear Class 4 Exam to become a Marine Engineer.",
    next: 'success'
  },
  cook_awareness: {
    type: 'info',
    themeKey: 'ccmc_catering',
    question: "MARINE COOK BRIEF",
    text: "CHIEF COOK: THE HEART OF THE CROWD\n\nFood is crucial for crew morale during long voyages. The Cook is a highly respected role.\n\nDUTIES & RESPONSIBILITIES:\n- Preparing balanced, nutritious meals for crew members of various nationalities.\n- Managing the ship galley (kitchen) hygiene and sanitation.\n- Maintaining store inventory, managing cold storage, and planning menu items.\n- Ensuring compliance with maritime food safety conventions (MLC 2006).\n\nRANK PROGRESION:\nAssistant Cook ➡️ Second Cook ➡️ Chief Cook.",
    next: 'success'
  },
  steward_awareness: {
    type: 'info',
    themeKey: 'ccmc_catering',
    question: "MARITIME STEWARD BRIEF",
    text: "STEWARD: SHIPBOARD HOSPITALITY & ACCOMMODATION\n\nStewards manage the officers' dining, living quarters, and general administrative domestic services.\n\nDUTIES & RESPONSIBILITIES:\n- Laying tables, serving food, and cleaning officer mess rooms.\n- Housekeeping and cleaning officers' cabins and public spaces.\n- Laundry management and bedding supplies.\n- Assisting the Chief Cook with provisioning and stores.\n\nRANK PROGRESION:\nSteward ➡️ Assistant Steward ➡️ Chief Steward.",
    next: 'success'
  },
  ncv_deck_awareness: {
    type: 'info',
    themeKey: 'ncv_coastal',
    question: "NCV DECK BRIEF",
    text: "NCV DECK HAND: COASTAL SHIPPING OPERATIONS\n\nNCV routes are tailored for vessels operating strictly within Near Coastal Voyages (regional waters).\n\nDUTIES & RESPONSIBILITIES:\n- Basic seamanship, steering, and cargo watch duties on smaller ships.\n- Quick certification pathways to work on tugboats, barges, and regional supply boats.\n- Practical deck handling and harbor operations.\n\nRANK PROGRESION:\nNCV OS ➡️ NCV AB ➡️ Coastal Bosun ➡️ Mate (NCV) ➡️ Master (NCV).",
    next: 'success'
  },
  ncv_engine_awareness: {
    type: 'info',
    themeKey: 'ncv_coastal',
    question: "NCV ENGINE BRIEF",
    text: "NCV ENGINE HAND: REGIONAL MACHINERY SUPPORT\n\nWorking in engine rooms of smaller vessels operating close to coastlines.\n\nDUTIES & RESPONSIBILITIES:\n- Maintaining smaller auxiliary engines, hydraulic pumps, and generators.\n- General engine room cleaning and lubrication checks.\n- Fast-track coastal certifications.\n\nRANK PROGRESION:\nNCV Wiper ➡️ NCV Oiler ➡️ NCV Motorman ➡️ Marine Engineer (NCV).",
    next: 'success'
  },
  poly_dme_awareness: {
    type: 'info',
    themeKey: 'officer_path',
    question: "POLYTECHNIC ➡️ DME PATH BRIEF",
    text: "POLYTECHNIC + LATERAL DME ENTRY: BECOME AN ENGINE OFFICER\n\nThis is the ultimate pathway for 10th-pass students to join the Merchant Navy as an Engine Officer without Class 12.\n\nTHE PROCESS:\n1. Complete a 3-Year Polytechnic Diploma in Mechanical or Electrical Engineering.\n2. Gain direct admission to the 2-Year DGS-approved Diploma in Marine Engineering (DME) pre-sea training.\n3. Complete 6 months of onboard training as a Junior Engineer.\n4. Qualify for the Class 4 Certificate of Competency (CoC) exam.\n\nRANK PROGRESION:\nJunior Engineer ➡️ Fourth Engineer ➡️ Third Engineer ➡️ Second Engineer ➡️ Chief Engineer.",
    next: 'success'
  },
  success: {
    question: "COORDINATES LOCKED",
    subtitle: "Onboarding completed successfully.",
    themeKey: 'default',
    options: []
  }
};

const MerchantNavyPathScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);

  const [currentNodeKey, setCurrentNodeKey] = useState('root');
  const [history, setHistory] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const slideAnim = useRef(new Animated.Value(0)).current; 
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const node = MARITIME_TREE[currentNodeKey];
  
  // DYNAMIC THEME DETERMINATION
  const activeThemeKey = node.themeKey || 'default';
  const activeTheme = THEMES[activeThemeKey];
  const themeCyan = isDark ? activeTheme.primary : activeTheme.secondary;

  const handleOptionSelect = (nextKey: string) => {
    Animated.parallel([
        Animated.timing(slideAnim, { toValue: -width, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true })
    ]).start(() => {
        setHistory([...history, currentNodeKey]);
        setHoveredId(null);
        setCurrentNodeKey(nextKey);
        slideAnim.setValue(width);
        
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
        ]).start(() => {
            if (nextKey === 'success') {
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
      <LinearGradient colors={isDark ? ['#020205', '#050a14'] : ['#F4F6F9', '#E6E9F0']} style={styles.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={themeCyan} />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressPulse, { width: `${(history.length + 1) * 20}%`, backgroundColor: themeCyan, shadowColor: themeCyan }]} />
        </View>
        <Text style={[styles.headerTag, { color: themeCyan, textShadowColor: activeTheme.textGlow, textShadowRadius: 5 }]}>MERCHANT NAVY HUB</Text>
      </View>

      <View style={styles.centerStage}>
          <Animated.View style={[
              styles.floatingCard, 
              { 
                  opacity: fadeAnim, 
                  transform: [{ translateX: slideAnim }],
                  borderColor: isDark ? themeCyan + '22' : 'rgba(0,0,0,0.05)'
              }
          ]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.nodeTitle, { textShadowColor: activeTheme.textGlow, textShadowRadius: isDark ? 10 : 0 }]}>{node.question}</Text>
                {node.subtitle && <Text style={styles.nodeSubtitle}>{node.subtitle}</Text>}
            </View>

            <View style={styles.optionsArea}>
                {node.type === 'info' ? (
                  <ScrollView style={styles.infoScroll} showsVerticalScrollIndicator={false}>
                      <Text style={styles.infoTxt}>{node.text}</Text>
                      <TouchableOpacity 
                        style={[styles.proceedBtn, { backgroundColor: themeCyan, shadowColor: themeCyan }]}
                        onPress={() => handleOptionSelect(node.next)}
                      >
                          <Text style={styles.proceedTxt}>LOCK COORDINATES</Text>
                          <Ionicons name="arrow-forward" size={18} color={isDark ? "#000" : "#FFF"} />
                      </TouchableOpacity>
                  </ScrollView>
                ) : (
                  node.options.map((option: any) => {
                    const isHovered = hoveredId === option.id;
                    const optionTheme = THEMES[option.colorTheme] || activeTheme;
                    const optionColor = isDark ? optionTheme.primary : optionTheme.secondary;
                    
                    const TouchableAction: any = TouchableOpacity;
                    return (
                        <TouchableAction 
                            key={option.id}
                            style={[
                                styles.optionBox, 
                                isHovered && {
                                  borderColor: optionColor + 'bb',
                                  shadowColor: optionColor,
                                  shadowOpacity: isDark ? 0.3 : 0.1,
                                }
                            ]}
                            onPress={() => handleOptionSelect(option.next)}
                            onMouseEnter={() => setHoveredId(option.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            activeOpacity={0.8}
                        >
                            <LinearGradient 
                                colors={isHovered ? 
                                    (isDark ? [optionColor + '1F', 'transparent'] : [optionColor + '10', 'transparent']) : 
                                    (isDark ? ['rgba(255, 255, 255, 0.02)', 'transparent'] : ['rgba(0, 0, 0, 0.02)', 'transparent'])
                                } 
                                style={styles.optionGrad}
                            />
                            <View style={styles.optionHeader}>
                                <Text style={[styles.optionLabel, isHovered && {color: optionColor}]}>{option.label}</Text>
                                <Ionicons name="boat-outline" size={18} color={isHovered ? optionColor : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)')} />
                            </View>
                            <Text style={styles.optionSub}>{option.sub}</Text>
                            
                            {/* EXPANDING BRIEF AREA */}
                            {isHovered && (
                              <View style={[styles.briefingView, { borderTopColor: optionColor + '33' }]}>
                                  <Text style={styles.briefTxt}>{option.brief}</Text>
                              </View>
                            )}
                        </TouchableAction>
                    );
                  })
                )}

                {currentNodeKey === 'success' && (
                  <View style={styles.successPulse}>
                      <MaterialCommunityIcons name="shield-airplane-outline" size={60} color={themeCyan} style={{ transform: [{ rotate: '90deg' }] }} />
                      <Text style={[styles.successTxt, { color: themeCyan }]}>ONBOARDING COMPLETE</Text>
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
  progressPulse: { height: '100%', shadowRadius: 10, shadowOpacity: 1 },
  headerTag: { fontSize: 9, fontWeight: '900', letterSpacing: 2 },

  centerStage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingCard: {
    width: cardWidth,
    backgroundColor: isDark ? 'rgba(10, 10, 20, 0.98)' : '#FFF',
    borderRadius: 25,
    borderWidth: 1,
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
    backgroundColor: isDark ? 'transparent' : '#FDFDFD',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 2,
  },
  optionGrad: { ...StyleSheet.absoluteFillObject },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  optionLabel: { color: isDark ? 'rgba(255,255,255,0.7)' : '#333', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  optionSub: { color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)', fontSize: 9, fontWeight: 'bold' },

  briefingView: { marginTop: 15, borderTopWidth: 1, paddingTop: 10 },
  briefTxt: { color: isDark ? 'rgba(255,255,255,0.5)' : '#555', fontSize: 10, lineHeight: 15, fontWeight: '500' },

  infoScroll: { maxHeight: 350 },
  infoTxt: { color: isDark ? 'rgba(255,255,255,0.6)' : '#444', fontSize: 11, lineHeight: 18, fontWeight: '600', letterSpacing: 0.5 },
  proceedBtn: { marginTop: 25, padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  proceedTxt: { color: isDark ? '#000' : '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginRight: 10 },

  successPulse: { alignItems: 'center', marginTop: 20 },
  successTxt: { fontSize: 10, fontWeight: '900', letterSpacing: 4, marginTop: 12 }
});

export default MerchantNavyPathScreen;
