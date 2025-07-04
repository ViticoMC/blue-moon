-- Script para crear las tablas en tu base de datos Vercel Postgres
-- Ejecuta este script en tu dashboard de Vercel o usando psql

-- Crear tabla de administradores
CREATE TABLE IF NOT EXISTS "blue-moon-admin" (
  id SERIAL PRIMARY KEY,
  admin VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de servicios
CREATE TABLE IF NOT EXISTS "blue-moon-services" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  descripcion TEXT,
  price DECIMAL(10,2) NOT NULL,
  img_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS "blue-moon-productos" (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  material VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  img_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de fotos/galería
CREATE TABLE IF NOT EXISTS "blue-moon-fotos" (
  id SERIAL PRIMARY KEY,
  fecha DATE DEFAULT CURRENT_DATE,
  img_url VARCHAR(500) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar administrador por defecto (usuario: admin, contraseña: admin123)
INSERT INTO "blue-moon-admin" (admin, password) 
VALUES ('admin', 'admin123')
ON CONFLICT (admin) DO NOTHING;

-- Insertar algunos servicios de ejemplo
INSERT INTO "blue-moon-services" (name, descripcion, price, img_url) VALUES
('Piercing de Oreja - Lóbulo', 'Perforación clásica en el lóbulo de la oreja. Proceso rápido y prácticamente indoloro. Incluye joya inicial de acero quirúrgico.', 25.00, ''),
('Piercing de Nariz - Nostril', 'Perforación lateral de la nariz. Muy popular y versátil. Cicatrización de 6-8 semanas. Incluye joya de titanio.', 45.00, ''),
('Piercing de Labio', 'Perforación en el labio inferior o superior. Requiere cuidados especiales durante la cicatrización.', 55.00, ''),
('Piercing de Lengua', 'Perforación central de la lengua. Requiere experiencia profesional. Cicatrización de 4-6 semanas.', 65.00, ''),
('Piercing de Ceja', 'Perforación vertical u horizontal en la ceja. Estilo único y llamativo.', 50.00, ''),
('Piercing de Ombligo', 'Perforación clásica del ombligo. Muy popular en verano. Cicatrización de 6-12 meses.', 60.00, '')
ON CONFLICT DO NOTHING;

-- Insertar algunos productos de ejemplo
INSERT INTO "blue-moon-productos" (nombre, material, price, descripcion, img_url) VALUES
('Arete de Titanio - Básico', 'Titanio', 15.00, 'Arete básico de titanio grado médico. Hipoalergénico y resistente a la corrosión.', ''),
('Piercing de Oro 14k - Premium', 'Oro 14k', 85.00, 'Joya de oro de 14 quilates. Elegante y duradera. Ideal para ocasiones especiales.', ''),
('Piercing de Acero Quirúrgico', 'Acero Quirúrgico', 12.00, 'Joya de acero quirúrgico 316L. Resistente y económica.', ''),
('Piercing de Plata 925', 'Plata 925', 35.00, 'Joya de plata esterlina 925. Elegante acabado brillante.', ''),
('Piercing de Niobio - Hipoalergénico', 'Niobio', 45.00, 'Joya de niobio puro. Completamente hipoalergénico.', ''),
('Barra para Lengua - Titanio', 'Titanio', 25.00, 'Barra especial para piercing de lengua. Titanio grado médico.', ''),
('Aro Continuo - Oro Rosa', 'Oro Rosa 14k', 95.00, 'Aro continuo de oro rosa. Diseño minimalista y elegante.', ''),
('Piercing con Gemas - Cristal', 'Titanio con Cristal', 55.00, 'Joya de titanio con cristales incrustados. Brillante y llamativa.', '')
ON CONFLICT DO NOTHING;

-- Insertar algunas fotos de ejemplo
INSERT INTO "blue-moon-fotos" (fecha, img_url, descripcion) VALUES
('2024-01-15', '', 'Piercing de oreja - Trabajo realizado'),
('2024-01-16', '', 'Piercing de nariz - Cliente satisfecho'),
('2024-01-17', '', 'Piercing de labio - Resultado profesional'),
('2024-01-18', '', 'Piercing de lengua - Técnica perfecta'),
('2024-01-19', '', 'Piercing de ceja - Estilo único'),
('2024-01-20', '', 'Piercing de ombligo - Trabajo de calidad'),
('2024-01-21', '', 'Múltiples piercings de oreja'),
('2024-01-22', '', 'Piercing industrial - Técnica avanzada'),
('2024-01-23', '', 'Piercing de septum - Resultado perfecto'),
('2024-01-24', '', 'Piercing de cartílago - Precisión profesional')
ON CONFLICT DO NOTHING;
