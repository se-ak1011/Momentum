import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppContext } from '../context/AppContext';

export function ClientsScreen() {
  const { clients, intakeForms, addClient, updateClient, archiveClient, addIntakeQuestion } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [intakeQuestion, setIntakeQuestion] = useState('');

  const visibleClients = useMemo(
    () => clients.filter((client) => client.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [clients, searchTerm],
  );

  return (
    <ScreenContainer title="Clients">
      <TextInput style={styles.input} placeholder="Search clients" value={searchTerm} onChangeText={setSearchTerm} />
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.flex]} placeholder="Client name" value={name} onChangeText={setName} />
        <TextInput
          style={[styles.input, styles.flex]}
          placeholder="Client email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <Pressable
        style={styles.primaryButton}
        onPress={() => {
          if (!name.trim() || !email.trim()) {
            return;
          }
          addClient({ name: name.trim(), email: email.trim() });
          setName('');
          setEmail('');
        }}
      >
        <Text style={styles.primaryLabel}>Add client</Text>
      </Pressable>

      {visibleClients.length ? (
        visibleClients.map((client) => (
          <View key={client.id} style={styles.card}>
            <Text style={styles.cardTitle}>{client.name}</Text>
            <Text style={styles.cardMeta}>{client.email}</Text>
            <Text style={styles.cardMeta}>Status: {client.status}</Text>
            <View style={styles.actionsRow}>
              <Pressable onPress={() => updateClient(client.id, { name: `${client.name} (edited)` })}>
                <Text style={styles.action}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => archiveClient(client.id)}>
                <Text style={styles.action}>Archive</Text>
              </Pressable>
            </View>
          </View>
        ))
      ) : (
        <EmptyState title="No matching clients" subtitle="Try a different search or add a new client." />
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Intake forms</Text>
        {intakeForms.map((form) => (
          <Text key={form.id} style={styles.cardMeta}>
            {form.name}: {form.questions.length} questions
          </Text>
        ))}
        <TextInput
          style={styles.input}
          placeholder="Custom intake question"
          value={intakeQuestion}
          onChangeText={setIntakeQuestion}
        />
        <Pressable
          style={styles.secondaryButton}
          onPress={() => {
            if (!intakeQuestion.trim() || !intakeForms[0]) {
              return;
            }
            addIntakeQuestion(intakeForms[0].id, intakeQuestion.trim());
            setIntakeQuestion('');
          }}
        >
          <Text style={styles.secondaryLabel}>Add intake question</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  flex: {
    flex: 1,
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
  card: {
    borderWidth: 1,
    borderColor: '#d8dff2',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardMeta: {
    color: '#4b587c',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  action: {
    color: '#2f4be0',
    fontWeight: '600',
  },
});
