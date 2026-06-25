import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppContext } from '../context/AppContext';
import { brand, ui } from '../theme/brand';

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
      <TextInput
        style={ui.input}
        placeholder="Search clients"
        placeholderTextColor={brand.mutedText}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <View style={styles.row}>
        <TextInput
          style={[ui.input, styles.flex]}
          placeholder="Client name"
          placeholderTextColor={brand.mutedText}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[ui.input, styles.flex]}
          placeholder="Client email"
          placeholderTextColor={brand.mutedText}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <Pressable
        style={ui.primaryButton}
        onPress={() => {
          if (!name.trim() || !email.trim()) {
            return;
          }
          addClient({ name: name.trim(), email: email.trim() });
          setName('');
          setEmail('');
        }}
      >
        <Text style={ui.primaryLabel}>Add client</Text>
      </Pressable>

      {visibleClients.length ? (
        visibleClients.map((client) => (
          <View key={client.id} style={styles.card}>
            <Text style={styles.cardTitle}>{client.name}</Text>
            <Text style={styles.cardMeta}>{client.email}</Text>
            <Text style={styles.cardMeta}>Status: {client.status}</Text>
            <View style={styles.actionsRow}>
              <Pressable onPress={() => updateClient(client.id, { name: `${client.name} (edited)` })}>
                <Text style={ui.actionText}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => archiveClient(client.id)}>
                <Text style={ui.actionText}>Archive</Text>
              </Pressable>
            </View>
          </View>
        ))
      ) : (
        <EmptyState title="No matching clients" subtitle="Try a different search or add a new client." />
      )}

      <View style={styles.intakeCard}>
        <Text style={styles.cardTitle}>Intake forms</Text>
        {intakeForms.map((form) => (
          <Text key={form.id} style={styles.cardMeta}>
            {form.name}: {form.questions.length} questions
          </Text>
        ))}
        <TextInput
          style={ui.input}
          placeholder="Custom intake question"
          placeholderTextColor={brand.mutedText}
          value={intakeQuestion}
          onChangeText={setIntakeQuestion}
        />
        <Pressable
          style={ui.secondaryButton}
          onPress={() => {
            if (!intakeQuestion.trim() || !intakeForms[0]) {
              return;
            }
            addIntakeQuestion(intakeForms[0].id, intakeQuestion.trim());
            setIntakeQuestion('');
          }}
        >
          <Text style={ui.secondaryLabel}>Add intake question</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  flex: {
    flex: 1,
  },
  card: {
    ...ui.card,
  },
  intakeCard: {
    ...ui.card,
    marginTop: 6,
  },
  cardTitle: {
    ...ui.sectionTitle,
    fontSize: 17,
  },
  cardMeta: {
    ...ui.mutedText,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
});
