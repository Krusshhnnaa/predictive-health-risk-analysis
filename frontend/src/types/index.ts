// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: 'male' | 'female';
  bmi: number;
  createdAt: string;
}

// Health Entry Types
export interface SleepEntry {
  id: string;
  date: string; // YYYY-MM-DD
  hours: number;
  minutes: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  notes?: string;
}

export interface DietEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  description?: string;
  photoUri?: string;
}

export interface WaterEntry {
  id: string;
  date: string;
  glasses: number;
  timestamp: string;
}

export interface ActivityEntry {
  id: string;
  date: string;
  steps: number;
  calories: number;
  distance: number; // in km
  duration: number; // in minutes
}

export interface StressEntry {
  id: string;
  date: string;
  level: number; // 1-10
  mood: 'happy' | 'calm' | 'anxious' | 'stressed' | 'angry' | 'sad';
  notes?: string;
}

export interface HabitEntry {
  id: string;
  date: string;
  smoking: number; // count
  alcohol: number; // count
}

// Daily Summary
export interface DailySummary {
  date: string;
  sleep?: SleepEntry;
  diet: DietEntry[];
  water: WaterEntry;
  activity?: ActivityEntry;
  stress?: StressEntry;
  habits?: HabitEntry;
}

// Store State Types
export interface HealthStore {
  user: User | null;
  dailyData: Record<string, DailySummary>;
  selectedDate: string;
  
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  addSleepEntry: (entry: SleepEntry) => void;
  addDietEntry: (entry: DietEntry) => void;
  updateWaterIntake: (glasses: number) => void;
  addActivityEntry: (entry: ActivityEntry) => void;
  addStressEntry: (entry: StressEntry) => void;
  addHabitEntry: (entry: HabitEntry) => void;
  setSelectedDate: (date: string) => void;
  getDailySummary: (date: string) => DailySummary | undefined;
  getWeeklySummary: (startDate: string, endDate: string) => DailySummary[];
  clearAllData: () => void;
}

// Navigation Types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  OnboardingName: undefined;
  OnboardingAge: undefined;
  OnboardingWeight: undefined;
  OnboardingHeight: undefined;
  MainTabs: undefined;
  WeeklyReport: undefined;
  Profile: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Sleep: undefined;
  Diet: undefined;
  Zen: undefined;
};
