import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../src/contexts/AuthContext';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../src/utils/constants';
import { calculateBMI } from '../src/utils/helpers';

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, updateUserProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');

    if (step === 1 && !name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (step === 2 && (!age || parseInt(age) < 1 || parseInt(age) > 120)) {
      setError('Please enter a valid age');
      return;
    }

    if (step === 3 && (!weight || parseFloat(weight) < 1)) {
      setError('Please enter a valid weight');
      return;
    }

    if (step === 4) {
      if (!height || parseFloat(height) < 1) {
        setError('Please enter a valid height');
        return;
      }
      handleComplete();
      return;
    }

    setStep(step + 1);
  };

  const handleComplete = async () => {
    const bmi = calculateBMI(parseFloat(weight), parseFloat(height));
    
    await updateUserProfile({
      name,
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
      gender,
      bmi: parseFloat(bmi.toFixed(1)),
    });

    router.replace('/(tabs)');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.question}>What's your name?</Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              autoFocus
            />
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.question}>How old are you?</Text>
            <Input
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              keyboardType="numeric"
              autoFocus
            />
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.question}>What's your weight?</Text>
            <Input
              value={weight}
              onChangeText={setWeight}
              placeholder="Weight in kg"
              keyboardType="decimal-pad"
              autoFocus
            />
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.question}>What's your height?</Text>
            <Input
              value={height}
              onChangeText={setHeight}
              placeholder="Height in cm"
              keyboardType="decimal-pad"
              autoFocus
            />
          </>
        );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundLight]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Let's get to know you</Text>
            <View style={styles.progressContainer}>
              {[1, 2, 3, 4].map((s) => (
                <View
                  key={s}
                  style={[
                    styles.progressDot,
                    s <= step && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.form}>
            {renderStep()}
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {step > 1 && (
            <Button
              title="Back"
              onPress={() => setStep(step - 1)}
              variant="ghost"
              fullWidth
            />
          )}
          <Button
            title={step === 4 ? 'Complete' : 'Next'}
            onPress={handleNext}
            gradient="primary"
            fullWidth
          />
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['3xl'],
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  progressDot: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
  form: {
    marginTop: SPACING.xl,
  },
  question: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  error: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.sm,
    marginTop: SPACING.sm,
  },
  footer: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
});
