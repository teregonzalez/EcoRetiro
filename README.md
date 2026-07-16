# EcoCircular - Recycling Management System

Aplicacion full-stack para gestion de residuos reciclables con autenticacion por roles.

## Estado actual

- Login con roles: Administrador, PYME y Reciclador.
- Frontend en React con vistas de dashboard separadas por rol.
- Backend en Express con SQLite para autenticacion, solicitudes y residuos.
- Seed disponible para crear usuarios de prueba y datos base.

## Funcionalidades

- Inicio de sesion y registro.
- Creacion de solicitudes de retiro desde PYME.
- Inventario de residuos disponibles para retiro.
- Historial de solicitudes por usuario.
- Catalogo de categorias de residuos activas.

## Stack tecnologico

- Frontend: React 18, TypeScript, Vite, Axios, React Router.
- Backend: Node.js, Express, TypeScript, SQLite3, bcrypt.
- Base de datos: SQLite.

## Estructura del proyecto

- frontend/: aplicacion React.
- backend/: API Express y acceso a base de datos.
- README.md: documentacion principal.

## Requisitos

- Node.js 16 o superior.
- npm.

## Instalacion y ejecucion

1. Instalar dependencias del backend:

   cd backend
   npm install

2. Instalar dependencias del frontend:

   cd ../frontend
   npm install

3. Poblar base de datos con datos de prueba:

   cd ../backend
   npm run seed

4. Levantar backend:

   npm run dev

5. Levantar frontend en otra terminal:

   cd ../frontend
   npm run dev

## Scripts principales

Backend:

- npm run dev
- npm run build
- npm start
- npm run seed

Frontend:

- npm run dev
- npm run build
- npm run preview

## Credenciales de prueba

Contrasena para las cuentas de prueba: password123

- Administrador: test@example.com
- PYME: pyme@elbosque.cl
- Reciclador: reciclador@elbosque.cl

## Endpoints API

Base URL backend local: http://localhost:3000

Salud:

- GET /health

Autenticacion:

- POST /auth/login
- POST /auth/register

Residuos y solicitudes:

- POST /waste/add
  - acepta categoryId o type + userId + weight
- GET /waste/categories
- GET /waste/inventory
- GET /waste/history/:userId

Dashboard:

- Prefijo montado en /dashboard
- Nota: actualmente la ruta existe en el servidor, pero su archivo de handlers esta vacio y requiere implementacion para exponer endpoints de metricas.

## Frontend y proxy

El frontend usa proxy de Vite para enviar peticiones /api al backend local.

Ejemplo:

- /api/auth/login -> http://localhost:3000/auth/login

## Licencia

MIT
