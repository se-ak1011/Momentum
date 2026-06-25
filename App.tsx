import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AppProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f8fc' }}>
        <StatusBar style="dark" />
        <RootNavigator />
      </SafeAreaView>
    </AppProvider>
  );
}
