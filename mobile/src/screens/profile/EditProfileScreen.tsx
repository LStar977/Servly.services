import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, borderRadius, typography } from '../../theme';

export function EditProfileScreen() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [city, setCity] = useState(user?.city ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');

  const handleSave = () => {
    Alert.alert('Saved', 'Profile updated successfully (demo mode).');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Icon name="person" size={32} color={colors.primary[400]} />
        </View>
        <Text style={styles.changePhoto}>Change Photo</Text>
      </View>

      <View style={styles.form}>
        <Field label="Full Name" value={name} onChangeText={setName} />
        <Field label="Email" value={user?.email ?? ''} onChangeText={() => {}} editable={false} />
        <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Field label="City" value={city} onChangeText={setCity} />
        <Field label="Bio" value={bio} onChangeText={setBio} multiline />
      </View>

      <View style={styles.saveSection}>
        <Button title="Save Changes" onPress={handleSave} fullWidth size="lg" />
      </View>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  editable = true,
  multiline = false,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  editable?: boolean;
  multiline?: boolean;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea, !editable && styles.inputDisabled]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhoto: {
    ...typography.buttonSmall,
    color: colors.primary[600],
    marginTop: spacing.sm,
  },
  form: {
    paddingHorizontal: spacing.base,
  },
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
  textArea: {
    minHeight: 80,
  },
  inputDisabled: {
    backgroundColor: colors.gray[100],
    color: colors.textTertiary,
  },
  saveSection: {
    padding: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
});
