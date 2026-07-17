import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Animated, Dimensions, Platform, 
  StatusBar, ScrollView, useColorScheme 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const neonCyan = '#1dd4e1ff';
const darkCyan = '#008B8B';
const cardWidth = width * 0.75; 

// DATASET: DEEP MISSION INTELLIGENCE
const CAREER_TREE: any = {
  root: {
    question: "FOUNDATION",
    subtitle: "Select your entry point",
    options: [
      { id: 'inter', label: "INTERMEDIATE", sub: "10+2 Academic Path", next: 'inter_streams', brief: "The traditional academic route leading to diverse professional degrees including Engineering, Medicine, and Law." },
      { id: 'diploma', label: "DIPLOMA", sub: "Technical Mastery", next: 'diploma_sector', brief: "A 3-year technical course allowing direct entry into the 2nd year of Engineering or the workforce." },
      { id: 'iti', label: "ITI", sub: "Vocational Skills", next: 'iti_sector', brief: "Hands-on vocational training designed for immediate industrial employment in specialized trades." }
    ]
  },
  // INTERMEDIATE STREAMS
  inter_streams: {
    question: "STREAM HUB",
    subtitle: "Define your core domain",
    options: [
      { id: 'science', label: "SCIENCE STREAM", sub: "Technical & Medical", next: 'science_path', brief: "The foundation for Engineering, Science, and medical disciplines. High research and tech potential." },
      { id: 'commerce', label: "COMMERCE STREAM", sub: "Business & Finance", next: 'commerce_note', brief: "Focuses on Trade, Business, and Finance. The gateway to massive career opportunities in management." },
      { id: 'arts', label: "ARTS & HUMANITIES", sub: "Creative & Social", next: 'arts_note', brief: "Explore Human Society, Literature, and Social Sciences. Ideal for Law and Civil Services." }
    ]
  },
  // COMMERCE NOTE SLIDE
  commerce_note: {
    type: 'info',
    question: "COMMERCE INTEL",
    text: "Commerce is the heartbeat of the Global Economy. By choosing this path, you enter a world of Business, Audit, and International Finance.\n\nWHY COMMERCE?\nIt leads to elite professions like Chartered Accountancy (CA), Banking, and Investment Management. It is ideal if you want to understand how wealth and corporations are managed.\n\nCAREER PATHS:\n- Finance Manager\n- Auditors & CA\n- Data Analysts\n- Business Strategists",
    next: 'commerce_path'
  },
  // ARTS NOTE SLIDE
  arts_note: {
    type: 'info',
    question: "ARTS & HUMANITY",
    text: "Arts and Humanities allow you to explore human society, expression, and governance. This is the bedrock of critical thinking and social progress.\n\nWHY ARTS?\nIdeal for students aiming for the Judiciary, Public Policy, Journalism, or the Civil Services (IAS/IPS). It offers deep insight into human history and creative industries.\n\nCAREER PATHS:\n- Legal Consultant (Law)\n- Diplomat & Civil Servant\n- Journalist & Media Host\n- Archaeologists & Historians",
    next: 'arts_path'
  },
  science_path: {
    question: "SCIENCE CORE",
    subtitle: "Select your academic minor",
    options: [
      { id: 'mpc', label: "MPC", sub: "Math, Physics, Chemistry", next: 'success', brief: "The mandatory path for Engineering and Architecture." },
      { id: 'mbipc', label: "MBiPC", sub: "General Science Hub", next: 'success', brief: "Combines Math and Biology, opening both Engineering and Medical doors." }
    ]
  },
  commerce_path: {
    question: "COMMERCE CORE",
    subtitle: "Select your business minor",
    options: [
      { id: 'cec', label: "CEC", sub: "Civics, Econ, Commerce", next: 'success', brief: "The classic business and commerce foundation." },
      { id: 'mec', label: "MEC", sub: "Math, Econ, Commerce", next: 'success', brief: "Integrates Math, making you eligible for high-end Finance degrees." },
      { id: 'hec_com', label: "HEC", sub: "History, Econ, Commerce", next: 'success', brief: "Combines social history with business economics." }
    ]
  },
  arts_path: {
    question: "ARTS CORE",
    subtitle: "Select your creative minor",
    options: [
      { id: 'hec_arts', label: "HEC", sub: "History, Econ, Civics", next: 'success', brief: "Ideal for aspiring Civil Servants and Historians." },
      { id: 'arts_pure', label: "ARTS", sub: "Pure Humanities", next: 'success', brief: "Focus on social sciences and cultural studies." }
    ]
  },
  // DIPLOMA SECTOR
  diploma_sector: {
    question: "DIPLOMA BRANCH",
    subtitle: "Select your technical mission",
    options: [
      { id: 'civil_eng', label: "CIVIL ENGINEERING", sub: "Structural Design", next: 'success', brief: "Master the art of infrastructure, from bridges to skyscrapers." },
      { id: 'mech_eng', label: "MECHANICAL ENGINEERING", sub: "Industrial Systems", next: 'success', brief: "The study of machines, thermodynamics, and manufacturing." },
      { id: 'elec_eng', label: "ELECTRICAL ENGINEERING", sub: "Energy Power Grids", next: 'success', brief: "Focus on power generation, distribution, and smart grids." },
      { id: 'ece_eng', label: "ECE ENGINEERING", sub: "Communication Hub", next: 'success', brief: "Electronics and Communication systems that power the world." },
      { id: 'comp_eng', label: "COMPUTER ENGINEERING", sub: "Software Hub", next: 'success', brief: "Master hardware-software integration and AI foundations." }
    ]
  },
  // ITI SECTOR
  iti_sector: {
    question: "ITI TRADE",
    subtitle: "Select your vocational mission",
    options: [
      { id: 'elec_iti', label: "ELECTRICIAN", sub: "Power Installation", next: 'success', brief: "Focus on domestic and industrial power wiring, maintenance, and grounding systems. High demand in construction and industries." },
      { id: 'fitter_iti', label: "FITTER", sub: "Industrial Assembly", next: 'success', brief: "Specialized in precision fitting of machine parts and assembly of engineering components. Bedrock of manufacturing." },
      { id: 'turner_iti', label: "TURNER", sub: "Lathe Machining", next: 'success', brief: "Master the art of lathe machining, metal turning, and creating precision cylindrical parts for engines and machines." },
      { id: 'mach_iti', label: "MACHINIST", sub: "Precision Tooling", next: 'success', brief: "Operate and set up various machine tools to produce high-precision metal parts with near-zero tolerance." },
      { id: 'elec_mech_iti', label: "ELECTRONICS MECHANIC", sub: "Circuit Mastery", next: 'success', brief: "Expertise in repairing, maintaining, and assembling electronic circuits, appliances, and industrial controllers." },
      { id: 'copa_iti', label: "COPA", sub: "Computer Ops & Programming", next: 'success', brief: "Computer Operator and Programming Assistant. Gateway to basic software management, data entry, and networking." }
    ]
  },
  success: {
    question: "MISSION STATUS",
    subtitle: "Pathway Synchronized.",
    options: []
  }
};

const EngineeringPathScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const themeCyan = isDark ? neonCyan : darkCyan;

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
      <LinearGradient colors={isDark ? ['#020205', '#080815'] : ['#F4F6F9', '#E6E9F0']} style={styles.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={themeCyan} />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressPulse, { width: `${(history.length + 1) * 15}%` }]} />
        </View>
        <Text style={styles.headerTag}>CAREER INTELLIGENCE</Text>
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
                                    (isDark ? ['rgba(0, 240, 255, 0.15)', 'rgba(0, 240, 255, 0.05)'] : ['rgba(0, 139, 139, 0.1)', 'transparent']) : 
                                    (isDark ? ['rgba(255, 255, 255, 0.02)', 'transparent'] : ['rgba(0, 0, 0, 0.02)', 'transparent'])
                                } 
                                style={styles.optionGrad}
                            />
                            <View style={styles.optionHeader}>
                                <Text style={[styles.optionLabel, isHovered && {color: themeCyan}]}>{option.label}</Text>
                                <Ionicons name="cube-outline" size={18} color={isHovered ? themeCyan : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)')} />
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
                      <MaterialCommunityIcons name="check-decagram" size={60} color={themeCyan} />
                      <Text style={styles.successTxt}>MAPPER FINALIZED</Text>
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
  progressPulse: { height: '100%', backgroundColor: isDark ? neonCyan : darkCyan, shadowColor: isDark ? neonCyan : darkCyan, shadowRadius: 10, shadowOpacity: 1 },
  headerTag: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)', fontSize: 9, fontWeight: '900', letterSpacing: 2 },

  centerStage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingCard: {
    width: cardWidth,
    backgroundColor: isDark ? 'rgba(10, 10, 20, 0.98)' : '#FFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(0, 240, 255, 0.1)' : 'rgba(0,0,0,0.05)',
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
    borderColor: isDark ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 139, 139, 0.3)',
    shadowColor: isDark ? neonCyan : darkCyan,
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

  briefingView: { marginTop: 15, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(0,240,255,0.1)' : 'rgba(0,0,0,0.05)', paddingTop: 10 },
  briefTxt: { color: isDark ? 'rgba(255,255,255,0.5)' : '#555', fontSize: 10, lineHeight: 15, fontWeight: '500' },

  infoScroll: { maxHeight: 350 },
  infoTxt: { color: isDark ? 'rgba(255,255,255,0.6)' : '#444', fontSize: 11, lineHeight: 18, fontWeight: '600', letterSpacing: 0.5 },
  proceedBtn: { marginTop: 25, backgroundColor: isDark ? neonCyan : darkCyan, padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: isDark ? neonCyan : darkCyan, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  proceedTxt: { color: isDark ? '#000' : '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginRight: 10 },

  successPulse: { alignItems: 'center', marginTop: 20 },
  successTxt: { color: isDark ? neonCyan : darkCyan, fontSize: 10, fontWeight: '900', letterSpacing: 4, marginTop: 12 }
});

export default EngineeringPathScreen;
