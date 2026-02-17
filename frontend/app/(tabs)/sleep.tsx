import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { useHealthStore } from '../../src/store/healthStore';
import { Card } from '../../src/components/Card';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { COLORS, GRADIENTS, SPACING, TYPOGRAPHY, RADIUS } from '../../src/utils/constants';
import { getRecommendedSleep, calculateSleepDebt, formatDateKey } from '../../src/utils/helpers';
import { SleepEntry } from '../../src/types';

export default function SleepScreen() {
  const { user } = useAuth();
  const { selectedDate, dailyData, addSleepEntry } = useHealthStore();
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [quality, setQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('good');

  const todayData = dailyData[selectedDate];
  const currentSleep = todayData?.sleep;
  
  const recommendedSleep = user ? getRecommendedSleep(user.age) : 8;
  const actualSleep = currentSleep ? currentSleep.hours + currentSleep.minutes / 60 : 0;
  const sleepDebt = calculateSleepDebt(actualSleep, recommendedSleep);

  const handleSaveSleep = () => {
    if (!hours && !minutes) return;

    const entry: SleepEntry = {
      id: `sleep_${selectedDate}_${Date.now()}`,
      date: selectedDate,
      hours: parseInt(hours) || 0,
      minutes: parseInt(minutes) || 0,
      quality,
    };

    addSleepEntry(entry);
    setHours('');
    setMinutes('');
  };

  const qualityOptions: Array<{ value: 'poor' | 'fair' | 'good' | 'excellent'; label: string; color: string }> = [
    { value: 'poor', label: 'Poor', color: COLORS.error },
    { value: 'fair', label: 'Fair', color: COLORS.warning },
    { value: 'good', label: 'Good', color: COLORS.success },
    { value: 'excellent', label: 'Excellent', color: COLORS.primary },
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
            <Text style={styles.title}>Sleep Tracker</Text>
            <Ionicons name="moon" size={32} color={COLORS.secondary} />
          </View>

          {/* Sleep Summary Card */}
          <View style={styles.section}>
            <Card gradient="purple" style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Today's Sleep</Text>
                  <Text style={styles.summaryValue}>
                    {currentSleep ? `${currentSleep.hours}h ${currentSleep.minutes}m` : '0h 0m'}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Recommended</Text>
                  <Text style={styles.summaryValue}>{recommendedSleep}h</Text>
                </View>
              </View>
              
              {sleepDebt > 0 && (
                <View style={styles.debtContainer}>
                  <Ionicons name="alert-circle" size={20} color={COLORS.warning} />
                  <Text style={styles.debtText}>Sleep debt: {sleepDebt.toFixed(1)}h</Text>
                </View>
              )}
            </Card>
          </View>

          {/* Sleep Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Log Sleep</Text>
            <Card>
              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Hours</Text>
                  <RNTextInput
                    style={styles.timeInput}
                    value={hours}
                    onChangeText={setHours}
                    placeholder="8"
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
                <Text style={styles.separator}>:</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Minutes</Text>
                  <RNTextInput
                    style={styles.timeInput}
                    value={minutes}
                    onChangeText={setMinutes}
                    placeholder="30"
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
              </View>

              <Text style={[styles.inputLabel, { marginTop: SPACING.md }]}>Sleep Quality</Text>
              <View style={styles.qualityContainer}>
                {qualityOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.qualityButton,
                      quality === option.value && { backgroundColor: option.color },
                    ]}
                    onPress={() => setQuality(option.value)}
                  >
                    <Text
                      style={[
                        styles.qualityText,
                        quality === option.value && styles.qualityTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                title="Save Sleep Entry"
                onPress={handleSaveSleep}
                gradient="primary"
                fullWidth
                style={{ marginTop: SPACING.md }}
              />
            </Card>
          </View>

          {/* Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sleep Tips</Text>
            <Card style={styles.tipCard}>
              <View style={styles.tip}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                <Text style={styles.tipText}>Maintain consistent sleep schedule</Text>
              </View>
              <View style={styles.tip}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                <Text style={styles.tipText}>Avoid screens 1 hour before bed</Text>
              </View>
              <View style={styles.tip}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                <Text style={styles.tipText}>Keep bedroom cool and dark</Text>
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
  summaryCard: {
    minHeight: 120,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  debtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  debtText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.medium,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.md,
  },
  inputGroup: {
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
    fontWeight: TYPOGRAPHY.medium,
  },
  timeInput: {
    width: 80,
    height: 60,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    textAlign: 'center',
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  separator: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    marginHorizontal: SPACING.md,
  },
  qualityContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  qualityButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  qualityText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.medium,
  },
  qualityTextActive: {
    color: COLORS.white,
  },
  tipCard: {
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
