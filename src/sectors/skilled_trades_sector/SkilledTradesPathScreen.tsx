import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Animated, Dimensions, Platform, 
  StatusBar, ScrollView, useColorScheme 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

const { width, height } = Dimensions.get('window');
const cardWidth = width * 0.75; 

// THEMATIC COLOR SCHEMES ACCORDING TO SKILLED TRADES COURSE
const THEMES: any = {
  default: { primary: '#FFAA00', secondary: '#FF7700', textGlow: 'rgba(255, 170, 0, 0.4)' },
  electrical: { primary: '#FFAA00', secondary: '#FF7700', textGlow: 'rgba(255, 170, 0, 0.4)' }, // Amber / Gold
  mechanical: { primary: '#FF4D00', secondary: '#D35400', textGlow: 'rgba(255, 77, 0, 0.4)' }  // Rust / Copper
};

const TRADES_TREE: any = {
  root: {
    question: "FOUNDATION",
    subtitle: "Select your entry qualification",
    themeKey: 'default',
    options: [
      { id: 'class10_pass', label: "CLASS 10 PASS", sub: "2-Year Specialized Trades", next: 'class10_trades', brief: "Standard entry for advanced tech trades: Electrician, Fitter, and RAC Technicians.", colorTheme: 'electrical' },
      { id: 'class8_pass', label: "CLASS 8 / SUPPORT", sub: "1-Year Practical Trades", next: 'class8_trades', brief: "Fast-track entry for essential manual trades: Welder, Wireman, and General Fitters.", colorTheme: 'mechanical' }
    ]
  },
  class10_trades: {
    question: "CLASS 10 TRADES",
    subtitle: "Select your core tech domain",
    themeKey: 'default',
    options: [
      { id: 'electrical_climate', label: "ELECTRICAL & CLIMATE", sub: "Wiring & Power Systems", next: 'electrical_climate_sub', brief: "Focuses on electrical engineering, wiring circuits, motors, and cooling systems.", colorTheme: 'electrical' },
      { id: 'mechanical_fitter', label: "ITI FITTER & TURNER", sub: "Machinery & Lathes", next: 'fitter_awareness', brief: "Train to assemble, machine, repair, and maintain industrial engines, gears, and automated machinery.", colorTheme: 'mechanical' }
    ]
  },
  class8_trades: {
    question: "CLASS 8 TRADES",
    subtitle: "Select your manual craft domain",
    themeKey: 'default',
    options: [
      { id: 'iti_welder', label: "ITI WELDER & FABRICATOR", sub: "Welding & Metallurgy", next: 'welder_awareness', brief: "Train in gas, arc, TIG, and MIG welding to construct and repair structural machinery and piping.", colorTheme: 'mechanical' },
      { id: 'iti_wireman', label: "ITI WIREMAN", sub: "Basic Electrical Layouts", next: 'wireman_awareness', brief: "Focuses on residential electrical wiring, home repairs, lighting setups, and electrical maintenance.", colorTheme: 'electrical' }
    ]
  },
  electrical_climate_sub: {
    question: "ELECTRICAL DIVISION",
    subtitle: "Select your specialized trade",
    themeKey: 'electrical',
    options: [
      { id: 'iti_electrician', label: "ITI ELECTRICIAN", sub: "Power & Systems Grid", next: 'electrician_awareness', brief: "Train to install, inspect, repair, and maintain residential and heavy industrial electrical grids.", colorTheme: 'electrical' },
      { id: 'iti_rac', label: "ITI RAC TECHNICIAN", sub: "Refrigeration & Cooling", next: 'rac_awareness', brief: "Train to repair and install commercial/residential AC loops, refrigerators, and cooling components.", colorTheme: 'electrical' }
    ]
  },
  // AWARENESS BRIEFINGS
  electrician_awareness: {
    type: 'info',
    themeKey: 'electrical',
    question: "ITI ELECTRICIAN BRIEF",
    text: "ITI ELECTRICIAN: POWER SYSTEMS & MAIN GRIDS\n\nElectricians work with heavy electrical machinery, switchgears, and wiring circuits.\n\nRESPONSIBILITIES:\n- Laying down residential and commercial building wiring networks.\n- Installing, testing, and rewinding electrical motors and generators.\n- Repairing power transmission lines and troubleshooting switchboards.\n- Implementing strict electrical safety norms.\n\nCAREER OPPORTUNITIES:\nElectricity Boards (State Govt) ➡️ Railway Technician ➡️ Maintenance Electrician ➡️ Independent Electrical Contractor.",
    next: 'success'
  },
  rac_awareness: {
    type: 'info',
    themeKey: 'electrical',
    question: "ITI RAC BRIEF",
    text: "ITI RAC TECHNICIAN: CLIMATE CONTROL SYSTEMS\n\nRAC technicians install and maintain heating, ventilation, air conditioning, and refrigeration systems.\n\nRESPONSIBILITIES:\n- Setting up gas pressures, compressor loops, and thermostat control grids.\n- Installing industrial cold storage plants for food/pharma supply chains.\n- Troubleshooting domestic ACs, water coolers, and deep freezers.\n- Managing eco-friendly refrigerants (gases).\n\nCAREER OPPORTUNITIES:\nAC Service Centers ➡️ Cold Storage Facilities ➡️ HVAC Maintenance in corporate high-rises ➡️ Service Entrepreneur.",
    next: 'success'
  },
  fitter_awareness: {
    type: 'info',
    themeKey: 'mechanical',
    question: "ITI FITTER BRIEF",
    text: "ITI FITTER: MACHINERY SYSTEMS ASSEMBLY\n\nFitters specialize in dismantling, fitting, and building heavy mechanical components.\n\nRESPONSIBILITIES:\n- Assembling mechanical components using bolts, keys, and precision fits.\n- Maintaining structural machinery in factories, power plants, and oil refineries.\n- Operating basic workshop tools (drilling, grinding, and files).\n- Aligning gears, drives, and shaft bearings.\n\nCAREER OPPORTUNITIES:\nIndian Railways Workshop ➡️ Public Sector Undertakings (BHEL, SAIL) ➡️ Plant Fitter in Manufacturing ➡️ Maintenance Supervisor.",
    next: 'success'
  },
  welder_awareness: {
    type: 'info',
    themeKey: 'mechanical',
    question: "ITI WELDER BRIEF",
    text: "ITI WELDER: METALLURGICAL FABRICATION\n\nWelders join metal parts together using intense heat, pressure, and metal bonding techniques.\n\nRESPONSIBILITIES:\n- Performing gas welding, Shielded Metal Arc Welding (SMAW), TIG, and MIG welding.\n- Reading structural drawings and blueprints to cut and shape steel sections.\n- Testing welds for strength and structural integrity.\n- Mooring ship components and piping structures.\n\nCAREER OPPORTUNITIES:\nShipbuilding Yards ➡️ Infrastructure/Bridge Construction ➡️ Automobile Assembly Plants ➡️ Boiler/Pipeline Welder.",
    next: 'success'
  },
  wireman_awareness: {
    type: 'info',
    themeKey: 'electrical',
    question: "ITI WIREMAN BRIEF",
    text: "ITI WIREMAN: RESIDENTIAL WIRING & INSTALLATIONS\n\nWiremen specialize in electrical installations and wiring layouts inside houses and commercial buildings.\n\nRESPONSIBILITIES:\n- Laying down wiring channels, conduits, and junction boxes.\n- Fitting domestic electrical fixtures, fans, switches, and meters.\n- Troubleshooting short circuits, home safety checks, and grounding systems.\n- Performing basic panel repairs.\n\nCAREER OPPORTUNITIES:\nBuilding Maintenance ➡️ Construction Contractors ➡️ Independent Service Provider ➡️ Repair Service Shop.",
    next: 'success'
  },
  success: {
    question: "COORDINATES LOCKED",
    subtitle: "Skilled Trades path selected.",
    themeKey: 'default',
    options: []
  }
};

const SkilledTradesPathScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);

  useEffect(() => {
    const saveSector = async () => {
      try {
        await AsyncStorage.setItem('activeSector', 'SKILLED TRADES');
      } catch (_) {}
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
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const node = TRADES_TREE[currentNodeKey];
  
  // DYNAMIC THEME DETERMINATION
  const activeThemeKey = node.themeKey || 'default';
  const activeTheme = THEMES[activeThemeKey];
  const themeGold = activeTheme.primary;

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
                supabase.auth.getUser().then(({ data: { user } }) => {
                    if (user) {
                        supabase.from('profiles').upsert({ 
                            id: user.id, 
                            sector: 'SKILLED TRADES', 
                            updated_at: new Date() 
                        }).then(({ error }) => {
                            if (error) console.log('Error saving sector:', error.message);
                        });
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
      <LinearGradient colors={isDark ? ['#020205', '#140a00'] : ['#F4F6F9', '#E6E9F0']} style={styles.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={themeGold} />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressPulse, { width: `${(history.length + 1) * 25}%`, backgroundColor: themeGold, shadowColor: themeGold }]} />
        </View>
        <Text style={[styles.headerTag, { color: themeGold, textShadowColor: activeTheme.textGlow, textShadowRadius: 5 }]}>SKILLED TRADES HUB</Text>
      </View>

      <View style={styles.centerStage}>
          <Animated.View style={[
              styles.floatingCard, 
              { 
                  opacity: fadeAnim, 
                  transform: [{ translateX: slideAnim }],
                  borderColor: isDark ? themeGold + '22' : 'rgba(0,0,0,0.05)'
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
                        style={[styles.proceedBtn, { backgroundColor: themeGold, shadowColor: themeGold }]}
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
                    const optionColor = optionTheme.primary;
                    
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
                            <View style={option.id === 'mechanical_fab' || option.id.includes('fitter') || option.id.includes('welder') ? styles.optionHeaderMech : styles.optionHeaderElec}>
                                <Text style={[styles.optionLabel, isHovered && {color: optionColor}]}>{option.label}</Text>
                                <MaterialCommunityIcons 
                                  name={option.id === 'mechanical_fab' || option.id.includes('fitter') || option.id.includes('welder') ? "hammer-screwdriver" : "flash-outline"} 
                                  size={18} 
                                  color={isHovered ? optionColor : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)')} 
                                />
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
                      <MaterialCommunityIcons name="shield-lock-outline" size={60} color={themeGold} />
                      <Text style={[styles.successTxt, { color: themeGold }]}>COORDINATES SECURED</Text>
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
    backgroundColor: isDark ? 'rgba(12, 8, 2, 0.98)' : '#FFF',
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
  optionHeaderElec: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  optionHeaderMech: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
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

export default SkilledTradesPathScreen;
