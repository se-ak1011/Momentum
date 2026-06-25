import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppContext } from '../context/AppContext';
import { suggestFollowUps } from '../services/aiService';
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
      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput style={styles.input} placeholder="Homework or follow-up task" value={title} onChangeText={setTitle} />
      <Pressable style={styles.primaryButton} onPress={() => void handleAddManual()}>
        <Text style={styles.primaryLabel}>Add task</Text>
      </Pressable>

      <Pressable style={[styles.secondaryButton, aiLoading && styles.disabled]} onPress={() => void handleSuggest()} disabled={aiLoading}>
        {aiLoading ? (
          <ActivityIndicator color="#2f4be0" />
        ) : (
          <Text style={styles.secondaryLabel}>AI: suggest follow-ups from last session</Text>
        )}
      </Pressable>
      {!!aiError && <Text style={styles.errorText}>{aiError}</Text>}

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
                <Text style={styles.action}>Mark done</Text>
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
  action: {
    color: '#2f4be0',
    fontWeight: '600',
  },
  suggestion: {
    color: '#2f4be0',
    paddingVertical: 4,
  },
});
