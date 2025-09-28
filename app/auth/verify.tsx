import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function VerifyOTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phone!,
        token: otp,
        type: 'sms',
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.replace('/dashboard');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone!,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'OTP sent successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>📱</Text>
          </View>
          <Text style={styles.title}>Enter verification code</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to {phone}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Verification Code"
            value={otp}
            onChangeText={setOtp}
            mode="outlined"
            keyboardType="numeric"
            placeholder="123456"
            maxLength={6}
            style={styles.input}
            disabled={loading}
          />

          <Button
            mode="contained"
            onPress={handleVerifyOTP}
            loading={loading}
            disabled={loading || otp.length !== 6}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>

          <Button
            mode="text"
            onPress={handleResendOTP}
            loading={resending}
            disabled={resending}
            style={styles.resendButton}
          >
            {resending ? 'Resending...' : 'Resend OTP'}
          </Button>
        </View>

        <View style={styles.footer}>
          <Button
            mode="text"
            onPress={() => router.back()}
            disabled={loading}
          >
            Change phone number
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 24,
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
  },
  button: {
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonContent: {
    height: 56,
  },
  resendButton: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
});