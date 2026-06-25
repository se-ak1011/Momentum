import { StyleSheet } from 'react-native';

export const brand = {
  background: '#F8F7F4',
  card: '#FFFFFF',
  text: '#151718',
  mutedText: '#5F6670',
  primary: '#285943',
  accent: '#8C9B68',
  successSoft: '#CFE7D3',
  border: '#E3E0D8',
  warning: '#B88A44',
  danger: '#9A4A34',
};

export const ui = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: brand.border,
    borderRadius: 16,
    backgroundColor: brand.card,
    padding: 16,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: brand.text,
    fontSize: 15,
  },
  primaryButton: {
    borderRadius: 12,
    backgroundColor: brand.primary,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  primaryLabel: {
    color: brand.card,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: brand.primary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: brand.card,
  },
  secondaryLabel: {
    color: brand.primary,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionTitle: {
    color: brand.text,
    fontWeight: '700',
    fontSize: 18,
  },
  mutedText: {
    color: brand.mutedText,
    fontSize: 15,
    lineHeight: 21,
  },
  actionText: {
    color: brand.primary,
    fontWeight: '700',
  },
  errorText: {
    color: brand.danger,
    fontSize: 13,
  },
  warningText: {
    color: brand.warning,
    fontSize: 13,
  },
});
