import express from 'express';
import request from 'supertest';
import dashboardRouter from './dashboard';
import { dbAll, dbGet } from '../models/database';

jest.mock('../models/database', () => ({
  dbGet: jest.fn(),
  dbAll: jest.fn(),
}));

const mockedDbGet = dbGet as jest.MockedFunction<typeof dbGet>;
const mockedDbAll = dbAll as jest.MockedFunction<typeof dbAll>;

const buildApp = () => {
  const app = express();
  app.use('/dashboard', dashboardRouter);
  return app;
};

describe('dashboard routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /dashboard/admin returns metrics and mapped roles', async () => {
    mockedDbGet
      .mockResolvedValueOnce({ total: 7 })
      .mockResolvedValueOnce({ total: 2 })
      .mockResolvedValueOnce({ total: 1500 });
    mockedDbAll
      .mockResolvedValueOnce([
        { id: 1, empresa: 'Eco SA', rolInterno: 'Empresa_Recicladora', estado: 'Aprobada', registro: '2026-01-01' },
      ])
      .mockResolvedValueOnce([{ type: 'Metal', total: 300 }]);

    const app = buildApp();
    const res = await request(app).get('/dashboard/admin');

    expect(res.status).toBe(200);
    expect(res.body.metrics.totalUsers).toBe(7);
    expect(res.body.metrics.totalWasteTon).toBe(1.5);
    expect(res.body.users[0].rol).toBe('Reciclador');
  });

  test('GET /dashboard/pyme/:userId returns empty payload when company does not exist', async () => {
    mockedDbGet.mockResolvedValueOnce({ ID_Empresa: null });
    const app = buildApp();

    const res = await request(app).get('/dashboard/pyme/8');
    expect(res.status).toBe(200);
    expect(res.body.profile).toBeNull();
    expect(res.body.history).toEqual([]);
  });

  test('GET /dashboard/pyme/:userId returns profile, metrics and history', async () => {
    mockedDbGet
      .mockResolvedValueOnce({
        empresa: 'Pyme Uno',
        contacto: 'Ana',
        telefono: '123',
        ubicacion: 'El Bosque',
        ID_Empresa: 15,
      })
      .mockResolvedValueOnce({ totalWeight: 250, totalEntries: 4 });

    mockedDbAll.mockResolvedValueOnce([
      { id: 1, fecha: '2026-01-01', tipo: 'Metal', cantidad: 100, unidad: 'kg', estado: 'Disponible' },
    ]);

    const app = buildApp();
    const res = await request(app).get('/dashboard/pyme/15');

    expect(res.status).toBe(200);
    expect(res.body.metrics.totalEntries).toBe(4);
    expect(res.body.metrics.co2Saved).toBe(450);
  });

  test('GET /dashboard/reciclador/:userId returns defaults when recycler company missing', async () => {
    mockedDbGet.mockResolvedValueOnce(undefined);
    const app = buildApp();

    const res = await request(app).get('/dashboard/reciclador/2');
    expect(res.status).toBe(200);
    expect(res.body.metrics.capacityTotal).toBe(0);
  });

  test('GET /dashboard/reciclador/:userId returns recycler metrics and collections', async () => {
    mockedDbGet
      .mockResolvedValueOnce({ ID_Empresa: 44 })
      .mockResolvedValueOnce({ total: 3 })
      .mockResolvedValueOnce({ total: 1 });

    mockedDbAll
      .mockResolvedValueOnce([{ material: 'Metal', total: 200, unit: 'kg' }])
      .mockResolvedValueOnce([
        { id: 10, fecha: '2026-08-10T10:00:00', origen: 'Pyme Uno', material: 'Metal', cantidad: 50, unidad: 'kg', estado: 'En camino' },
      ])
      .mockResolvedValueOnce([{ material: 'Metal', percent: 80 }]);

    const app = buildApp();
    const res = await request(app).get('/dashboard/reciclador/44');

    expect(res.status).toBe(200);
    expect(res.body.metrics.processedToday).toBe(3);
    expect(res.body.metrics.capacityTotal).toBe(100);
    expect(res.body.capacity[0].percent).toBe(80);
  });
});
