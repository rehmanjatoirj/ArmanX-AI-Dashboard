import request from 'supertest';
import { app } from '../src/server';

const registerAndCreateAgent = async () => {
  const authResponse = await request(app).post('/api/v1/auth/register').send({
    email: 'lead-user@example.com',
    password: 'strongpass123',
    fullName: 'Lead User',
  });

  const token = authResponse.body.token as string;
  const agentResponse = await request(app)
    .post('/api/v1/agents')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Lead Agent', type: 'SCRAPER' });

  return { token, agentId: agentResponse.body.id as string };
};

describe('Lead API', () => {
  it('supports CRUD, bulk create, pagination, and filters', async () => {
    const { token, agentId } = await registerAndCreateAgent();

    const createResponse = await request(app)
      .post('/api/v1/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        agentId,
        linkedinUrl: 'https://linkedin.com/in/ali-hassan',
        fullName: 'Ali Hassan',
        jobTitle: 'CTO',
        company: 'TechPK Solutions',
      });

    expect(createResponse.status).toBe(201);
    const leadId = createResponse.body.id;

    const bulkResponse = await request(app)
      .post('/api/v1/leads/bulk')
      .set('Authorization', `Bearer ${token}`)
      .send({
        leads: [
          {
            agentId,
            linkedinUrl: 'https://linkedin.com/in/sara-ahmed',
            fullName: 'Sara Ahmed',
            jobTitle: 'VP Sales',
            company: 'Gulf Ventures LLC',
            status: 'CONTACTED',
          },
          {
            agentId,
            linkedinUrl: 'https://linkedin.com/in/usman-malik',
            fullName: 'Usman Malik',
            jobTitle: 'Founder & CEO',
            company: 'Lahore SaaS Co',
            status: 'REPLIED',
          },
        ],
      });

    expect(bulkResponse.status).toBe(201);
    expect(bulkResponse.body).toHaveLength(2);

    const listResponse = await request(app)
      .get('/api/v1/leads?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(2);

    const filteredResponse = await request(app)
      .get('/api/v1/leads?status=REPLIED')
      .set('Authorization', `Bearer ${token}`);
    expect(filteredResponse.status).toBe(200);
    expect(filteredResponse.body).toHaveLength(1);

    const updateResponse = await request(app)
      .put(`/api/v1/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'MEETING_BOOKED' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe('MEETING_BOOKED');

    const exportResponse = await request(app)
      .get('/api/v1/leads/export/csv')
      .set('Authorization', `Bearer ${token}`);
    expect(exportResponse.status).toBe(200);
    expect(exportResponse.header['content-type']).toContain('text/csv');

    const deleteResponse = await request(app)
      .delete(`/api/v1/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteResponse.status).toBe(204);
  });
});
