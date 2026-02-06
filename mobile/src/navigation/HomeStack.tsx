import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProviderDetailScreen } from '../screens/home/ProviderDetailScreen';
import { CategoryProvidersScreen } from '../screens/home/CategoryProvidersScreen';
import { HomeStackParamList } from '../types';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primary[600],
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: colors.white },
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProviderDetail"
        component={ProviderDetailScreen}
        options={{ title: 'Provider' }}
      />
      <Stack.Screen
        name="CategoryProviders"
        component={CategoryProvidersScreen}
        options={{ title: 'Category' }}
      />
    </Stack.Navigator>
  );
}
