import type { Client, IntakeForm, Session, Task } from '../types/models';
import { supabase } from './supabaseClient';

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

export const fetchClients = async (userId: string): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('id, name, email, status, onboarding_stage, last_contact_at')
    .eq('provider_id', userId)
    .order('last_contact_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    status: row.status as Client['status'],
    onboardingStage: row.onboarding_stage as Client['onboardingStage'],
    lastContactAt: row.last_contact_at as string | undefined,
  }));
};

export const insertClient = async (userId: string, client: Pick<Client, 'name' | 'email'>): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .insert({
      provider_id: userId,
      name: client.name,
      email: client.email,
      status: 'active',
      onboarding_stage: 'new',
      last_contact_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Insert failed.');
  }

  return {
    id: data.id as string,
    name: data.name as string,
    email: data.email as string,
    status: data.status as Client['status'],
    onboardingStage: data.onboarding_stage as Client['onboardingStage'],
    lastContactAt: data.last_contact_at as string | undefined,
  };
};

export const updateClient = async (clientId: string, updates: Partial<Pick<Client, 'name' | 'email' | 'status'>>): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .update({
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.email !== undefined && { email: updates.email }),
      ...(updates.status !== undefined && { status: updates.status }),
    })
    .eq('id', clientId);

  if (error) {
    throw new Error(error.message);
  }
};

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export const fetchSessions = async (clientId: string): Promise<Session[]> => {
  const { data, error } = await supabase
    .from('sessions')
    .select('id, client_id, date, notes, summary, next_steps')
    .eq('client_id', clientId)
    .order('date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    clientId: row.client_id as string,
    date: row.date as string,
    notes: row.notes as string,
    summary: row.summary as string,
    nextSteps: row.next_steps as string,
  }));
};

export const insertSession = async (session: Omit<Session, 'id'>): Promise<Session> => {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      client_id: session.clientId,
      date: session.date,
      notes: session.notes,
      summary: session.summary,
      next_steps: session.nextSteps,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Insert failed.');
  }

  return {
    id: data.id as string,
    clientId: data.client_id as string,
    date: data.date as string,
    notes: data.notes as string,
    summary: data.summary as string,
    nextSteps: data.next_steps as string,
  };
};

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export const fetchTasks = async (clientId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('id, client_id, title, due_date, status, follow_up_status')
    .eq('client_id', clientId)
    .order('due_date', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    clientId: row.client_id as string,
    title: row.title as string,
    dueDate: row.due_date as string,
    status: row.status as Task['status'],
    followUpStatus: row.follow_up_status as Task['followUpStatus'],
  }));
};

export const insertTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      client_id: task.clientId,
      title: task.title,
      due_date: task.dueDate,
      status: task.status,
      follow_up_status: task.followUpStatus,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Insert failed.');
  }

  return {
    id: data.id as string,
    clientId: data.client_id as string,
    title: data.title as string,
    dueDate: data.due_date as string,
    status: data.status as Task['status'],
    followUpStatus: data.follow_up_status as Task['followUpStatus'],
  };
};

export const updateTaskStatus = async (taskId: string, status: Task['status'], followUpStatus: Task['followUpStatus']): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ status, follow_up_status: followUpStatus })
    .eq('id', taskId);

  if (error) {
    throw new Error(error.message);
  }
};

// ---------------------------------------------------------------------------
// Intake forms
// ---------------------------------------------------------------------------

export const fetchIntakeForms = async (userId: string): Promise<IntakeForm[]> => {
  const { data, error } = await supabase
    .from('intake_forms')
    .select('id, name, questions, reusable')
    .eq('provider_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    questions: (row.questions as string[]) ?? [],
    reusable: row.reusable as boolean,
  }));
};

export const upsertIntakeForm = async (userId: string, form: IntakeForm): Promise<void> => {
  const { error } = await supabase.from('intake_forms').upsert({
    id: form.id,
    provider_id: userId,
    name: form.name,
    questions: form.questions,
    reusable: form.reusable,
  });

  if (error) {
    throw new Error(error.message);
  }
};
