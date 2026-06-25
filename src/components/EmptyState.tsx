import { StyleSheet, Text, View } from 'react-native';

export function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d8dff2',
    padding: 16,
    backgroundColor: '#ffffff',
    gap: 8,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
  },
  subtitle: {
    color: '#4b587c',
  },
});
