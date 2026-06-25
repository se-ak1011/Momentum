import { createContext, useContext, useMemo, useState } from 'react';
import { buildDashboardMetrics, initialState, type MomentumState } from '../services/momentumStore';
import type { BusinessType, Client, IntakeForm, ProviderProfile, Session, Task, User } from '../types/models';

type AppStage = 'auth' | 'onboarding' | 'app';

interface AppContextValue extends MomentumState {
  stage: AppStage;
  dashboard: ReturnType<typeof buildDashboardMetrics>;
  signIn: (email: string) => void;
  sendMagicLink: (email: string) => void;
  completeOnboarding: (payload: Omit<ProviderProfile, 'businessType'> & { businessType: BusinessType }) => void;
  addClient: (client: Pick<Client, 'name' | 'email'>) => void;
  updateClient: (clientId: string, updates: Partial<Pick<Client, 'name' | 'email'>>) => void;
  archiveClient: (clientId: string) => void;
  addIntakeQuestion: (formId: string, question: string) => void;
  addSession: (session: Omit<Session, 'id'>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  markTaskDone: (taskId: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MomentumState>(initialState);
  const stage: AppStage = state.user ? (state.providerProfile ? 'app' : 'onboarding') : 'auth';

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      stage,
      dashboard: buildDashboardMetrics(state),
      signIn: (email: string) => {
        setState((prev) => ({
          ...prev,
          user: { id: 'u1', email, displayName: email.split('@')[0] ?? 'Provider' } as User,
        }));
      },
      sendMagicLink: () => undefined,
      completeOnboarding: (payload) => {
        setState((prev) => ({
          ...prev,
          providerProfile: payload,
        }));
      },
      addClient: ({ name, email }) => {
        setState((prev) => ({
          ...prev,
          clients: [
            ...prev.clients,
            {
              id: `c${Date.now()}`,
              name,
              email,
              status: 'active',
              onboardingStage: 'new',
              lastContactAt: new Date().toISOString(),
            },
          ],
        }));
      },
      updateClient: (clientId, updates) => {
        setState((prev) => ({
          ...prev,
          clients: prev.clients.map((client) => (client.id === clientId ? { ...client, ...updates } : client)),
        }));
      },
      archiveClient: (clientId) => {
        setState((prev) => ({
          ...prev,
          clients: prev.clients.map((client) =>
            client.id === clientId ? { ...client, status: 'archived' as const } : client,
          ),
        }));
      },
      addIntakeQuestion: (formId, question) => {
        setState((prev) => ({
          ...prev,
          intakeForms: prev.intakeForms.map((form: IntakeForm) =>
            form.id === formId ? { ...form, questions: [...form.questions, question] } : form,
          ),
        }));
      },
      addSession: (session) => {
        setState((prev) => ({
          ...prev,
          sessions: [...prev.sessions, { ...session, id: `s${Date.now()}` }],
        }));
      },
      addTask: (task) => {
        setState((prev) => ({
          ...prev,
          tasks: [...prev.tasks, { ...task, id: `t${Date.now()}` }],
        }));
      },
      markTaskDone: (taskId) => {
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) =>
            task.id === taskId ? { ...task, status: 'done' as const, followUpStatus: 'complete' as const } : task,
          ),
        }));
      },
    }),
    [stage, state],
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
