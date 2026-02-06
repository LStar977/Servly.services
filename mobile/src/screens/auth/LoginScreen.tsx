import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { AuthStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login, loginAsDemo, isLoading, isDemoMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e?.message || 'Login failed');
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    try {
      await loginAsDemo();
    } catch (e: any) {
      setError(e?.message || 'Demo login failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="bolt" size={32} color={colors.white} />
          </View>
          <Text style={styles.title}>Welcome to Servly</Text>
          <Text style={styles.subtitle}>
            Book trusted local services in minutes
          </Text>
        </View>

        {isDemoMode && (
          <View style={styles.demoBanner}>
            <Icon name="info-circle" size={16} color={colors.primary[700]} />
            <Text style={styles.demoText}>Demo Mode - Tap below to explore</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry
            />
          </View>

          {error !== '' && <Text style={styles.error}>{error}</Text>}

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            style={styles.loginButton}
          />

          {isDemoMode && (
            <Button
              title="Try Demo Mode"
              onPress={handleDemoLogin}
              variant="secondary"
              loading={isLoading}
              fullWidth
              style={styles.demoButton}
            />
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            style={styles.signupLink}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text style={styles.signupTextBold}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  demoText: {
    ...typography.bodySmall,
    color: colors.primary[700],
    fontWeight: '500',
  },
  form: {},
  inputGroup: {
    marginBottom: spacing.base,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    marginBottom: spacing.md,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  demoButton: {
    marginTop: spacing.md,
  },
  signupLink: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  signupText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  signupTextBold: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});
