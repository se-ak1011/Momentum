import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppContext } from '../context/AppContext';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { signIn, sendMagicLink } = useAppContext();

  return (
    <ScreenContainer title="Momentum">
      <Text style={styles.subtitle}>Sign in to manage clients, sessions, and follow-ups.</Text>
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Pressable style={styles.primaryButton} onPress={() => signIn(email.trim())}>
        <Text style={styles.primaryLabel}>Sign in</Text>
      </Pressable>
      <Pressable
        style={styles.secondaryButton}
        onPress={() => {
          sendMagicLink(email.trim());
          setMessage('Magic link sent (mock).');
        }}
      >
        <Text style={styles.secondaryLabel}>Send magic link</Text>
      </Pressable>
      {!!message && <Text style={styles.helper}>{message}</Text>}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: '#4b587c',
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
  helper: {
    color: '#4b587c',
  },
});
