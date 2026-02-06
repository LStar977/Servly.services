import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { HomeStack } from './HomeStack';
import { SearchStack } from './SearchStack';
import { BookingsStack } from './BookingsStack';
import { MessagesStack } from './MessagesStack';
import { ProfileStack } from './ProfileStack';
import { MainTabParamList } from '../types';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, string> = {
  HomeTab: 'home',
  SearchTab: 'search',
  BookingsTab: 'calendar',
  MessagesTab: 'comments-o',
  ProfileTab: 'user',
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarLabelStyle: {
          ...typography.caption,
          fontWeight: '500',
          marginBottom: 2,
        },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: 88,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => (
          <Icon name={tabIcons[route.name]} size={size - 2} color={color} />
        ),
      })}>
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="SearchTab" component={SearchStack} options={{ title: 'Search' }} />
      <Tab.Screen name="BookingsTab" component={BookingsStack} options={{ title: 'Bookings' }} />
      <Tab.Screen name="MessagesTab" component={MessagesStack} options={{ title: 'Messages' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
