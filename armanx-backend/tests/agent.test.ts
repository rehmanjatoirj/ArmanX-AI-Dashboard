import request from 'supertest';
import { app } from '../src/server';

const registerUser = async (email: string) => {
  const response = await request(app).post('/api/v1/auth/register').send({
    email,
    password: 'strongpass123',
    fullName: 'Agent User',
  });

  return response.body.token as string;
};

describe('Agent API', () => {
  it('supports CRUD and status actions with auth isolation', async () => {
    const tokenA = await registerUser('agent-a@example.com');
    const tokenB = await registerUser('agent-b@example.com');

    const createResponse = await request(app)
      .post('/api/v1/agents')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'Lead Gen Agent',
        type: 'SCRAPER',
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.name).toBe('Lead Gen Agent');
    const agentId = createResponse.body.id;

    const listResponse = await request(app).get('/api/v1/agents').set('Authorization', `Bearer ${tokenA}`);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);

    const updateResponse = await request(app)
      .put(`/api/v1/agents/${agentId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'Updated Agent' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe('Updated Agent');

    const startResponse = await request(app)
      .post(`/api/v1/agents/${agentId}/start`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(startResponse.status).toBe(200);
    expect(startResponse.body.status).toBe('running');

    const pauseResponse = await request(app)
      .post(`/api/v1/agents/${agentId}/pause`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(pauseResponse.status).toBe(200);
    expect(pauseResponse.body.status).toBe('paused');

    const foreignGetResponse = await request(app)
      .get(`/api/v1/agents/${agentId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(foreignGetResponse.status).toBe(404);
  });
});
