import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { brand } from './src/theme/brand';

export default function App() {
  return (
    <AppProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: brand.background }}>
        <StatusBar style="dark" />
        <RootNavigator />
      </SafeAreaView>
    </AppProvider>
  );
}
