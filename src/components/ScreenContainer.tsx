import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { brand } from '../theme/brand';

export function ScreenContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.body}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 20,
    backgroundColor: brand.background,
  },
  title: {
    color: brand.text,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  body: {
    gap: 14,
  },
});
