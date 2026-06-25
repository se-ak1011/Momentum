import { suggestFollowUps, summarizeSession } from './aiService';

describe('aiService (no API key)', () => {
  beforeEach(() => {
    // Ensure the env var is unset in tests so we test the guard branch.
    delete process.env['EXPO_PUBLIC_OPENAI_API_KEY'];
  });

  it('summarizeSession returns empty string for empty notes', async () => {
    const result = await summarizeSession('   ');
    expect(result).toBe('');
  });

  it('summarizeSession throws when API key is missing', async () => {
    await expect(summarizeSession('Patient discussed goals.')).rejects.toThrow('EXPO_PUBLIC_OPENAI_API_KEY');
  });

  it('suggestFollowUps returns empty array for empty summary', async () => {
    const result = await suggestFollowUps('');
    expect(result).toEqual([]);
  });

  it('suggestFollowUps throws when API key is missing', async () => {
    await expect(suggestFollowUps('Session went well.')).rejects.toThrow('EXPO_PUBLIC_OPENAI_API_KEY');
  });
});
