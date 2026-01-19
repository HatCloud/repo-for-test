import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../config';

interface ProgressRingProps {
  progress: number; // 0 to 1
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const ProgressRing = ({
  progress,
  size,
  strokeWidth,
  color,
  backgroundColor = COLORS.surface,
  children,
}: ProgressRingProps) => {
  // 简化版本：使用 View 替代 SVG
  const innerSize = size - strokeWidth * 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer ring (background) */}
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: backgroundColor,
          },
        ]}
      />
      {/* Progress indicator - simplified as a colored border section */}
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: progress > 0.25 ? color : 'transparent',
            borderRightColor: progress > 0.5 ? color : 'transparent',
            borderBottomColor: progress > 0.75 ? color : 'transparent',
            borderLeftColor: progress > 0 ? color : 'transparent',
            transform: [{ rotate: '-90deg' }],
            opacity: progress > 0 ? 1 : 0,
          },
        ]}
      />
      {/* Inner content */}
      <View style={[styles.content, { width: innerSize, height: innerSize }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
