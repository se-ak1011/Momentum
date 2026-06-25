import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  body: {
    gap: 12,
  },
});
