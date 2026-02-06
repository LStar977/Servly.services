import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card } from './Card';
import { StarRating } from './StarRating';
import { Badge } from './Badge';
import { ProviderProfile } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';

interface ProviderCardProps {
  provider: ProviderProfile;
  onPress: () => void;
}

export function ProviderCard({ provider, onPress }: ProviderCardProps) {
  const lowestPrice = provider.services.length
    ? Math.min(...provider.services.map(s => s.price))
    : 0;

  return (
    <Card onPress={onPress} padded={false} style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Icon name="briefcase" size={32} color={colors.primary[300]} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {provider.businessName}
        </Text>
        <View style={styles.ratingRow}>
          <StarRating rating={provider.rating} size={12} />
          <Text style={styles.ratingText}>
            {provider.rating} ({provider.reviewCount})
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="map-marker" size={12} color={colors.textSecondary} />
          <Text style={styles.metaText}>{provider.city}</Text>
        </View>
        <View style={styles.footer}>
          <Badge
            label={provider.locationType === 'mobile' ? 'Comes to you' : 'At their location'}
            variant={provider.locationType === 'mobile' ? 'success' : 'info'}
          />
          {lowestPrice > 0 && (
            <Text style={styles.price}>From ${lowestPrice}</Text>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  imagePlaceholder: {
    height: 140,
    backgroundColor: colors.primary[50],
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.base,
  },
  name: {
    ...typography.h4,
    color: colors.text,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  ratingText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.md,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    ...typography.h4,
    color: colors.primary[700],
  },
});
