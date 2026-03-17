import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const empresaSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        primary: true,
    },
    nombre: {
        type: String,
        required: [true, 'El nombre de la empresa es obligatorio'],
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
        unique: [true, 'El nombre de la empresa ya está registrado'],
    },
    nivelImpacto: {
        type: String,
        enum: {
            values: ['Alto', 'Medio', 'Bajo'],
            message: 'El nivel de impacto debe ser Alto, Medio o Bajo',
        },
        required: [true, 'El nivel de impacto es obligatorio'],
    },
    añosTrayectoria: {
        type: Number,
        required: [true, 'Los años de trayectoria son obligatorios'],
        min: [0, 'Los años de trayectoria no pueden ser negativos'],
        max: [500, 'Los años de trayectoria no pueden exceder 500'],
    },
    categoriaEmpresarial: {
        type: String,
        required: [true, 'La categoría empresarial es obligatoria'],
        trim: true,
        minlength: [3, 'La categoría debe tener al menos 3 caracteres'],
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor proporciona un email válido'],
        unique: [true, 'El email ya está registrado'],
    },
    telefono: {
        type: String,
        required: false,
        trim: true,
    },
    sitioWeb: {
        type: String,
        required: false,
        trim: true,
    },
    descripcion: {
        type: String,
        required: false,
        maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
    },
    logo: {
        type: String,
        required: false,
    },
    creadoPor: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        enum: {
            values: ['Activo', 'Inactivo'],
            message: 'El estado debe ser Activo o Inactivo',
        },
        default: 'Activo',
    },
    fechaRegistro: {
        type: Date,
        default: Date.now,
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    versionKey: false,
});

// Middleware para actualizar fechaActualizacion
empresaSchema.pre('findByIdAndUpdate', function (next) {
    this.set({ fechaActualizacion: Date.now() });
    next();
});

export const Empresa = mongoose.model('Empresa', empresaSchema);
