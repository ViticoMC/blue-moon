-- Script SQL para configurar las tablas en Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- Habilitar Row Level Security (RLS)
-- Esto es importante para la seguridad en Supabase

-- 1. Crear tabla de administradores
CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla de servicios
CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  image_public_id VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  material VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  image_public_id VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear tabla de galería
CREATE TABLE IF NOT EXISTS gallery (
  id BIGSERIAL PRIMARY KEY,
  image_url VARCHAR(500) NOT NULL,
  image_public_id VARCHAR(200),
  date_taken DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Insertar administrador por defecto
-- Contraseña: admin123 (hasheada con bcrypt)
INSERT INTO admins (username, password_hash) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (username) DO NOTHING;

-- 6. Configurar Row Level Security (RLS)

-- Para la tabla services (lectura pública, escritura solo admin)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by everyone" ON services
  FOR SELECT USING (true);

CREATE POLICY "Services are editable by admins only" ON services
  FOR ALL USING (auth.role() = 'service_role');

-- Para la tabla products (lectura pública, escritura solo admin)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products are editable by admins only" ON products
  FOR ALL USING (auth.role() = 'service_role');

-- Para la tabla gallery (lectura pública, escritura solo admin)
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery is viewable by everyone" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Gallery is editable by admins only" ON gallery
  FOR ALL USING (auth.role() = 'service_role');

-- Para la tabla admins (solo acceso de servicio)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins are only accessible by service role" ON admins
  FOR ALL USING (auth.role() = 'service_role');

-- 7. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Crear triggers para actualizar updated_at
CREATE TRIGGER update_services_updated_at 
  BEFORE UPDATE ON services 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
