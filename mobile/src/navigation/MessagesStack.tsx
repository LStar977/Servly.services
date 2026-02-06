import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConversationsListScreen } from '../screens/messages/ConversationsListScreen';
import { ChatScreen } from '../screens/messages/ChatScreen';
import { MessagesStackParamList } from '../types';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<MessagesStackParamList>();

export function MessagesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primary[600],
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: colors.white },
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="ConversationsList"
        component={ConversationsListScreen}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({ title: route.params.participantName })}
      />
    </Stack.Navigator>
  );
}
