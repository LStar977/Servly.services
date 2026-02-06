import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeStack } from './HomeStack';
import { SearchStack } from './SearchStack';
import { BookingsStack } from './BookingsStack';
import { MessagesStack } from './MessagesStack';
import { ProfileStack } from './ProfileStack';
import { MainTabParamList } from '../types';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, { active: string; inactive: string }> = {
  HomeTab:     { active: 'home',        inactive: 'home-outline' },
  SearchTab:   { active: 'search',      inactive: 'search-outline' },
  BookingsTab: { active: 'calendar',    inactive: 'calendar-outline' },
  MessagesTab: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  ProfileTab:  { active: 'person',      inactive: 'person-outline' },
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
          fontSize: 11,
          marginBottom: Platform.OS === 'ios' ? 0 : 2,
        },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray[200],
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 6,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarIcon: ({ color, focused }) => (
          <Icon
            name={focused ? tabIcons[route.name].active : tabIcons[route.name].inactive}
            size={24}
            color={color}
          />
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
