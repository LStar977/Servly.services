import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchBar, ProviderCard, EmptyState, CategoryIcon, SectionHeader } from '../../components';
import { demoAPI } from '../../mock/api';
import { colors, spacing } from '../../theme';
import { SearchStackParamList, ProviderProfile } from '../../types';
import { categories } from '../../mock/data';

type Props = NativeStackScreenProps<SearchStackParamList, 'Search'>;

export function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProviderProfile[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    const data = await demoAPI.providers.search(query);
    setResults(data);
    setHasSearched(true);
  }, [query]);

  const handleQueryChange = useCallback(
    async (text: string) => {
      setQuery(text);
      if (text.length === 0) {
        setResults([]);
        setHasSearched(false);
      } else if (text.length >= 2) {
        const data = await demoAPI.providers.search(text);
        setResults(data);
        setHasSearched(true);
      }
    },
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={query}
          onChangeText={handleQueryChange}
          onSubmit={handleSearch}
          placeholder="Search services, providers, cities..."
          autoFocus
        />
      </View>

      {!hasSearched ? (
        <View>
          <SectionHeader title="Browse by Category" />
          <View style={styles.categoryGrid}>
            {categories.map(cat => (
              <CategoryIcon
                key={cat.id}
                name={cat.name}
                icon={cat.icon}
                onPress={() =>
                  navigation.navigate('ProviderDetail', {
                    providerId: '', // Would navigate to category in full app
                  })
                }
              />
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => (
            <ProviderCard
              provider={item}
              onPress={() =>
                navigation.navigate('ProviderDetail', { providerId: item.id })
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="search"
              title="No results"
              message={`No providers match "${query}". Try a different search.`}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: spacing.base,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.base,
    gap: spacing.base,
  },
  resultsList: {
    padding: spacing.base,
  },
});
