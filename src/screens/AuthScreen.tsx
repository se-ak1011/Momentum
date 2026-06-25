import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppContext } from '../context/AppContext';

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
    <ScreenContainer title="Momentum">
      <Text style={styles.subtitle}>Sign in to manage clients, sessions, and follow-ups.</Text>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
      {magicSent && <Text style={styles.successText}>Magic link sent — check your email.</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />
      <Pressable style={[styles.primaryButton, loading && styles.disabled]} onPress={handleSignIn} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryLabel}>Sign in</Text>}
      </Pressable>
      <Pressable style={[styles.secondaryButton, loading && styles.disabled]} onPress={handleMagicLink} disabled={loading}>
        <Text style={styles.secondaryLabel}>Send magic link</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: '#4b587c',
  },
  errorText: {
    color: '#c0392b',
    fontSize: 13,
  },
  successText: {
    color: '#27ae60',
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d8dff2',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryButton: {
    borderRadius: 8,
    backgroundColor: '#2f4be0',
    padding: 12,
  },
  primaryLabel: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2f4be0',
    padding: 12,
  },
  secondaryLabel: {
    color: '#2f4be0',
    textAlign: 'center',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});
