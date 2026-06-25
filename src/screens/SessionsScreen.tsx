import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppContext } from '../context/AppContext';
import { summarizeSession } from '../services/aiService';
import { brand, ui } from '../theme/brand';

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
      {!!error && <Text style={ui.errorText}>{error}</Text>}
      <TextInput
        style={[ui.input, styles.multiline]}
        placeholder="Session notes (raw)"
        placeholderTextColor={brand.mutedText}
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <Pressable style={[ui.secondaryButton, aiLoading && styles.disabled]} onPress={handleSummarise} disabled={aiLoading}>
        {aiLoading ? (
          <ActivityIndicator color={brand.primary} />
        ) : (
          <Text style={ui.secondaryLabel}>AI: generate summary from notes</Text>
        )}
      </Pressable>
      {!!aiError && <Text style={ui.errorText}>{aiError}</Text>}
      <TextInput
        style={ui.input}
        placeholder="Session summary"
        placeholderTextColor={brand.mutedText}
        value={summary}
        onChangeText={setSummary}
      />
      <TextInput
        style={ui.input}
        placeholder="Next steps"
        placeholderTextColor={brand.mutedText}
        value={nextSteps}
        onChangeText={setNextSteps}
      />
      <Pressable style={ui.primaryButton} onPress={handleSave}>
        <Text style={ui.primaryLabel}>Save session</Text>
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
    ...ui.mutedText,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  disabled: {
    opacity: 0.6,
  },
  card: {
    ...ui.card,
  },
  cardTitle: {
    ...ui.sectionTitle,
    fontSize: 17,
  },
  cardMeta: {
    ...ui.mutedText,
  },
});
