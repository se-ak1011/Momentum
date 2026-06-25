import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { AuthScreen } from '../screens/AuthScreen';
import { ClientsScreen } from '../screens/ClientsScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SessionsScreen } from '../screens/SessionsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { brand } from '../theme/brand';

type AppTab = 'dashboard' | 'clients' | 'sessions' | 'tasks' | 'settings';

const tabs: { id: AppTab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'clients', label: 'Clients' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'settings', label: 'Settings' },
];

export function RootNavigator() {
  const { stage } = useAppContext();
  const [tab, setTab] = useState<AppTab>('dashboard');

  if (stage === 'auth') {
    return <AuthScreen />;
  }

  if (stage === 'onboarding') {
    return <OnboardingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderTab(tab)}</View>
      <View style={styles.tabBar}>
        {tabs.map((item) => (
          <Pressable key={item.id} onPress={() => setTab(item.id)} style={styles.tabItem}>
            <Text style={tab === item.id ? styles.tabTextActive : styles.tabText}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const renderTab = (tab: AppTab) => {
  switch (tab) {
    case 'dashboard':
      return <DashboardScreen />;
    case 'clients':
      return <ClientsScreen />;
    case 'sessions':
      return <SessionsScreen />;
    case 'tasks':
      return <TasksScreen />;
    case 'settings':
      return <SettingsScreen />;
    default:
      return <DashboardScreen />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.card,
    paddingBottom: 12,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  tabText: {
    color: brand.mutedText,
    fontSize: 12.5,
  },
  tabTextActive: {
    color: brand.primary,
    fontSize: 12.5,
    fontWeight: '700',
  },
});
