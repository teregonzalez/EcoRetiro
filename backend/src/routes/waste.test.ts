import express from 'express';
import request from 'supertest';
import wasteRouter from './waste';
import { dbAll, dbGet, dbRun } from '../models/database';

jest.mock('../models/database', () => ({
  dbRun: jest.fn(),
  dbGet: jest.fn(),
  dbAll: jest.fn(),
}));

const mockedDbGet = dbGet as jest.MockedFunction<typeof dbGet>;
const mockedDbRun = dbRun as jest.MockedFunction<typeof dbRun>;
const mockedDbAll = dbAll as jest.MockedFunction<typeof dbAll>;

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/waste', wasteRouter);
  return app;
};

describe('waste routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /waste/add returns 400 for missing required fields', async () => {
    const app = buildApp();
    const res = await request(app).post('/waste/add').send({ userId: 1 });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Faltan campos');
  });

  test('POST /waste/add resolves category by type alias and creates entry', async () => {
    mockedDbGet
      .mockResolvedValueOnce({ ID_Categoria: 5 })
      .mockResolvedValueOnce({ ID_Empresa: 10 });
    mockedDbRun.mockResolvedValue(undefined);

    const app = buildApp();
    const res = await request(app).post('/waste/add').send({
      userId: 3,
      type: 'plastic',
      weight: 45,
      pickupDate: '2026-08-13T12:00:00.000Z',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockedDbRun).toHaveBeenCalledTimes(1);
  });

  test('POST /waste/add returns 400 when category is not found', async () => {
    mockedDbGet.mockResolvedValueOnce(undefined);
    const app = buildApp();

    const res = await request(app).post('/waste/add').send({
      userId: 3,
      type: 'unknown',
      weight: 20,
      pickupDate: '2026-08-13T12:00:00.000Z',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('no encontrada');
  });

  test('POST /waste/add returns 400 for invalid pickupDate', async () => {
    mockedDbGet.mockResolvedValueOnce({ ID_Empresa: 10 });
    const app = buildApp();

    const res = await request(app).post('/waste/add').send({
      userId: 3,
      categoryId: 7,
      weight: 20,
      pickupDate: 'not-a-date',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('pickupDate invalida');
  });

  test('GET /waste/categories returns active categories', async () => {
    mockedDbAll.mockResolvedValueOnce([{ id: 1, name: 'Metal', unit: 'kg' }]);
    const app = buildApp();
    const res = await request(app).get('/waste/categories');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('GET /waste/inventory returns grouped inventory', async () => {
    mockedDbAll.mockResolvedValueOnce([{ type: 'Metal', totalWeight: 10, unit: 'kg', count: 1 }]);
    const app = buildApp();
    const res = await request(app).get('/waste/inventory');

    expect(res.status).toBe(200);
    expect(res.body[0].type).toBe('Metal');
  });

  test('GET /waste/history/:userId returns empty when no company exists', async () => {
    mockedDbGet.mockResolvedValueOnce(undefined);
    const app = buildApp();

    const res = await request(app).get('/waste/history/33');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('GET /waste/history/:userId returns history entries for company', async () => {
    mockedDbGet.mockResolvedValueOnce({ ID_Empresa: 10 });
    mockedDbAll.mockResolvedValueOnce([
      { id: 1, type: 'Metal', weight: 30, unit: 'kg', status: 'Disponible', date: '2026-08-13', certificate: null },
    ]);
    const app = buildApp();

    const res = await request(app).get('/waste/history/10');
    expect(res.status).toBe(200);
    expect(res.body[0].type).toBe('Metal');
  });
});
