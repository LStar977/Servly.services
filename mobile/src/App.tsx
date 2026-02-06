import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './hooks/useAuth';
import { RootNavigator } from './navigation/RootNavigator';
import { colors } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
