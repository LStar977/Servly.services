import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Card, Badge, StarRating } from '../../components';
import { demoAPI } from '../../mock/api';
import { colors, spacing, borderRadius, typography, categoryColors, defaultCategoryColor } from '../../theme';
import { categories as categoryList } from '../../mock/data';
import { HomeStackParamList, ProviderProfile, Review, Service } from '../../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProviderDetail'>;

export function ProviderDetailScreen({ route, navigation }: Props) {
  const { providerId } = route.params;
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [providerId]);

  const loadData = async () => {
    const [p, r] = await Promise.all([
      demoAPI.providers.getById(providerId),
      demoAPI.reviews.getByProvider(providerId),
    ]);
    setProvider(p);
    setReviews(r);
    setLoading(false);
  };

  if (loading || !provider) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image Placeholder */}
      <View style={styles.headerImage}>
        <Icon
          name={(() => {
            const catId = provider.categories[0];
            return categoryList.find(c => c.id === catId)?.icon ?? 'briefcase-outline';
          })()}
          size={48}
          color={(() => {
            const catId = provider.categories[0];
            return categoryColors[catId] || defaultCategoryColor;
          })()}
        />
      </View>

      {/* Provider Info */}
      <View style={styles.infoSection}>
        <Text style={styles.businessName}>{provider.businessName}</Text>
        <View style={styles.ratingRow}>
          <StarRating rating={provider.rating} size={16} />
          <Text style={styles.ratingText}>
            {provider.rating} ({provider.reviewCount} reviews)
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{provider.city}</Text>
        </View>
        <View style={styles.metaRow}>
          <Badge
            label={provider.locationType === 'mobile' ? 'Comes to you' : 'At their location'}
            variant={provider.locationType === 'mobile' ? 'success' : 'info'}
          />
        </View>
        <Text style={styles.description}>{provider.description}</Text>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        {provider.services.map(service => (
          <ServiceRow
            key={service.id}
            service={service}
            onBook={() => {
              // Navigate to booking via the parent navigator
              navigation.getParent()?.navigate('BookingsTab', {
                screen: 'NewBooking',
                params: { providerId: provider.id, serviceId: service.id },
              });
            }}
          />
        ))}
      </View>

      {/* Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hours of Operation</Text>
        <Card>
          {Object.entries(provider.hoursOfOperation).map(([day, hours]) => (
            <View key={day} style={styles.hoursRow}>
              <Text style={styles.dayText}>{day}</Text>
              <Text style={[styles.hoursText, hours.closed && styles.closedText]}>
                {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
              </Text>
            </View>
          ))}
        </Card>
      </View>

      {/* Reviews */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {reviews.length === 0 ? (
          <Text style={styles.noReviews}>No reviews yet</Text>
        ) : (
          reviews.map(review => (
            <Card key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerAvatar}>
                    <Icon name="person-outline" size={14} color={colors.primary[400]} />
                  </View>
                  <Text style={styles.reviewerName}>{review.customerName}</Text>
                </View>
                <StarRating rating={review.rating} size={12} />
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </Card>
          ))
        )}
      </View>

      {/* Book CTA */}
      <View style={styles.ctaSection}>
        <Button
          title="Book a Service"
          onPress={() => {
            if (provider.services.length > 0) {
              navigation.getParent()?.navigate('BookingsTab', {
                screen: 'NewBooking',
                params: { providerId: provider.id, serviceId: provider.services[0].id },
              });
            }
          }}
          fullWidth
          size="lg"
        />
      </View>
    </ScrollView>
  );
}

function ServiceRow({ service, onBook }: { service: Service; onBook: () => void }) {
  return (
    <Card style={styles.serviceCard}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceTitle}>{service.title}</Text>
        <Text style={styles.serviceDesc} numberOfLines={2}>
          {service.description}
        </Text>
        <Text style={styles.servicePrice}>
          ${service.price}/{service.priceUnit}
        </Text>
      </View>
      <TouchableOpacity style={styles.bookButton} onPress={onBook}>
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  headerImage: {
    height: 200,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    padding: spacing.base,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  businessName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  ratingText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  section: {
    padding: spacing.base,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    ...typography.h4,
    color: colors.text,
  },
  serviceDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginVertical: 4,
  },
  servicePrice: {
    ...typography.label,
    color: colors.primary[700],
  },
  bookButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginLeft: spacing.md,
  },
  bookButtonText: {
    ...typography.buttonSmall,
    color: colors.white,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  dayText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '500',
  },
  hoursText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  closedText: {
    color: colors.error,
  },
  noReviews: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  reviewCard: {
    marginBottom: spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reviewerAvatar: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerName: {
    ...typography.label,
    color: colors.text,
  },
  reviewComment: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  ctaSection: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
});
