import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthStore, User, SleepEntry, DietEntry, ActivityEntry, StressEntry, HabitEntry, DailySummary, WaterEntry } from '../types';
import { formatDateKey } from '../utils/helpers';

const STORAGE_KEY = '@vitals_hub_data';

// Load data from AsyncStorage
const loadData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { user: null, dailyData: {} };
  } catch (error) {
    console.error('Error loading data:', error);
    return { user: null, dailyData: {} };
  }
};

// Save data to AsyncStorage
const saveData = async (user: User | null, dailyData: Record<string, DailySummary>) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user, dailyData }));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const useHealthStore = create<HealthStore>((set, get) => ({
  user: null,
  dailyData: {},
  selectedDate: formatDateKey(new Date()),

  setUser: (user) => {
    set({ user });
    saveData(user, get().dailyData);
  },

  updateUser: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      set({ user: updatedUser });
      saveData(updatedUser, get().dailyData);
    }
  },

  addSleepEntry: (entry) => {
    const { dailyData } = get();
    const dateKey = entry.date;
    
    const updatedData = {
      ...dailyData,
      [dateKey]: {
        ...dailyData[dateKey],
        date: dateKey,
        sleep: entry,
      },
    };
    
    set({ dailyData: updatedData });
    saveData(get().user, updatedData);
  },

  addDietEntry: (entry) => {
    const { dailyData } = get();
    const dateKey = entry.date;
    
    const currentDiet = dailyData[dateKey]?.diet || [];
    const updatedData = {
      ...dailyData,
      [dateKey]: {
        ...dailyData[dateKey],
        date: dateKey,
        diet: [...currentDiet, entry],
      },
    };
    
    set({ dailyData: updatedData });
    saveData(get().user, updatedData);
  },

  updateWaterIntake: (glasses) => {
    const { dailyData, selectedDate } = get();
    const dateKey = selectedDate;
    
    const waterEntry: WaterEntry = {
      id: `water_${dateKey}`,
      date: dateKey,
      glasses,
      timestamp: new Date().toISOString(),
    };
    
    const updatedData = {
      ...dailyData,
      [dateKey]: {
        ...dailyData[dateKey],
        date: dateKey,
        water: waterEntry,
      },
    };
    
    set({ dailyData: updatedData });
    saveData(get().user, updatedData);
  },

  addActivityEntry: (entry) => {
    const { dailyData } = get();
    const dateKey = entry.date;
    
    const updatedData = {
      ...dailyData,
      [dateKey]: {
        ...dailyData[dateKey],
        date: dateKey,
        activity: entry,
      },
    };
    
    set({ dailyData: updatedData });
    saveData(get().user, updatedData);
  },

  addStressEntry: (entry) => {
    const { dailyData } = get();
    const dateKey = entry.date;
    
    const updatedData = {
      ...dailyData,
      [dateKey]: {
        ...dailyData[dateKey],
        date: dateKey,
        stress: entry,
      },
    };
    
    set({ dailyData: updatedData });
    saveData(get().user, updatedData);
  },

  addHabitEntry: (entry) => {
    const { dailyData } = get();
    const dateKey = entry.date;
    
    const updatedData = {
      ...dailyData,
      [dateKey]: {
        ...dailyData[dateKey],
        date: dateKey,
        habits: entry,
      },
    };
    
    set({ dailyData: updatedData });
    saveData(get().user, updatedData);
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  getDailySummary: (date) => {
    return get().dailyData[date];
  },

  getWeeklySummary: (startDate, endDate) => {
    const { dailyData } = get();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const summaries: DailySummary[] = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateKey = formatDateKey(d);
      if (dailyData[dateKey]) {
        summaries.push(dailyData[dateKey]);
      }
    }
    
    return summaries;
  },

  clearAllData: () => {
    set({ user: null, dailyData: {}, selectedDate: formatDateKey(new Date()) });
    AsyncStorage.removeItem(STORAGE_KEY);
  },
}));

// Initialize store from AsyncStorage
export const initializeStore = async () => {
  const data = await loadData();
  useHealthStore.setState({
    user: data.user,
    dailyData: data.dailyData,
    selectedDate: formatDateKey(new Date()),
  });
};
