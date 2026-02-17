import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';
import { initializeStore } from '../src/store/healthStore';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  useEffect(() => {
    initializeStore();
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="weekly-report" />
      </Stack>
    </AuthProvider>
  );
}
