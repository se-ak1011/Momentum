import { StyleSheet, Text, View } from 'react-native';
import { brand, ui } from '../theme/brand';

export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    ...ui.card,
    gap: 6,
  },
  value: {
    color: brand.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  label: {
    color: brand.mutedText,
    fontSize: 14,
  },
});
