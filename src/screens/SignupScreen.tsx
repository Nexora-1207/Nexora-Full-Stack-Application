import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated
} from 'react-native';

const SignupScreen = ({ navigation }: any) => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Button interaction animation
  const scaleAnim = new Animated.Value(1);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start(() => {
      // Navigate to Home after signup simulation
      navigation.replace('Home');
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Join NEXORA 🌟</Text>
        <Text style={styles.subtitle}>Discover your truest passion.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Student Name"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="student@nexora.com"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Create Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%', marginTop: 20 }}>
          <TouchableOpacity
            style={styles.signupButton}
            activeOpacity={0.8}
            onPress={animateButton}
          >
            <Text style={styles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#F9F9F9',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: isDarkMode ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'DancingScript_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: isDarkMode ? '#AAAAAA' : '#666666',
    marginBottom: 40,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: isDarkMode ? '#BBBBBB' : '#444444',
    marginBottom: 8,
  },
  input: {
    height: 55,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: isDarkMode ? '#FFFFFF' : '#000000',
    borderWidth: 1,
    borderColor: isDarkMode ? '#333333' : '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  signupButton: {
    height: 55,
    backgroundColor: isDarkMode ? '#BB86FC' : '#6200EE',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: isDarkMode ? '#BB86FC' : '#6200EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    color: isDarkMode ? '#AAAAAA' : '#666666',
    fontSize: 15,
  },
  loginLink: {
    color: isDarkMode ? '#BB86FC' : '#6200EE',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default SignupScreen;
