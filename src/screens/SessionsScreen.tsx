import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppContext } from '../context/AppContext';

export function SessionsScreen() {
  const { clients, sessions, addSession } = useAppContext();
  const [summary, setSummary] = useState('');
  const [notes, setNotes] = useState('');
  const [nextSteps, setNextSteps] = useState('');

  const selectedClient = clients.find((client) => client.status === 'active');

  return (
    <ScreenContainer title="Sessions">
      <Text style={styles.helper}>Current client: {selectedClient?.name ?? 'No active clients yet'}</Text>
      <TextInput style={styles.input} placeholder="Session summary" value={summary} onChangeText={setSummary} />
      <TextInput style={styles.input} placeholder="Session notes" value={notes} onChangeText={setNotes} multiline />
      <TextInput style={styles.input} placeholder="Next steps" value={nextSteps} onChangeText={setNextSteps} />
      <Pressable
        style={styles.primaryButton}
        onPress={() => {
          if (!selectedClient || !summary.trim()) {
            return;
          }
          addSession({
            clientId: selectedClient.id,
            date: new Date().toISOString(),
            summary: summary.trim(),
            notes: notes.trim(),
            nextSteps: nextSteps.trim(),
          });
          setSummary('');
          setNotes('');
          setNextSteps('');
        }}
      >
        <Text style={styles.primaryLabel}>Save session</Text>
      </Pressable>

      {sessions.length ? (
        sessions.map((session) => (
          <View style={styles.card} key={session.id}>
            <Text style={styles.cardTitle}>{session.summary}</Text>
            <Text style={styles.cardMeta}>{session.nextSteps || 'No next steps yet'}</Text>
          </View>
        ))
      ) : (
        <EmptyState title="No sessions yet" subtitle="Capture session notes and next steps after each call." />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  helper: {
    color: '#4b587c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d8dff2',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryButton: {
    borderRadius: 8,
    backgroundColor: '#2f4be0',
    padding: 12,
  },
  primaryLabel: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
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
  cardMeta: {
    color: '#4b587c',
  },
});
