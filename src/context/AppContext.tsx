import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  onAuthStateChange,
  sendMagicLink as authSendMagicLink,
  signInWithPassword,
} from '../services/authService';
import {
  fetchClients,
  fetchIntakeForms,
  fetchSessions,
  fetchTasks,
  insertClient,
  insertSession,
  insertTask,
  updateClient as dbUpdateClient,
  updateTaskStatus,
  upsertIntakeForm,
} from '../services/dbService';
import { buildDashboardMetrics, initialState, type MomentumState } from '../services/momentumStore';
import type { BusinessType, Client, IntakeForm, ProviderProfile, Session, Task } from '../types/models';

type AppStage = 'auth' | 'onboarding' | 'app';

interface AppContextValue extends MomentumState {
  stage: AppStage;
  loading: boolean;
  error: string | null;
  dashboard: ReturnType<typeof buildDashboardMetrics>;
  signIn: (email: string, password: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  completeOnboarding: (payload: Omit<ProviderProfile, 'businessType'> & { businessType: BusinessType }) => void;
  addClient: (client: Pick<Client, 'name' | 'email'>) => Promise<void>;
  updateClient: (clientId: string, updates: Partial<Pick<Client, 'name' | 'email'>>) => Promise<void>;
  archiveClient: (clientId: string) => Promise<void>;
  addIntakeQuestion: (formId: string, question: string) => Promise<void>;
  addSession: (session: Omit<Session, 'id'>) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  markTaskDone: (taskId: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MomentumState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedForUser = useRef<string | null>(null);

  const stage: AppStage = state.user
    ? state.providerProfile
      ? 'app'
      : 'onboarding'
    : 'auth';

  // Subscribe to Supabase auth and restore session on mount.
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setState((prev) => ({ ...prev, user: user ?? null }));
    });
    return unsubscribe;
  }, []);

  // Load data from Supabase when a user signs in.
  useEffect(() => {
    const userId = state.user?.id;
    if (!userId || loadedForUser.current === userId) {
      return;
    }
    loadedForUser.current = userId;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [clients, intakeForms] = await Promise.all([fetchClients(userId), fetchIntakeForms(userId)]);

        // Fetch sessions and tasks for all active clients in parallel.
        const activeClientIds = clients.filter((c) => c.status === 'active').map((c) => c.id);
        const [allSessions, allTasks] = await Promise.all([
          Promise.all(activeClientIds.map(fetchSessions)).then((arrs) => arrs.flat()),
          Promise.all(activeClientIds.map(fetchTasks)).then((arrs) => arrs.flat()),
        ]);

        setState((prev) => ({
          ...prev,
          clients: clients.length > 0 ? clients : prev.clients,
          intakeForms: intakeForms.length > 0 ? intakeForms : prev.intakeForms,
          sessions: allSessions,
          tasks: allTasks,
        }));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load data.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [state.user?.id]);

  // ---------------------------------------------------------------------------
  // Action helpers
  // ---------------------------------------------------------------------------

  const withError = useCallback(async (fn: () => Promise<void>) => {
    setError(null);
    try {
      await fn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
    }
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      loading,
      error,
      stage,
      dashboard: buildDashboardMetrics(state),

      signIn: (email, password) =>
        withError(async () => {
          const user = await signInWithPassword(email, password);
          setState((prev) => ({ ...prev, user }));
        }),

      sendMagicLink: (email) =>
        withError(async () => {
          await authSendMagicLink(email);
        }),

      completeOnboarding: (payload) => {
        setState((prev) => ({ ...prev, providerProfile: payload }));
      },

      addClient: (client) =>
        withError(async () => {
          const userId = state.user?.id;
          if (!userId) {
            return;
          }
          const newClient = await insertClient(userId, client);
          setState((prev) => ({ ...prev, clients: [...prev.clients, newClient] }));
        }),

      updateClient: (clientId, updates) =>
        withError(async () => {
          await dbUpdateClient(clientId, updates);
          setState((prev) => ({
            ...prev,
            clients: prev.clients.map((c) => (c.id === clientId ? { ...c, ...updates } : c)),
          }));
        }),

      archiveClient: (clientId) =>
        withError(async () => {
          await dbUpdateClient(clientId, { status: 'archived' });
          setState((prev) => ({
            ...prev,
            clients: prev.clients.map((c) => (c.id === clientId ? { ...c, status: 'archived' as const } : c)),
          }));
        }),

      addIntakeQuestion: (formId, question) =>
        withError(async () => {
          const userId = state.user?.id;
          const form = state.intakeForms.find((f: IntakeForm) => f.id === formId);
          if (!form || !userId) {
            return;
          }
          const updatedForm: IntakeForm = { ...form, questions: [...form.questions, question] };
          await upsertIntakeForm(userId, updatedForm);
          setState((prev) => ({
            ...prev,
            intakeForms: prev.intakeForms.map((f: IntakeForm) => (f.id === formId ? updatedForm : f)),
          }));
        }),

      addSession: (session) =>
        withError(async () => {
          const saved = await insertSession(session);
          setState((prev) => ({ ...prev, sessions: [...prev.sessions, saved] }));
        }),

      addTask: (task) =>
        withError(async () => {
          const saved = await insertTask(task);
          setState((prev) => ({ ...prev, tasks: [...prev.tasks, saved] }));
        }),

      markTaskDone: (taskId) =>
        withError(async () => {
          await updateTaskStatus(taskId, 'done', 'complete');
          setState((prev) => ({
            ...prev,
            tasks: prev.tasks.map((t) =>
              t.id === taskId ? { ...t, status: 'done' as const, followUpStatus: 'complete' as const } : t,
            ),
          }));
        }),
    }),
    [error, loading, stage, state, withError],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
