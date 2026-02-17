import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHealthStore } from '../src/store/healthStore';
import { Card } from '../src/components/Card';
import { COLORS, GRADIENTS, SPACING, TYPOGRAPHY, RADIUS } from '../src/utils/constants';
import { formatDateKey, calculateAverage } from '../src/utils/helpers';

export default function WeeklyReportScreen() {
  const router = useRouter();
  const { dailyData } = useHealthStore();

  // Get last 7 days data
  const last7Days = useMemo(() => {
    const today = new Date();
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(formatDateKey(date));
    }
    return dates.map(date => dailyData[date] || { date });
  }, [dailyData]);

  // Calculate averages
  const avgSleep = useMemo(() => {
    const sleepHours = last7Days
      .filter(d => d.sleep)
      .map(d => d.sleep!.hours + d.sleep!.minutes / 60);
    return calculateAverage(sleepHours);
  }, [last7Days]);

  const avgWater = useMemo(() => {
    const waterGlasses = last7Days
      .filter(d => d.water)
      .map(d => d.water!.glasses);
    return calculateAverage(waterGlasses);
  }, [last7Days]);

  const avgSteps = useMemo(() => {
    const steps = last7Days
      .filter(d => d.activity)
      .map(d => d.activity!.steps);
    return calculateAverage(steps);
  }, [last7Days]);

  const avgCalories = useMemo(() => {
    const calories = last7Days
      .filter(d => d.diet && d.diet.length > 0)
      .map(d => d.diet!.reduce((sum, entry) => sum + entry.calories, 0));
    return calculateAverage(calories);
  }, [last7Days]);

  const avgStress = useMemo(() => {
    const stress = last7Days
      .filter(d => d.stress)
      .map(d => d.stress!.level);
    return calculateAverage(stress);
  }, [last7Days]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundLight]}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Weekly Report</Text>
            <View style={styles.backButton} />
          </View>

          {/* Overall Health Score (Placeholder) */}
          <View style={styles.section}>
            <Card gradient="purple">
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Overall Health</Text>
                <Text style={styles.scoreValue}>75%</Text>
                <Text style={styles.scoreSubtitle}>Thriving</Text>
              </View>
            </Card>
          </View>

          {/* Weekly Averages */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Averages</Text>
            
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <LinearGradient
                  colors={GRADIENTS.purple}
                  style={styles.metricGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="moon" size={28} color={COLORS.secondary} />
                  <Text style={styles.metricLabel}>Sleep</Text>
                  <Text style={styles.metricValue}>{avgSleep.toFixed(1)}h</Text>
                  <Text style={styles.metricTrend}>per night</Text>
                </LinearGradient>
              </View>

              <View style={styles.metricCard}>
                <LinearGradient
                  colors={GRADIENTS.blue}
                  style={styles.metricGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="water" size={28} color={COLORS.primary} />
                  <Text style={styles.metricLabel}>Water</Text>
                  <Text style={styles.metricValue}>{avgWater.toFixed(1)}</Text>
                  <Text style={styles.metricTrend}>glasses</Text>
                </LinearGradient>
              </View>

              <View style={styles.metricCard}>
                <LinearGradient
                  colors={GRADIENTS.peach}
                  style={styles.metricGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="flame" size={28} color={COLORS.peachDark} />
                  <Text style={styles.metricLabel}>Calories</Text>
                  <Text style={styles.metricValue}>{Math.round(avgCalories)}</Text>
                  <Text style={styles.metricTrend}>kcal</Text>
                </LinearGradient>
              </View>

              <View style={styles.metricCard}>
                <LinearGradient
                  colors={GRADIENTS.yellow}
                  style={styles.metricGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="footsteps" size={28} color={COLORS.warning} />
                  <Text style={styles.metricLabel}>Steps</Text>
                  <Text style={styles.metricValue}>{Math.round(avgSteps)}</Text>
                  <Text style={styles.metricTrend}>per day</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Trend Analysis (Placeholder) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trend Analysis</Text>
            <Card>
              <View style={styles.trendRow}>
                <Ionicons name="trending-up" size={24} color={COLORS.success} />
                <Text style={styles.trendText}>Sleep quality improved by 15%</Text>
              </View>
              <View style={styles.trendRow}>
                <Ionicons name="trending-up" size={24} color={COLORS.success} />
                <Text style={styles.trendText}>Water intake increased</Text>
              </View>
              <View style={styles.trendRow}>
                <Ionicons name="trending-down" size={24} color={COLORS.warning} />
                <Text style={styles.trendText}>Step goal missed 3 days</Text>
              </View>
            </Card>
          </View>

          {/* Stress Level */}
          {avgStress > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Stress Management</Text>
              <Card gradient="pink">
                <View style={styles.stressContainer}>
                  <Text style={styles.stressLabel}>Average Stress Level</Text>
                  <Text style={styles.stressValue}>{avgStress.toFixed(1)}/10</Text>
                  <Text style={styles.stressStatus}>
                    {avgStress <= 3 ? '✓ Low stress levels' : avgStress <= 6 ? '⚠ Moderate stress' : '⚠ High stress - Consider relaxation'}
                  </Text>
                </View>
              </Card>
            </View>
          )}

          {/* Recommendations (Placeholder) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <Card>
              <View style={styles.recommendation}>
                <View style={styles.recommendationIcon}>
                  <Ionicons name="bulb" size={20} color={COLORS.warning} />
                </View>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>Increase Daily Steps</Text>
                  <Text style={styles.recommendationText}>Try to reach 10,000 steps daily</Text>
                </View>
              </View>
              <View style={styles.recommendation}>
                <View style={styles.recommendationIcon}>
                  <Ionicons name="bulb" size={20} color={COLORS.warning} />
                </View>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>Maintain Sleep Schedule</Text>
                  <Text style={styles.recommendationText}>Great job! Keep it consistent</Text>
                </View>
              </View>
              <View style={styles.recommendation}>
                <View style={styles.recommendationIcon}>
                  <Ionicons name="bulb" size={20} color={COLORS.warning} />
                </View>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>Balance Nutrition</Text>
                  <Text style={styles.recommendationText}>Ensure adequate protein intake</Text>
                </View>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  scoreLabel: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  scoreValue: {
    fontSize: TYPOGRAPHY['5xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  scoreSubtitle: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.medium,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  metricCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  metricGradient: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.medium,
    marginTop: SPACING.xs,
  },
  metricValue: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  metricTrend: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textLight,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  trendText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text,
  },
  stressContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  stressLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stressValue: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stressStatus: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  recommendationText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textLight,
  },
});
