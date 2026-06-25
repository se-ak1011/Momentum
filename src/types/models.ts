export type BusinessType = 'consulting' | 'coaching' | 'psychology';

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface ProviderProfile {
  name: string;
  businessType: BusinessType;
  brandColor: string;
  workflowName: string;
}

export interface ClientSensitiveData {
  privateNotes?: string;
  riskFlags: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'archived';
  onboardingStage: 'new' | 'in_progress' | 'complete';
  lastContactAt?: string;
}

export interface IntakeForm {
  id: string;
  name: string;
  questions: string[];
  reusable: boolean;
}

export interface Session {
  id: string;
  clientId: string;
  date: string;
  notes: string;
  summary: string;
  nextSteps: string;
}

export interface Task {
  id: string;
  clientId: string;
  title: string;
  dueDate: string;
  status: 'todo' | 'done' | 'overdue';
  followUpStatus: 'pending' | 'sent' | 'complete';
}

export interface Reminder {
  id: string;
  taskId: string;
  notifyAt: string;
  channel: 'push' | 'email';
}

export interface Plan {
  id: string;
  tier: 'starter' | 'pro';
  stripePriceId?: string;
  active: boolean;
}

export interface DashboardMetrics {
  activeClients: number;
  dueTasks: number;
  overdueFollowUps: number;
  churnRiskFlags: string[];
}
