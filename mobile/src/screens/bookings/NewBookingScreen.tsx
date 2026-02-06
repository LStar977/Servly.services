import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Card } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { demoAPI } from '../../mock/api';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { BookingsStackParamList, ProviderProfile, Service } from '../../types';

type Props = NativeStackScreenProps<BookingsStackParamList, 'NewBooking'>;

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

const UPCOMING_DATES = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 1);
  return d;
});

export function NewBookingScreen({ route, navigation }: Props) {
  const { providerId, serviceId } = route.params;
  const { user } = useAuth();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProvider();
  }, [providerId]);

  const loadProvider = async () => {
    const p = await demoAPI.providers.getById(providerId);
    setProvider(p);
    if (p) {
      const svc = p.services.find(s => s.id === serviceId) || p.services[0];
      setSelectedService(svc);
    }
    setLoading(false);
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime || !address || !selectedService || !user) {
      Alert.alert('Missing Info', 'Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await demoAPI.bookings.create({
        customerId: user.id,
        providerId,
        serviceId: selectedService.id,
        categoryId: selectedService.categoryId,
        dateTime: selectedDate.toISOString(),
        address,
        notes,
        status: 'pending',
        paymentStatus: 'pending',
      });

      Alert.alert('Booking Confirmed!', 'Your service has been booked. The provider will confirm shortly.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !provider) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  const formatDate = (d: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return { day: days[d.getDay()], date: d.getDate(), month: months[d.getMonth()] };
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Provider Summary */}
      <Card style={styles.providerSummary}>
        <Text style={styles.providerName}>{provider.businessName}</Text>
        {selectedService && (
          <View style={styles.serviceRow}>
            <Text style={styles.serviceName}>{selectedService.title}</Text>
            <Text style={styles.servicePrice}>
              ${selectedService.price}/{selectedService.priceUnit}
            </Text>
          </View>
        )}
      </Card>

      {/* Service Selection (if multiple) */}
      {provider.services.length > 1 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Service</Text>
          {provider.services.map(svc => (
            <TouchableOpacity
              key={svc.id}
              style={[
                styles.serviceOption,
                selectedService?.id === svc.id && styles.serviceOptionActive,
              ]}
              onPress={() => setSelectedService(svc)}>
              <View style={styles.serviceOptionInfo}>
                <Text style={styles.serviceOptionTitle}>{svc.title}</Text>
                <Text style={styles.serviceOptionPrice}>
                  ${svc.price}/{svc.priceUnit}
                </Text>
              </View>
              {selectedService?.id === svc.id && (
                <Icon name="check-circle" size={20} color={colors.primary[600]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Date Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dateRow}>
            {UPCOMING_DATES.map((d, i) => {
              const f = formatDate(d);
              const isSelected = selectedDate?.toDateString() === d.toDateString();
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.dateChip, isSelected && styles.dateChipActive]}
                  onPress={() => setSelectedDate(d)}>
                  <Text style={[styles.dateDay, isSelected && styles.dateDayActive]}>{f.day}</Text>
                  <Text style={[styles.dateNum, isSelected && styles.dateNumActive]}>{f.date}</Text>
                  <Text style={[styles.dateMonth, isSelected && styles.dateMonthActive]}>{f.month}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Time Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map(time => {
            const isSelected = selectedTime === time;
            return (
              <TouchableOpacity
                key={time}
                style={[styles.timeChip, isSelected && styles.timeChipActive]}
                onPress={() => setSelectedTime(time)}>
                <Text style={[styles.timeText, isSelected && styles.timeTextActive]}>
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any special instructions..."
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Summary & Book */}
      <View style={styles.bookSection}>
        {selectedService && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>${selectedService.price}</Text>
          </View>
        )}
        <Button
          title="Confirm Booking"
          onPress={handleBook}
          loading={submitting}
          fullWidth
          size="lg"
          disabled={!selectedDate || !selectedTime || !address}
        />
      </View>
    </ScrollView>
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
  providerSummary: {
    margin: spacing.base,
  },
  providerName: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  servicePrice: {
    ...typography.label,
    color: colors.primary[700],
  },
  section: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  serviceOptionActive: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  serviceOptionInfo: {},
  serviceOptionTitle: {
    ...typography.label,
    color: colors.text,
  },
  serviceOptionPrice: {
    ...typography.caption,
    color: colors.primary[700],
    marginTop: 2,
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dateChip: {
    width: 60,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  dateChipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  dateDay: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  dateDayActive: { color: colors.primary[200] },
  dateNum: {
    ...typography.h3,
    color: colors.text,
  },
  dateNumActive: { color: colors.white },
  dateMonth: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  dateMonthActive: { color: colors.primary[200] },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  timeChipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  timeText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  timeTextActive: { color: colors.white },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  textArea: {
    minHeight: 80,
  },
  bookSection: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  totalLabel: {
    ...typography.h4,
    color: colors.text,
  },
  totalPrice: {
    ...typography.h2,
    color: colors.primary[700],
  },
});
