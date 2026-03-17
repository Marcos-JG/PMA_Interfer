import { body } from 'express-validator';

export const validarCrearEmpresa = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('nivelImpacto')
    .notEmpty().withMessage('El nivel de impacto es obligatorio')
    .isIn(['Alto', 'Medio', 'Bajo']).withMessage('El nivel de impacto debe ser Alto, Medio o Bajo'),
  
  body('añosTrayectoria')
    .notEmpty().withMessage('Los años de trayectoria son obligatorios')
    .isInt({ min: 0, max: 500 }).withMessage('Los años deben ser un número entre 0 y 500'),
  
  body('categoriaEmpresarial')
    .notEmpty().withMessage('La categoría empresarial es obligatoria')
    .trim()
    .isLength({ min: 3 }).withMessage('La categoría debe tener al menos 3 caracteres'),
  
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email debe ser válido')
    .normalizeEmail(),
  
  body('telefono')
    .optional()
    .trim(),
  
  body('sitioWeb')
    .optional()
    .trim(),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
];

export const validarActualizarEmpresa = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('nivelImpacto')
    .optional()
    .isIn(['Alto', 'Medio', 'Bajo']).withMessage('El nivel de impacto debe ser Alto, Medio o Bajo'),
  
  body('añosTrayectoria')
    .optional()
    .isInt({ min: 0, max: 500 }).withMessage('Los años deben ser un número entre 0 y 500'),
  
  body('categoriaEmpresarial')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('La categoría debe tener al menos 3 caracteres'),
  
  body('email')
    .optional()
    .isEmail().withMessage('El email debe ser válido')
    .normalizeEmail(),
  
  body('telefono')
    .optional()
    .trim(),
  
  body('sitioWeb')
    .optional()
    .trim(),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('estado')
    .optional()
    .isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo'),
];
