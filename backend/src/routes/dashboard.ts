import express from 'express';
import { dbAll, dbGet } from '../models/database.js';

const router = express.Router();

router.get('/admin', async (_req, res) => {
	try {
		const totalUsersRow = await dbGet('SELECT COUNT(*) AS total FROM Usuarios');
		const pendingRequestsRow = await dbGet(
			`SELECT COUNT(*) AS total
			 FROM Usuarios
			 WHERE Estado_Cuenta = 'Pendiente'`
		);
		const totalWasteRow = await dbGet(
			`SELECT COALESCE(SUM(Volumen_Cantidad), 0) AS total
			 FROM Solicitudes_Retiro`
		);

		const users = await dbAll(
			`SELECT
				u.ID_Usuario AS id,
				COALESCE(e.Razon_Social, u.Nombre_Contacto) AS empresa,
				r.Nombre_Rol AS rolInterno,
				u.Estado_Cuenta AS estado,
				u.Fecha_Registro AS registro
			 FROM Usuarios u
			 JOIN Roles r ON r.ID_Rol = u.ID_Rol
			 LEFT JOIN Empresas e ON e.ID_Usuario = u.ID_Usuario
			 ORDER BY u.Fecha_Registro DESC
			 LIMIT 20`
		);

		const wasteTrend = await dbAll(
			`SELECT
				c.Nombre_Residuo AS type,
				ROUND(SUM(s.Volumen_Cantidad), 2) AS total
			 FROM Solicitudes_Retiro s
			 JOIN Catalogo_Residuos c ON c.ID_Categoria = s.ID_Categoria
			 GROUP BY c.ID_Categoria, c.Nombre_Residuo
			 ORDER BY total DESC`
		);

		res.json({
			metrics: {
				totalUsers: totalUsersRow?.total || 0,
				pendingRequests: pendingRequestsRow?.total || 0,
				totalWasteTon: Number((Number(totalWasteRow?.total || 0) / 1000).toFixed(2)),
			},
			users: users.map((u) => ({
				id: u.id,
				empresa: u.empresa,
				rol:
					u.rolInterno === 'Administrador'
						? 'Administrador'
						: u.rolInterno === 'Empresa_Recicladora'
							? 'Reciclador'
							: 'PYME',
				estado: u.estado,
				registro: u.registro,
			})),
			wasteTrend,
		});
	} catch (error) {
		console.error('Error en /dashboard/admin:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
});

router.get('/pyme/:userId', async (req, res) => {
	try {
		const userId = Number(req.params.userId);

		const profile = await dbGet(
			`SELECT
				e.Razon_Social AS empresa,
				u.Nombre_Contacto AS contacto,
				COALESCE(u.Telefono, '') AS telefono,
				COALESCE(e.Direccion_Geolocalizacion, '') AS ubicacion,
				e.ID_Empresa
			 FROM Usuarios u
			 LEFT JOIN Empresas e ON e.ID_Usuario = u.ID_Usuario
			 WHERE u.ID_Usuario = ?`,
			[userId]
		);

		if (!profile?.ID_Empresa) {
			return res.json({
				profile: null,
				metrics: { totalWeight: 0, totalEntries: 0, co2Saved: 0 },
				history: [],
			});
		}

		const metricsRow = await dbGet(
			`SELECT
				COALESCE(SUM(Volumen_Cantidad), 0) AS totalWeight,
				COUNT(*) AS totalEntries
			 FROM Solicitudes_Retiro
			 WHERE ID_Empresa_Generadora = ?`,
			[profile.ID_Empresa]
		);

		const history = await dbAll(
			`SELECT
				s.ID_Solicitud AS id,
				s.Fecha_Publicacion AS fecha,
				c.Nombre_Residuo AS tipo,
				s.Volumen_Cantidad AS cantidad,
				c.Unidad_Medida AS unidad,
				s.Estado_Tracking AS estado
			 FROM Solicitudes_Retiro s
			 JOIN Catalogo_Residuos c ON c.ID_Categoria = s.ID_Categoria
			 WHERE s.ID_Empresa_Generadora = ?
			 ORDER BY s.Fecha_Publicacion DESC
			 LIMIT 30`,
			[profile.ID_Empresa]
		);

		const totalWeight = Number(metricsRow?.totalWeight || 0);

		res.json({
			profile: {
				empresa: profile.empresa || '',
				contacto: profile.contacto || '',
				telefono: profile.telefono || '',
				ubicacion: profile.ubicacion || '',
			},
			metrics: {
				totalWeight,
				totalEntries: Number(metricsRow?.totalEntries || 0),
				co2Saved: Number((totalWeight * 1.8).toFixed(2)),
			},
			history,
		});
	} catch (error) {
		console.error('Error en /dashboard/pyme/:userId:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
});

router.get('/reciclador/:userId', async (req, res) => {
	try {
		const userId = Number(req.params.userId);

		const empresaRecicladora = await dbGet(
			`SELECT ID_Empresa
			 FROM Empresas
			 WHERE ID_Usuario = ?`,
			[userId]
		);

		if (!empresaRecicladora?.ID_Empresa) {
			return res.json({
				metrics: { processedToday: 0, activeCollections: 0, capacityTotal: 0, openAlerts: 0 },
				nearbyWaste: [],
				collectionHistory: [],
				capacity: [],
			});
		}

		const processedTodayRow = await dbGet(
			`SELECT COUNT(*) AS total
			 FROM Solicitudes_Retiro
			 WHERE ID_Empresa_Recicladora = ?
				 AND Estado_Tracking = 'Gestionado'
				 AND date(Fecha_Procesamiento) = date('now')`,
			[empresaRecicladora.ID_Empresa]
		);

		const activeCollectionsRow = await dbGet(
			`SELECT COUNT(*) AS total
			 FROM Solicitudes_Retiro
			 WHERE ID_Empresa_Recicladora = ?
				 AND Estado_Tracking = 'En camino'`,
			[empresaRecicladora.ID_Empresa]
		);

		const nearbyWaste = await dbAll(
			`SELECT
				c.Nombre_Residuo AS material,
				ROUND(SUM(s.Volumen_Cantidad), 2) AS total,
				c.Unidad_Medida AS unit
			 FROM Solicitudes_Retiro s
			 JOIN Catalogo_Residuos c ON c.ID_Categoria = s.ID_Categoria
			 WHERE s.Estado_Tracking = 'Disponible'
			 GROUP BY c.ID_Categoria, c.Nombre_Residuo, c.Unidad_Medida
			 ORDER BY total DESC`
		);

		const collectionHistory = await dbAll(
			`SELECT
				s.ID_Solicitud AS id,
				s.Fecha_Publicacion AS fecha,
				eg.Razon_Social AS origen,
				c.Nombre_Residuo AS material,
				s.Volumen_Cantidad AS cantidad,
				c.Unidad_Medida AS unidad,
				s.Estado_Tracking AS estado
			 FROM Solicitudes_Retiro s
			 JOIN Empresas eg ON eg.ID_Empresa = s.ID_Empresa_Generadora
			 JOIN Catalogo_Residuos c ON c.ID_Categoria = s.ID_Categoria
			 WHERE s.ID_Empresa_Recicladora = ?
			 ORDER BY s.Fecha_Publicacion DESC
			 LIMIT 30`,
			[empresaRecicladora.ID_Empresa]
		);

		const capacity = await dbAll(
			`SELECT
				c.Nombre_Residuo AS material,
				MIN(100, ROUND(SUM(s.Volumen_Cantidad) * 2, 2)) AS percent
			 FROM Solicitudes_Retiro s
			 JOIN Catalogo_Residuos c ON c.ID_Categoria = s.ID_Categoria
			 WHERE s.ID_Empresa_Recicladora = ?
				 AND s.Estado_Tracking IN ('En camino','Gestionado')
			 GROUP BY c.ID_Categoria, c.Nombre_Residuo
			 ORDER BY percent DESC`,
			[empresaRecicladora.ID_Empresa]
		);

		res.json({
			metrics: {
				processedToday: Number(processedTodayRow?.total || 0),
				activeCollections: Number(activeCollectionsRow?.total || 0),
				capacityTotal: 100,
				openAlerts: 0,
			},
			nearbyWaste,
			collectionHistory,
			capacity,
		});
	} catch (error) {
		console.error('Error en /dashboard/reciclador/:userId:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
});

export default router;
