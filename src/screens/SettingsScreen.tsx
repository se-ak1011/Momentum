import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { env } from '../config/env';
import { signOut } from '../services/authService';
import { useAppContext } from '../context/AppContext';

export function SettingsScreen() {
  const { providerProfile, plan, user } = useAppContext();

  return (
    <ScreenContainer title="Settings">
      <View style={styles.card}>
        <Text style={styles.title}>Signed in as</Text>
        <Text style={styles.meta}>{user?.email ?? '—'}</Text>
        <Pressable style={styles.dangerButton} onPress={() => void signOut()}>
          <Text style={styles.dangerLabel}>Sign out</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Provider profile</Text>
        <Text style={styles.meta}>Name: {providerProfile?.name ?? 'Not set'}</Text>
        <Text style={styles.meta}>Business: {providerProfile?.businessType ?? 'Not set'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Billing</Text>
        <Text style={styles.meta}>Tier: {plan.tier}</Text>
        <Text style={styles.meta}>Stripe price id: {plan.stripePriceId ?? 'set in backend later'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Integrations</Text>
        <Text style={styles.meta}>Supabase: {env.supabaseUrl ? 'connected' : 'not configured'}</Text>
        <Text style={styles.meta}>AI suggestions: {env.openAiKeySet ? 'enabled' : 'not configured'}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#d8dff2',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
    gap: 4,
  },
  title: {
    fontWeight: '600',
  },
  meta: {
    color: '#4b587c',
  },
  dangerButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c0392b',
    padding: 10,
    marginTop: 4,
  },
  dangerLabel: {
    color: '#c0392b',
    textAlign: 'center',
    fontWeight: '600',
  },
});
