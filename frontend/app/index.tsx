import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../src/contexts/AuthContext';
import { Button } from '../src/components/Button';
import { COLORS, GRADIENTS, SPACING, TYPOGRAPHY } from '../src/utils/constants';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundLight]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="fitness" size={80} color={COLORS.primary} />
        </View>
        
        <Text style={styles.title}>Vitals Hub</Text>
        <Text style={styles.subtitle}>Track your health journey every day</Text>
        
        <View style={styles.features}>
          <FeatureItem icon="moon" text="Monitor Sleep" />
          <FeatureItem icon="restaurant" text="Track Nutrition" />
          <FeatureItem icon="walk" text="Count Steps" />
          <FeatureItem icon="heart" text="Manage Stress" />
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={() => router.push('/signup')}
          gradient="primary"
          size="lg"
          fullWidth
        />
        <Button
          title="I already have an account"
          onPress={() => router.push('/login')}
          variant="ghost"
          size="md"
          fullWidth
        />
      </View>
    </LinearGradient>
  );
}

const FeatureItem = ({ icon, text }: { icon: any; text: string }) => (
  <View style={styles.feature}>
    <Ionicons name={icon} size={24} color={COLORS.primary} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: TYPOGRAPHY['4xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    gap: SPACING.xs,
  },
  featureText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.medium,
  },
  buttonContainer: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
});
