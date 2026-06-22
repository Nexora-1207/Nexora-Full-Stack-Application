import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AIScreen = () => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <LinearGradient colors={isDark ? ['#020205', '#081525'] : ['#F4F6F9', '#E6E9F0']} style={styles.background} />
      <View style={styles.header}>
        <Text style={styles.title}>NEXORA AI</Text>
        <Text style={styles.subtitle}>Your Career & Academic Intelligent Agent</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollArea}>
         <View style={styles.aiCard}>
             <Text style={styles.aiTitle}>S-NODE ACTIVE</Text>
             <Text style={styles.aiGreet}>I am Nexora AI. Ask me about your career mission, doubts, or institute requirements.</Text>
         </View>
         <TouchableOpacity style={styles.askBtn}>
             <Text style={styles.askTxt}>INITIATE DOUBT QUERY</Text>
             <Ionicons name="mic-outline" size={20} color="#FFF" />
         </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDark ? '#020205' : '#F4F6F9' },
  background: { ...StyleSheet.absoluteFillObject },
  header: { padding: 40, paddingTop: 60, alignItems: 'center' },
  title: { color: isDark ? '#00F0FF' : '#008B8B', fontSize: 26, fontWeight: '900', letterSpacing: 6 },
  subtitle: { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)', fontSize: 11, marginTop: 10, fontWeight: 'bold' },
  scrollArea: { padding: 25, alignItems: 'center' },
  aiCard: { width: '100%', padding: 25, backgroundColor: isDark ? 'rgba(0, 100, 255, 0.1)' : '#FFF', borderRadius: 30, borderWidth: 1, borderColor: isDark ? 'rgba(0, 100, 255, 0.3)' : 'rgba(0, 139, 139, 0.2)', shadowColor: '#000', shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 10, elevation: 2 },
  aiTitle: { color: isDark ? '#00F0FF' : '#008B8B', fontSize: 13, fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
  aiGreet: { color: isDark ? '#FFF' : '#111', fontSize: 16, lineHeight: 24, fontWeight: '600' },
  askBtn: { marginTop: 40, width: '100%', height: 65, backgroundColor: isDark ? '#0070FF' : '#008B8B', borderRadius: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', shadowColor: isDark ? '#0070FF' : '#008B8B', shadowOpacity: 0.5, shadowRadius: 15 },
  askTxt: { color: '#FFF', fontSize: 13, fontWeight: '900', letterSpacing: 3, marginRight: 15 }
});

export default AIScreen;
