import { StyleSheet, Text, View } from 'react-native';
import { brand, ui } from '../theme/brand';

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
    ...ui.card,
    gap: 10,
  },
  title: {
    color: brand.text,
    fontWeight: '600',
    fontSize: 17,
  },
  subtitle: {
    color: brand.mutedText,
    lineHeight: 21,
  },
});
