import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@vitals_hub_auth';
const USERS_STORAGE_KEY = '@vitals_hub_users';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get all users
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: Record<string, { password: string; user: User }> = usersData 
        ? JSON.parse(usersData) 
        : {};

      // Check if user exists and password matches
      const userRecord = users[email];
      if (userRecord && userRecord.password === password) {
        setUser(userRecord.user);
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userRecord.user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get all users
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: Record<string, { password: string; user: User }> = usersData 
        ? JSON.parse(usersData) 
        : {};

      // Check if user already exists
      if (users[email]) {
        return false;
      }

      // Create new user (will be completed during onboarding)
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: '',
        age: 0,
        weight: 0,
        height: 0,
        gender: 'male',
        bmi: 0,
        createdAt: new Date().toISOString(),
      };

      // Save user
      users[email] = { password, user: newUser };
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      setUser(newUser);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Error during signup:', error);
      return false;
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update in auth storage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      
      // Update in users storage
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (usersData) {
        const users = JSON.parse(usersData);
        if (users[user.email]) {
          users[user.email].user = updatedUser;
          await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
