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
import { Button } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { AuthStackParamList, Role } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export function SignupScreen({ navigation }: Props) {
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('customer');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    try {
      await signup({ name, email, password, role });
    } catch (e: any) {
      setError(e?.message || 'Signup failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Servly to book trusted local services</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="words"
            />
          </View>

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
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Min 6 characters"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>I want to...</Text>
            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[styles.roleOption, role === 'customer' && styles.roleActive]}
                onPress={() => setRole('customer')}>
                <Text style={[styles.roleText, role === 'customer' && styles.roleTextActive]}>
                  Book Services
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleOption, role === 'provider' && styles.roleActive]}
                onPress={() => setRole('provider')}>
                <Text style={[styles.roleText, role === 'provider' && styles.roleTextActive]}>
                  Offer Services
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {error !== '' && <Text style={styles.error}>{error}</Text>}

          <Button
            title="Create Account"
            onPress={handleSignup}
            loading={isLoading}
            fullWidth
            style={styles.signupButton}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginTextBold}>Sign in</Text>
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
    padding: spacing.xl,
    paddingTop: spacing['3xl'],
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing['2xl'],
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
  roleRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  roleOption: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  roleActive: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  roleText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  roleTextActive: {
    color: colors.primary[700],
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    marginBottom: spacing.md,
  },
  signupButton: {
    marginTop: spacing.sm,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loginTextBold: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});
