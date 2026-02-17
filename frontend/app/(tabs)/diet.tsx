import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHealthStore } from '../../src/store/healthStore';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { COLORS, GRADIENTS, SPACING, TYPOGRAPHY, RADIUS, WATER_GOAL } from '../../src/utils/constants';
import { DietEntry } from '../../src/types';

export default function DietScreen() {
  const { selectedDate, dailyData, addDietEntry, updateWaterIntake } = useHealthStore();
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  const todayData = dailyData[selectedDate];
  const totalCalories = todayData?.diet?.reduce((sum, entry) => sum + entry.calories, 0) || 0;
  const totalCarbs = todayData?.diet?.reduce((sum, entry) => sum + entry.carbs, 0) || 0;
  const totalProtein = todayData?.diet?.reduce((sum, entry) => sum + entry.protein, 0) || 0;
  const totalFat = todayData?.diet?.reduce((sum, entry) => sum + entry.fat, 0) || 0;
  const waterIntake = todayData?.water?.glasses || 0;

  const handleAddMeal = () => {
    if (!calories) return;

    const entry: DietEntry = {
      id: `diet_${selectedDate}_${Date.now()}`,
      date: selectedDate,
      mealType,
      calories: parseInt(calories) || 0,
      carbs: parseInt(carbs) || 0,
      protein: parseInt(protein) || 0,
      fat: parseInt(fat) || 0,
    };

    addDietEntry(entry);
    setCalories('');
    setCarbs('');
    setProtein('');
    setFat('');
  };

  const handleWaterChange = (change: number) => {
    const newValue = Math.max(0, waterIntake + change);
    updateWaterIntake(newValue);
  };

  const mealTypes: Array<{ value: 'breakfast' | 'lunch' | 'dinner' | 'snack'; label: string; icon: string }> = [
    { value: 'breakfast', label: 'Breakfast', icon: 'sunny' },
    { value: 'lunch', label: 'Lunch', icon: 'restaurant' },
    { value: 'dinner', label: 'Dinner', icon: 'moon' },
    { value: 'snack', label: 'Snack', icon: 'fast-food' },
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
            <Text style={styles.title}>Diet & Nutrition</Text>
            <Ionicons name="restaurant" size={32} color={COLORS.peachDark} />
          </View>

          {/* Calorie Summary */}
          <View style={styles.section}>
            <Card gradient="peach">
              <View style={styles.calorieHeader}>
                <Text style={styles.calorieLabel}>Total Calories</Text>
                <Text style={styles.calorieValue}>{totalCalories} kcal</Text>
              </View>
              
              <View style={styles.macrosContainer}>
                <View style={styles.macroItem}>
                  <View style={[styles.macroBar, { backgroundColor: COLORS.blue }]}>
                    <View style={[styles.macroFill, { width: `${Math.min(100, (totalCarbs / 300) * 100)}%` }]} />
                  </View>
                  <Text style={styles.macroLabel}>Carbs: {totalCarbs}g</Text>
                </View>
                <View style={styles.macroItem}>
                  <View style={[styles.macroBar, { backgroundColor: COLORS.error }]}>
                    <View style={[styles.macroFill, { width: `${Math.min(100, (totalProtein / 150) * 100)}%` }]} />
                  </View>
                  <Text style={styles.macroLabel}>Protein: {totalProtein}g</Text>
                </View>
                <View style={styles.macroItem}>
                  <View style={[styles.macroBar, { backgroundColor: COLORS.warning }]}>
                    <View style={[styles.macroFill, { width: `${Math.min(100, (totalFat / 70) * 100)}%` }]} />
                  </View>
                  <Text style={styles.macroLabel}>Fat: {totalFat}g</Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Meal Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Log Meal</Text>
            <Card>
              <Text style={styles.inputLabel}>Meal Type</Text>
              <View style={styles.mealTypeContainer}>
                {mealTypes.map((meal) => (
                  <TouchableOpacity
                    key={meal.value}
                    style={[
                      styles.mealTypeButton,
                      mealType === meal.value && styles.mealTypeButtonActive,
                    ]}
                    onPress={() => setMealType(meal.value)}
                  >
                    <Ionicons 
                      name={meal.icon as any} 
                      size={20} 
                      color={mealType === meal.value ? COLORS.white : COLORS.textLight} 
                    />
                    <Text
                      style={[
                        styles.mealTypeText,
                        mealType === meal.value && styles.mealTypeTextActive,
                      ]}
                    >
                      {meal.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.nutrientInputs}>
                <View style={styles.nutrientInput}>
                  <Text style={styles.inputLabel}>Calories</Text>
                  <RNTextInput
                    style={styles.input}
                    value={calories}
                    onChangeText={setCalories}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.nutrientInput}>
                  <Text style={styles.inputLabel}>Carbs (g)</Text>
                  <RNTextInput
                    style={styles.input}
                    value={carbs}
                    onChangeText={setCarbs}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.nutrientInput}>
                  <Text style={styles.inputLabel}>Protein (g)</Text>
                  <RNTextInput
                    style={styles.input}
                    value={protein}
                    onChangeText={setProtein}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.nutrientInput}>
                  <Text style={styles.inputLabel}>Fat (g)</Text>
                  <RNTextInput
                    style={styles.input}
                    value={fat}
                    onChangeText={setFat}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.photoButton}>
                <Ionicons name="camera" size={24} color={COLORS.primary} />
                <Text style={styles.photoButtonText}>Add Photo (Coming Soon)</Text>
              </TouchableOpacity>

              <Button
                title="Log Meal"
                onPress={handleAddMeal}
                gradient="primary"
                fullWidth
                style={{ marginTop: SPACING.md }}
              />
            </Card>
          </View>

          {/* Water Intake */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Water Intake</Text>
            <Card gradient="blue">
              <View style={styles.waterHeader}>
                <Ionicons name="water" size={32} color={COLORS.primary} />
                <Text style={styles.waterValue}>
                  {waterIntake}/{WATER_GOAL} glasses
                </Text>
              </View>
              
              <View style={styles.waterControls}>
                <TouchableOpacity
                  style={styles.waterButton}
                  onPress={() => handleWaterChange(-1)}
                >
                  <Ionicons name="remove" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <View style={styles.glassesContainer}>
                  {[...Array(WATER_GOAL)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < waterIntake ? 'water' : 'water-outline'}
                      size={24}
                      color={i < waterIntake ? COLORS.primary : COLORS.textMuted}
                    />
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.waterButton}
                  onPress={() => handleWaterChange(1)}
                >
                  <Ionicons name="add" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.reminderContainer}>
                <Ionicons name="notifications" size={20} color={COLORS.text} />
                <Text style={styles.reminderText}>Hydration Reminders (Coming Soon)</Text>
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
  calorieHeader: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  calorieLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  calorieValue: {
    fontSize: TYPOGRAPHY['4xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  macrosContainer: {
    gap: SPACING.md,
  },
  macroItem: {
    gap: SPACING.xs,
  },
  macroBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    opacity: 0.3,
  },
  macroFill: {
    height: '100%',
    backgroundColor: COLORS.text,
  },
  macroLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.medium,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
    fontWeight: TYPOGRAPHY.medium,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  mealTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    gap: SPACING.xs,
  },
  mealTypeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  mealTypeText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.medium,
  },
  mealTypeTextActive: {
    color: COLORS.white,
  },
  nutrientInputs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  nutrientInput: {
    width: '48%',
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  photoButtonText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.medium,
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  waterValue: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  waterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  waterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassesContainer: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flex: 1,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(93, 211, 199, 0.3)',
  },
  reminderText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text,
  },
});
