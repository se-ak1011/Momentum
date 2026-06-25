import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppContext } from '../context/AppContext';
import { brand, ui } from '../theme/brand';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [magicSent, setMagicSent] = useState(false);
  const { signIn, sendMagicLink, loading, error } = useAppContext();

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      return;
    }
    await signIn(email.trim(), password.trim());
  };

  const handleMagicLink = async () => {
    if (!email.trim()) {
      return;
    }
    await sendMagicLink(email.trim());
    if (!error) {
      setMagicSent(true);
    }
  };

  return (
    <ScreenContainer title="Tenant Passport">
      <Text style={styles.subtitle}>The renter’s side of renting, ready whenever you apply.</Text>
      {!!error && <Text style={ui.errorText}>{error}</Text>}
      {magicSent && <Text style={styles.successText}>Magic link sent — check your email.</Text>}
      <TextInput
        style={ui.input}
        placeholder="Email"
        placeholderTextColor={brand.mutedText}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      <TextInput
        style={ui.input}
        placeholder="Password"
        placeholderTextColor={brand.mutedText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />
      <Pressable style={[ui.primaryButton, loading && styles.disabled]} onPress={handleSignIn} disabled={loading}>
        {loading ? <ActivityIndicator color={brand.card} /> : <Text style={ui.primaryLabel}>Sign in</Text>}
      </Pressable>
      <Pressable style={[ui.secondaryButton, loading && styles.disabled]} onPress={handleMagicLink} disabled={loading}>
        <Text style={ui.secondaryLabel}>Send magic link</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    ...ui.mutedText,
  },
  successText: {
    color: brand.primary,
    backgroundColor: brand.successSoft,
    fontSize: 13,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  disabled: {
    opacity: 0.6,
  },
});
