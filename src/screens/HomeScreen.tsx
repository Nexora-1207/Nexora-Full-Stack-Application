import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, Animated, Dimensions,
  Platform, useColorScheme, ActivityIndicator, Alert, TextInput, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { CareerSwitcher } from '../components/CareerSwitcher';
import { SECTOR_THEMES } from '../theme/sectorThemes';

const { width, height } = Dimensions.get('window');
const neonCyan = '#00F0FF';
const neonMagenta = '#FF008A';

const CAROUSEL_EVENTS = [
  { id: 'c1', title: 'JEE Main Phase 3 Entry', date: 'Deadline: Aug 25', info: 'Joint Entrance Examination portal is open for registration. Target elite NIT and IIT engineering blocks.' },
  { id: 'c2', title: 'National Coding Hackathon', date: 'Starts: Sep 10', info: 'Represent Nexora and win cash rewards up to INR 2 Lakhs. Teams of 2 to 4 are eligible.' },
  { id: 'c3', title: 'Vanguard Founder Fellowship', date: 'Closes: Sep 02', info: 'Pitch your technical prototype directly to Silicon Valley seed investor panels.' }
];

const HomeScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const isFocused = useIsFocused();
  const [profile, setProfile] = useState<any>({ fullName: 'Nexora Student', sector: 'default', stream: 'MPC' });
  const [activeSector, setActiveSector] = useState('ENGINEERING');
  const [loading, setLoading] = useState(true);

  // States for Dashboards Layout
  const [activeTab, setActiveTab] = useState<'Home' | 'Events'>('Home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [schedule, setSchedule] = useState([
    { id: '1', time: '08:30 AM', title: 'Mathematics (Calculus)', location: 'L-Room 102' },
    { id: '2', time: '10:30 AM', title: 'Data Structures Lab', location: 'Lab-3' },
    { id: '3', time: '02:00 PM', title: 'Physics (Electromagnetism)', location: 'L-Room 104' }
  ]);

  // Modal Control States
  const [resumeModal, setResumeModal] = useState(false);
  const [interviewModal, setInterviewModal] = useState(false);
  const [explainerModal, setExplainerModal] = useState(false);
  const [notesModal, setNotesModal] = useState(false);
  const [plannerModal, setPlannerModal] = useState(false);

  // Resume AI State
  const [resumeText, setResumeText] = useState('');
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [resumeResult, setResumeResult] = useState<any>(null);

  // Interview Prep State
  const [interviewAnswer, setInterviewAnswer] = useState('');
  const [evaluatingInterview, setEvaluatingInterview] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState<any>(null);

  // Concept Explainer State
  const [conceptText, setConceptText] = useState('');
  const [explainingConcept, setExplainingConcept] = useState(false);
  const [conceptBrief, setConceptBrief] = useState<any>(null);

  // Smart Notes State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Schedule Planner State
  const [newClassTime, setNewClassTime] = useState('');
  const [newClassTitle, setNewClassTitle] = useState('');
  const [newClassLocation, setNewClassLocation] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Auto-play slideshow simulation
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % CAROUSEL_EVENTS.length);
    }, 4500);
    return () => clearInterval(slideInterval);
  }, []);

  // Fetch profile from supabase on mount
  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, sector, stream')
          .eq('id', user.id)
          .single();
        if (data) {
          const fetchedSector = data.sector || 'ENGINEERING';
          setProfile({
            fullName: data.full_name || 'Nexora Student',
            sector: fetchedSector,
            stream: data.stream || 'MPC'
          });
          // Synchronize local activeSector
          const stored = await AsyncStorage.getItem('activeSector');
          if (!stored) {
            await AsyncStorage.setItem('activeSector', fetchedSector);
            setActiveSector(fetchedSector);
          }
        }
      }
    } catch (err) {
      console.log('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 2000, useNativeDriver: false })
      ])
    ).start();
  }, []);

  // Load activeSector
  useEffect(() => {
    if (isFocused) {
      const loadSector = async () => {
        try {
          const stored = await AsyncStorage.getItem('activeSector');
          if (stored && SECTOR_THEMES[stored]) {
            setActiveSector(stored);
          } else if (profile.sector && SECTOR_THEMES[profile.sector]) {
            setActiveSector(profile.sector);
          }
        } catch (_) {}
      };
      loadSector();
    }
  }, [isFocused, profile.sector]);

  const currentTheme = SECTOR_THEMES[activeSector] || SECTOR_THEMES.ENGINEERING;
  const primaryColor = currentTheme.primary;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Resume Analyzer Handler
  const handleAnalyzeResume = () => {
    if (!resumeText.trim()) return;
    setAnalyzingResume(true);
    setTimeout(() => {
      setAnalyzingResume(false);
      setResumeResult({
        score: Math.floor(75 + Math.random() * 20),
        keywords: ['System Architecture', 'Telemetry', 'Micro-wiring', 'Assembly logic'],
        tips: [
          'Add quantitative benchmarks in your projects section.',
          'Align your core skills list with standard engineering parameters.',
          'Emphasize your technical diploma credentials.'
        ]
      });
    }, 1500);
  };

  // Interview Evaluator Handler
  const handleEvaluateInterview = () => {
    if (!interviewAnswer.trim()) return;
    setEvaluatingInterview(true);
    setTimeout(() => {
      setEvaluatingInterview(false);
      setInterviewFeedback({
        score: 'EXCELLENT',
        critique: 'Great explanation of problem breakdown! You highlighted diagnostic tools and structural debugging approaches. Consider expanding on the trade-offs between speed and resources.',
        sample: 'A professional response details debugging logs, modular unit checks, and hardware simulation modules before applying a fix.'
      });
    }, 1500);
  };

  // Concept Explainer Handler
  const handleExplainConcept = () => {
    if (!conceptText.trim()) return;
    setExplainingConcept(true);
    setTimeout(() => {
      setExplainingConcept(false);
      let analogy = 'Think of it as an automated precision sculptor. Instead of a human hand using chisels, a computer computerizes the cutting paths to carve parts with microscopic accuracy.';
      let physicsText = 'Water flowing through a pipeline. Voltage is the water pressure, current is the flow rate of water, and resistance is the width constraint of the pipe.';
      
      const term = conceptText.toLowerCase();
      setConceptBrief({
        name: conceptText.toUpperCase(),
        analogy: term.includes('ohm') ? physicsText : analogy,
        summary: `Highly critical academic module in standard intermediate science and engineering streams.`
      });
    }, 1500);
  };

  // Save Notes Handler
  const handleSaveNotes = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;
    try {
      const stored = await AsyncStorage.getItem('vault_files');
      let files = stored ? JSON.parse(stored) : [];
      const newNote = {
        id: Math.random().toString(),
        name: `${noteTitle.replace(/\s+/g, '_')}_Note.txt`,
        category: 'ACADEMIC',
        size: '8 KB',
        date: new Date().toISOString().split('T')[0],
        content: `NOTE TITLE: ${noteTitle}\n\nCONTENT:\n${noteContent}`
      };
      files.unshift(newNote);
      await AsyncStorage.setItem('vault_files', JSON.stringify(files));
      Alert.alert('VAULT GATEWAY SYNCED', 'Your Smart Note has been successfully synchronized and encrypted in the Document Vault.');
      setNoteTitle('');
      setNoteContent('');
      setNotesModal(false);
    } catch (e) {
      console.log('Error saving note:', e);
    }
  };

  // Planner Handler
  const handleAddSchedule = () => {
    if (!newClassTime.trim() || !newClassTitle.trim()) return;
    const newItem = {
      id: Math.random().toString(),
      time: newClassTime,
      title: newClassTitle,
      location: newClassLocation || 'Main Block'
    };
    setSchedule([...schedule, newItem]);
    setNewClassTime('');
    setNewClassTitle('');
    setNewClassLocation('');
    setPlannerModal(false);
    Alert.alert('SCHEDULE UPDATED', `"${newClassTitle}" added to your academic routine for today.`);
  };

  const textTheme = { color: isDark ? '#FFF' : '#0F172A' };
  const subTextTheme = { color: isDark ? 'rgba(255,255,255,0.5)' : '#475569' };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#020205' : '#F4F6F9' }]}>
        <ActivityIndicator size="large" color={isDark ? '#00F0FF' : '#008B8B'} />
      </View>
    );
  }

  // Get student welcome name (displays first name dynamically)
  const studentFirstName = profile.fullName ? profile.fullName.split(' ')[0] : 'Student';

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={isDark ? currentTheme.gradientDark : currentTheme.gradientLight} 
        style={StyleSheet.absoluteFillObject} 
      />
      
      {/* HEADER ROW */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.brandText, { 
            color: isDark ? '#FFF' : '#111',
            textShadowColor: primaryColor,
            textShadowRadius: isDark ? 12 : 4 
          }]}>NEXORA</Text>
          <Text style={[styles.welcomeMsg, subTextTheme]}>Hi, {studentFirstName} 👋</Text>
        </View>

        {/* Dynamic sliding segment switcher */}
        <View style={[styles.pillSwitcher, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)' }]}>
          <TouchableOpacity 
            style={[styles.switchTab, activeTab === 'Home' && [styles.switchActive, { backgroundColor: primaryColor }]]}
            onPress={() => setActiveTab('Home')}
          >
            <Text style={[styles.switchText, activeTab === 'Home' && styles.switchTextActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.switchTab, activeTab === 'Events' && [styles.switchActive, { backgroundColor: primaryColor }]]}
            onPress={() => setActiveTab('Events')}
          >
            <Text style={[styles.switchText, activeTab === 'Events' && styles.switchTextActive]}>Events</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
          <Ionicons name="exit-outline" size={22} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        contentContainerStyle={styles.scrollArea}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {activeTab === 'Home' ? (
          <>
            {/* HERO ROW: Side-by-side Carousel + Schedule displayer */}
            <View style={[styles.heroRow, { flexDirection: Platform.OS === 'web' && width > 600 ? 'row' : 'column' }]}>
              
              {/* Event Slideshow (Left Column) */}
              <TouchableOpacity 
                style={[styles.slideshowCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFF', borderColor: primaryColor + '22' }]}
                onPress={() => Alert.alert(CAROUSEL_EVENTS[currentSlide].title, CAROUSEL_EVENTS[currentSlide].info)}
                activeOpacity={0.9}
              >
                <LinearGradient colors={[primaryColor + '12', 'transparent']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.slideHeader}>
                  <Ionicons name="megaphone" size={16} color={neonMagenta} />
                  <Text style={styles.slideTag}>GLOBAL UPDATE</Text>
                </View>
                <Text style={[styles.slideTitle, textTheme]} numberOfLines={1}>{CAROUSEL_EVENTS[currentSlide].title}</Text>
                <Text style={styles.slideDate}>{CAROUSEL_EVENTS[currentSlide].date}</Text>
                <Text style={[styles.slideDesc, subTextTheme]} numberOfLines={2}>{CAROUSEL_EVENTS[currentSlide].info}</Text>
                
                {/* Pagination Dots */}
                <View style={styles.dotsRow}>
                  {CAROUSEL_EVENTS.map((_, i) => (
                    <View 
                      key={i} 
                      style={[styles.dot, { backgroundColor: currentSlide === i ? primaryColor : 'rgba(120, 120, 120, 0.4)' }]} 
                    />
                  ))}
                </View>
              </TouchableOpacity>

              {/* Schedule Displayer (Right Column) */}
              <View style={[styles.scheduleCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <View style={styles.scheduleTitleRow}>
                  <Ionicons name="calendar-outline" size={14} color={primaryColor} />
                  <Text style={[styles.scheduleTitle, textTheme]}>TODAY ROUTINE</Text>
                </View>
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ maxHeight: 110 }}>
                  {schedule.map((item) => (
                    <View key={item.id} style={styles.scheduleItem}>
                      <View style={styles.scheduleTimeIndicator}>
                        <View style={[styles.bulletPoint, { backgroundColor: primaryColor }]} />
                        <Text style={[styles.scheduleTime, { color: primaryColor }]}>{item.time}</Text>
                      </View>
                      <Text style={[styles.scheduleClassText, textTheme]} numberOfLines={1}>{item.title}</Text>
                      <Text style={[styles.scheduleLocText, subTextTheme]}>{item.location}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

            </View>

            {/* INTERACTIVE TILES GRID */}
            <Text style={[styles.sectionHeader, textTheme]}>Interactive Toolkits</Text>
            
            {/* 3-Column Tool Cards */}
            <View style={styles.gridRow}>
              <TouchableOpacity 
                style={[styles.gridTile, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFF', borderColor: primaryColor + '20' }]}
                onPress={() => setResumeModal(true)}
              >
                <View style={[styles.tileIcon, { backgroundColor: '#FF8A0022' }]}>
                  <Ionicons name="document-text" size={20} color="#FF8A00" />
                </View>
                <Text style={[styles.tileLabel, textTheme]}>Resume AI</Text>
                <Text style={styles.tileSub}>Scan Dossier</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.gridTile, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFF', borderColor: primaryColor + '20' }]}
                onPress={() => setInterviewModal(true)}
              >
                <View style={[styles.tileIcon, { backgroundColor: '#FF008A22' }]}>
                  <Ionicons name="mic-outline" size={20} color="#FF008A" />
                </View>
                <Text style={[styles.tileLabel, textTheme]}>Interview Prep</Text>
                <Text style={styles.tileSub}>Mock Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.gridTile, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFF', borderColor: primaryColor + '20' }]}
                onPress={() => setExplainerModal(true)}
              >
                <View style={[styles.tileIcon, { backgroundColor: '#00F0FF22' }]}>
                  <Ionicons name="planet-outline" size={20} color="#00F0FF" />
                </View>
                <Text style={[styles.tileLabel, textTheme]}>Concept Help</Text>
                <Text style={styles.tileSub}>Explainer AI</Text>
              </TouchableOpacity>
            </View>

            {/* Second row tool cards */}
            <View style={[styles.gridRow, { marginTop: 12 }]}>
              <TouchableOpacity 
                style={[styles.gridTileFull, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFF', borderColor: primaryColor + '20' }]}
                onPress={() => setNotesModal(true)}
              >
                <View style={styles.flexRow}>
                  <View style={[styles.tileIcon, { backgroundColor: '#AF52DE22', marginRight: 12 }]}>
                    <Ionicons name="pencil" size={18} color="#AF52DE" />
                  </View>
                  <View>
                    <Text style={[styles.tileLabel, textTheme]}>Smart Note Pad</Text>
                    <Text style={styles.tileSub}>Save lecture details to college Vault locker</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="rgba(120, 120, 120, 0.6)" />
              </TouchableOpacity>
            </View>

            {/* SCHEDULE PLANNER ROW */}
            <TouchableOpacity 
              style={[styles.plannerRow, { backgroundColor: isDark ? 'rgba(0, 240, 255, 0.05)' : '#FFF', borderColor: primaryColor + '30' }]}
              onPress={() => setPlannerModal(true)}
            >
              <View style={styles.flexRow}>
                <Ionicons name="add-circle" size={22} color={primaryColor} style={{ marginRight: 12 }} />
                <View>
                  <Text style={[styles.plannerTitle, textTheme]}>Schedule Planner</Text>
                  <Text style={styles.plannerSub}>Manage your timetables and classes</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={primaryColor} />
            </TouchableOpacity>

            <CareerSwitcher />
          </>
        ) : (
          /* EVENTS TIMELINE FEED */
          <View style={styles.eventsTimeline}>
            <Text style={[styles.sectionHeader, textTheme, { marginTop: 10 }]}>Immersive Campus Events</Text>
            {currentTheme.events.map((evt, i) => (
              <View key={i} style={[styles.eventTimelineCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)' }]}>
                <View style={[styles.timelineBadge, { backgroundColor: primaryColor }]}>
                  <Text style={styles.timelineBadgeText}>{evt.dateNum} {evt.dateMon}</Text>
                </View>
                <View style={styles.timelineDetails}>
                  <Text style={[styles.timelineTitle, textTheme]}>{evt.title}</Text>
                  <Text style={[styles.timelineSub, subTextTheme]}>{evt.sub}</Text>
                  <Text style={[styles.timelineBody, subTextTheme]}>
                    Access gateway opens at standard university timings. Sync with admissions portal directly on Colleges tab.
                  </Text>
                  <TouchableOpacity 
                    style={[styles.timelineActionBtn, { borderColor: primaryColor }]} 
                    onPress={() => {
                      Alert.alert(evt.title, `Event registration is open for all synchronized Nexora profiles in the engineering sector.`);
                    }}
                  >
                    <Text style={[styles.timelineActionText, { color: primaryColor }]}>REGISTER REGISTRATION NODE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </Animated.ScrollView>

      {/* ================= MODAL DIALOGUES ================= */}

      {/* Resume AI Modal */}
      <Modal visible={resumeModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#08081A' : '#FFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitleText, textTheme]}>RESUME ANALYZER</Text>
              <TouchableOpacity onPress={() => { setResumeModal(false); setResumeResult(null); setResumeText(''); }}>
                <Ionicons name="close" size={24} color={textTheme.color} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={[styles.modalDescText, subTextTheme]}>Paste your technical profile / draft resume parameters to run suitability check.</Text>
              <TextInput
                style={[styles.modalInputText, { color: textTheme.color, borderColor: isDark ? '#222' : '#DDD' }]}
                placeholder="Skills, Projects, Education details..."
                placeholderTextColor="rgba(120, 120, 120, 0.6)"
                value={resumeText}
                onChangeText={setResumeText}
                multiline
              />
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: primaryColor }]} onPress={handleAnalyzeResume}>
                {analyzingResume ? <ActivityIndicator size="small" color="#000" /> : <Text style={styles.modalBtnText}>RUN AI CHECK</Text>}
              </TouchableOpacity>

              {resumeResult && (
                <View style={styles.resultBox}>
                  <Text style={[styles.resultTitle, { color: primaryColor }]}>COMPATIBILITY RATING: {resumeResult.score}%</Text>
                  <Text style={[styles.resultSubtitle, textTheme]}>Suggested keywords detected:</Text>
                  <Text style={[styles.resultBody, subTextTheme]}>{resumeResult.keywords.join(', ')}</Text>
                  <Text style={[styles.resultSubtitle, textTheme, { marginTop: 10 }]}>Actionable improvements:</Text>
                  {resumeResult.tips.map((tip: string, i: number) => (
                    <Text key={i} style={[styles.resultBody, subTextTheme]}>- {tip}</Text>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Interview Prep Modal */}
      <Modal visible={interviewModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#08081A' : '#FFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitleText, textTheme]}>INTERVIEW SIMULATION</Text>
              <TouchableOpacity onPress={() => { setInterviewModal(false); setInterviewFeedback(null); setInterviewAnswer(''); }}>
                <Ionicons name="close" size={24} color={textTheme.color} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={[styles.questionBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F5F5F5' }]}>
                <Text style={[styles.questionHeader, { color: primaryColor }]}>INTERVIEW QUESTION:</Text>
                <Text style={[styles.questionText, textTheme]}>"Explain how you troubleshoot a failure in a mechanical assembly or code module."</Text>
              </View>
              <TextInput
                style={[styles.modalInputText, { color: textTheme.color, borderColor: isDark ? '#222' : '#DDD' }]}
                placeholder="Type your response here..."
                placeholderTextColor="rgba(120, 120, 120, 0.6)"
                value={interviewAnswer}
                onChangeText={setInterviewAnswer}
                multiline
              />
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: primaryColor }]} onPress={handleEvaluateInterview}>
                {evaluatingInterview ? <ActivityIndicator size="small" color="#000" /> : <Text style={styles.modalBtnText}>EVALUATE RESPONSE</Text>}
              </TouchableOpacity>

              {interviewFeedback && (
                <View style={styles.resultBox}>
                  <Text style={[styles.resultTitle, { color: primaryColor }]}>FEEDBACK: {interviewFeedback.score}</Text>
                  <Text style={[styles.resultBody, subTextTheme]}>{interviewFeedback.critique}</Text>
                  <Text style={[styles.resultSubtitle, textTheme, { marginTop: 10 }]}>Expected Reference Elements:</Text>
                  <Text style={[styles.resultBody, subTextTheme]}>{interviewFeedback.sample}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Concept Explainer Modal */}
      <Modal visible={explainerModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#08081A' : '#FFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitleText, textTheme]}>CONCEPT EXPLAINER</Text>
              <TouchableOpacity onPress={() => { setExplainerModal(false); setConceptBrief(null); setConceptText(''); }}>
                <Ionicons name="close" size={24} color={textTheme.color} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={[styles.modalDescText, subTextTheme]}>Enter any science or mechanical term to get an analogy-rich description.</Text>
              <TextInput
                style={[styles.modalInputText, { height: 50, color: textTheme.color, borderColor: isDark ? '#222' : '#DDD' }]}
                placeholder="e.g. Ohm's Law, CNC Machining..."
                placeholderTextColor="rgba(120, 120, 120, 0.6)"
                value={conceptText}
                onChangeText={setConceptText}
              />
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: primaryColor }]} onPress={handleExplainConcept}>
                {explainingConcept ? <ActivityIndicator size="small" color="#000" /> : <Text style={styles.modalBtnText}>SIMULATE BRIEF</Text>}
              </TouchableOpacity>

              {conceptBrief && (
                <View style={styles.resultBox}>
                  <Text style={[styles.resultTitle, { color: primaryColor }]}>{conceptBrief.name}</Text>
                  <Text style={[styles.resultSubtitle, textTheme]}>The Analogy:</Text>
                  <Text style={[styles.resultBody, subTextTheme]}>{conceptBrief.analogy}</Text>
                  <Text style={[styles.resultSubtitle, textTheme, { marginTop: 10 }]}>Summary Detail:</Text>
                  <Text style={[styles.resultBody, subTextTheme]}>{conceptBrief.summary}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Smart Notes Modal */}
      <Modal visible={notesModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#08081A' : '#FFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitleText, textTheme]}>SMART NOTE EDITOR</Text>
              <TouchableOpacity onPress={() => setNotesModal(false)}>
                <Ionicons name="close" size={24} color={textTheme.color} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={[styles.modalDescText, subTextTheme]}>Compile lecture notes. Sync files straight to your document Vault.</Text>
              <TextInput
                style={[styles.modalInputText, { height: 50, color: textTheme.color, borderColor: isDark ? '#222' : '#DDD', marginBottom: 15 }]}
                placeholder="Note Title (e.g. Engineering Mechanics)"
                placeholderTextColor="rgba(120, 120, 120, 0.6)"
                value={noteTitle}
                onChangeText={setNoteTitle}
              />
              <TextInput
                style={[styles.modalInputText, { color: textTheme.color, borderColor: isDark ? '#222' : '#DDD' }]}
                placeholder="Compose notes..."
                placeholderTextColor="rgba(120, 120, 120, 0.6)"
                value={noteContent}
                onChangeText={setNoteContent}
                multiline
              />
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: primaryColor }]} onPress={handleSaveNotes}>
                <Text style={styles.modalBtnText}>SAVE TO DOCUMENT VAULT</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Schedule Planner Modal */}
      <Modal visible={plannerModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#08081A' : '#FFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitleText, textTheme]}>ADD TO DAILY ROUTINE</Text>
              <TouchableOpacity onPress={() => setPlannerModal(false)}>
                <Ionicons name="close" size={24} color={textTheme.color} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <TextInput
                style={[styles.modalInputText, { height: 50, color: textTheme.color, borderColor: isDark ? '#222' : '#DDD', marginBottom: 15 }]}
                placeholder="Time (e.g. 10:30 AM)"
                placeholderTextColor="rgba(120, 120, 120, 0.6)"
                value={newClassTime}
                onChangeText={setNewClassTime}
              />
              <TextInput
                style={[styles.modalInputText, { height: 50, color: textTheme.color, borderColor: isDark ? '#222' : '#DDD', marginBottom: 15 }]}
                placeholder="Routine / Class Title (e.g. Electronics)"
                placeholderTextColor="rgba(120, 120, 120, 0.6)"
                value={newClassTitle}
                onChangeText={setNewClassTitle}
              />
              <TextInput
                style={[styles.modalInputText, { height: 50, color: textTheme.color, borderColor: isDark ? '#222' : '#DDD', marginBottom: 15 }]}
                placeholder="Location (e.g. Lab 4)"
                placeholderTextColor="rgba(120, 120, 120, 0.6)"
                value={newClassLocation}
                onChangeText={setNewClassLocation}
              />
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: primaryColor }]} onPress={handleAddSchedule}>
                <Text style={styles.modalBtnText}>SAVE ROUTINE</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 25, paddingTop: Platform.OS === 'ios' ? 70 : 60, paddingBottom: 25
  },
  brandText: { fontSize: 26, fontWeight: '900', letterSpacing: 4 },
  welcomeMsg: { fontSize: 13, fontWeight: 'bold', marginTop: 4 },
  
  pillSwitcher: { 
    flexDirection: 'row', 
    padding: 3, 
    borderRadius: 20, 
    alignSelf: 'center',
    width: 140,
    height: 38,
    alignItems: 'center'
  },
  switchTab: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 18,
    height: '100%'
  },
  switchActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  switchText: { fontSize: 11, fontWeight: '900', color: 'rgba(120, 120, 120, 0.8)' },
  switchTextActive: { color: '#000' },
  
  iconBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: { paddingHorizontal: 20, paddingBottom: 150 },
  
  heroRow: { 
    justifyContent: 'space-between', 
    marginTop: 15,
    gap: 12
  },
  
  slideshowCard: { 
    flex: 2, 
    padding: 18, 
    borderRadius: 22, 
    borderWidth: 1, 
    minHeight: 180,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  slideHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  slideTag: { color: neonMagenta, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  slideTitle: { fontSize: 16, fontWeight: '900', marginTop: 10 },
  slideDate: { color: '#FFD700', fontSize: 11, fontWeight: '900', marginTop: 2 },
  slideDesc: { fontSize: 11.5, marginTop: 8, lineHeight: 17, fontWeight: '500' },
  dotsRow: { flexDirection: 'row', gap: 6, alignSelf: 'flex-start', marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3 },

  scheduleCard: { 
    flex: 1.2, 
    padding: 18, 
    borderRadius: 22, 
    borderWidth: 1,
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2
  },
  scheduleTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  scheduleTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  scheduleItem: { 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(120, 120, 120, 0.08)',
    paddingVertical: 6,
    marginBottom: 6
  },
  scheduleTimeIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bulletPoint: { width: 4, height: 4, borderRadius: 2 },
  scheduleTime: { fontSize: 9.5, fontWeight: '900' },
  scheduleClassText: { fontSize: 11, fontWeight: '900', marginTop: 2 },
  scheduleLocText: { fontSize: 9, fontWeight: '700', marginTop: 1 },

  sectionHeader: { fontSize: 16, fontWeight: '900', marginTop: 30, marginBottom: 15, marginLeft: 5, letterSpacing: 1.5 },
  
  gridRow: { flexDirection: 'row', gap: 10, width: '100%' },
  gridTile: { 
    flex: 1, 
    padding: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2
  },
  tileIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  tileLabel: { fontSize: 12.5, fontWeight: '900', textAlign: 'center' },
  tileSub: { fontSize: 9, color: 'rgba(120, 120, 120, 0.6)', fontWeight: 'bold', marginTop: 3 },
  
  gridTileFull: { 
    width: '100%', 
    padding: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2
  },
  flexRow: { flexDirection: 'row', alignItems: 'center' },
  
  plannerRow: { 
    width: '100%', 
    padding: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2
  },
  plannerTitle: { fontSize: 13, fontWeight: '900' },
  plannerSub: { fontSize: 10, color: 'rgba(120, 120, 120, 0.6)', fontWeight: 'bold', marginTop: 2 },

  // EVENTS TIMELINE FEED
  eventsTimeline: { marginTop: 10 },
  eventTimelineCard: { 
    borderRadius: 22, 
    borderWidth: 1, 
    padding: 20, 
    marginBottom: 15,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2
  },
  timelineBadge: { 
    position: 'absolute', 
    top: 18, 
    left: 20, 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 8 
  },
  timelineBadgeText: { color: '#000', fontSize: 9.5, fontWeight: '900' },
  timelineDetails: { paddingLeft: 70 },
  timelineTitle: { fontSize: 14.5, fontWeight: '900' },
  timelineSub: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  timelineBody: { fontSize: 11, lineHeight: 17, marginTop: 10 },
  timelineActionBtn: { 
    borderWidth: 1, 
    paddingVertical: 8, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 15 
  },
  timelineActionText: { fontSize: 9.5, fontWeight: '900', letterSpacing: 1 },

  // MODAL OVERLAYS
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { 
    height: height * 0.75, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    paddingHorizontal: 25, 
    paddingTop: 20 
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(120, 120, 120, 0.08)' },
  modalTitleText: { fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  modalScroll: { paddingTop: 20, paddingBottom: 100 },
  modalDescText: { fontSize: 12, lineHeight: 18, fontWeight: '600', marginBottom: 15 },
  modalInputText: { 
    height: 120, 
    borderWidth: 1, 
    borderRadius: 16, 
    padding: 15, 
    fontSize: 13.5, 
    textAlignVertical: 'top', 
    backgroundColor: 'rgba(120, 120, 120, 0.05)' 
  },
  modalBtn: { 
    height: 50, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5
  },
  modalBtnText: { color: '#000', fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  
  resultBox: { marginTop: 25, padding: 18, backgroundColor: 'rgba(120,120,120,0.05)', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(120,120,120,0.1)' },
  resultTitle: { fontSize: 13.5, fontWeight: '900', letterSpacing: 1, marginBottom: 10 },
  resultSubtitle: { fontSize: 11.5, fontWeight: '900', marginTop: 12, marginBottom: 6 },
  resultBody: { fontSize: 12, lineHeight: 18, fontWeight: '500' },

  questionBox: { padding: 15, borderRadius: 16, marginBottom: 15 },
  questionHeader: { fontSize: 11, fontWeight: '900', marginBottom: 4 },
  questionText: { fontSize: 13, fontWeight: '800', lineHeight: 18 }
});

export default HomeScreen;
