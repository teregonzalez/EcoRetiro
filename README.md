# EcoCircular - Recycling Management System

Aplicación full-stack para la gestión de residuos reciclables con autenticación por roles, trazabilidad y dashboards específicos por tipo de usuario.

## Estado actual

- Autenticación con JWT en backend y consumo desde frontend.
- Login con roles: Administrador, PYME y Reciclador.
- Frontend en React con dashboards separados por rol.
- Backend en Express + SQLite para autenticación, solicitudes, residuos y métricas.
- Vista de usuarios integrada en el dashboard de Administrador.
- Exportación de reportes en PDF desde la vista de reportes siguiendo el estilo del documento HTML de reporte.
- Seed disponible para crear usuarios y datos base de prueba.

## Funcionalidades

- Inicio de sesión y registro de usuarios.
- Autenticación segura con JWT y almacenamiento del token en el cliente.
- Dashboard de administrador con métricas generales, gestión de usuarios y reportes.
- Dashboard PYME con ingreso de residuos, historial y métricas.
- Dashboard Reciclador con inventario disponible, rutas y gestión de recolección.
- Exportación de reportes PDF desde la vista de reportes.
- Catálogo de categorías de residuos activas.
- Base de datos SQLite con datos de prueba.

## Stack tecnológico

- Frontend: React 18, TypeScript, Vite, Axios, React Router.
- Backend: Node.js, Express, TypeScript, SQLite3, bcrypt, JWT.
- Base de datos: SQLite.
- Testing: Jest + Supertest + Testing Library.

## Estructura del proyecto

- frontend/: aplicación React.
- backend/: API Express, validación JWT y acceso a base de datos.
- README.md: documentación principal.
- bdd_model.puml: modelo de dominio y relaciones principales.
- diagramas/: diagramas de arquitectura y procesos.

## Requisitos

- Node.js 18 o superior.
- npm.

## Instalación y ejecución

1. Instalar dependencias del backend:

   cd backend
   npm install

2. Instalar dependencias del frontend:

   cd ../frontend
   npm install

3. Poblar la base de datos con datos de prueba:

   cd ../backend
   npm run seed

4. Levantar el backend:

   npm run dev

5. Levantar el frontend en otra terminal:

   cd ../frontend
   npm run dev

## Scripts principales

Backend:

- npm run dev
- npm run build
- npm start
- npm run seed
- npm test

Frontend:

- npm run dev
- npm run build
- npm run preview
- npm test

## Credenciales de prueba

Contraseña para las cuentas de prueba: password123

- Administrador: test@example.com
- PYME: pyme@elbosque.cl
- Reciclador: reciclador@elbosque.cl

## Endpoints API

Base URL backend local: http://localhost:3000

Salud:

- GET /health

Autenticación:

- POST /auth/login
- POST /auth/register

Residuos y solicitudes:

- POST /waste/add
  - acepta categoryId o type + userId + weight
- GET /waste/categories
- GET /waste/inventory
- GET /waste/history/:userId

Dashboard:

- GET /dashboard/admin
- GET /dashboard/pyme/:userId
- GET /dashboard/reciclador/:userId

> Todas las rutas de dashboard están protegidas por JWT mediante Bearer token.

## Frontend y proxy

El frontend usa proxy de Vite para enviar peticiones /api al backend local.

Ejemplo:

- /api/auth/login -> http://localhost:3000/auth/login
- /api/dashboard/admin -> http://localhost:3000/dashboard/admin

## Autenticación JWT

La API ya está preparada para JWT:

- El backend firma un token al iniciar sesión.
- El frontend lo guarda en localStorage y lo reutiliza.
- El cliente agrega el token en el header Authorization en cada request autenticado.
- Las rutas protegidas validan el token antes de servir la información del dashboard.

## Exportación de reportes

La vista de reportes incluye un botón de exportación que genera una venta emergente con el contenido HTML del reporte y dispara la impresión del navegador, lo que permite exportarlo como PDF desde la ventana del navegador.

## Licencia

MIT
