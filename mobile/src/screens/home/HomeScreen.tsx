import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../hooks/useAuth';
import { SearchBar, SectionHeader, CategoryIcon, ProviderCard, Card } from '../../components';
import { demoAPI } from '../../mock/api';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { HomeStackParamList, ProviderProfile } from '../../types';
import { categories } from '../../mock/data';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  React.useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    const data = await demoAPI.providers.getAll();
    setProviders(data);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProviders();
    setRefreshing(false);
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />
      }>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.greeting}>Hey {firstName} 👋</Text>
        <Text style={styles.heroTitle}>What do you need help with?</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for a service..."
        />
      </View>

      {/* Demo Mode Banner */}
      <Card style={styles.demoBanner}>
        <View style={styles.demoContent}>
          <Icon name="rocket-outline" size={20} color={colors.primary[600]} />
          <View style={styles.demoTextContainer}>
            <Text style={styles.demoBannerTitle}>Demo Mode Active</Text>
            <Text style={styles.demoBannerSubtitle}>
              Explore the app with sample data. All features are functional.
            </Text>
          </View>
        </View>
      </Card>

      {/* Categories */}
      <SectionHeader title="Browse Categories" />
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CategoryIcon
            name={item.name}
            icon={item.icon}
            categoryId={item.id}
            onPress={() =>
              navigation.navigate('CategoryProviders', {
                categoryId: item.id,
                categoryName: item.name,
              })
            }
          />
        )}
      />

      {/* Top Rated Providers */}
      <SectionHeader title="Top Rated" actionLabel="See all" onAction={() => {}} />
      <View style={styles.providersList}>
        {providers
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
          .map(provider => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onPress={() =>
                navigation.navigate('ProviderDetail', { providerId: provider.id })
              }
            />
          ))}
      </View>

      {/* How It Works */}
      <SectionHeader title="How It Works" />
      <View style={styles.stepsContainer}>
        {[
          { icon: 'search-outline', title: 'Search', desc: 'Find the service you need' },
          { icon: 'calendar-outline', title: 'Book', desc: 'Pick a date and time' },
          { icon: 'checkmark-circle-outline', title: 'Done', desc: 'Sit back and relax' },
        ].map((step, i) => (
          <View key={i} style={styles.step}>
            <View style={styles.stepIcon}>
              <Icon name={step.icon} size={20} color={colors.primary[600]} />
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDesc}>{step.desc}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
    borderBottomLeftRadius: borderRadius['2xl'],
    borderBottomRightRadius: borderRadius['2xl'],
  },
  greeting: {
    ...typography.body,
    color: colors.primary[200],
    marginBottom: spacing.xs,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.lg,
  },
  demoBanner: {
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    marginBottom: spacing.lg,
  },
  demoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  demoTextContainer: {
    flex: 1,
  },
  demoBannerTitle: {
    ...typography.label,
    color: colors.text,
  },
  demoBannerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  categoriesList: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  providersList: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.lg,
  },
  stepsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  stepTitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: 2,
  },
  stepDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: spacing['2xl'],
  },
});
