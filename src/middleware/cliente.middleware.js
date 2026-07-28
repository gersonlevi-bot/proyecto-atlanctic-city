import Joi from 'joi';

// Esquema de validación estricto según las restricciones de la BD
const clienteSchema = Joi.object({
    tipo_cliente_id: Joi.number().integer().required().messages({
        'number.base': 'El tipo de cliente debe ser un número válido.',
        'any.required': 'El tipo de cliente es obligatorio.'
    }),
    nombre: Joi.string().trim().max(100).required().messages({
        'string.empty': 'El nombre no puede estar vacío.',
        'any.required': 'El nombre es obligatorio.'
    }),
    apellido: Joi.string().trim().max(100).required().messages({
        'string.empty': 'El apellido no puede estar vacío.',
        'any.required': 'El apellido es obligatorio.'
    }),
    DNI: Joi.string().trim().min(8).max(12).regex(/^\d+$/).required().messages({
        'string.pattern.base': 'El DNI solo debe contener números.',
        'string.min': 'El DNI debe tener al menos 8 dígitos.',
        'string.max': 'El DNI no puede exceder los 8 dígitos.',
        'any.required': 'El DNI es obligatorio.'
    }),
    correo: Joi.string().trim().email().max(100).allow(null, '').messages({
        'string.email': 'El formato del correo electrónico no es válido.'
    }),
    direccion: Joi.string().trim().max(255).allow(null, ''),
    telefono: Joi.string().trim().max(20).allow(null, '')
});

// Función Middleware que Express ejecutará antes del controlador
export const validarCliente = (req, res, next) => {
    const { error } = clienteSchema.validate(req.body, { abortEarly: false });

    // Si hay errores de validación, detenemos el flujo y respondemos al frontend
    if (error) {
        const erroresUnificados = error.details.map(err => err.message);
        return res.status(400).json({ status: 'Error de Validación', errores: erroresUnificados });
    }

    // Si todo está perfecto, avanzamos al controlador con next()
    next();
};
