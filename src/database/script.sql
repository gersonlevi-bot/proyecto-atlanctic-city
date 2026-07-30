-- 1. CREACIÓN Y CONFIGURACIÓN DE LA BASE DE DATOS

CREATE DATABASE IF NOT EXISTS casino_atencion_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE casino_atencion_db;

-- 2. TABLAS MAESTRAS
-- Estructura de accesos del sistema
CREATE TABLE Rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE -- Ej: 'Administrador', 'Empleado'
);

-- Segmentación del negocio de casinos
CREATE TABLE Tipo_Cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE -- Ej: 'VIP', 'Frecuente', 'Regular'
);

-- Ciclo de vida de campañas de marketing
CREATE TABLE Estado_promocion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE -- Ej: 'Activa', 'Inactiva', 'Expirada'
);

-- Clasificación para el módulo de atención
CREATE TABLE Tipo_Incidencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE -- Ej: 'Queja', 'Solicitud'
);

-- Flujo de estados para la resolución de casos
CREATE TABLE Estado_Incidencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE -- Ej: 'En Proceso/Pendiente', 'Resuelto'
);

-- 3. TABLAS DE ENTIDADES PRINCIPALES
-- Personal que opera el sistema y gestiona la atención
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE, -- Clave única para el proceso de Login
    contrasena VARCHAR(255) NOT NULL,    -- Espacio amplio diseñado para hashes criptográficos
    foto_url VARCHAR(255),               -- Almacena la ruta del archivo o URL de la imagen de perfil
    estado BOOLEAN DEFAULT TRUE,         -- AUDITORÍA: Borrado lógico. Desactiva usuarios sin romper registros históricos
    FOREIGN KEY (rol_id) REFERENCES Rol(id)
);

-- Fichas de clientes registrados en el establecimiento
CREATE TABLE Cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_cliente_id INT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    DNI VARCHAR(12) NOT NULL UNIQUE,     -- Documento de identidad único para validaciones estrictas en casino
    correo VARCHAR(100) UNIQUE,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- AUDITORÍA: Fecha automática de alta del cliente
    estado BOOLEAN DEFAULT TRUE,         --  Borrado lógico. Desactiva clientes sin romper registros históricos
    FOREIGN KEY (tipo_cliente_id) REFERENCES Tipo_Cliente(id)
);

-- Campañas o incentivos de fidelización creados
CREATE TABLE Promocion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estado_promocion_id INT,
    nombre_promocion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    FOREIGN KEY (estado_promocion_id) REFERENCES Estado_promocion(id)
);

-- Historial de concurrencia y flujo económico por cliente
CREATE TABLE Visita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    fecha_inicio_visita DATETIME NOT NULL,
    fecha_fin_visita DATETIME,
    monto_consumido DECIMAL(10,2) DEFAULT 0.00, -- Control financiero con precisión decimal exacta
    observacion TEXT,
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id)
);

-- 4. TABLAS RELACIONALES Y TRANSACCIONALES
-- Registro de asignación y canje de beneficios promocionales
CREATE TABLE Cliente_promocion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    promocion_id INT,
    usuario_id INT,                      -- AUDITORÍA: Traza exacta de qué empleado otorgó el beneficio
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP, -- AUDITORÍA: Marca temporal de la entrega
    fecha_uso DATETIME,                  -- Permanece en NULL hasta que el cliente canjee efectivamente el cupón
    observacion TEXT,
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id),
    FOREIGN KEY (promocion_id) REFERENCES Promocion(id),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Tickets de control para incidencias de atención al cliente
CREATE TABLE Incidencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    usuario_id INT,                      -- AUDITORÍA: Empleado responsable asignado al caso
    tipo_incidencia_id INT,
    estado_incidencia_id INT,
    descripcion TEXT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP, -- AUDITORÍA: Inicio del ciclo de vida del ticket
    fecha_resolucion DATETIME,           -- Permanece en NULL hasta que el caso transicione al estado 'Resuelto'
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (tipo_incidencia_id) REFERENCES Tipo_Incidencia(id),
    FOREIGN KEY (estado_incidencia_id) REFERENCES Estado_Incidencia(id)
);