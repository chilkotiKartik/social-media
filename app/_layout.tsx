import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/phone" />
          <Stack.Screen name="auth/verify" />
          <Stack.Screen name="dashboard" />
          <Stack.Screen name="call/[id]" />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}