import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProviderCard, EmptyState } from '../../components';
import { demoAPI } from '../../mock/api';
import { colors, spacing } from '../../theme';
import { HomeStackParamList, ProviderProfile } from '../../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'CategoryProviders'>;

export function CategoryProvidersScreen({ route, navigation }: Props) {
  const { categoryId, categoryName } = route.params;
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: categoryName });
    loadProviders();
  }, [categoryId]);

  const loadProviders = async () => {
    const data = await demoAPI.providers.getByCategory(categoryId);
    setProviders(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={providers}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <ProviderCard
          provider={item}
          onPress={() => navigation.navigate('ProviderDetail', { providerId: item.id })}
        />
      )}
      ListEmptyComponent={
        <EmptyState
          icon="search"
          title="No providers found"
          message={`We don't have any ${categoryName} providers in your area yet.`}
        />
      }
    />
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
  },
  list: {
    padding: spacing.base,
  },
});
