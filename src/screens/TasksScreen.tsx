import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppContext } from '../context/AppContext';

export function TasksScreen() {
  const { clients, tasks, addTask, markTaskDone } = useAppContext();
  const [title, setTitle] = useState('');

  const activeClient = clients.find((client) => client.status === 'active');

  return (
    <ScreenContainer title="Tasks & reminders">
      <Text style={styles.helper}>Push nudges are prepared through reminder records and Expo notification services.</Text>
      <TextInput style={styles.input} placeholder="Homework or follow-up task" value={title} onChangeText={setTitle} />
      <Pressable
        style={styles.primaryButton}
        onPress={() => {
          if (!activeClient || !title.trim()) {
            return;
          }
          addTask({
            clientId: activeClient.id,
            title: title.trim(),
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            status: 'todo',
            followUpStatus: 'pending',
          });
          setTitle('');
        }}
      >
        <Text style={styles.primaryLabel}>Add task</Text>
      </Pressable>

      {tasks.length ? (
        tasks.map((task) => (
          <View key={task.id} style={styles.card}>
            <Text style={styles.cardTitle}>{task.title}</Text>
            <Text style={styles.cardMeta}>Status: {task.status}</Text>
            <Text style={styles.cardMeta}>Follow-up: {task.followUpStatus}</Text>
            {task.status !== 'done' && (
              <Pressable onPress={() => markTaskDone(task.id)}>
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
  action: {
    color: '#2f4be0',
    fontWeight: '600',
  },
});
