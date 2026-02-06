import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors, spacing, borderRadius, typography } from '../theme';

interface CategoryIconProps {
  name: string;
  icon: string;
  onPress?: () => void;
  size?: 'sm' | 'md';
}

export function CategoryIcon({ name, icon, onPress, size = 'md' }: CategoryIconProps) {
  const iconSize = size === 'sm' ? 20 : 28;
  const boxSize = size === 'sm' ? 48 : 64;

  const content = (
    <View style={styles.container}>
      <View style={[styles.iconBox, { width: boxSize, height: boxSize }]}>
        <Icon name={icon} size={iconSize} color={colors.primary[600]} />
      </View>
      <Text style={[styles.label, size === 'sm' && styles.labelSm]} numberOfLines={2}>
        {name}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
  },
  iconBox: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  labelSm: {
    fontSize: 11,
  },
});
