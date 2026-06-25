import { buildDashboardMetrics, initialState } from './momentumStore';

describe('buildDashboardMetrics', () => {
  it('computes dashboard values for active clients and follow-ups', () => {
    const metrics = buildDashboardMetrics({
      ...initialState,
      tasks: [
        {
          id: 't1',
          clientId: 'c1',
          title: 'Homework',
          dueDate: new Date().toISOString(),
          status: 'todo',
          followUpStatus: 'pending',
        },
        {
          id: 't2',
          clientId: 'c1',
          title: 'Follow-up',
          dueDate: new Date().toISOString(),
          status: 'overdue',
          followUpStatus: 'sent',
        },
      ],
    });

    expect(metrics.activeClients).toBe(1);
    expect(metrics.dueTasks).toBe(1);
    expect(metrics.overdueFollowUps).toBe(1);
    expect(metrics.churnRiskFlags).toContain('low engagement');
  });
});
