import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors, spacing } from '../theme';

interface StarRatingProps {
  rating: number;
  size?: number;
  color?: string;
}

export function StarRating({
  rating,
  size = 14,
  color = colors.warning,
}: StarRatingProps) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Icon key={i} name="star" size={size} color={color} />);
    } else if (i === fullStars && hasHalf) {
      stars.push(<Icon key={i} name="star-half-o" size={size} color={color} />);
    } else {
      stars.push(<Icon key={i} name="star-o" size={size} color={colors.gray[300]} />);
    }
  }

  return <View style={styles.container}>{stars}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
});
