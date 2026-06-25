export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  openAiKeySet: Boolean(process.env.EXPO_PUBLIC_OPENAI_API_KEY),
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.example.com',
  analyticsKey: process.env.EXPO_PUBLIC_ANALYTICS_KEY ?? '',
};
