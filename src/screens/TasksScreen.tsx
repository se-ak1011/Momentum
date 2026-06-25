import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppContext } from '../context/AppContext';
import { suggestFollowUps } from '../services/aiService';
import { brand, ui } from '../theme/brand';
import type { Task } from '../types/models';

const tomorrow = (): string => new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();

const makeTask = (clientId: string, title: string): Omit<Task, 'id'> => ({
  clientId,
  title,
  dueDate: tomorrow(),
  status: 'todo',
  followUpStatus: 'pending',
});

export function TasksScreen() {
  const { clients, tasks, sessions, addTask, markTaskDone, error } = useAppContext();
  const [title, setTitle] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const activeClient = clients.find((client) => client.status === 'active');

  const handleSuggest = async () => {
    const latestSession = sessions.filter((s) => s.clientId === activeClient?.id).at(-1);
    if (!latestSession?.summary.trim()) {
      setAiError('Save a session summary first to get AI suggestions.');
      return;
    }
    setAiLoading(true);
    setAiError(null);
    setSuggestions([]);
    try {
      const items = await suggestFollowUps(latestSession.summary);
      setSuggestions(items);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI suggestion failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddSuggested = async (suggestion: string) => {
    if (!activeClient) {
      return;
    }
    await addTask(makeTask(activeClient.id, suggestion));
    setSuggestions((prev) => prev.filter((s) => s !== suggestion));
  };

  const handleAddManual = async () => {
    if (!activeClient || !title.trim()) {
      return;
    }
    await addTask(makeTask(activeClient.id, title.trim()));
    setTitle('');
  };

  return (
    <ScreenContainer title="Tasks & reminders">
      <Text style={styles.helper}>Push nudges are prepared through reminder records and Expo notification services.</Text>
      {!!error && <Text style={ui.errorText}>{error}</Text>}

      <TextInput
        style={ui.input}
        placeholder="Homework or follow-up task"
        placeholderTextColor={brand.mutedText}
        value={title}
        onChangeText={setTitle}
      />
      <Pressable style={ui.primaryButton} onPress={() => void handleAddManual()}>
        <Text style={ui.primaryLabel}>Add task</Text>
      </Pressable>

      <Pressable style={[ui.secondaryButton, aiLoading && styles.disabled]} onPress={() => void handleSuggest()} disabled={aiLoading}>
        {aiLoading ? (
          <ActivityIndicator color={brand.primary} />
        ) : (
          <Text style={ui.secondaryLabel}>AI: suggest follow-ups from last session</Text>
        )}
      </Pressable>
      {!!aiError && <Text style={ui.warningText}>{aiError}</Text>}

      {suggestions.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Suggested follow-ups</Text>
          {suggestions.map((s) => (
            <Pressable key={s} onPress={() => void handleAddSuggested(s)}>
              <Text style={styles.suggestion}>+ {s}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {tasks.length ? (
        tasks.map((task) => (
          <View key={task.id} style={styles.card}>
            <Text style={styles.cardTitle}>{task.title}</Text>
            <Text style={styles.cardMeta}>Status: {task.status}</Text>
            <Text style={styles.cardMeta}>Follow-up: {task.followUpStatus}</Text>
            {task.status !== 'done' && (
              <Pressable onPress={() => void markTaskDone(task.id)}>
                <Text style={ui.actionText}>Mark done</Text>
              </Pressable>
            )}
          </View>
        ))
      ) : (
        <EmptyState title="No tasks yet" subtitle="Track homework and reminder follow-ups in one place." />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  helper: {
    ...ui.mutedText,
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
  suggestion: {
    ...ui.actionText,
    paddingVertical: 5,
  },
});
