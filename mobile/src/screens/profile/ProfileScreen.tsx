import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Badge, Button } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { ProfileStackParamList } from '../../types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

export function ProfileScreen({ navigation }: Props) {
  const { user, logout, isDemoMode } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Icon name="person" size={36} color={colors.primary[400]} />
        </View>
        <Text style={styles.name}>{user?.name ?? 'User'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
        <Badge label={user?.role ?? 'customer'} variant="info" style={styles.roleBadge} />
      </View>

      {isDemoMode && (
        <Card style={styles.demoCard}>
          <View style={styles.demoRow}>
            <Icon name="information-circle-outline" size={16} color={colors.primary[600]} />
            <Text style={styles.demoText}>
              You're using demo mode. Profile changes won't persist.
            </Text>
          </View>
        </Card>
      )}

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <MenuItem icon="create-outline" label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
        <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
        <MenuItem icon="card-outline" label="Payment Methods" onPress={() => {}} />
        <MenuItem icon="time-outline" label="Booking History" onPress={() => navigation.getParent()?.navigate('BookingsTab')} />
      </View>

      <View style={styles.menuSection}>
        <MenuItem icon="settings-outline" label="Settings" onPress={() => navigation.navigate('Settings')} />
        <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
        <MenuItem icon="document-text-outline" label="Terms & Privacy" onPress={() => {}} />
      </View>

      <View style={styles.logoutSection}>
        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="outline"
          fullWidth
        />
      </View>

      <Text style={styles.version}>Servly v0.1.0 (Demo)</Text>
    </ScrollView>
  );
}

function MenuItem({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Icon name={icon} size={18} color={colors.textSecondary} style={styles.menuIcon} />
      <Text style={styles.menuLabel}>{label}</Text>
      <Icon name="chevron-forward" size={12} color={colors.textTertiary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: {
    ...typography.h2,
    color: colors.text,
  },
  email: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
  },
  roleBadge: {
    marginTop: spacing.sm,
  },
  demoCard: {
    margin: spacing.base,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  demoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  menuSection: {
    backgroundColor: colors.white,
    marginTop: spacing.base,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 28,
    textAlign: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  logoutSection: {
    padding: spacing.base,
    marginTop: spacing.base,
  },
  version: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
