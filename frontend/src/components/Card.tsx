import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, RADIUS, SPACING, SHADOWS } from '../utils/constants';

interface CardProps {
  children: ReactNode;
  gradient?: keyof typeof GRADIENTS;
  style?: ViewStyle;
  padding?: keyof typeof SPACING;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  gradient, 
  style,
  padding = 'md'
}) => {
  if (gradient) {
    return (
      <View style={[styles.card, style, { padding: SPACING[padding] }]}>
        <LinearGradient
          colors={GRADIENTS[gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.xl }]}
        />
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.card, style, { padding: SPACING[padding] }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xl,
    ...SHADOWS.md,
  },
});
