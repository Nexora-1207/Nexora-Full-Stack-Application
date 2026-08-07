import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  ScrollView, ActivityIndicator, Alert, Platform, useColorScheme, KeyboardAvoidingView, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const neonCyan = '#00F0FF';
const darkCyan = '#008B8B';
const neonMagenta = '#FF008A';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

const AI_SUGGESTIONS = [
  "What is Polytechnic lateral entry?",
  "What careers open with intermediate MPC?",
  "Explain BiPC medical research path",
  "How does the College Vault work?"
];

const AI_RESPONSES: Record<string, string> = {
  "what is polytechnic lateral entry?": `Polytechnic Lateral Entry allows students who have completed a 3-year Technical Diploma or equivalent to enter directly into the **2nd year (3rd semester)** of a 4-year Bachelor of Engineering (B.E.) or Bachelor of Technology (B.Tech) program.

### Key Highlights:
- **Duration Saved**: Reduces engineering degree duration from 4 years to 3 years.
- **Academic Stream Compatibility**: Open for Diploma branches (Computer, Mechanical, Civil, ECE, Electrical).
- **Eligibility Criteria**: Must secure a minimum of 50-60% aggregate marks in your technical diploma.
- **Entry Gate**: Admission is typically based on State-level lateral entry entrance exams (e.g. ECET).`,

  "what careers open with intermediate mpc?": `Intermediate MPC (Math, Physics, Chemistry) is the primary foundation for technical, structural, and numerical careers. 

### Key Engineering & Tech Paths:
- **Computer Science & AI**: Software Engineer, Neural Systems Architect, Data Analyst.
- **Core Engineering**: Robotics, Aerospace Telemetry, Structural Civil Engineering, Electric Smart Grid Management.
- **Defense & Aerospace**: Join Indian Navy, Air Force, or ISRO research divisions as technical officers.

### Alternative Elite Paths:
- **Data Science & FinTech**: Risk modeling, blockchain development.
- **Pure Sciences**: Physics Research, Quantum Computation, Computational Chemistry.`,

  "explain bipc medical research path": `Intermediate BiPC (Biology, Physics, Chemistry) opens the doors to human biological engineering, micro-biological research, and advanced clinical services.

### Core Career Verticals:
1. **Clinical & Medical Support**: Decoding quantum bio-signals, assisting robotic surgery lines.
2. **Nanotechnology & Biotechnology**: Developing target-specific nanomedicines, editing genes (CRISPR), and vaccine design.
3. **Pharmaceutical R&D**: High-throughput compound screening, clinical trial analysis.

### Top Academic Routes:
- **MBBS/BDS**: Traditional medical practitioner route.
- **B.Tech Biotech / Bioinformatics**: Bridging computers and biological systems.
- **B.Sc Allied Health Sciences**: Specialized support in imaging, telemetry, and critical care.`,

  "how does the college vault work?": `The **Nexora Document Vault** is your secure, localized academic locker. It is designed to catalog and store critical files needed for college admissions.

### Vault Key Features:
- **Admission Token Safe**: Keep a record of unique tokens generated via college applications (e.g. \`NEX-128479\`).
- **Timetable & Syllabus Storage**: Save active academic routines and reference manuals.
- **WhatsApp Sync Node**: Export files and tokens straight to your WhatsApp client for easy forwarding.
- **Space Meter**: Visually track your locker footprint against a 512 MB storage allocation.`
};

const DEFAULT_AI_INTRO = "Greetings, Student! I am Nexora AI, your active academic synchronizer. Ask me about career streams (MPC, BiPC, Polytechnic), specific syllabus guidelines, or how to store your admission credentials in the Vault.";

const AIScreen = () => {
  const isDark = useColorScheme() === 'dark';
  const themeCyan = isDark ? neonCyan : darkCyan;
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: DEFAULT_AI_INTRO,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [aiTyping, setAiTyping] = useState(false);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAiTyping(true);

    // Simulate AI thinking and typing stream
    setTimeout(() => {
      const normalizedQuery = textToSend.trim().toLowerCase();
      let responseText = `I have logged your query about: "${textToSend}". Under the Nexora Engineering Pathway, students are mapped based on their selected stream (MPC, BiPC, or Polytechnic). To get detailed curriculum specs or university credentials, let me know which specific path matches your academic foundation.`;

      // Match queries
      for (const [key, value] of Object.entries(AI_RESPONSES)) {
        if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
          responseText = value;
          break;
        }
      }

      // Add a streaming placeholder
      const aiMsgId = Math.random().toString();
      const initialAiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true
      };

      setMessages(prev => [...prev, initialAiMsg]);
      setAiTyping(false);

      // Simulate typewriter streaming
      let index = 0;
      const interval = setInterval(() => {
        setMessages(prev => {
          return prev.map(m => {
            if (m.id === aiMsgId) {
              const nextChar = responseText.slice(0, index + 3);
              const finished = nextChar.length >= responseText.length;
              if (finished) clearInterval(interval);
              return {
                ...m,
                text: responseText.slice(0, index + 3),
                isStreaming: !finished
              };
            }
            return m;
          });
        });
        index += 3;
      }, 20);

    }, 1200);
  };

  useEffect(() => {
    // Scroll to bottom when messages list updates
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, aiTyping]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.container}
    >
      <LinearGradient colors={isDark ? ['#020205', '#081525', '#020205'] : ['#F4F6F9', '#ECEFF4', '#F4F6F9']} style={styles.background} />
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <Text style={styles.title}>NEXORA AI</Text>
        <Text style={styles.subtitle}>Your Career & Academic Intelligent Agent</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.statusIndicator, { backgroundColor: '#00FF88' }]} />
          <Text style={styles.statusText}>S-NODE ONLINE</Text>
        </View>
      </View>

      {/* MESSAGES VIEW */}
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.msgBubble, 
              msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
              { 
                backgroundColor: msg.sender === 'user' 
                  ? (isDark ? 'rgba(0, 240, 255, 0.12)' : 'rgba(0, 139, 139, 0.12)')
                  : (isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF'),
                borderColor: msg.sender === 'user' 
                  ? themeCyan + '44' 
                  : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')
              }
            ]}
          >
            {msg.sender === 'ai' && (
              <View style={styles.aiLabelRow}>
                <Ionicons name="flash" size={14} color={neonMagenta} />
                <Text style={styles.aiLabel}>NEXORA INTEL</Text>
              </View>
            )}
            <Text style={[styles.msgText, { color: isDark ? '#FFF' : '#111' }]}>{msg.text}</Text>
            {msg.isStreaming && (
              <View style={styles.cursor} />
            )}
            <Text style={styles.timestamp}>{msg.timestamp}</Text>
          </View>
        ))}

        {aiTyping && (
          <View style={[styles.msgBubble, styles.aiBubble, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#FFF' }]}>
            <View style={styles.typingIndicator}>
              <ActivityIndicator size="small" color={themeCyan} />
              <Text style={[styles.typingText, { color: themeCyan }]}>Querying Neural Career Dossiers...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* QUICK SUGGESTIONS CHIPS */}
      {messages.length === 1 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsLabel}>SUGGESTED ENQUIRIES:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
            {AI_SUGGESTIONS.map((sug, i) => (
              <TouchableOpacity 
                key={i} 
                style={[
                  styles.sugChip, 
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)' }
                ]}
                onPress={() => handleSend(sug)}
              >
                <Text style={[styles.sugChipText, { color: themeCyan }]}>{sug}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* INPUT FIELD CONTAINER */}
      <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(5, 5, 15, 0.9)' : '#FFF', borderTopColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0, 0, 0, 0.05)' }]}>
        <TextInput
          style={[styles.input, { color: isDark ? '#FFF' : '#000' }]}
          placeholder="Ask about MPC streams, Polytechnics, lateral entry..."
          placeholderTextColor="rgba(120, 120, 120, 0.6)"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend(inputText)}
        />
        <TouchableOpacity 
          style={[styles.sendBtn, { backgroundColor: themeCyan }]}
          onPress={() => handleSend(inputText)}
          disabled={!inputText.trim()}
        >
          <Ionicons name="arrow-up" size={20} color={isDark ? '#000' : '#FFF'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  header: { 
    paddingHorizontal: 25, 
    paddingTop: Platform.OS === 'ios' ? 70 : 55, 
    paddingBottom: 15, 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)'
  },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: 5, color: '#FFF', textShadowColor: neonCyan, textShadowRadius: 8 },
  subtitle: { fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 5, fontWeight: 'bold' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statusIndicator: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 8, fontWeight: '900', color: '#00FF88', letterSpacing: 1 },
  
  scrollArea: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 120 },
  msgBubble: { 
    borderRadius: 20, 
    borderWidth: 1, 
    padding: 15, 
    marginBottom: 15, 
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1
  },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  aiLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  aiLabel: { color: neonMagenta, fontSize: 8, fontWeight: '900', letterSpacing: 1.5, marginLeft: 6 },
  msgText: { fontSize: 13.5, lineHeight: 22, fontWeight: '500' },
  timestamp: { fontSize: 8, color: 'rgba(120, 120, 120, 0.6)', alignSelf: 'flex-end', marginTop: 6, fontWeight: 'bold' },
  
  typingIndicator: { flexDirection: 'row', alignItems: 'center' },
  typingText: { fontSize: 11, fontWeight: '700', marginLeft: 10 },
  cursor: { width: 6, height: 14, backgroundColor: neonCyan, marginLeft: 2, marginTop: 4 },

  suggestionsContainer: { position: 'absolute', bottom: 75, left: 0, right: 0, paddingVertical: 10 },
  suggestionsLabel: { fontSize: 8, color: 'rgba(120, 120, 120, 0.8)', fontWeight: '900', letterSpacing: 1, paddingHorizontal: 20, marginBottom: 8 },
  suggestionsScroll: { paddingHorizontal: 20 },
  sugChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, marginRight: 8 },
  sugChipText: { fontSize: 10, fontWeight: '800' },

  inputContainer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 70, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    borderTopWidth: 1
  },
  input: { flex: 1, height: 44, borderRadius: 22, backgroundColor: 'rgba(120, 120, 120, 0.08)', paddingHorizontal: 18, fontSize: 13 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 12 }
});

export default AIScreen;
