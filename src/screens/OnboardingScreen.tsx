import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppContext } from '../context/AppContext';
import { brand, ui } from '../theme/brand';
import type { BusinessType } from '../types/models';

const businessTypes: BusinessType[] = ['consulting', 'coaching', 'psychology'];

export function OnboardingScreen() {
  const [name, setName] = useState('');
  const [workflowName, setWorkflowName] = useState('Standard Follow-up');
  const [brandColor, setBrandColor] = useState(brand.primary);
  const [businessType, setBusinessType] = useState<BusinessType>('consulting');
  const { completeOnboarding } = useAppContext();

  return (
    <ScreenContainer title="Onboarding setup">
      <Text style={styles.subtitle}>Create your provider profile and default client workflow.</Text>
      <TextInput
        style={ui.input}
        placeholder="Provider name"
        placeholderTextColor={brand.mutedText}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={ui.input}
        placeholder="Brand color"
        placeholderTextColor={brand.mutedText}
        value={brandColor}
        onChangeText={setBrandColor}
      />
      <TextInput
        style={ui.input}
        placeholder="Workflow setup"
        placeholderTextColor={brand.mutedText}
        value={workflowName}
        onChangeText={setWorkflowName}
      />
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
        style={ui.primaryButton}
        onPress={() => completeOnboarding({ name, businessType, brandColor, workflowName })}
      >
        <Text style={ui.primaryLabel}>Finish onboarding</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    ...ui.mutedText,
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  segment: {
    borderWidth: 1,
    borderColor: brand.border,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: brand.card,
  },
  segmentActive: {
    backgroundColor: brand.successSoft,
    borderColor: brand.accent,
  },
  segmentLabel: {
    color: brand.mutedText,
    textTransform: 'capitalize',
  },
  segmentLabelActive: {
    color: brand.primary,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});
