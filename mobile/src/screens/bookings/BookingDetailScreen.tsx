import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Card, Badge } from '../../components';
import { demoAPI } from '../../mock/api';
import { mockProviders } from '../../mock/data';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { BookingsStackParamList, Booking } from '../../types';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<BookingsStackParamList, 'BookingDetail'>;

export function BookingDetailScreen({ route, navigation }: Props) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    const data = await demoAPI.bookings.getById(bookingId);
    setBooking(data);
    setLoading(false);
  };

  const handleCancel = () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          await demoAPI.bookings.updateStatus(bookingId, 'cancelled');
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading || !booking) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  const provider = mockProviders.find(p => p.id === booking.providerId);
  const service = provider?.services.find(s => s.id === booking.serviceId);
  const canCancel = ['pending', 'confirmed', 'accepted'].includes(booking.status);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Status Banner */}
      <View style={[styles.statusBanner, statusBannerColor(booking.status)]}>
        <Icon name={statusIcon(booking.status)} size={20} color={colors.white} />
        <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
      </View>

      {/* Provider & Service */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{provider?.businessName ?? 'Provider'}</Text>
        <Text style={styles.serviceText}>{service?.title ?? 'Service'}</Text>
        {service && (
          <Text style={styles.priceText}>
            ${service.price}/{service.priceUnit}
          </Text>
        )}
      </Card>

      {/* Details */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Booking Details</Text>
        <DetailRow icon="calendar-outline" label="Date & Time" value={format(new Date(booking.dateTime), 'EEEE, MMM d, yyyy · h:mm a')} />
        <DetailRow icon="location-outline" label="Address" value={booking.address} />
        {booking.notes ? (
          <DetailRow icon="document-text-outline" label="Notes" value={booking.notes} />
        ) : null}
        <DetailRow icon="card-outline" label="Payment" value={booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'} />
      </Card>

      {/* Actions */}
      {canCancel && (
        <View style={styles.actions}>
          <Button
            title="Cancel Booking"
            onPress={handleCancel}
            variant="outline"
            fullWidth
          />
        </View>
      )}

      <View style={styles.spacer} />
    </ScrollView>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Icon name={icon} size={14} color={colors.textTertiary} style={styles.detailIcon} />
      <View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

function statusIcon(status: string) {
  switch (status) {
    case 'completed': return 'checkmark-circle';
    case 'confirmed':
    case 'accepted': return 'thumbs-up';
    case 'pending': return 'time-outline';
    case 'cancelled':
    case 'declined': return 'close-circle';
    default: return 'information-circle';
  }
}

function statusBannerColor(status: string) {
  switch (status) {
    case 'completed': return { backgroundColor: colors.success };
    case 'confirmed':
    case 'accepted': return { backgroundColor: colors.info };
    case 'pending': return { backgroundColor: colors.warning };
    case 'cancelled':
    case 'declined': return { backgroundColor: colors.error };
    default: return { backgroundColor: colors.gray[500] };
  }
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  statusText: {
    ...typography.button,
    color: colors.white,
    letterSpacing: 1,
  },
  card: {
    margin: spacing.base,
    marginBottom: 0,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  serviceText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  priceText: {
    ...typography.label,
    color: colors.primary[700],
    marginTop: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  detailIcon: {
    marginTop: 3,
    marginRight: spacing.md,
    width: 20,
    textAlign: 'center',
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  detailValue: {
    ...typography.body,
    color: colors.text,
    marginTop: 2,
  },
  actions: {
    padding: spacing.base,
    marginTop: spacing.base,
  },
  spacer: {
    height: spacing['3xl'],
  },
});
