import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHealthStore } from '../../src/store/healthStore';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { COLORS, GRADIENTS, SPACING, TYPOGRAPHY, RADIUS } from '../../src/utils/constants';
import { StressEntry, HabitEntry } from '../../src/types';

export default function ZenScreen() {
  const { selectedDate, dailyData, addStressEntry, addHabitEntry } = useHealthStore();
  const [stressLevel, setStressLevel] = useState(5);
  const [mood, setMood] = useState<'happy' | 'calm' | 'anxious' | 'stressed' | 'angry' | 'sad'>('calm');
  const [smoking, setSmoking] = useState('');
  const [alcohol, setAlcohol] = useState('');

  const todayData = dailyData[selectedDate];
  const currentStress = todayData?.stress;
  const currentHabits = todayData?.habits;

  const handleSaveStress = () => {
    const entry: StressEntry = {
      id: `stress_${selectedDate}_${Date.now()}`,
      date: selectedDate,
      level: stressLevel,
      mood,
    };
    addStressEntry(entry);
  };

  const handleSaveHabits = () => {
    const entry: HabitEntry = {
      id: `habits_${selectedDate}_${Date.now()}`,
      date: selectedDate,
      smoking: parseInt(smoking) || 0,
      alcohol: parseInt(alcohol) || 0,
    };
    addHabitEntry(entry);
    setSmoking('');
    setAlcohol('');
  };

  const moods: Array<{ value: 'happy' | 'calm' | 'anxious' | 'stressed' | 'angry' | 'sad'; label: string; icon: string; color: string }> = [
    { value: 'happy', label: 'Happy', icon: 'happy', color: COLORS.success },
    { value: 'calm', label: 'Calm', icon: 'leaf', color: COLORS.primary },
    { value: 'anxious', label: 'Anxious', icon: 'alert-circle', color: COLORS.warning },
    { value: 'stressed', label: 'Stressed', icon: 'flash', color: COLORS.error },
    { value: 'angry', label: 'Angry', icon: 'flame', color: COLORS.error },
    { value: 'sad', label: 'Sad', icon: 'sad', color: COLORS.info },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundLight]}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Zen & Wellness</Text>
            <Ionicons name="heart" size={32} color={COLORS.error} />
          </View>

          {/* Stress Level */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How stressed are you?</Text>
            <Card gradient="pink">
              <View style={styles.stressLevelContainer}>
                <Text style={styles.stressLevelValue}>{stressLevel}/10</Text>
                <Text style={styles.stressLevelLabel}>
                  {stressLevel <= 3 ? 'Low Stress' : stressLevel <= 6 ? 'Moderate' : 'High Stress'}
                </Text>
              </View>

              <View style={styles.sliderContainer}>
                {[...Array(10)].map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.sliderDot,
                      i < stressLevel && styles.sliderDotActive,
                    ]}
                    onPress={() => setStressLevel(i + 1)}
                  />
                ))}
              </View>
            </Card>
          </View>

          {/* Mood Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How are you feeling?</Text>
            <Card>
              <View style={styles.moodsGrid}>
                {moods.map((moodOption) => (
                  <TouchableOpacity
                    key={moodOption.value}
                    style={[
                      styles.moodButton,
                      mood === moodOption.value && { backgroundColor: moodOption.color },
                    ]}
                    onPress={() => setMood(moodOption.value)}
                  >
                    <Ionicons
                      name={moodOption.icon as any}
                      size={28}
                      color={mood === moodOption.value ? COLORS.white : moodOption.color}
                    />
                    <Text
                      style={[
                        styles.moodText,
                        mood === moodOption.value && styles.moodTextActive,
                      ]}
                    >
                      {moodOption.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                title="Save Stress Entry"
                onPress={handleSaveStress}
                gradient="primary"
                fullWidth
                style={{ marginTop: SPACING.md }}
              />
            </Card>
          </View>

          {/* Habits Tracking */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Habits</Text>
            <Card>
              <View style={styles.habitRow}>
                <View style={styles.habitIcon}>
                  <Ionicons name="fitness" size={24} color={COLORS.error} />
                </View>
                <View style={styles.habitContent}>
                  <Text style={styles.habitLabel}>Smoking (cigarettes)</Text>
                  <RNTextInput
                    style={styles.habitInput}
                    value={smoking}
                    onChangeText={setSmoking}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.habitRow}>
                <View style={styles.habitIcon}>
                  <Ionicons name="wine" size={24} color={COLORS.warning} />
                </View>
                <View style={styles.habitContent}>
                  <Text style={styles.habitLabel}>Alcohol (drinks)</Text>
                  <RNTextInput
                    style={styles.habitInput}
                    value={alcohol}
                    onChangeText={setAlcohol}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Button
                title="Save Habits"
                onPress={handleSaveHabits}
                gradient="primary"
                fullWidth
                style={{ marginTop: SPACING.md }}
              />
            </Card>
          </View>

          {/* Current Status */}
          {(currentStress || currentHabits) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Summary</Text>
              <Card>
                {currentStress && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Stress Level:</Text>
                    <Text style={styles.summaryValue}>{currentStress.level}/10</Text>
                  </View>
                )}
                {currentStress && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Mood:</Text>
                    <Text style={styles.summaryValue}>{currentStress.mood}</Text>
                  </View>
                )}
                {currentHabits && currentHabits.smoking > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Smoking:</Text>
                    <Text style={styles.summaryValue}>{currentHabits.smoking} cigarettes</Text>
                  </View>
                )}
                {currentHabits && currentHabits.alcohol > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Alcohol:</Text>
                    <Text style={styles.summaryValue}>{currentHabits.alcohol} drinks</Text>
                  </View>
                )}
              </Card>
            </View>
          )}

          {/* Wellness Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wellness Tips</Text>
            <Card style={styles.tipsCard}>
              <View style={styles.tip}>
                <Ionicons name="leaf" size={20} color={COLORS.success} />
                <Text style={styles.tipText}>Practice deep breathing for 5 minutes</Text>
              </View>
              <View style={styles.tip}>
                <Ionicons name="walk" size={20} color={COLORS.success} />
                <Text style={styles.tipText}>Take a short walk outdoors</Text>
              </View>
              <View style={styles.tip}>
                <Ionicons name="musical-notes" size={20} color={COLORS.success} />
                <Text style={styles.tipText}>Listen to calming music</Text>
              </View>
            </Card>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  stressLevelContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  stressLevelValue: {
    fontSize: TYPOGRAPHY['4xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  stressLevelLabel: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.xs,
  },
  sliderDot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  sliderDotActive: {
    backgroundColor: COLORS.error,
  },
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  moodButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  moodText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.medium,
  },
  moodTextActive: {
    color: COLORS.white,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  habitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  habitContent: {
    flex: 1,
  },
  habitLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  habitInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.text,
  },
  tipsCard: {
    gap: SPACING.md,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  tipText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text,
  },
});
