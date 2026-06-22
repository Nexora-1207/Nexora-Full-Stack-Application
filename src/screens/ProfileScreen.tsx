import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ScrollView, Animated, Image, Dimensions,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, useColorScheme
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const neonCyan = '#00F0FF';
const darkCyan = '#008B8B';
const deepPurple = '#0A0A1F';

const ProfileScreen = () => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const themeCyan = isDark ? neonCyan : darkCyan;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    bio: '',
    school: '',
    college: '',
    phone_number: '',
    address: '',
    linkedin_url: '',
    skills: [] as string[]
  });
  const [skillInput, setSkillInput] = useState('');

  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchProfile();
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setProfile({
          username: data.username || '',
          full_name: data.full_name || '',
          bio: data.bio || '',
          school: data.school || '',
          college: data.college || '',
          phone_number: data.phone_number || '',
          address: data.address || '',
          linkedin_url: data.linkedin_url || '',
          skills: data.skills || []
        });
      }
    } catch (error: any) {
      Alert.alert('Cloud-Desync', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No User Node Found');

      const updates = {
        id: user.id,
        ...profile,
        updated_at: new Date()
      };

      let { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      Alert.alert('Mission-Success', 'Student Dossier Synchronized with Nexora Cloud.');
    } catch (error: any) {
      Alert.alert('Upload-Failure', error.message);
    } finally {
      setUpdating(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={themeCyan} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollArea}>
        {/* LINDEDIN-STYLE HEADER */}
        <View style={styles.header}>
          <LinearGradient 
            colors={['#0070FF', '#AF52DE']} 
            start={{x:0, y:0}} end={{x:1, y:1}} 
            style={styles.banner} 
          />
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBorder}>
              <View style={styles.avatarInner}>
                 <Ionicons name="person" size={50} color={themeCyan} />
              </View>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={20} color={isDark ? "#000" : "#FFF"} />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
          <Text style={styles.heroName}>{profile.full_name || 'Nexora Student'}</Text>
          <Text style={styles.heroTag}>Student Hub ID: {profile.username || 'Unassigned'}</Text>

          <DossierSection title="Mission Brief (Bio & Links)" styles={styles}>
            <InputNode 
              label="Professional Bio" 
              value={profile.bio} 
              onChange={(txt: string) => setProfile({ ...profile, bio: txt })} 
              placeholder="Tell us about your career goals..."
              multiline
              styles={styles}
              isDark={isDark}
            />
            <InputNode 
              label="LinkedIn URL" 
              value={profile.linkedin_url} 
              onChange={(txt: string) => setProfile({ ...profile, linkedin_url: txt })} 
              placeholder="https://linkedin.com/in/..."
              icon="logo-linkedin"
              styles={styles}
              isDark={isDark}
            />
          </DossierSection>

          <DossierSection title="Identity Details" styles={styles}>
            <InputNode 
              label="Full Name" 
              value={profile.full_name} 
              onChange={(txt: string) => setProfile({ ...profile, full_name: txt })} 
              placeholder="John Doe"
              styles={styles}
              isDark={isDark}
            />
            <InputNode 
              label="User ID" 
              value={profile.username} 
              onChange={(txt: string) => setProfile({ ...profile, username: txt })} 
              placeholder="@student_2024"
              styles={styles}
              isDark={isDark}
            />
          </DossierSection>

          <DossierSection title="Education Matrix" styles={styles}>
            <InputNode 
              label="High School" 
              value={profile.school} 
              onChange={(txt: string) => setProfile({ ...profile, school: txt })} 
              placeholder="Enter your high school name"
              icon="school"
              styles={styles}
              isDark={isDark}
            />
            <InputNode 
              label="College / Institute" 
              value={profile.college} 
              onChange={(txt: string) => setProfile({ ...profile, college: txt })} 
              placeholder="Enter your college trade/name"
              icon="business"
              styles={styles}
              isDark={isDark}
            />
          </DossierSection>

          <DossierSection title="Contact & Hub" styles={styles}>
            <InputNode 
              label="Personal Phone" 
              value={profile.phone_number} 
              onChange={(txt: string) => setProfile({ ...profile, phone_number: txt })} 
              placeholder="+91 XXXXX XXXXX"
              icon="call"
              styles={styles}
              isDark={isDark}
            />
            <InputNode 
              label="Physical Address" 
              value={profile.address} 
              onChange={(txt: string) => setProfile({ ...profile, address: txt })} 
              placeholder="City, State, Zip"
              icon="location"
              multiline
              styles={styles}
              isDark={isDark}
            />
          </DossierSection>

          <DossierSection title="Career Skillsets" styles={styles}>
            <View style={styles.skillInputRow}>
              <TextInput 
                style={styles.skillInput}
                value={skillInput}
                onChangeText={setSkillInput}
                placeholder="Add a skill (e.g. Kotlin, CAD)"
                placeholderTextColor={isDark ? "#444" : "#999"}
              />
              <TouchableOpacity style={styles.addSkillBtn} onPress={addSkill}>
                 <Ionicons name="add" size={24} color={isDark ? "#000" : "#FFF"} />
              </TouchableOpacity>
            </View>
            <View style={styles.skillsContainer}>
               {profile.skills.map((skill, index) => (
                  <TouchableOpacity key={index} style={styles.skillChip} onPress={() => removeSkill(skill)}>
                    <Text style={styles.skillText}>{skill}</Text>
                    <Ionicons name="close-circle" size={14} color={themeCyan} style={{ marginLeft: 5 }} />
                  </TouchableOpacity>
               ))}
            </View>
          </DossierSection>

          <TouchableOpacity 
            style={[styles.syncBtn, updating && styles.syncBtnDisabled]}
            onPress={updateProfile}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color={isDark ? "#000" : "#FFF"} />
            ) : (
              <>
                <Ionicons name="cloud-upload" size={24} color={isDark ? "#000" : "#FFF"} style={{ marginRight: 10 }} />
                <Text style={styles.syncBtnText}>SYNCHRONIZE DOSSIER</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// MINI COMPONENTS
const DossierSection = ({ title, children, styles }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
    {children}
  </View>
);

const InputNode = ({ label, value, onChange, placeholder, icon = 'create', multiline = false, styles, isDark }: any) => {
  const themeCyan = isDark ? neonCyan : darkCyan;
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputLabelRow}>
        <Ionicons name={icon} size={14} color={themeCyan} />
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <TextInput 
        style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={isDark ? "#555" : "#999"}
        multiline={multiline}
      />
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDark ? '#020205' : '#F4F6F9' },
  scrollArea: { paddingBottom: 150 },
  header: { height: 200, marginBottom: 60 },
  banner: { height: 160, width: '100%' },
  avatarContainer: { 
    position: 'absolute', bottom: -50, left: 25, 
    alignItems: 'center' 
  },
  avatarBorder: { 
    width: 110, height: 110, borderRadius: 55, 
    backgroundColor: isDark ? '#020205' : '#F4F6F9', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: isDark ? 'rgba(0, 240, 255, 0.3)' : 'rgba(0, 139, 139, 0.3)'
  },
  avatarInner: { 
    width: 95, height: 95, borderRadius: 47.5, 
    backgroundColor: isDark ? 'rgba(0, 240, 255, 0.05)' : 'rgba(0, 139, 139, 0.05)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: isDark ? neonCyan : darkCyan
  },
  editAvatarBtn: { 
    position: 'absolute', bottom: 5, right: 0, 
    width: 34, height: 34, borderRadius: 17, 
    backgroundColor: isDark ? neonCyan : darkCyan, justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: isDark ? '#020205' : '#F4F6F9'
  },
  
  form: { paddingHorizontal: 25 },
  heroName: { fontSize: 28, fontWeight: '900', color: isDark ? '#FFF' : '#111', letterSpacing: 1 },
  heroTag: { fontSize: 13, color: isDark ? neonCyan : darkCyan, fontWeight: 'bold', marginTop: 5, marginBottom: 25 },

  section: { marginBottom: 35, backgroundColor: isDark ? 'rgba(10, 10, 31, 0.5)' : '#FFF', padding: 20, borderRadius: 25, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)', elevation: isDark ? 0 : 2, shadowColor: '#000', shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 10 },
  sectionTitle: { fontSize: 10, color: isDark ? '#444' : '#888', fontWeight: '900', letterSpacing: 2, marginBottom: 20 },

  inputContainer: { marginBottom: 20 },
  inputLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  inputLabel: { color: isDark ? '#666' : '#888', fontSize: 11, fontWeight: 'bold', marginLeft: 8, textTransform: 'uppercase', letterSpacing: 1 },
  input: { 
    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#F9F9F9', color: isDark ? '#FFF' : '#111', paddingHorizontal: 15, 
    paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: isDark ? '#111' : '#DDD',
    fontSize: 14
  },

  skillInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#F9F9F9', borderRadius: 12, borderWidth: 1, borderColor: isDark ? '#111' : '#DDD', paddingRight: 10 },
  skillInput: { flex: 1, color: isDark ? '#FFF' : '#111', paddingHorizontal: 15, paddingVertical: 12 },
  addSkillBtn: { backgroundColor: isDark ? neonCyan : darkCyan, padding: 5, borderRadius: 8 },
  
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 },
  skillChip: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? 'rgba(0, 240, 255, 0.1)' : 'rgba(0, 139, 139, 0.1)', 
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 8,
    borderWidth: 1, borderColor: isDark ? 'rgba(0, 240, 255, 0.2)' : 'rgba(0, 139, 139, 0.2)'
  },
  skillText: { color: isDark ? neonCyan : darkCyan, fontSize: 12, fontWeight: 'bold' },

  syncBtn: { 
    flexDirection: 'row', backgroundColor: isDark ? neonCyan : darkCyan, paddingVertical: 18, 
    borderRadius: 20, justifyContent: 'center', alignItems: 'center',
    shadowColor: isDark ? neonCyan : darkCyan, shadowOpacity: 0.5, shadowRadius: 15, elevation: 10,
    marginTop: 10
  },
  syncBtnDisabled: { opacity: 0.5 },
  syncBtnText: { color: isDark ? '#000' : '#FFF', fontWeight: '900', fontSize: 15, letterSpacing: 1 }
});

export default ProfileScreen;
