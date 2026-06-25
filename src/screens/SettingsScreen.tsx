import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { env } from '../config/env';
import { useAppContext } from '../context/AppContext';

export function SettingsScreen() {
  const { providerProfile, plan } = useAppContext();

  return (
    <ScreenContainer title="Settings">
      <View style={styles.card}>
        <Text style={styles.title}>Provider profile</Text>
        <Text style={styles.meta}>Name: {providerProfile?.name ?? 'Not set'}</Text>
        <Text style={styles.meta}>Business: {providerProfile?.businessType ?? 'Not set'}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Billing-ready plan structure</Text>
        <Text style={styles.meta}>Tier: {plan.tier}</Text>
        <Text style={styles.meta}>Stripe price id: {plan.stripePriceId ?? 'set in backend later'}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Environment config</Text>
        <Text style={styles.meta}>API base URL: {env.apiBaseUrl}</Text>
        <Text style={styles.meta}>Auth key configured: {env.authProviderKey ? 'yes' : 'no'}</Text>
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
});
