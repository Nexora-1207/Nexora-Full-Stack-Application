import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, useColorScheme, Animated } from 'react-native';
import { supabase } from './src/lib/supabase';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Session } from '@supabase/supabase-js';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// SCREENS
import AuthScreen from './src/screens/AuthScreen';
import SectorSelectionScreen from './src/screens/SectorSelectionScreen';
import EngineeringPathScreen from './src/screens/EngineeringPathScreen';
import HomeScreen from './src/screens/HomeScreen';
import CollegeScreen from './src/screens/CollegeScreen';
import AIScreen from './src/screens/AIScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const neonCyan = '#00F0FF';
const darkCyan = '#008B8B';

const AnimatedIcon = ({ name, color, focused, size, isDark }: any) => {
  const scaleValue = useRef(new Animated.Value(focused ? 1.2 : 1)).current;
  const glowOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: focused ? 1.3 : 1, 
        useNativeDriver: true,
        friction: 3, 
        tension: 40
      }),
      Animated.timing(glowOpacity, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: focused ? 1 : 0,
        useNativeDriver: true,
        friction: 6,
        tension: 60
      })
    ]).start();
  }, [focused]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0] // Slide up effect
  });

  const scaleX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.01, 1] // Expand from middle
  });

  return (
    <Animated.View style={{ 
      transform: [{ scale: scaleValue }],
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      <Ionicons name={name} size={size * 0.9} color={color} />
      
      {/* Dynamic Glow Indicator - Slidable & Expandable */}
      <Animated.View style={{
        position: 'absolute',
        bottom: -8,
        width: 16,
        height: 3,
        borderRadius: 2,
        backgroundColor: color,
        opacity: glowOpacity,
        transform: [
          { translateY },
          { scaleX }
        ],
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 8
      }} />
    </Animated.View>
  );
};

// PENTAGON-BAR HUB
function TabNavigator() {
  const isDark = useColorScheme() === 'dark';
  const themeStyles = getStyles(isDark);
  const themeCyan = isDark ? neonCyan : darkCyan;
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderWidth: 0,
          elevation: 0,
          height: 60,
          position: 'absolute',
          bottom: Platform.OS === 'web' ? 20 : 25,
          left: 20,
          right: 20,
          paddingBottom: Platform.OS === 'ios' ? 5 : 0,
          paddingTop: 5,
        },
        tabBarActiveTintColor: themeCyan,
        tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)',
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen 
        name="HubHome" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({ color, focused }) => <AnimatedIcon name={focused ? "home" : "home-outline"} size={24} color={color} focused={focused} isDark={isDark} /> }}
      />
      <Tab.Screen 
        name="Colleges" 
        component={CollegeScreen} 
        options={{ tabBarIcon: ({ color, focused }) => <AnimatedIcon name={focused ? "business" : "business-outline"} size={24} color={color} focused={focused} isDark={isDark} /> }}
      />
      <Tab.Screen 
        name="NexoraAI" 
        component={AIScreen} 
        options={{ 
          tabBarIcon: ({ color, focused }) => (
            <Animated.View style={[themeStyles.aiNodeContainer, { transform: [{ scale: focused ? 1.15 : 1 }] }]}>
                <LinearGradient
                  colors={isDark ? ['#0070FF', '#00C2FF'] : ['#008B8B', '#00CED1']}
                  style={themeStyles.aiNodeInner}
                >
                  <Ionicons name="flash" size={26} color="#FFF" />
                </LinearGradient>
                <View style={themeStyles.aiNodeGlow} />
            </Animated.View>
          )
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationScreen} 
        options={{ tabBarIcon: ({ color, focused }) => <AnimatedIcon name={focused ? "notifications" : "notifications-outline"} size={24} color={color} focused={focused} isDark={isDark} /> }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({ color, focused }) => <AnimatedIcon name={focused ? "person-circle" : "person-circle-outline"} size={24} color={color} focused={focused} isDark={isDark} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.log('Session error:', error.message);
        await supabase.auth.signOut(); // Clear invalid token state
      }
      setSession(session);
      setIsInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isInitializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <Stack.Group>
            <Stack.Screen name="Selection" component={SectorSelectionScreen} />
            <Stack.Screen name="EngineeringPath" component={EngineeringPathScreen} />
            <Stack.Screen name="Home" component={TabNavigator} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  aiNodeContainer: {
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#020205' : '#F4F6F9',
    marginTop: -45,
    zIndex: 10,
  },
  aiNodeInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
  },
  aiNodeGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: isDark ? '#0070FF' : '#008B8B',
    opacity: isDark ? 0.15 : 0.2,
    zIndex: -1,
  }
});
