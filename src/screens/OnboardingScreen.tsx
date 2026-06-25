import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppContext } from '../context/AppContext';
import type { BusinessType } from '../types/models';

const businessTypes: BusinessType[] = ['consulting', 'coaching', 'psychology'];

export function OnboardingScreen() {
  const [name, setName] = useState('');
  const [workflowName, setWorkflowName] = useState('Standard Follow-up');
  const [brandColor, setBrandColor] = useState('#2f4be0');
  const [businessType, setBusinessType] = useState<BusinessType>('consulting');
  const { completeOnboarding } = useAppContext();

  return (
    <ScreenContainer title="Onboarding setup">
      <Text style={styles.subtitle}>Create your provider profile and default client workflow.</Text>
      <TextInput style={styles.input} placeholder="Provider name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Brand color" value={brandColor} onChangeText={setBrandColor} />
      <TextInput style={styles.input} placeholder="Workflow setup" value={workflowName} onChangeText={setWorkflowName} />
      <View style={styles.segmentedRow}>
        {businessTypes.map((type) => (
          <Pressable
            key={type}
            style={[styles.segment, businessType === type && styles.segmentActive]}
            onPress={() => setBusinessType(type)}
          >
            <Text style={businessType === type ? styles.segmentLabelActive : styles.segmentLabel}>{type}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        style={styles.primaryButton}
        onPress={() => completeOnboarding({ name, businessType, brandColor, workflowName })}
      >
        <Text style={styles.primaryLabel}>Finish onboarding</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: '#4b587c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d8dff2',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  segment: {
    borderWidth: 1,
    borderColor: '#d8dff2',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  segmentActive: {
    backgroundColor: '#2f4be0',
    borderColor: '#2f4be0',
  },
  segmentLabel: {
    color: '#4b587c',
    textTransform: 'capitalize',
  },
  segmentLabelActive: {
    color: '#fff',
    textTransform: 'capitalize',
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
});
