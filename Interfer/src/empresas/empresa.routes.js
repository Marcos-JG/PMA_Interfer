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

const router = express.Router();

// Rutas públicas
router.get('/reporte/excel', validateJWT, generarReporteExcel);
router.get('/:id', validateJWT, obtenerEmpresaPorId);
router.get('/', validateJWT, obtenerEmpresas);

// Rutas protegidas (solo para admins)
router.post('/', validateJWT, validarCrearEmpresa, crearEmpresa);
router.put('/:id', validateJWT, validarActualizarEmpresa, actualizarEmpresa);

export default router;
