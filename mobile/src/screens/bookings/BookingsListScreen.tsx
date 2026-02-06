import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, Badge, EmptyState } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { demoAPI } from '../../mock/api';
import { mockProviders } from '../../mock/data';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { BookingsStackParamList, Booking } from '../../types';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<BookingsStackParamList, 'BookingsList'>;

const statusVariant = (status: Booking['status']): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch (status) {
    case 'completed': return 'success';
    case 'confirmed':
    case 'accepted': return 'info';
    case 'pending': return 'warning';
    case 'cancelled':
    case 'declined': return 'error';
    default: return 'default';
  }
};

export function BookingsListScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const data = await demoAPI.bookings.getByCustomer(user.id);
    setBookings(data);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const upcoming = bookings.filter(b =>
    ['pending', 'confirmed', 'accepted'].includes(b.status),
  );
  const past = bookings.filter(b =>
    ['completed', 'cancelled', 'declined'].includes(b.status),
  );

  const sections = [
    ...(upcoming.length ? [{ title: 'Upcoming', data: upcoming }] : []),
    ...(past.length ? [{ title: 'Past', data: past }] : []),
  ];

  const getProviderName = (providerId: string) =>
    mockProviders.find(p => p.id === providerId)?.businessName ?? 'Provider';

  const getServiceTitle = (providerId: string, serviceId: string) => {
    const provider = mockProviders.find(p => p.id === providerId);
    return provider?.services.find(s => s.id === serviceId)?.title ?? 'Service';
  };

  if (bookings.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="calendar"
          title="No bookings yet"
          message="When you book a service, it will appear here."
          actionLabel="Browse Services"
          onAction={() => navigation.getParent()?.navigate('SearchTab')}
        />
      </View>
    );
  }

  return (
    <SectionList
      style={styles.container}
      sections={sections}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />
      }
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
      renderItem={({ item }) => (
        <Card
          onPress={() => navigation.navigate('BookingDetail', { bookingId: item.id })}
          style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <View style={styles.bookingIcon}>
              <Icon name="calendar-check-o" size={18} color={colors.primary[600]} />
            </View>
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingProvider}>{getProviderName(item.providerId)}</Text>
              <Text style={styles.bookingService}>{getServiceTitle(item.providerId, item.serviceId)}</Text>
            </View>
            <Badge label={item.status} variant={statusVariant(item.status)} />
          </View>
          <View style={styles.bookingMeta}>
            <View style={styles.metaItem}>
              <Icon name="clock-o" size={12} color={colors.textTertiary} />
              <Text style={styles.metaText}>
                {format(new Date(item.dateTime), 'MMM d, yyyy · h:mm a')}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="map-marker" size={12} color={colors.textTertiary} />
              <Text style={styles.metaText} numberOfLines={1}>{item.address}</Text>
            </View>
          </View>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.base,
  },
  sectionHeader: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.base,
  },
  bookingCard: {
    marginBottom: spacing.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bookingIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingProvider: {
    ...typography.h4,
    color: colors.text,
  },
  bookingService: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  bookingMeta: {
    gap: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
});
