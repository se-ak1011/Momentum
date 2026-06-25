import { StyleSheet, Text, View } from 'react-native';

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
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d8dff2',
    gap: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
  label: {
    color: '#4b587c',
  },
});
