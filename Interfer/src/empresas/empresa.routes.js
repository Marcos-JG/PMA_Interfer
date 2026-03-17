import express from 'express';
import {
  crearEmpresa,
  obtenerEmpresas,
  obtenerEmpresaPorId,
  actualizarEmpresa,
  generarReporteExcel,
} from './empresa.controller.js';
import { validarCrearEmpresa, validarActualizarEmpresa } from '../../middlewares/empresa.validation.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { requireAdmin } from '../../middlewares/require-admin.js';

const router = express.Router();

// Rutas protegidas (solo para administradores)
router.get('/reporte/excel', validateJWT, requireAdmin, generarReporteExcel);
router.get('/:id', validateJWT, requireAdmin, obtenerEmpresaPorId);
router.get('/', validateJWT, requireAdmin, obtenerEmpresas);
router.post('/', validateJWT, requireAdmin, validarCrearEmpresa, crearEmpresa);
router.put('/:id', validateJWT, requireAdmin, validarActualizarEmpresa, actualizarEmpresa);

export default router;
