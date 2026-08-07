import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  TextInput, ScrollView, Animated, Dimensions, 
  Modal, ActivityIndicator, Alert, Platform,
  StatusBar, useColorScheme
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const neonCyan = '#00F0FF';
const darkCyan = '#008B8B';
const neonMagenta = '#FF008A';
const darkBackground = '#020205';

interface College {
  id: string;
  name: string;
  shortName: string;
  sector: string;
  rating: number;
  location: string;
  matchRate: number;
  mission: string;
  perks: string[];
  requirements: string;
  description: string;
  stream: 'MPC' | 'BiPC' | 'Polytechnic' | 'ITI';
}

const MOCK_COLLEGES: College[] = [
  {
    id: 'narayana-mpc',
    name: 'Narayana Junior College (MPC Block)',
    shortName: 'Narayana MPC',
    sector: 'ENGINEERING',
    rating: 4.7,
    location: 'Hyderabad Tech Corridor',
    matchRate: 92,
    mission: 'Intensive engineering entrance preparation for JEE Main/Advanced.',
    perks: ['Direct JEE Coaching Node', '100% Academic Merit Waiver', 'IIT Placement Track'],
    requirements: 'Min 85% in Class 10 Board exam',
    description: 'Renowned for intensive intermediate coaching, Narayana MPC block prepares students with rigorous scientific and mathematical foundations targeting top engineering entries.',
    stream: 'MPC'
  },
  {
    id: 'chaitanya-bipc',
    name: 'Sri Chaitanya Pre-Medical Academy (BiPC)',
    shortName: 'Chaitanya BiPC',
    sector: 'MEDICAL SUPPORT',
    rating: 4.8,
    location: 'Vizag Bio-Hub',
    matchRate: 90,
    mission: 'Nurturing future surgeons and bio-research scholars.',
    perks: ['NEET Sandbox Simulation', 'Top 100 Ranker Grant', 'Integrated Bio-Research Labs'],
    requirements: 'Min 88% in Class 10 Science & Math',
    description: 'A dedicated Intermediate block focusing on Biology, Physics, and Chemistry (BiPC) designed to successfully guide students through clinical entrance and medical research gates.',
    stream: 'BiPC'
  },
  {
    id: 'govt-poly',
    name: 'Government Polytechnic College',
    shortName: 'Govt Polytechnic',
    sector: 'ENGINEERING',
    rating: 4.6,
    location: 'Bangalore Industrial Node',
    matchRate: 94,
    mission: 'Practical technical mastery and core diploma engineering.',
    perks: ['100% Government Stipend Cover', 'CNC Machining Workshop Access', 'Direct Lateral Entry to B.Tech'],
    requirements: 'Class 10 Pass / POLYCET Entrance Exam',
    description: 'Government polytechnic institute offering hands-on 3-year diploma programs. Provides direct admission into the 2nd year of engineering streams for diploma holders.',
    stream: 'Polytechnic'
  },
  {
    id: 'centauri-poly',
    name: 'Centauri Polytechnic Institute',
    shortName: 'Centauri Poly',
    sector: 'COMPUTERS',
    rating: 4.7,
    location: 'Hyderabad Tech-Spur',
    matchRate: 95,
    mission: 'Hands-on code compilation, hardware logic, and network wiring.',
    perks: ['Advanced Microprocessor Lab', 'Cybersecurity Sandbox Access', 'Direct Job Placement Node'],
    requirements: 'Class 10 or equivalent, POLYCET rank',
    description: 'Specialized diploma programs focused on software systems, micro-assembly, and computing infrastructure, paving a clear way for lateral entry into B.Tech CSE.',
    stream: 'Polytechnic'
  },
  {
    id: 'nit-lateral',
    name: 'Nexora Institute of Technology (Lateral Entry)',
    shortName: 'NIT Lateral',
    sector: 'ENGINEERING',
    rating: 4.9,
    location: 'Bangalore Cyber-Nexus',
    matchRate: 96,
    mission: 'Designing next-generation orbital telemetry & neural architecture.',
    perks: ['Elite Lateral Fellowship (100% Tuition)', 'Interactive Neural AI Sandbox', 'Direct ISRO/SpaceX Placement'],
    requirements: 'Diploma in Engineering with min 70% aggregate marks',
    description: 'The flagship engineering branch of Nexora. NIT provides a direct lateral entry gateway for Polytechnic diploma graduates into the 2nd year of Computer, Electronics, and Mechanical Engineering.',
    stream: 'Polytechnic'
  },
  {
    id: 'govt-iti',
    name: 'Government ITI Industrial Training School',
    shortName: 'Govt ITI',
    sector: 'SKILLED TRADES',
    rating: 4.5,
    location: 'Chennai Industrial Cluster',
    matchRate: 88,
    mission: 'Vocational trade engineering, machine assembly, and smart grids.',
    perks: ['Free Tooling Kit Allowance', 'Direct Corporate Apprenticeship', 'Vocational Trade Certification'],
    requirements: 'Class 10 Pass, Manual Agility Test',
    description: 'Pioneering vocational training in industrial electrician trades, fitter crafts, and lathe machining operations. Focuses on immediate, production-ready workplace placement.',
    stream: 'ITI'
  }
];

const STREAM_FILTERS = ['ALL', 'MPC', 'BiPC', 'Polytechnic', 'ITI'];

const CollegeScreen = () => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const themeCyan = isDark ? neonCyan : darkCyan;
  const [profile, setProfile] = useState<any>(null);
  const [dbColleges, setDbColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'online' | 'cache'>('cache');
  const [activeStream, setActiveStream] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchProfileAndColleges();
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    
    // Pulsing effect for match badges
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: false })
      ])
    ).start();
  }, []);

  const fetchProfileAndColleges = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      let userStream = 'ALL';
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileData) {
          setProfile(profileData);
          if (profileData.stream) {
            userStream = profileData.stream;
          }
        }
      }

      // Check local storage for offline stream configuration
      const storedStream = await AsyncStorage.getItem('activeStream');
      if (storedStream) {
        userStream = storedStream;
      }
      setActiveStream(userStream);

      // Try fetching colleges from Supabase if online
      const { data: colData, error: colError } = await supabase
        .from('colleges')
        .select('*');

      if (colError) throw colError;

      if (colData && colData.length > 0) {
        // Map database records to include stream classification if absent
        const mappedDb = colData.map((c: any) => ({
          ...c,
          stream: c.stream || (c.sector === 'MEDICAL SUPPORT' ? 'BiPC' : c.sector === 'SKILLED TRADES' ? 'ITI' : 'MPC')
        }));
        setDbColleges(mappedDb);
        setSyncStatus('online');
      } else {
        setSyncStatus('cache');
      }
    } catch (e) {
      console.log('Using robust offline mock college database.');
      setSyncStatus('cache');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (collegeId: string) => {
    setApplyingId(collegeId);
    setTimeout(() => {
      setApplyingId(null);
      setAppliedIds([...appliedIds, collegeId]);
      const token = `NEX-${Math.floor(100000 + Math.random() * 900000)}`;
      const collegeObj = collegesToUse.find(c => c.id === collegeId);
      const collegeName = collegeObj ? collegeObj.name : 'College Node';
      Alert.alert(
        'GATEWAY ESTABLISHED',
        `Admissions Token: ${token}\n\nYour Nexora Profile Dossier has been securely synchronized with the college registration node. Admissions officers will contact you shortly.`,
        [
          { text: 'OK' },
          { 
            text: 'SAVE TO VAULT',
            onPress: async () => {
              try {
                const stored = await AsyncStorage.getItem('vault_files');
                let vaultFiles = stored ? JSON.parse(stored) : [];
                const newFile = {
                  id: Math.random().toString(),
                  name: `Token_${collegeId}_${token}.txt`,
                  category: 'ADMISSIONS',
                  size: '14 KB',
                  date: new Date().toISOString().split('T')[0],
                  content: `GATEWAY TOKEN: ${token}\nCollege: ${collegeName}\nSync Status: Secured Synced Node\nDate Synchronized: ${new Date().toLocaleString()}`
                };
                vaultFiles.unshift(newFile);
                await AsyncStorage.setItem('vault_files', JSON.stringify(vaultFiles));
                Alert.alert('VAULT UPDATED', 'The admission gateway token has been successfully encrypted and stored in your Vault locker.');
              } catch (e) {
                console.log('Error saving token to vault:', e);
              }
            }
          }
        ]
      );
    }, 2000);
  };

  const collegesToUse = dbColleges.length > 0 ? dbColleges : MOCK_COLLEGES;

  // Personalized Match Rate adjustment if user has skills that match college profile
  const getAdjustedMatch = (college: College) => {
    if (!profile || !profile.skills || profile.skills.length === 0) {
      return college.matchRate;
    }
    
    // Check overlapping keywords
    let matchCount = 0;
    const lowerMission = college.mission.toLowerCase();
    const lowerPerks = college.perks.join(' ').toLowerCase();
    const lowerDesc = college.description.toLowerCase();

    profile.skills.forEach((skill: string) => {
      const lowerSkill = skill.toLowerCase();
      if (lowerMission.includes(lowerSkill) || lowerPerks.includes(lowerSkill) || lowerDesc.includes(lowerSkill)) {
        matchCount += 3;
      }
    });

    const finalMatch = Math.min(100, college.matchRate + matchCount);
    return finalMatch;
  };

  const filteredColleges = collegesToUse.filter((col) => {
    const matchesStream = activeStream === 'ALL' || (col.stream && col.stream.toUpperCase() === activeStream.toUpperCase());
    const matchesSearch = col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.mission.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStream && matchesSearch;
  });

  const borderGlow = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 240, 255, 0.15)', 'rgba(0, 240, 255, 0.5)']
  });

  const badgeScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05]
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <LinearGradient colors={isDark ? ['#020205', '#08081A', '#020205'] : ['#F4F6F9', '#E6E9F0', '#F4F6F9']} style={styles.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>COLLEGE HUB</Text>
          <Text style={styles.subtitle}>Explore Institutes & Campus Missions</Text>
        </View>
        <View style={[
          styles.syncBadge, 
          { borderColor: syncStatus === 'online' ? neonCyan + 'aa' : '#FFAA00aa' }
        ]}>
          <View style={[
            styles.syncIndicator, 
            { backgroundColor: syncStatus === 'online' ? neonCyan : '#FFAA00' }
          ]} />
          <Text style={[
            styles.syncText, 
            { color: syncStatus === 'online' ? neonCyan : '#FFAA00' }
          ]}>
            {syncStatus === 'online' ? 'ONLINE SYNCED' : 'CACHE SYNCED'}
          </Text>
        </View>
      </View>

      {/* SEARCH AND FILTERS */}
      <View style={styles.searchSection}>
        <View style={[
          styles.searchBox, 
          searchFocused && { borderColor: themeCyan, shadowColor: themeCyan, shadowRadius: 10, shadowOpacity: 0.2, elevation: 5 }
        ]}>
          <Ionicons name="search" size={20} color={searchFocused ? neonCyan : 'rgba(255,255,255,0.3)'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search institute name, mission, keyword..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* HORIZONTAL SECTORS */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {STREAM_FILTERS.map((stream) => {
            const isActive = activeStream === stream;
            return (
              <TouchableOpacity 
                key={stream} 
                style={[
                  styles.filterChip, 
                  isActive && styles.filterChipActive
                ]}
                onPress={() => setActiveStream(stream)}
              >
                {isActive && <LinearGradient colors={[neonCyan + 'aa', 'transparent']} style={styles.chipGlow} />}
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {stream}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* COLLEGES DYNAMIC VIEW */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={neonCyan} />
          <Text style={styles.loaderText}>Accessing Intelligence Database...</Text>
        </View>
      ) : filteredColleges.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="planet" size={50} color="rgba(255,255,255,0.15)" />
          <Text style={styles.emptyText}>No institute nodes matching the query.</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={() => { setActiveStream('ALL'); setSearchQuery(''); }}>
            <Text style={styles.resetTxt}>RESET DATA ACCESS</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.FlatList
          data={filteredColleges}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim }}
          renderItem={({ item }) => {
            const adjustedMatch = getAdjustedMatch(item);
            const isApplied = appliedIds.includes(item.id);
            return (
              <Animated.View style={[
                styles.collegeCard, 
                { borderColor: borderGlow }
              ]}>
                <LinearGradient 
                  colors={isDark ? ['rgba(15, 15, 35, 0.95)', '#060613'] : ['rgba(255, 255, 255, 1)', '#F0F0F0']} 
                  style={styles.cardGrad} 
                />
                
                <View style={styles.cardHeader}>
                  <View style={styles.headerInfo}>
                    <Text style={styles.sectorTag}>{item.sector}</Text>
                    <Text style={styles.collegeName}>{item.name}</Text>
                    <View style={styles.ratingLocationRow}>
                      <Ionicons name="star" size={13} color="#FFD700" />
                      <Text style={styles.cardRating}>{item.rating}</Text>
                      <Text style={styles.cardRatingSep}>•</Text>
                      <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.4)" />
                      <Text style={styles.cardLocation} numberOfLines={1}>{item.location}</Text>
                    </View>
                  </View>
                  
                  <Animated.View style={[
                    styles.matchBadge, 
                    { transform: [{ scale: badgeScale }] }
                  ]}>
                    <Text style={styles.matchPerc}>{adjustedMatch}%</Text>
                    <Text style={styles.matchLabel}>MATCH</Text>
                  </Animated.View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.missionTitle}>CAMPUS MISSION</Text>
                <Text style={styles.missionText}>"{item.mission}"</Text>

                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.detailsBtn} 
                    onPress={() => setSelectedCollege(item)}
                  >
                    <Ionicons name="document-text-outline" size={16} color={neonCyan} />
                    <Text style={styles.detailsBtnText}>MISSION BRIEF</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.applyBtn, 
                      isApplied && styles.applyBtnSuccess,
                      applyingId === item.id && styles.applyBtnDisabled
                    ]}
                    onPress={() => handleApply(item.id)}
                    disabled={isApplied || applyingId === item.id}
                  >
                    {applyingId === item.id ? (
                      <ActivityIndicator size="small" color={isDark ? '#000' : '#FFF'} />
                    ) : (
                      <>
                        <Ionicons 
                          name={isApplied ? "checkmark-circle" : "arrow-forward-circle"} 
                          size={16} 
                          color={isDark ? '#000' : '#FFF'} 
                        />
                        <Text style={styles.applyBtnText}>
                          {isApplied ? 'SYNCD APPLY' : 'APPLY GATEWAY'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </Animated.View>
            );
          }}
        />
      )}

      {/* DETAIL BRIEFING MODAL */}
      <Modal
        visible={selectedCollege !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedCollege(null)}
      >
        {selectedCollege && (
          <View style={styles.modalOverlay}>
            <LinearGradient colors={isDark ? ['rgba(2, 2, 5, 0.95)', 'rgba(8, 8, 25, 0.98)'] : ['rgba(255, 255, 255, 0.95)', 'rgba(240, 240, 245, 0.98)']} style={styles.modalBg} />
            
            <View style={styles.modalWrapper}>
              <View style={styles.modalCard}>
                <LinearGradient colors={isDark ? ['rgba(15, 15, 40, 0.98)', '#070718'] : ['rgba(255, 255, 255, 0.98)', '#F4F6F9']} style={styles.modalInnerGrad} />
                
                {/* Close Button */}
                <TouchableOpacity 
                  style={styles.closeBtn} 
                  onPress={() => setSelectedCollege(null)}
                >
                  <Ionicons name="close" size={24} color={isDark ? "#FFF" : "#000"} />
                </TouchableOpacity>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                  <Text style={styles.modalSector}>{selectedCollege.sector}</Text>
                  <Text style={styles.modalName}>{selectedCollege.name}</Text>
                  
                  <View style={styles.modalMetaRow}>
                    <View style={styles.modalRatingBox}>
                      <Ionicons name="star" size={15} color="#FFD700" />
                      <Text style={styles.modalRatingText}>{selectedCollege.rating} (Elite Standard)</Text>
                    </View>
                    <View style={styles.modalLocationBox}>
                      <Ionicons name="location" size={15} color={neonCyan} />
                      <Text style={styles.modalLocationText}>{selectedCollege.location}</Text>
                    </View>
                  </View>

                  <View style={styles.modalDivider} />

                  <Text style={styles.modalSectionTitle}>THE MISSION DIRECTIVE</Text>
                  <Text style={styles.modalDesc}>{selectedCollege.description}</Text>

                  <Text style={styles.modalSectionTitle}>CORE CAMPUS INITIATIVE</Text>
                  <View style={styles.missionQuoteContainer}>
                    <Text style={styles.missionQuote}>"{selectedCollege.mission}"</Text>
                  </View>

                  <Text style={styles.modalSectionTitle}>ACADEMIC GATEWAY REQS</Text>
                  <View style={styles.reqsBox}>
                    <Ionicons name="shield-outline" size={16} color={neonCyan} style={{ marginRight: 10 }} />
                    <Text style={styles.reqsText}>{selectedCollege.requirements}</Text>
                  </View>

                  <Text style={styles.modalSectionTitle}>NEXORA SCHOLARSHIPS & NODES</Text>
                  {selectedCollege.perks.map((perk, idx) => (
                    <View key={idx} style={styles.perkNode}>
                      <Ionicons name="flash" size={14} color={neonMagenta} style={{ marginRight: 10 }} />
                      <Text style={styles.perkText}>{perk}</Text>
                    </View>
                  ))}

                  {/* Skills overlap highlight */}
                  {profile && profile.skills && profile.skills.length > 0 && (
                    <>
                      <Text style={styles.modalSectionTitle}>YOUR SYNCED MATCH MATRIX</Text>
                      <View style={styles.overlapBox}>
                        <Ionicons name="checkbox" size={16} color={neonCyan} style={{ marginRight: 10 }} />
                        <Text style={styles.overlapText}>
                          Matched Profile Skillsets: {
                            profile.skills.filter((sk: string) => 
                              selectedCollege.mission.toLowerCase().includes(sk.toLowerCase()) || 
                              selectedCollege.description.toLowerCase().includes(sk.toLowerCase())
                            ).join(', ') || 'General Academic Path Core'
                          }
                        </Text>
                      </View>
                    </>
                  )}

                  <View style={{ height: 40 }} />
                </ScrollView>

                {/* Bottom Gateway apply row inside modal */}
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[
                      styles.modalApplyBtn,
                      appliedIds.includes(selectedCollege.id) && styles.modalApplyBtnSuccess,
                      applyingId === selectedCollege.id && styles.modalApplyBtnDisabled
                    ]}
                    onPress={() => handleApply(selectedCollege.id)}
                    disabled={appliedIds.includes(selectedCollege.id) || applyingId === selectedCollege.id}
                  >
                    {applyingId === selectedCollege.id ? (
                      <ActivityIndicator size="small" color={isDark ? '#000' : '#FFF'} />
                    ) : (
                      <>
                        <Ionicons 
                          name={appliedIds.includes(selectedCollege.id) ? "shield-checkmark-outline" : "rocket-outline"} 
                          size={20} 
                          color={isDark ? '#000' : '#FFF'} 
                          style={{ marginRight: 10 }} 
                        />
                        <Text style={styles.modalApplyText}>
                          {appliedIds.includes(selectedCollege.id) 
                            ? 'APPLICATION TRANSMITTED' 
                            : 'INITIATE APPLICATION GATEWAY'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const getStyles = (isDark: boolean) => {
  const themeCyan = isDark ? neonCyan : darkCyan;
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: isDark ? darkBackground : '#F4F6F9' },
  background: { ...StyleSheet.absoluteFillObject },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 25, 
    paddingTop: Platform.OS === 'ios' ? 70 : 50, 
    paddingBottom: 20
  },
  title: { color: isDark ? '#FFF' : '#111', fontSize: 28, fontWeight: '900', letterSpacing: 3, textShadowColor: neonCyan, textShadowRadius: 10 },
  subtitle: { color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 5, fontWeight: 'bold' },
  
  syncBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    borderWidth: 1, 
    borderRadius: 20, 
    paddingHorizontal: 12, 
    paddingVertical: 6 
  },
  syncIndicator: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  syncText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },

  searchSection: { paddingHorizontal: 20, marginBottom: 15 },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    borderRadius: 18, 
    paddingHorizontal: 15, 
    height: 54, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.06)' 
  },
  searchInput: { flex: 1, marginLeft: 12, color: isDark ? '#FFF' : '#111', fontSize: 14 },

  filterSection: { marginBottom: 20 },
  filterScroll: { paddingHorizontal: 20 },
  filterChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 15, 
    marginRight: 10, 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
    overflow: 'hidden'
  },
  filterChipActive: { 
    backgroundColor: 'rgba(0, 240, 255, 0.1)', 
    borderColor: 'rgba(0, 240, 255, 0.3)' 
  },
  chipGlow: { ...StyleSheet.absoluteFillObject, opacity: 0.2 },
  filterChipText: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  filterChipTextActive: { color: themeCyan },

  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { color: themeCyan, fontSize: 12, fontWeight: 'bold', letterSpacing: 2, marginTop: 15 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { color: 'rgba(255,255,255,0.3)', fontSize: 14, fontWeight: '600', marginTop: 15, textAlign: 'center', marginBottom: 25 },
  resetBtn: { backgroundColor: 'rgba(0, 240, 255, 0.08)', borderWidth: 1, borderColor: themeCyan + '44', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 15 },
  resetTxt: { color: themeCyan, fontSize: 11, fontWeight: '900', letterSpacing: 2 },

  scrollArea: { paddingHorizontal: 20, paddingBottom: 150 },
  collegeCard: { 
    borderRadius: 24, 
    borderWidth: 1, 
    marginBottom: 20, 
    position: 'relative', 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8
  },
  cardGrad: { ...StyleSheet.absoluteFillObject },
  cardHeader: { flexDirection: 'row', padding: 20, paddingBottom: 15 },
  headerInfo: { flex: 1, marginRight: 10 },
  sectorTag: { color: neonMagenta, fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginBottom: 6 },
  collegeName: { color: isDark ? '#FFF' : '#111', fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  ratingLocationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  cardRating: { color: isDark ? '#FFF' : '#111', fontSize: 12, fontWeight: '800', marginLeft: 5 },
  cardRatingSep: { color: 'rgba(255,255,255,0.2)', marginHorizontal: 8 },
  cardLocation: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '600', flex: 1 },
  
  matchBadge: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: 'rgba(0, 240, 255, 0.1)', 
    borderWidth: 2, 
    borderColor: themeCyan, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: themeCyan,
    shadowRadius: 10,
    shadowOpacity: 0.3
  },
  matchPerc: { color: isDark ? '#FFF' : '#111', fontSize: 15, fontWeight: '900' },
  matchLabel: { color: themeCyan, fontSize: 7, fontWeight: '900', marginTop: 1 },

  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.04)', marginHorizontal: 20 },
  
  missionTitle: { color: 'rgba(255,255,255,0.25)', fontSize: 9, fontWeight: '900', letterSpacing: 2, paddingHorizontal: 20, paddingTop: 15, marginBottom: 5 },
  missionText: { color: isDark ? '#FFF' : '#111', fontSize: 13, lineHeight: 20, fontStyle: 'italic', paddingHorizontal: 20, paddingBottom: 20 },

  cardActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    padding: 15, 
    borderTopWidth: 1, 
    borderColor: 'rgba(255,255,255,0.03)' 
  },
  detailsBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FFF', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)'
  },
  detailsBtnText: { color: themeCyan, fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginLeft: 8 },
  
  applyBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: themeCyan, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 14,
    shadowColor: themeCyan,
    shadowRadius: 10,
    shadowOpacity: 0.3,
    elevation: 5
  },
  applyBtnSuccess: { 
    backgroundColor: '#00FF88',
    shadowColor: '#00FF88' 
  },
  applyBtnDisabled: { opacity: 0.6 },
  applyBtnText: { color: isDark ? '#000' : '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginLeft: 8 },

  // MODAL STYLING
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBg: { ...StyleSheet.absoluteFillObject },
  modalWrapper: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'transparent' },
  modalCard: { 
    height: height * 0.85, 
    width: '100%', 
    borderTopLeftRadius: 36, 
    borderTopRightRadius: 36, 
    borderWidth: 1, 
    borderColor: 'rgba(0,240,255,0.15)', 
    overflow: 'hidden',
    position: 'relative'
  },
  modalInnerGrad: { ...StyleSheet.absoluteFillObject },
  closeBtn: { 
    position: 'absolute', 
    top: 25, 
    right: 25, 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  modalScroll: { paddingHorizontal: 30, paddingTop: 40, paddingBottom: 150 },
  modalSector: { color: neonMagenta, fontSize: 11, fontWeight: '900', letterSpacing: 3, marginBottom: 8 },
  modalName: { color: isDark ? '#FFF' : '#111', fontSize: 26, fontWeight: '900', lineHeight: 34 },
  modalMetaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 },
  modalRatingBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,215,0,0.08)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 8
  },
  modalRatingText: { color: '#FFD700', fontSize: 12, fontWeight: '800', marginLeft: 6 },
  modalLocationBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,240,255,0.08)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12,
    marginBottom: 8
  },
  modalLocationText: { color: themeCyan, fontSize: 12, fontWeight: '800', marginLeft: 6 },
  modalDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 25 },
  modalSectionTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 15, marginTop: 10 },
  modalDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 22, fontWeight: '500' },
  missionQuoteContainer: { 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderLeftWidth: 3, 
    borderColor: themeCyan, 
    padding: 16, 
    borderRadius: 12, 
    marginVertical: 5 
  },
  missionQuote: { color: isDark ? '#FFF' : '#111', fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  reqsBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FFF', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.04)', 
    padding: 15, 
    borderRadius: 16 
  },
  reqsText: { color: isDark ? '#FFF' : '#111', fontSize: 13, fontWeight: '600', flex: 1 },
  perkNode: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,0,138,0.05)', 
    padding: 14, 
    borderRadius: 14, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,0,138,0.1)'
  },
  perkText: { color: isDark ? '#FFF' : '#111', fontSize: 13, fontWeight: '600' },
  overlapBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,240,255,0.05)', 
    borderWidth: 1, 
    borderColor: 'rgba(0,240,255,0.15)', 
    padding: 15, 
    borderRadius: 16 
  },
  overlapText: { color: themeCyan, fontSize: 12, fontWeight: 'bold', flex: 1 },

  modalActions: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: 30, 
    backgroundColor: isDark ? '#070718' : '#F4F6F9', 
    borderTopWidth: 1, 
    borderColor: 'rgba(255,255,255,0.05)' 
  },
  modalApplyBtn: { 
    flexDirection: 'row', 
    backgroundColor: themeCyan, 
    height: 60, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: themeCyan,
    shadowRadius: 15,
    shadowOpacity: 0.4,
    elevation: 8
  },
  modalApplyBtnSuccess: { 
    backgroundColor: '#00FF88',
    shadowColor: '#00FF88' 
  },
  modalApplyBtnDisabled: { opacity: 0.6 },
  modalApplyText: { color: isDark ? '#000' : '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 2 }
});
};

export default CollegeScreen;
