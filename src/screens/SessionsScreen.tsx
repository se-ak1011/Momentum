import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppContext } from '../context/AppContext';
import { summarizeSession } from '../services/aiService';

export function SessionsScreen() {
  const { clients, sessions, addSession, error } = useAppContext();
  const [summary, setSummary] = useState('');
  const [notes, setNotes] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const selectedClient = clients.find((client) => client.status === 'active');

  const handleSummarise = async () => {
    if (!notes.trim()) {
      return;
    }
    setAiLoading(true);
    setAiError(null);
    try {
      const generated = await summarizeSession(notes);
      if (generated) {
        setSummary(generated);
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI summarize failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedClient || !summary.trim()) {
      return;
    }
    await addSession({
      clientId: selectedClient.id,
      date: new Date().toISOString(),
      summary: summary.trim(),
      notes: notes.trim(),
      nextSteps: nextSteps.trim(),
    });
    setSummary('');
    setNotes('');
    setNextSteps('');
  };

  return (
    <ScreenContainer title="Sessions">
      <Text style={styles.helper}>Current client: {selectedClient?.name ?? 'No active clients yet'}</Text>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Session notes (raw)"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <Pressable style={[styles.secondaryButton, aiLoading && styles.disabled]} onPress={handleSummarise} disabled={aiLoading}>
        {aiLoading ? (
          <ActivityIndicator color="#2f4be0" />
        ) : (
          <Text style={styles.secondaryLabel}>AI: generate summary from notes</Text>
        )}
      </Pressable>
      {!!aiError && <Text style={styles.errorText}>{aiError}</Text>}
      <TextInput style={styles.input} placeholder="Session summary" value={summary} onChangeText={setSummary} />
      <TextInput style={styles.input} placeholder="Next steps" value={nextSteps} onChangeText={setNextSteps} />
      <Pressable style={styles.primaryButton} onPress={handleSave}>
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
  errorText: {
    color: '#c0392b',
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d8dff2',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  secondaryButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2f4be0',
    padding: 10,
  },
  secondaryLabel: {
    color: '#2f4be0',
    textAlign: 'center',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
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
