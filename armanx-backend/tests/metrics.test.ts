import request from 'supertest';
import { app } from '../src/server';

describe('Metrics API', () => {
  it('returns dashboard metrics and funnel stages', async () => {
    const authResponse = await request(app).post('/api/v1/auth/register').send({
      email: 'metrics@example.com',
      password: 'strongpass123',
      fullName: 'Metrics User',
    });

    const token = authResponse.body.token as string;

    const agentResponse = await request(app)
      .post('/api/v1/agents')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Metrics Agent', type: 'SCRAPER' });

    const agentId = agentResponse.body.id as string;

    await request(app)
      .post('/api/v1/leads/bulk')
      .set('Authorization', `Bearer ${token}`)
      .send({
        leads: [
          {
            agentId,
            linkedinUrl: 'https://linkedin.com/in/fatima',
            fullName: 'Fatima Al-Said',
            jobTitle: 'HR Director',
            company: 'Dubai Digital Hub',
            status: 'CONTACTED',
          },
          {
            agentId,
            linkedinUrl: 'https://linkedin.com/in/omar',
            fullName: 'Omar Sheikh',
            jobTitle: 'Head of Growth',
            company: 'Karachi Tech Hub',
            status: 'REPLIED',
          },
          {
            agentId,
            linkedinUrl: 'https://linkedin.com/in/nadia',
            fullName: 'Nadia Al-Rashid',
            jobTitle: 'Ops Head',
            company: 'Abu Dhabi Fintech',
            status: 'MEETING_BOOKED',
          },
        ],
      });

    const dashboardResponse = await request(app)
      .get('/api/v1/metrics/dashboard')
      .set('Authorization', `Bearer ${token}`);
    expect(dashboardResponse.status).toBe(200);
    expect(dashboardResponse.body).toHaveProperty('scrapedToday');
    expect(dashboardResponse.body).toHaveProperty('deltas');

    const funnelResponse = await request(app)
      .get('/api/v1/metrics/funnel')
      .set('Authorization', `Bearer ${token}`);
    expect(funnelResponse.status).toBe(200);
    expect(funnelResponse.body).toHaveLength(5);
    expect(funnelResponse.body[0]).toHaveProperty('stage');
  });
});
