import { SLEEP_RECOMMENDATIONS, BMI_CATEGORIES } from './constants';

// Calculate BMI
export const calculateBMI = (weight: number, height: number): number => {
  // Weight in kg, height in cm
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

// Get BMI Category
export const getBMICategory = (bmi: number) => {
  if (bmi < BMI_CATEGORIES.underweight.max) {
    return BMI_CATEGORIES.underweight;
  } else if (bmi >= BMI_CATEGORIES.normal.min && bmi < BMI_CATEGORIES.normal.max) {
    return BMI_CATEGORIES.normal;
  } else if (bmi >= BMI_CATEGORIES.overweight.min && bmi < BMI_CATEGORIES.overweight.max) {
    return BMI_CATEGORIES.overweight;
  } else {
    return BMI_CATEGORIES.obese;
  }
};

// Get recommended sleep based on age
export const getRecommendedSleep = (age: number): number => {
  if (age <= 2) return SLEEP_RECOMMENDATIONS['0-2'];
  if (age <= 11) return SLEEP_RECOMMENDATIONS['3-11'];
  if (age <= 2) return SLEEP_RECOMMENDATIONS['1-2'];
  if (age <= 5) return SLEEP_RECOMMENDATIONS['3-5'];
  if (age <= 13) return SLEEP_RECOMMENDATIONS['6-13'];
  if (age <= 17) return SLEEP_RECOMMENDATIONS['14-17'];
  if (age <= 64) return SLEEP_RECOMMENDATIONS['18-64'];
  return SLEEP_RECOMMENDATIONS['65+'];
};

// Calculate sleep debt
export const calculateSleepDebt = (actualSleep: number, recommendedSleep: number): number => {
  return Math.max(0, recommendedSleep - actualSleep);
};

// Format date
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Get day name
export const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Get week dates (7 days centered on today)
export const getWeekDates = (centerDate: Date = new Date()): Date[] => {
  const dates: Date[] = [];
  const today = new Date(centerDate);
  
  // Get 3 days before, today, and 3 days after
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

// Check if date is today
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Format date as YYYY-MM-DD
export const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Calculate calorie needs (simple formula)
export const calculateCalorieNeeds = (
  weight: number, 
  height: number, 
  age: number, 
  gender: 'male' | 'female' = 'male'
): number => {
  // Mifflin-St Jeor Equation
  let bmr: number;
  
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Multiply by activity factor (assuming moderate activity)
  return Math.round(bmr * 1.55);
};

// Calculate average from array
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
};

// Get greeting based on time of day
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};
