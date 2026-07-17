import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Animated, Dimensions, StatusBar,
  Platform, useColorScheme
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
// DECENT SMALL PROFESSIONAL POD SIZES (FIXED 100PX)
const ITEM_SIZE = Math.min(width / 4, 100);
const neonCyan = '#00F0FF';
const darkCyan = '#008B8B';

const SECTORS = [
  { id: '1', name: 'ENGINEERING', icon: 'construct-outline', color: '#FF4D00', type: 'ion' },
  { id: '2', name: 'SKILLED TRADES', icon: 'hammer-outline', color: '#FFAA00', type: 'ion' },
  { id: '3', name: 'COMPUTERS', icon: 'desktop-outline', color: '#00F0FF', type: 'ion' },
  { id: '4', name: 'MEDICAL SUPPORT', icon: 'medkit-outline', color: '#FF0055', type: 'ion' },
  { id: '5', name: 'MERCHANT NAVY', icon: 'boat-outline', color: '#0077FF', type: 'ion' },
  { id: '6', name: 'HOSPITALITY', icon: 'restaurant-outline', color: '#F0FF00', type: 'ion' },
  { id: '7', name: 'FASHION & DESIGN', icon: 'shirt-outline', color: '#FF00FF', type: 'ion' },
  { id: '8', name: 'MEDIA', icon: 'videocam-outline', color: '#00FF88', type: 'ion' },
  { id: '9', name: 'AGRICULTURE', icon: 'leaf-outline', color: '#88FF00', type: 'ion' },
  { id: '10', name: 'BEAUTY & WELLNESS', icon: 'sparkles-outline', color: '#FF99AA', type: 'ion' },
  { id: '11', name: 'AUTOMOBILE', icon: 'car-outline', color: '#8888FF', type: 'ion' },
  { id: '12', name: 'CONSTRUCTION', icon: 'business-outline', color: '#FF8800', type: 'ion' },
  { id: '13', name: 'ELECTRICAL', icon: 'flash-outline', color: '#FFEE00', type: 'ion' },
  { id: '14', name: 'RETAIL & LOGISTICS', icon: 'cart-outline', color: '#3300FF', type: 'ion' },
];

const SectorCard = ({ item, onSelect, styles, isDark }: { item: any, onSelect: () => void, styles: any, isDark: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;

  const toggleExpand = (isExpanded: boolean) => {
    setExpanded(isExpanded);
    Animated.spring(animValue, {
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25],
  });

  const nameColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)', item.color],
  });

  const glowOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, isDark ? 0.9 : 0.5],
  });

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => toggleExpand(true)}
        onPressOut={() => toggleExpand(false)}
        {...(Platform.OS === 'web' ? {
          onPointerEnter: () => toggleExpand(true),
          onPointerLeave: () => toggleExpand(false)
        } : {})}
        onPress={onSelect}
        style={{ zIndex: expanded ? 50 : 1 }}
      >
        <Animated.View style={[
          styles.glowHalo,
          {
            opacity: glowOpacity,
            backgroundColor: item.color,
            shadowColor: item.color,
            transform: [{ scale: 1.5 }]
          }
        ]} />

        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <LinearGradient
            colors={isDark ? ['rgba(255,255,255,0.05)', '#000'] : ['rgba(255,255,255,1)', '#F0F0F0']}
            style={styles.cardGradient}
          >
            {item.type === 'ion' ? (
              <Ionicons name={item.icon} size={34} color={expanded ? (isDark ? '#FFF' : '#000') : item.color} />
            ) : (
              <MaterialCommunityIcons name={item.icon} size={38} color={expanded ? (isDark ? '#FFF' : '#000') : item.color} />
            )}
          </LinearGradient>
          <View style={[styles.circleBorder, { borderColor: item.color, opacity: expanded ? 1 : 0.2 }]} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.Text style={[styles.sectorName, { color: nameColor, fontWeight: expanded ? '900' : 'bold' }]}>
        {item.name}
      </Animated.Text>
    </View>
  );
};

const SectorSelectionScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const themeCyan = isDark ? neonCyan : darkCyan;

  const [showIntro, setShowIntro] = useState(true);
  const [typedLogo, setTypedLogo] = useState('');
  const [typedTitle, setTypedTitle] = useState('');

  const fullLogo = "NEXORA";
  const fullTitle = "CHOOSE PATH";

  const introFade = useRef(new Animated.Value(0)).current;
  const gridFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    startTyping(fullLogo, setTypedLogo, () => {
      Animated.parallel([
        Animated.timing(introFade, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1.2, friction: 3, useNativeDriver: true })
      ]).start(() => {
        setTimeout(() => {
          Animated.timing(introFade, { toValue: 0, duration: 600, useNativeDriver: true }).start(() => {
            setShowIntro(false);
            startTyping(fullTitle, setTypedTitle);
            Animated.timing(gridFade, { toValue: 1, duration: 800, useNativeDriver: true }).start();
          });
        }, 1000);
      });
    });
  }, []);

  const startTyping = (text: string, setter: (val: string) => void, onComplete?: () => void) => {
    let index = 0;
    const interval = setInterval(() => {
      setter(text.substring(0, index + 1));
      index++;
      if (index === text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 120);
  };

  const handleSelect = (name: string) => {
    if (name === 'ENGINEERING') {
      navigation.navigate('EngineeringPath');
    } else if (name === 'MERCHANT NAVY') {
      navigation.navigate('MerchantNavyPath');
    } else {
      navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <LinearGradient colors={isDark ? ['#020205', '#0D0D1D'] : ['#F4F6F9', '#E6E9F0']} style={styles.background} />

      {showIntro ? (
        <Animated.View style={[styles.introContainer, { opacity: introFade }]}>
          <Animated.View style={{ transform: [{ scale: logoScale }] }}>
            <Text style={styles.introLogo}>{typedLogo}</Text>
            <View style={styles.introUnderline} />
          </Animated.View>
          <Text style={styles.introPrompt}>ACCESSING COMMAND HUB...</Text>
        </Animated.View>
      ) : (
        <Animated.View style={[styles.contentWrapper, { opacity: gridFade }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{typedTitle}</Text>
            <Text style={styles.subtitle}>Select your future career heartbeat</Text>
          </View>

          <FlatList
            data={SECTORS}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <SectorCard item={item} onSelect={() => handleSelect(item.name)} styles={styles} isDark={isDark} />
            )}
          />
        </Animated.View>
      )}
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDark ? '#020205' : '#F4F6F9' },
  background: { ...StyleSheet.absoluteFillObject },

  introContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  introLogo: { fontSize: 52, fontWeight: '900', color: isDark ? '#FFF' : '#111', letterSpacing: 10, textShadowColor: isDark ? neonCyan : darkCyan, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 25 },
  introUnderline: { height: 2, width: 80, backgroundColor: isDark ? neonCyan : darkCyan, marginTop: 15 },
  introPrompt: { color: isDark ? '#222' : '#888', fontSize: 10, fontWeight: '900', letterSpacing: 4, marginTop: 60 },

  contentWrapper: { flex: 1 },
  header: { marginTop: Platform.OS === 'ios' ? 70 : 50, alignItems: 'center', marginBottom: 50 },
  title: { fontSize: 34, fontWeight: '900', color: isDark ? '#FFF' : '#111', letterSpacing: 8, textShadowColor: isDark ? neonCyan : darkCyan, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 },
  subtitle: { fontSize: 13, color: isDark ? '#444' : '#888', fontWeight: 'bold', letterSpacing: 2, marginTop: 10 },

  listContent: { paddingHorizontal: 0, paddingBottom: 150 },
  columnWrapper: { justifyContent: 'space-evenly', marginBottom: 65 },

  cardWrapper: {
    width: width / 3.5,
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  glowHalo: { position: 'absolute', width: ITEM_SIZE - 20, height: ITEM_SIZE - 20, borderRadius: ITEM_SIZE / 2, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 35, elevation: 30 },
  card: { width: ITEM_SIZE, height: ITEM_SIZE, borderRadius: ITEM_SIZE / 2, overflow: 'hidden', backgroundColor: isDark ? '#000' : '#FFF', justifyContent: 'center', alignItems: 'center', elevation: isDark ? 0 : 5, shadowColor: '#000', shadowOpacity: isDark ? 0 : 0.1, shadowRadius: 10 },
  cardGradient: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  circleBorder: { ...StyleSheet.absoluteFillObject, borderRadius: ITEM_SIZE / 2, borderWidth: 1.5 },
  sectorName: { marginTop: 10, fontSize: 8, textAlign: 'center', letterSpacing: 1.2, width: '100%' },
});

export default SectorSelectionScreen;
