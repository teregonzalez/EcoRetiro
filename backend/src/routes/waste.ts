import express from 'express';
import { dbRun, dbGet, dbAll } from '../models/database.js';

const router = express.Router();

const CATEGORY_ALIASES: Record<string, string> = {
  plastic: 'Plástico PET',
  paper: 'Cartón corrugado',
  cardboard: 'Cartón corrugado',
  glass: 'Borra de café',
  aluminum: 'Metal',
  metal: 'Metal',
  wood: 'Borra de café',
};

const resolveEmpresaIdByUser = async (userId: number): Promise<number | null> => {
  const empresa = await dbGet(
    `SELECT ID_Empresa
     FROM Empresas
     WHERE ID_Usuario = ?`,
    [userId]
  );

  return empresa?.ID_Empresa ?? null;
};

// ==========================================
// 1. INGRESAR RESIDUOS (Módulo PYME)
// ==========================================
router.post('/add', async (req, res) => {
  try {
    const { userId, categoryId, type, weight } = req.body;

    if (!userId || !weight || (!categoryId && !type)) {
      return res.status(400).json({ error: 'Faltan campos requeridos (userId, categoryId|type, weight)' });
    }

    let resolvedCategoryId = Number(categoryId);

    if (!resolvedCategoryId && type) {
      const normalizedType = String(type).trim();
      const lookupType = CATEGORY_ALIASES[normalizedType.toLowerCase()] || normalizedType;

      const category = await dbGet(
        `SELECT ID_Categoria
         FROM Catalogo_Residuos
         WHERE lower(Nombre_Residuo) = lower(?)`,
        [lookupType]
      );

      if (!category) {
        return res.status(400).json({ error: 'Categoria de residuo no encontrada' });
      }

      resolvedCategoryId = category.ID_Categoria;
    }

    if (!resolvedCategoryId) {
      return res.status(400).json({ error: 'categoryId invalido' });
    }

    const empresaGeneradoraId = await resolveEmpresaIdByUser(Number(userId));
    if (!empresaGeneradoraId) {
      return res.status(400).json({ error: 'No existe empresa asociada al usuario' });
    }

    await dbRun(
      `INSERT INTO Solicitudes_Retiro (ID_Empresa_Generadora, ID_Categoria, Volumen_Cantidad) 
       VALUES (?, ?, ?)`,
      [empresaGeneradoraId, resolvedCategoryId, weight]
    );

    res.json({ success: true, message: 'Residuo ingresado y disponible para retiro' });
  } catch (error) {
    console.error('Error en /add:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/categories', async (_req, res) => {
  try {
    const categories = await dbAll(
      `SELECT ID_Categoria as id, Nombre_Residuo as name, Unidad_Medida as unit
       FROM Catalogo_Residuos
       WHERE Estado_Categoria = 'Activa'
       ORDER BY Nombre_Residuo ASC`
    );

    res.json(categories || []);
  } catch (error) {
    console.error('Error en /categories:', error);
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

    const empresaGeneradoraId = await resolveEmpresaIdByUser(Number(userId));
    if (!empresaGeneradoraId) {
      return res.json([]);
    }

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
       WHERE s.ID_Empresa_Generadora = ? 
       ORDER BY s.Fecha_Publicacion DESC`,
      [empresaGeneradoraId]
    );

    res.json(entries || []);
  } catch (error) {
    console.error('Error en /history:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;