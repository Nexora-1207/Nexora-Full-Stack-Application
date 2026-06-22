import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, Animated, 
  Dimensions, Alert, ActivityIndicator, Easing, useColorScheme, Image
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();
const { width } = Dimensions.get('window');
const neonCyan = '#00F0FF';
const darkCyan = '#008B8B';

const AuthScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const iconColor = isDark ? neonCyan : darkCyan;

  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp_login' | 'otp_verify' | 'recovery_hub' | 'reset_password' | 'success_message'>('login');
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const logoPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    // Logo breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulseAnim, { toValue: 1.05, duration: 1500, easing: Easing.ease, useNativeDriver: true }),
        Animated.timing(logoPulseAnim, { toValue: 1, duration: 1500, easing: Easing.ease, useNativeDriver: true })
      ])
    ).start();

    let interval: any;
    if (authMode === 'otp_verify' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [authMode, timer]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Use Linking.createURL which is much more reliable in Expo Go than AuthSession.makeRedirectUri
  const redirectUri = Platform.OS === 'web' 
    ? window.location.origin 
    : Linking.createURL('auth-callback');

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { 
                redirectTo: redirectUri,
                skipBrowserRedirect: true,
                queryParams: {
                    prompt: 'select_account' // Forces the Google account picker
                }
            },
        });
        if (error) throw error;

        if (data?.url) {
            const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
            if (result.type === 'success' && result.url) {
                // Robust parsing of the redirect URL without relying on URLSearchParams
                const queryString = result.url.split('#')[1] || result.url.split('?')[1] || '';
                
                let access_token = null;
                let refresh_token = null;
                let code = null;

                queryString.split('&').forEach(pair => {
                    const [key, value] = pair.split('=');
                    if (key === 'access_token') access_token = value;
                    if (key === 'refresh_token') refresh_token = value;
                    if (key === 'code') code = value;
                });
                
                if (code) {
                    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
                    if (sessionError) throw sessionError;
                } else if (access_token) {
                    // Sometimes refresh_token is missing, we should still try to set the session
                    const { error: sessionError } = await supabase.auth.setSession({ 
                        access_token, 
                        refresh_token: refresh_token || ''
                    });
                    if (sessionError) throw sessionError;
                } else {
                    throw new Error('No access token or code found in the redirect URL. ' + result.url);
                }
            } else if (result.type !== 'cancel') {
                throw new Error(`Browser returned: ${result.type}`);
            }
            setLoading(false);
        } else {
            setLoading(false);
        }
    } catch (err: any) {
        Alert.alert('Google Fault', err.message);
        setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    const currentEmail = email.trim();
    const currentPass = password;
    if (!currentEmail || !currentPass) return Alert.alert('Gate Locked', 'Email and Password required.');

    setLoading(true);
    if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: currentEmail, password: currentPass });
        if (error) { setLoading(false); Alert.alert('Access Denied', error.message); }
    } else if (authMode === 'signup') {
        if (currentPass !== confirmPassword) { setLoading(false); return Alert.alert('Error', 'Passwords mismatch.'); }
        const { data, error } = await supabase.auth.signUp({ 
            email: currentEmail, password: currentPass, 
            options: { data: { full_name: name }, emailRedirectTo: redirectUri } 
        });
        setLoading(false);
        if (error) Alert.alert('Signup Fault', error.message);
        else if (!data.session) {
            setSuccessInfo('Clearance Required! Check your student email for the Nexora link.');
            setAuthMode('success_message');
        }
    } else if (authMode === 'reset_password') {
        if (currentPass !== confirmPassword) { setLoading(false); return Alert.alert('Error', 'Passwords mismatch.'); }
        const { error } = await supabase.auth.updateUser({ password: currentPass });
        setLoading(false);
        if (error) Alert.alert('Update Fault', error.message);
        else {
            setSuccessInfo('Security Key Updated! Your hub is now accessible.');
            setAuthMode('success_message');
        }
    }
  };

  const handleSendOTP = async () => {
      const currentEmail = email.trim();
      if (!currentEmail) return Alert.alert('Error', 'Provide email address.');
      setLoading(true);

      let result;
      if (authMode === 'recovery_hub') {
          result = await supabase.auth.resetPasswordForEmail(currentEmail, { redirectTo: redirectUri });
      } else {
          result = await supabase.auth.signInWithOtp({ email: currentEmail, options: { emailRedirectTo: redirectUri } });
      }

      setLoading(false);
      if (result.error) {
          if (result.error.status === 429) {
              Alert.alert('Satellite Busy', 'Too many requests! Please wait a few minutes for the security lock to lift.');
          } else {
              Alert.alert('Signal Failed', result.error.message);
          }
      } else {
          setTimer(30);
          setCanResend(false);
          setAuthMode('otp_verify');
      }
  };

  const handleVerifyOTP = async () => {
      if (!otpCode || otpCode.length < 6) return Alert.alert('Error', 'Code incomplete.');
      setLoading(true);
      
      const verifyType = (authMode === 'otp_verify' && successInfo === 'RECOVERY_ACTIVE') ? 'recovery' : 'email';
      
      const { data, error } = await supabase.auth.verifyOtp({ 
          email: email.trim(), 
          token: otpCode.trim(), 
          type: verifyType 
      });

      if (error) {
          setLoading(false);
          if (error.status === 429) {
              Alert.alert('Satellite Busy', 'You are verifying too fast. Please wait 30 seconds.');
          } else {
              Alert.alert('Gate Locked', 'Identity code invalid.');
          }
      } else {
          setLoading(false);
          if (verifyType === 'recovery') {
              setAuthMode('reset_password'); 
          }
      }
  };

  const handleHubFinalAction = () => {
      if (authMode === 'login' || authMode === 'signup' || authMode === 'reset_password') handleEmailAuth();
      else if (authMode === 'otp_login' || authMode === 'recovery_hub') {
          if (authMode === 'recovery_hub') setSuccessInfo('RECOVERY_ACTIVE');
          else setSuccessInfo('');
          handleSendOTP();
      } 
      else if (authMode === 'otp_verify') handleVerifyOTP();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.mainWrapper, { opacity: fadeAnim }]}>
          
          <View style={styles.brandBox}>
            <Animated.Image 
              source={require('../../assets/nexora_logo.jpg')}
              style={[styles.appLogo, { transform: [{ scale: logoPulseAnim }] }]}
              resizeMode="contain"
            />
            <Text style={styles.brandSlogan}>TRUSTED • SECURE • SMART</Text>
            <View style={styles.neonDivider} />
          </View>

          {(authMode === 'login' || authMode === 'signup') && (
            <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin} disabled={loading} activeOpacity={0.7}>
                <Ionicons name="logo-google" size={24} color="#000" />
                <Text style={styles.googleTxt}>CONTINUE VIA GOOGLE GATEWAY</Text>
            </TouchableOpacity>
          )}

          <View style={styles.cardContainer}>
            <Animated.View style={[styles.neonTracer, { transform: [{ rotate: rotation }] }]} />
            <View style={styles.cardInner}>
                {authMode === 'success_message' ? (
                    <View style={{alignItems: 'center'}}>
                        <Ionicons name="shield-checkmark" size={60} color={iconColor} />
                        <Text style={styles.successTitle}>Clearance Active</Text>
                        <Text style={styles.successBody}>{successInfo}</Text>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => {setAuthMode('login'); setEmail(''); setPassword('');}}>
                            <Text style={styles.actionTxt}>ACCESS LOGIN</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                    <Text style={styles.modeTitle}>
                        {authMode === 'reset_password' ? 'Set New Key' : authMode === 'login' ? 'Mission Control' : authMode === 'signup' ? 'New Profile' : authMode === 'otp_verify' ? 'Identity Code' : 'Access Hub'}
                    </Text>

                    {authMode === 'signup' && (
                        <View style={styles.inputBox}>
                            <Ionicons name="person-outline" size={18} color={iconColor} />
                            <TextInput style={styles.input} placeholder="Student Name" placeholderTextColor={isDark ? "#555" : "#888"} value={name} onChangeText={setName} />
                        </View>
                    )}

                    {(authMode !== 'otp_verify' && authMode !== 'reset_password') && (
                        <View style={styles.inputBox}>
                            <Ionicons name="mail-outline" size={18} color={iconColor} />
                            <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={isDark ? "#555" : "#888"} value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" />
                        </View>
                    )}

                    {(authMode === 'login' || authMode === 'signup' || authMode === 'reset_password') && (
                        <View style={styles.inputBox}>
                            <Ionicons name="lock-closed-outline" size={18} color={iconColor} />
                            <TextInput style={styles.input} placeholder={authMode === 'reset_password' ? "New Security Key" : "Password"} placeholderTextColor={isDark ? "#555" : "#888"} secureTextEntry value={password} onChangeText={setPassword} autoComplete="password" />
                        </View>
                    )}

                    {(authMode === 'signup' || authMode === 'reset_password') && (
                        <View style={styles.inputBox}>
                            <Ionicons name="lock-open-outline" size={18} color={iconColor} />
                            <TextInput style={styles.input} placeholder="Confirm Security Key" placeholderTextColor={isDark ? "#555" : "#888"} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
                        </View>
                    )}

                    {authMode === 'otp_verify' && (
                        <View>
                            <View style={styles.inputBox}>
                                <Ionicons name="keypad-outline" size={18} color={iconColor} />
                                <TextInput style={styles.input} placeholder="6-digit code" placeholderTextColor={isDark ? "#555" : "#888"} keyboardType="number-pad" maxLength={6} value={otpCode} onChangeText={setOtpCode} />
                            </View>
                            <View style={styles.timerBox}>
                                <Text style={styles.timerLabel}>{timer > 0 ? `Access pulse: 00:${timer < 10 ? '0'+timer : timer}` : 'Code Expired.'}</Text>
                                {canResend && <TouchableOpacity onPress={handleSendOTP}><Text style={styles.resendTxt}>REQUEST FRESH PULSE</Text></TouchableOpacity>}
                            </View>
                        </View>
                    )}

                    <TouchableOpacity style={styles.actionBtn} onPress={handleHubFinalAction} disabled={loading}>
                        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.actionTxt}>{authMode === 'reset_password' ? 'UPDATE KEY' : 'UNLOCK HUB'}</Text>}
                    </TouchableOpacity>

                    <View style={styles.linkRow}>
                        {authMode === 'login' && (
                            <>
                                <TouchableOpacity onPress={() => setAuthMode('otp_login')}><Text style={styles.link}>Entry via OTP</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => setAuthMode('recovery_hub')}><Text style={styles.link}>Forgot Key?</Text></TouchableOpacity>
                            </>
                        )}
                        {authMode !== 'login' && <TouchableOpacity onPress={() => {setAuthMode('login'); setSuccessInfo('');}}><Text style={styles.link}>Return to Login</Text></TouchableOpacity>}
                    </View>
                    </>
                )}
            </View>
          </View>
          
          {(authMode === 'login' || authMode === 'signup') && (
            <TouchableOpacity onPress={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')} style={{marginTop: 35}}>
                <Text style={styles.bottomLink}>{authMode === 'signup' ? 'ALREADY PART OF NEXORA? LOG IN' : "BUILD YOUR FUTURE. CREATE HUB ACCOUNT"}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDark ? '#020205' : '#F4F6F9' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  mainWrapper: { width: '100%', maxWidth: 400, alignItems: 'center' },
  brandBox: { alignItems: 'center', marginBottom: 40 },
  appLogo: { width: 140, height: 140, marginBottom: 15, borderRadius: 24, overflow: 'hidden' },
  brandTitle: { color: isDark ? '#FFF' : '#111', fontSize: 34, fontWeight: '900', letterSpacing: 6, textShadowColor: isDark ? neonCyan : darkCyan, textShadowRadius: 15 },
  brandSlogan: { fontSize: 10, color: isDark ? '#444' : '#888', fontWeight: 'bold', letterSpacing: 2, marginTop: 5 },
  neonDivider: { height: 2, width: 45, backgroundColor: isDark ? neonCyan : darkCyan, marginTop: 12, shadowColor: isDark ? neonCyan : darkCyan, shadowRadius: 10, shadowOpacity: 0.8 },
  googleBtn: { height: 60, borderRadius: 15, backgroundColor: isDark ? neonCyan : '#FFF', borderWidth: isDark ? 0 : 1, borderColor: '#DDD', width: '100%', maxWidth: 350, marginBottom: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  googleTxt: { color: '#000', fontWeight: '900', fontSize: 12, marginLeft: 12, letterSpacing: 1 },
  cardContainer: { width: '100%', position: 'relative', overflow: 'hidden', borderRadius: 30, padding: 3, backgroundColor: isDark ? '#0D0D1D' : '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  neonTracer: { position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', backgroundColor: 'transparent', borderWidth: 25, borderColor: 'transparent', borderTopColor: isDark ? neonCyan : darkCyan, borderRightColor: isDark ? neonCyan : darkCyan, opacity: isDark ? 0.3 : 0.1 },
  cardInner: { width: '100%', backgroundColor: isDark ? '#0D0D1D' : '#FFF', borderRadius: 28, padding: 30 },
  modeTitle: { fontSize: 24, fontWeight: '900', color: isDark ? '#FFF' : '#111', textAlign: 'center', marginBottom: 25, letterSpacing: 1 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#020205' : '#F9F9F9', height: 55, borderRadius: 15, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: isDark ? 'rgba(0, 240, 255, 0.1)' : 'rgba(0, 139, 139, 0.2)' },
  input: { flex: 1, marginLeft: 12, color: isDark ? '#FFF' : '#111', fontSize: 15 },
  actionBtn: { height: 55, width: '100%', backgroundColor: isDark ? neonCyan : darkCyan, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  actionTxt: { color: isDark ? '#000' : '#FFF', fontWeight: '900', letterSpacing: 2 },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, paddingHorizontal: 5 },
  link: { color: isDark ? neonCyan : darkCyan, fontWeight: 'bold', fontSize: 12 },
  bottomLink: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)', fontWeight: 'bold', fontSize: 13, letterSpacing: 1 },
  successTitle: { color: isDark ? '#FFF' : '#111', fontSize: 24, fontWeight: '900', marginTop: 15 },
  successBody: { color: isDark ? '#888' : '#555', textAlign: 'center', fontSize: 13, lineHeight: 22, marginTop: 10, paddingHorizontal: 10 },
  timerBox: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, paddingHorizontal: 5 },
  timerLabel: { color: isDark ? '#444' : '#888', fontSize: 11, fontWeight: 'bold' },
  resendTxt: { color: isDark ? neonCyan : darkCyan, fontSize: 11, fontWeight: '900', textDecorationLine: 'underline' }
});

export default AuthScreen;
