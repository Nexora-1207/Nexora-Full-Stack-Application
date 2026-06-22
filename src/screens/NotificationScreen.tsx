import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const NotificationScreen = () => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const themeCyan = isDark ? '#00F0FF' : '#008B8B';

  return (
    <View style={styles.container}>
      <LinearGradient colors={isDark ? ['#020205', '#0D0D1D'] : ['#F4F6F9', '#E6E9F0']} style={styles.background} />
      <View style={styles.header}>
        <Text style={styles.title}>NOTIFICATIONS</Text>
        <Text style={styles.subtitle}>Real-time Campus Updates & Alerts</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollArea}>
          <View style={styles.alertCard}>
              <Ionicons name="notifications-circle-outline" size={32} color={themeCyan} />
              <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle}>HUB SYNCHRONIZED</Text>
                  <Text style={styles.alertTime}>Just Now</Text>
                  <Text style={styles.alertTxt}>Your Nexora Career Hub is now mathematically connected. Explore your future mission!</Text>
              </View>
          </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDark ? '#020205' : '#F4F6F9' },
  background: { ...StyleSheet.absoluteFillObject },
  header: { padding: 40, paddingTop: 60 },
  title: { color: isDark ? '#FFF' : '#111', fontSize: 24, fontWeight: '900', letterSpacing: 4 },
  subtitle: { color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)', fontSize: 13, marginTop: 10 },
  scrollArea: { padding: 25 },
  alertCard: { width: '100%', flexDirection: 'row', padding: 20, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#FFF', borderRadius: 25, borderWidth: 1, borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.05)', marginBottom: 15, shadowColor: '#000', shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 10, elevation: 2 },
  alertInfo: { marginLeft: 20, flex: 1 },
  alertTitle: { color: isDark ? '#00F0FF' : '#008B8B', fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  alertTime: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)', fontSize: 10, marginTop: 4, fontWeight: 'bold' },
  alertTxt: { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 10, lineHeight: 20, fontWeight: '500' }
});

export default NotificationScreen;
