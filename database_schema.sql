-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT, -- untuk styling (hex color)
  icon TEXT,  -- untuk icon kategori
  parent_id UUID REFERENCES categories(id), -- untuk nested categories
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'member',
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  featured_image TEXT,
  status TEXT DEFAULT 'draft',
  author_id UUID REFERENCES profiles(id),
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Media table
CREATE TABLE media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Programs table
CREATE TABLE programs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'planned',
  responsible_person UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated read" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow own profile update" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow public read published" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Allow admin all" ON posts FOR ALL USING (auth.role() = 'authenticated' AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow author update" ON posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Allow public read" ON media FOR SELECT USING (true);
CREATE POLICY "Allow admin all" ON media FOR ALL USING (auth.role() = 'authenticated' AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow public read" ON programs FOR SELECT USING (true);
CREATE POLICY "Allow admin all" ON programs FOR ALL USING (auth.role() = 'authenticated' AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow public read approved" ON comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Allow authenticated insert" ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all" ON comments FOR ALL USING (auth.role() = 'authenticated' AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow public read active" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated' AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Indexes untuk performa
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_posts_category ON posts(category_id);

-- Triggers untuk auto-update updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert kategori default
INSERT INTO categories (name, slug, description, color) VALUES
('Berita', 'berita', 'Berita dan informasi terkini', '#3B82F6'),
('Artikel', 'artikel', 'Artikel dan opini', '#10B981'),
('Program', 'program', 'Program dan kegiatan', '#F59E0B'),
('Pengumuman', 'pengumuman', 'Pengumuman resmi', '#EF4444');