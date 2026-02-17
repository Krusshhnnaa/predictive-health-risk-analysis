import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { useHealthStore } from '../../src/store/healthStore';
import { Card } from '../../src/components/Card';
import { COLORS, GRADIENTS, SPACING, TYPOGRAPHY, RADIUS, WATER_GOAL, STEP_GOAL } from '../../src/utils/constants';
import { formatDateKey, getWeekDates, isToday, getDayName, getGreeting, calculateAverage } from '../../src/utils/helpers';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedDate, setSelectedDate, dailyData } = useHealthStore();
  
  const weekDates = useMemo(() => getWeekDates(), []);
  
  const todayData = dailyData[selectedDate] || {};
  
  // Calculate averages
  const last7Days = Object.values(dailyData).slice(-7);
  const avgSleep = useMemo(() => {
    const sleepHours = last7Days
      .filter(d => d.sleep)
      .map(d => d.sleep!.hours + d.sleep!.minutes / 60);
    return calculateAverage(sleepHours);
  }, [dailyData]);
  
  const avgWater = useMemo(() => {
    const waterGlasses = last7Days
      .filter(d => d.water)
      .map(d => d.water!.glasses);
    return calculateAverage(waterGlasses);
  }, [dailyData]);
  
  const avgSteps = useMemo(() => {
    const steps = last7Days
      .filter(d => d.activity)
      .map(d => d.activity!.steps);
    return calculateAverage(steps);
  }, [dailyData]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundLight]}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>
            <TouchableOpacity style={styles.avatar}>
              <Ionicons name="person" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Week Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weekContainer}
          >
            {weekDates.map((date, index) => {
              const dateKey = formatDateKey(date);
              const selected = dateKey === selectedDate;
              const today = isToday(date);

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedDate(dateKey)}
                  style={[
                    styles.dayCard,
                    selected && styles.dayCardActive,
                  ]}
                >
                  <Text style={[styles.dayName, selected && styles.dayNameActive]}>
                    {getDayName(date)}
                  </Text>
                  <View style={[styles.dayNumber, selected && styles.dayNumberActive]}>
                    <Text style={[styles.dayNumberText, selected && styles.dayNumberTextActive]}>
                      {date.getDate()}
                    </Text>
                  </View>
                  {today && <View style={styles.todayDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>Today's Summary</Text>
            
            <View style={styles.metricsGrid}>
              <TouchableOpacity 
                style={styles.metricCard}
                onPress={() => router.push('/(tabs)/sleep')}
              >
                <LinearGradient
                  colors={GRADIENTS.purple}
                  style={styles.metricGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="moon" size={32} color={COLORS.secondary} />
                  <Text style={styles.metricLabel}>Sleep</Text>
                  <Text style={styles.metricValue}>
                    {todayData.sleep 
                      ? `${todayData.sleep.hours}h ${todayData.sleep.minutes}m`
                      : '0h 0m'
                    }
                  </Text>
                  <Text style={styles.metricAvg}>Avg: {avgSleep.toFixed(1)}h</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.metricCard}
                onPress={() => router.push('/(tabs)/diet')}
              >
                <LinearGradient
                  colors={GRADIENTS.blue}
                  style={styles.metricGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="water" size={32} color={COLORS.primary} />
                  <Text style={styles.metricLabel}>Water</Text>
                  <Text style={styles.metricValue}>
                    {todayData.water?.glasses || 0}/{WATER_GOAL}
                  </Text>
                  <Text style={styles.metricAvg}>Avg: {avgWater.toFixed(1)} glasses</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.metricCard}
                onPress={() => router.push('/(tabs)/diet')}
              >
                <LinearGradient
                  colors={GRADIENTS.peach}
                  style={styles.metricGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="flame" size={32} color={COLORS.peachDark} />
                  <Text style={styles.metricLabel}>Calories</Text>
                  <Text style={styles.metricValue}>
                    {todayData.diet?.reduce((sum, entry) => sum + entry.calories, 0) || 0}
                  </Text>
                  <Text style={styles.metricAvg}>kcal today</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.metricCard}
                onPress={() => router.push('/(tabs)/diet')}
              >
                <LinearGradient
                  colors={GRADIENTS.yellow}
                  style={styles.metricGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="footsteps" size={32} color={COLORS.warning} />
                  <Text style={styles.metricLabel}>Steps</Text>
                  <Text style={styles.metricValue}>
                    {todayData.activity?.steps || 0}
                  </Text>
                  <Text style={styles.metricAvg}>Goal: {STEP_GOAL}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/weekly-report')}
            >
              <Card>
                <View style={styles.actionContent}>
                  <View style={styles.actionIcon}>
                    <Ionicons name="bar-chart" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>Weekly Report</Text>
                    <Text style={styles.actionSubtitle}>View your progress</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
                </View>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/zen')}
            >
              <Card>
                <View style={styles.actionContent}>
                  <View style={styles.actionIcon}>
                    <Ionicons name="heart" size={24} color={COLORS.error} />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>Stress Check</Text>
                    <Text style={styles.actionSubtitle}>How are you feeling?</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
                </View>
              </Card>
            </TouchableOpacity>
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
  greeting: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  userName: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  dayCard: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    minWidth: 60,
  },
  dayCardActive: {
    backgroundColor: COLORS.primary,
  },
  dayName: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  dayNameActive: {
    color: COLORS.white,
  },
  dayNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  dayNumberActive: {
    backgroundColor: COLORS.white,
  },
  dayNumberText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.text,
  },
  dayNumberTextActive: {
    color: COLORS.primary,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: SPACING.xs,
  },
  summaryContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
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
    marginTop: SPACING.sm,
  },
  metricValue: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  metricAvg: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textLight,
  },
  actionsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  actionCard: {
    marginBottom: SPACING.md,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  actionSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textLight,
  },
});
