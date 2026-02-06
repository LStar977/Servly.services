import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookingsListScreen } from '../screens/bookings/BookingsListScreen';
import { BookingDetailScreen } from '../screens/bookings/BookingDetailScreen';
import { NewBookingScreen } from '../screens/bookings/NewBookingScreen';
import { BookingsStackParamList } from '../types';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<BookingsStackParamList>();

export function BookingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primary[600],
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: colors.white },
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="BookingsList"
        component={BookingsListScreen}
        options={{ title: 'My Bookings' }}
      />
      <Stack.Screen
        name="BookingDetail"
        component={BookingDetailScreen}
        options={{ title: 'Booking Details' }}
      />
      <Stack.Screen
        name="NewBooking"
        component={NewBookingScreen}
        options={{ title: 'Book Service', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
