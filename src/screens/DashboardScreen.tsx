import { StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatCard } from '../components/StatCard';
import { useAppContext } from '../context/AppContext';

export function DashboardScreen() {
  const { dashboard } = useAppContext();

  return (
    <ScreenContainer title="Dashboard">
      <View style={styles.row}>
        <StatCard label="Active clients" value={dashboard.activeClients} />
        <StatCard label="Due tasks" value={dashboard.dueTasks} />
      </View>
      <View style={styles.row}>
        <StatCard label="Overdue follow-ups" value={dashboard.overdueFollowUps} />
      </View>
      {dashboard.churnRiskFlags.length ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Churn-risk flags</Text>
          {dashboard.churnRiskFlags.map((flag) => (
            <Text key={flag} style={styles.listItem}>
              • {flag}
            </Text>
          ))}
        </View>
      ) : (
        <EmptyState title="No churn risk flags" subtitle="Momentum will highlight clients needing attention." />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: '#d8dff2',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
    gap: 6,
  },
  cardTitle: {
    fontWeight: '600',
  },
  listItem: {
    color: '#4b587c',
  },
});
