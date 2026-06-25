import { suggestFollowUps, summariseSession } from './aiService';

describe('aiService (no API key)', () => {
  beforeEach(() => {
    // Ensure the env var is unset in tests so we test the guard branch.
    delete process.env['EXPO_PUBLIC_OPENAI_API_KEY'];
  });

  it('summariseSession returns empty string for empty notes', async () => {
    const result = await summariseSession('   ');
    expect(result).toBe('');
  });

  it('summariseSession throws when API key is missing', async () => {
    await expect(summariseSession('Patient discussed goals.')).rejects.toThrow('EXPO_PUBLIC_OPENAI_API_KEY');
  });

  it('suggestFollowUps returns empty array for empty summary', async () => {
    const result = await suggestFollowUps('');
    expect(result).toEqual([]);
  });

  it('suggestFollowUps throws when API key is missing', async () => {
    await expect(suggestFollowUps('Session went well.')).rejects.toThrow('EXPO_PUBLIC_OPENAI_API_KEY');
  });
});
