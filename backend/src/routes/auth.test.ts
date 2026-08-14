import express from 'express';
import request from 'supertest';
import bcrypt from 'bcrypt';
import authRouter from './auth';
import { dbGet, dbRun } from '../models/database';

jest.mock('bcrypt');
jest.mock('../models/database', () => ({
  dbGet: jest.fn(),
  dbRun: jest.fn(),
}));

const mockedDbGet = dbGet as jest.MockedFunction<typeof dbGet>;
const mockedDbRun = dbRun as jest.MockedFunction<typeof dbRun>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/auth', authRouter);
  return app;
};

describe('auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /auth/login returns 400 when missing credentials', async () => {
    const app = buildApp();
    const res = await request(app).post('/auth/login').send({ correo: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('requeridos');
  });

  test('POST /auth/login returns 401 when user does not exist', async () => {
    mockedDbGet.mockResolvedValueOnce(undefined);
    const app = buildApp();

    const res = await request(app)
      .post('/auth/login')
      .send({ correo: 'x@test.com', password: 'secret' });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Credenciales');
  });

  test('POST /auth/login returns mapped role when credentials are valid', async () => {
    mockedDbGet.mockResolvedValueOnce({
      ID_Usuario: 10,
      Correo: 'pyme@test.com',
      Contrasena: 'hashed',
      Estado_Cuenta: 'Aprobada',
      Nombre_Rol: 'Empresa_Generadora',
    });
    mockedBcrypt.compare.mockResolvedValueOnce(true as never);

    const app = buildApp();
    const res = await request(app)
      .post('/auth/login')
      .send({ correo: 'pyme@test.com', password: 'secret' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.rol).toBe('PYME');
    expect(res.body.rolInterno).toBe('Empresa_Generadora');
  });

  test('POST /auth/register creates PYME user and company', async () => {
    mockedBcrypt.hash.mockResolvedValueOnce('hashed-pass' as never);
    mockedDbRun.mockResolvedValue(undefined);
    mockedDbGet.mockResolvedValueOnce({ ID_Usuario: 99 });

    const app = buildApp();
    const res = await request(app).post('/auth/register').send({
      rutEmpresa: '12345678-9',
      razonSocial: 'Empresa Test',
      correo: 'new@pyme.com',
      password: 'secret',
      nombreContacto: 'Contacto Test',
      telefono: '1234567',
      rol: 'pyme',
      direccionGeolocalizacion: 'Santiago',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockedDbRun).toHaveBeenCalledWith('BEGIN TRANSACTION');
    expect(mockedDbRun).toHaveBeenCalledWith('COMMIT');
    expect(mockedDbRun).toHaveBeenCalledTimes(4);
  });

  test('POST /auth/register returns 400 for company role without rut/razon', async () => {
    const app = buildApp();
    const res = await request(app).post('/auth/register').send({
      correo: 'new@pyme.com',
      password: 'secret',
      nombreContacto: 'Contacto Test',
      rol: 'pyme',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('RUT');
  });

  test('POST /auth/register handles unique constraint with rollback', async () => {
    mockedBcrypt.hash.mockResolvedValueOnce('hashed-pass' as never);
    mockedDbRun
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('UNIQUE constraint failed: Usuarios.Correo'))
      .mockResolvedValueOnce(undefined);

    const app = buildApp();
    const res = await request(app).post('/auth/register').send({
      correo: 'dup@test.com',
      password: 'secret',
      nombreContacto: 'Contacto Test',
      rol: 'administrador',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('ya se encuentra registrado');
    expect(mockedDbRun).toHaveBeenLastCalledWith('ROLLBACK');
  });
});
