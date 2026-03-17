import { validationResult } from 'express-validator';
import { Empresa } from './empresa.model.js';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear nueva empresa
export const crearEmpresa = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { nombre, nivelImpacto, añosTrayectoria, categoriaEmpresarial, email, telefono, sitioWeb, descripcion } = req.body;

    // Verificar si la empresa ya existe
    const empresaExistente = await Empresa.findOne({ $or: [{ nombre }, { email }] });
    if (empresaExistente) {
      return res.status(409).json({
        success: false,
        message: 'Una empresa con ese nombre o email ya existe',
      });
    }

    const nuevaEmpresa = new Empresa({
      nombre,
      nivelImpacto,
      añosTrayectoria,
      categoriaEmpresarial,
      email,
      telefono: telefono || '',
      sitioWeb: sitioWeb || '',
      descripcion: descripcion || '',
      creadoPor: req.user.id,
    });

    await nuevaEmpresa.save();

    res.status(201).json({
      success: true,
      message: 'Empresa registrada exitosamente',
      data: nuevaEmpresa,
    });
  } catch (error) {
    console.error('Error al crear empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar la empresa',
      error: error.message,
    });
  }
};

// Obtener todas las empresas con filtros y ordenamiento
export const obtenerEmpresas = async (req, res) => {
  try {
    const { orden, filtroCategoria, filtroAños, estado } = req.query;
    let filtro = {};

    // Aplicar filtros
    if (filtroCategoria) {
      filtro.categoriaEmpresarial = { $regex: filtroCategoria, $options: 'i' };
    }

    if (filtroAños) {
      filtro.añosTrayectoria = parseInt(filtroAños);
    }

    if (estado) {
      filtro.estado = estado;
    } else {
      filtro.estado = 'Activo'; // Por defecto mostrar solo empresas activas
    }

    let query = Empresa.find(filtro);

    // Aplicar ordenamiento
    if (orden === 'A-Z') {
      query = query.sort({ nombre: 1 });
    } else if (orden === 'Z-A') {
      query = query.sort({ nombre: -1 });
    } else if (orden === 'reciente') {
      query = query.sort({ fechaRegistro: -1 });
    } else if (orden === 'antiguo') {
      query = query.sort({ fechaRegistro: 1 });
    }

    const empresas = await query.exec();

    res.status(200).json({
      success: true,
      count: empresas.length,
      data: empresas,
    });
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener empresas',
      error: error.message,
    });
  }
};

// Obtener empresa por ID
export const obtenerEmpresaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findById(id);

    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      data: empresa,
    });
  } catch (error) {
    console.error('Error al obtener empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la empresa',
      error: error.message,
    });
  }
};

// Actualizar empresa
export const actualizarEmpresa = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const camposActualizables = ['nombre', 'nivelImpacto', 'añosTrayectoria', 'categoriaEmpresarial', 'email', 'telefono', 'sitioWeb', 'descripcion', 'estado'];
    
    const actualizaciones = {};
    for (const campo of camposActualizables) {
      if (req.body.hasOwnProperty(campo)) {
        actualizaciones[campo] = req.body[campo];
      }
    }

    const empresaActualizada = await Empresa.findByIdAndUpdate(
      id,
      actualizaciones,
      { new: true, runValidators: true }
    );

    if (!empresaActualizada) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Empresa actualizada exitosamente',
      data: empresaActualizada,
    });
  } catch (error) {
    console.error('Error al actualizar empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la empresa',
      error: error.message,
    });
  }
};

// Generar reporte en Excel
export const generarReporteExcel = async (req, res) => {
  try {
    // Obtener todas las empresas activas
    const empresas = await Empresa.find({ estado: 'Activo' }).sort({ fechaRegistro: -1 }).lean();

    if (empresas.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay empresas para reportar',
      });
    }

    // Preparar datos para Excel
    const datosExcel = empresas.map((empresa, index) => ({
      'No.': index + 1,
      'Nombre': empresa.nombre,
      'Email': empresa.email,
      'Teléfono': empresa.telefono || 'N/A',
      'Sitio Web': empresa.sitioWeb || 'N/A',
      'Nivel de Impacto': empresa.nivelImpacto,
      'Años de Trayectoria': empresa.añosTrayectoria,
      'Categoría': empresa.categoriaEmpresarial,
      'Descripción': empresa.descripcion || 'N/A',
      'Estado': empresa.estado,
      'Fecha de Registro': new Date(empresa.fechaRegistro).toLocaleDateString('es-ES'),
    }));

    // Crear workbook
    const ws = XLSX.utils.json_to_sheet(datosExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Empresas');

    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 5 },   // No.
      { wch: 20 },  // Nombre
      { wch: 25 },  // Email
      { wch: 15 },  // Teléfono
      { wch: 20 },  // Sitio Web
      { wch: 15 },  // Nivel de Impacto
      { wch: 15 },  // Años de Trayectoria
      { wch: 20 },  // Categoría
      { wch: 30 },  // Descripción
      { wch: 10 },  // Estado
      { wch: 15 },  // Fecha de Registro
    ];
    ws['!cols'] = columnWidths;

    // Generar nombre del archivo
    const fecha = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
    const nombreArchivo = `Reporte_Empresas_${fecha}.xlsx`;
    const rutaArchivo = path.join(__dirname, '../../uploads', nombreArchivo);

    // Crear carpeta uploads si no existe
    const carpetaUploads = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(carpetaUploads)) {
      fs.mkdirSync(carpetaUploads, { recursive: true });
    }

    // Guardar archivo
    XLSX.writeFile(wb, rutaArchivo);

    // Enviar archivo
    res.download(rutaArchivo, nombreArchivo, (err) => {
      if (err) {
        console.error('Error al descargar archivo:', err);
      }
      // Eliminar archivo después de descargar
      fs.unlink(rutaArchivo, (err) => {
        if (err) console.error('Error al eliminar archivo temporal:', err);
      });
    });
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el reporte',
      error: error.message,
    });
  }
};
