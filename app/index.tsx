import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>📞</Text>
          </View>
          <Text style={styles.title}>SocialCall</Text>
          <Text style={styles.subtitle}>Connect & Call</Text>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Connect with people through{' '}
            <Text style={styles.heroHighlight}>meaningful conversations</Text>
          </Text>
          <Text style={styles.heroDescription}>
            Join our community and discover new connections through high-quality 
            voice and video calls with advanced noise cancellation.
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎥</Text>
            <Text style={styles.featureText}>HD Video Calls</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎵</Text>
            <Text style={styles.featureText}>Noise Cancellation</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>Safe & Secure</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => router.push('/auth/phone')}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
          >
            Get Started
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
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 32,
  },
  heroHighlight: {
    color: '#ff6b35',
  },
  heroDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  actions: {
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 12,
  },
  buttonContent: {
    height: 56,
  },
});