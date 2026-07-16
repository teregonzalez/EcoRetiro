import express from 'express';
import { dbRun, dbGet, dbAll } from '../models/database.js';

const router = express.Router();

// ==========================================
// 1. INGRESAR RESIDUOS (Módulo PYME)
// ==========================================
router.post('/add', async (req, res) => {
  try {
    // Nota: El frontend ahora debe enviar 'categoryId' (el ID numérico del residuo) 
    // en lugar del texto libre 'type'
    const { userId, categoryId, weight } = req.body;

    if (!userId || !categoryId || !weight) {
      return res.status(400).json({ error: 'Faltan campos requeridos (userId, categoryId, weight)' });
    }

    // Insertamos la nueva solicitud. La fecha se asigna automáticamente vía SQLite DEFAULT(datetime('now'))
    await dbRun(
      `INSERT INTO Solicitudes_Retiro (ID_PYME, ID_Categoria, Volumen_Cantidad) 
       VALUES (?, ?, ?)`,
      [userId, categoryId, weight]
    );

    res.json({ success: true, message: 'Residuo ingresado y disponible para retiro' });
  } catch (error) {
    console.error('Error en /add:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// 2. INVENTARIO DISPONIBLE (Módulo Reciclador)
// ==========================================
router.get('/inventory', async (req, res) => {
  try {
    // La ruta de inventario ahora filtra solo los residuos en estado 'Disponible'.
    // Esto permitirá a las empresas recicladoras que operan en El Bosque ver exactamente 
    // qué materiales están listos para ser retirados.
    const entries = await dbAll(
      `SELECT 
         c.Nombre_Residuo as type, 
         SUM(s.Volumen_Cantidad) as totalWeight, 
         c.Unidad_Medida as unit,
         COUNT(s.ID_Solicitud) as count 
       FROM Solicitudes_Retiro s
       JOIN Catalogo_Residuos c ON c.ID_Categoria = s.ID_Categoria
       WHERE s.Estado_Tracking = 'Disponible'
       GROUP BY c.ID_Categoria, c.Nombre_Residuo, c.Unidad_Medida`
    );

    res.json(entries || []);
  } catch (error) {
    console.error('Error en /inventory:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// 3. HISTORIAL POR USUARIO (Módulo PYME)
// ==========================================
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Recuperamos el historial cruzando datos con el catálogo para devolver nombres legibles,
    // y sumamos el estado de tracking para que la PYME sepa dónde está su residuo.
    const entries = await dbAll(
      `SELECT 
         s.ID_Solicitud as id, 
         c.Nombre_Residuo as type, 
         s.Volumen_Cantidad as weight, 
         c.Unidad_Medida as unit,
         s.Estado_Tracking as status,
         s.Fecha_Publicacion as date,
         s.URL_Certificado as certificate
       FROM Solicitudes_Retiro s
       JOIN Catalogo_Residuos c ON c.ID_Categoria = s.ID_Categoria
       WHERE s.ID_PYME = ? 
       ORDER BY s.Fecha_Publicacion DESC`,
      [userId]
    );

    res.json(entries || []);
  } catch (error) {
    console.error('Error en /history:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;