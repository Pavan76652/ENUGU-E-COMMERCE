import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

const apiBase = '/api/v1/auth';

const registerPayload = (overrides = {}) => ({
  firstName: 'Aria',
  lastName: 'Stark',
  email: `aria${Date.now()}${Math.random().toString(16).slice(2)}@example.com`,
  password: 'Password123',
  ...overrides,
});

describe('Auth API', () => {
  it('registers a new customer and returns an access token + refresh cookie', async () => {
    const payload = registerPayload();
    const res = await request(app).post(`${apiBase}/register`).send(payload);

    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe(payload.email);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(res.body.data.user.isEmailVerified).toBe(false);

    const cookies = res.headers['set-cookie'] ?? [];
    expect(cookies.some((c) => c.startsWith('refreshToken='))).toBe(true);
  });

  it('rejects duplicate email registration', async () => {
    const payload = registerPayload();
    await request(app).post(`${apiBase}/register`).send(payload);
    const res = await request(app).post(`${apiBase}/register`).send(payload);

    expect(res.status).toBe(409);
  });

  it('logs in with valid credentials and rejects bad passwords', async () => {
    const payload = registerPayload();
    await request(app).post(`${apiBase}/register`).send(payload);

    const ok = await request(app)
      .post(`${apiBase}/login/customer`)
      .send({ email: payload.email, password: payload.password });
    expect(ok.status).toBe(200);
    expect(ok.body.data.accessToken).toBeTruthy();

    const bad = await request(app)
      .post(`${apiBase}/login/customer`)
      .send({ email: payload.email, password: 'WrongPass123' });
    expect(bad.status).toBe(401);
  });

  it('refreshes the access token using the refresh cookie', async () => {
    const payload = registerPayload();
    const reg = await request(app).post(`${apiBase}/register`).send(payload);
    const cookie = reg.headers['set-cookie'];

    const res = await request(app).post(`${apiBase}/refresh-token`).set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeTruthy();
  });
});
