const request = require('supertest');
const app = require('../server');

describe('Basic API tests', () => {
  test('GET /api/bookings without token should be unauthorized', async () => {
    const res = await request(app).get('/api/bookings');
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/events without token should be unauthorized', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({
        title: 'Test Event',
        description: 'Test Description',
        venue: 'Test Venue',
        eventDate: '2026-12-10T18:00:00.000Z',
        category: 'Music',
        totalTickets: 100,
        price: 50
      });

    expect(res.statusCode).toBe(401);
  });

  test('POST /api/tickets without token should be unauthorized', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .send({
        eventId: '123456789012345678901234',
        name: 'VIP',
        price: 100,
        quantityAvailable: 10
      });

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/auth/profile without token should be unauthorized', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.statusCode).toBe(401);
  });
});