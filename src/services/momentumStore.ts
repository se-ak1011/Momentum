import type {
  Client,
  ClientSensitiveData,
  DashboardMetrics,
  IntakeForm,
  Plan,
  ProviderProfile,
  Reminder,
  Session,
  Task,
  User,
} from '../types/models';

export interface MomentumState {
  user: User | null;
  providerProfile: ProviderProfile | null;
  clients: Client[];
  sensitiveByClientId: Record<string, ClientSensitiveData>;
  intakeForms: IntakeForm[];
  sessions: Session[];
  tasks: Task[];
  reminders: Reminder[];
  plan: Plan;
}

export const initialState: MomentumState = {
  user: null,
  providerProfile: null,
  clients: [
    {
      id: 'c1',
      name: 'Morgan Lee',
      email: 'morgan@example.com',
      status: 'active',
      onboardingStage: 'complete',
      lastContactAt: new Date().toISOString(),
    },
  ],
  sensitiveByClientId: {
    c1: { privateNotes: '', riskFlags: ['low engagement'] },
  },
  intakeForms: [{ id: 'f1', name: 'Discovery Intake', questions: ['What is your top goal?'], reusable: true }],
  sessions: [],
  tasks: [],
  reminders: [],
  plan: { id: 'starter-plan', tier: 'starter', active: true },
};

export const buildDashboardMetrics = (state: MomentumState): DashboardMetrics => {
  const activeClients = state.clients.filter((client) => client.status === 'active').length;
  const dueTasks = state.tasks.filter((task) => task.status === 'todo').length;
  const overdueFollowUps = state.tasks.filter((task) => task.status === 'overdue').length;

  const churnRiskFlags = Object.values(state.sensitiveByClientId)
    .flatMap((data) => data.riskFlags)
    .slice(0, 5);

  return { activeClients, dueTasks, overdueFollowUps, churnRiskFlags };
};
