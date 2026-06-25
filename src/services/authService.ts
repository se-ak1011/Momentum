import type { Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';
import type { User } from '../types/models';
import { supabase } from './supabaseClient';

/**
 * Map a Supabase User object to the app's User model.
 */
export const mapSupabaseUser = (user: SupabaseUser): User => ({
  id: user.id,
  email: user.email ?? '',
  displayName: user.user_metadata?.['display_name'] ?? user.email?.split('@')[0] ?? 'Provider',
});

/**
 * Sign in with email and password using Supabase Auth.
 * Returns the app User on success, throws on error.
 */
export const signInWithPassword = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    throw new Error(error?.message ?? 'Sign-in failed.');
  }
  return mapSupabaseUser(data.user);
};

/**
 * Send a magic-link email using Supabase Auth OTP.
 */
export const sendMagicLink = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign out the current session.
 */
export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Get the currently active session, if any.
 */
export const getSession = async (): Promise<SupabaseSession | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 */
export const onAuthStateChange = (
  callback: (user: User | null) => void,
): (() => void) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? mapSupabaseUser(session.user) : null);
  });
  return () => subscription.unsubscribe();
};
