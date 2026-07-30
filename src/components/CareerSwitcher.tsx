// src/components/CareerSwitcher.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Footer component that displays a horizontal list of career categories.
 * Tapping a card navigates to the corresponding roadmap screen.
 */
export const CareerSwitcher: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width } = Dimensions.get('window');

  const categories = [
    { name: 'Engineering', screen: 'EngineeringPath', sectorKey: 'ENGINEERING', color: '#FF4D00' },
    { name: 'Computers', screen: 'ComputersPath', sectorKey: 'COMPUTERS', color: '#00FF88' },
    { name: 'Skilled Trades', screen: 'SkilledTradesPath', sectorKey: 'SKILLED TRADES', color: '#FFAA00' },
    { name: 'Fashion & Design', screen: 'FashionDesignPath', sectorKey: 'FASHION & DESIGN', color: '#FF00FF' },
    { name: 'Media', screen: 'MediaPath', sectorKey: 'MEDIA', color: '#FF5E36' },
    { name: 'Agriculture', screen: 'AgriculturePath', sectorKey: 'AGRICULTURE', color: '#88FF00' },
    { name: 'Merchant Navy', screen: 'MerchantNavyPath', sectorKey: 'MERCHANT NAVY', color: '#0077FF' },
    { name: 'Medical Support', screen: 'MedicalSupportPath', sectorKey: 'MEDICAL SUPPORT', color: '#FF0055' },
  ];

  const handlePress = async (screen: string, sectorKey: string) => {
    try {
      await AsyncStorage.setItem('activeSector', sectorKey);
    } catch (_) {}
    navigation.navigate(screen as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Other Career Paths</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat.name} style={[styles.card, { width: width * 0.45 }]} onPress={() => handlePress(cat.screen, cat.sectorKey)}>
            <Ionicons name="briefcase" size={28} color={cat.color} />
            <Text style={styles.cardText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
    marginLeft: 10,
    color: '#FFF',
  },
  scroll: {
    paddingHorizontal: 10,
  },
  scrollContent: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    marginTop: 6,
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
