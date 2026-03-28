import request from 'supertest';
import { app } from '../src/server';

describe('Auth API', () => {
  it('registers a user and returns tokens', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      email: 'arman@example.com',
      password: 'strongpass123',
      fullName: 'Arman Khan',
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    expect(response.body.user.email).toBe('arman@example.com');
    expect(response.body.user.hashedPassword).toBeUndefined();
  });

  it('logs in an existing user', async () => {
    await request(app).post('/api/v1/auth/register').send({
      email: 'login@example.com',
      password: 'strongpass123',
      fullName: 'Login User',
    });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'login@example.com',
      password: 'strongpass123',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.fullName).toBe('Login User');
  });

  it('returns current user from /me', async () => {
    const registerResponse = await request(app).post('/api/v1/auth/register').send({
      email: 'me@example.com',
      password: 'strongpass123',
      fullName: 'Profile User',
    });

    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${registerResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe('me@example.com');
  });

  it('rejects unauthorized /me requests', async () => {
    const response = await request(app).get('/api/v1/auth/me');

    expect(response.status).toBe(401);
  });
});
